"use client"
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Upload, FileText, CheckCircle, Clock, XCircle, Info } from 'lucide-react';
import { auth, getCurrentUser } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import DocumentViewer from './DocumentViewer';

interface DocumentStatus {
  name: string;
  status: 'uploaded' | 'pending' | 'verified' | 'rejected';
  feedback?: string;
  required: boolean;
}

export function DocumentVerification() {
  const [kycStatus, setKycStatus] = useState<'verified' | 'pending' | 'rejected'>('pending');
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({});
  const [documents, setDocuments] = useState<DocumentStatus[]>([
    { name: 'Proof of Identity', status: 'pending', required: true },
    { name: 'Aadhar / Govt. ID', status: 'verified', required: true },
    { name: 'PAN / Tax ID', status: 'rejected', feedback: 'Aadhar image unclear, please re-upload', required: true },
    { name: 'Proof of Address', status: 'pending', required: true },
    { name: 'Utility Bill', status: 'pending', required: true },
    { name: 'GST Certificate', status: 'pending', required: false },
    { name: 'Company Registration', status: 'pending', required: false },
  ]);

  const [userId, setUserId] = useState('');
  
  type DocumentTypes = 'panCard' | 'aadhaarCard' | 'proofOfIdentity' | 'proofOfAddress' | 'gstCertificate' | 'companyRegistration' | 'utilityBill';
  type DocumentState = {
    [key in DocumentTypes]: File[];
  };

  const initialDocuments: DocumentState = {
    proofOfIdentity: [],
    panCard: [],
    aadhaarCard: [],
    proofOfAddress: [],
    gstCertificate: [],
    companyRegistration: [],
    utilityBill: [],
  };

  const [userDocuments, setUserDocuments] = useState<DocumentState>(initialDocuments);

  useEffect(() => {
    const checkSessionAndFetchUser = async () => {
      try {
        const sessionRes = await fetch('/api/auth/check-session', {
          credentials: 'include',
        });
        if (!sessionRes.ok) {
          throw new Error('Session invalid');
        }
        onAuthStateChanged(auth, (user) => {
          if (user) {
            setUserId(user.uid);
          }
        });
      } catch (error) {
        console.error('Session check failed:', error);
      }
    };
    checkSessionAndFetchUser();
  }, []);

  // Status icon component helper
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-destructive" />;
      case 'uploaded': return <FileText className="h-5 w-5 text-blue-600" />;
      default: return null;
    }
  };

  // Status badge helper
  const getStatusBadge = (status: string) => {
    const variants = {
      verified: 'default',
      pending: 'secondary',
      rejected: 'destructive',
      uploaded: 'outline',
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Handle file input change per doc type
  const handleDocumentChange = (e: ChangeEvent<HTMLInputElement>, docType: DocumentTypes) => {
    const files = Array.from(e.target.files || []);
    setUserDocuments(prev => ({
      ...prev,
      [docType]: files,
    }));
  };

  // Trigger hidden file input click
  const fileInputRefs = useRef<{ [key in DocumentTypes]?: HTMLInputElement | null }>({});
  const handleButtonClick = (docKey: DocumentTypes) => {
    fileInputRefs.current[docKey]?.click();
  };

  // Submit documents upload
  const handleSubmitDocuments = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    const user = getCurrentUser();

    if (!user) {
      console.error("User not logged in");
      return;
    }

    Object.entries(userDocuments).forEach(([docKey, files]) => {
      files.forEach((file, index) => {
        const ext = file.name.split('.').pop();
        const newName = `${docKey}_${index + 1}.${ext}`;
        const renamedFile = new File([file], newName, { type: file.type });
        formData.append(docKey, renamedFile);
      });
    });

    try {
      const idToken = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/user/upload-documents/${userId}`, {
        method: 'POST',
        headers: { ...(idToken && { Authorization: `Bearer ${idToken}` }) },
        body: formData,
      });

      if (res.ok) {
        console.log('✅ Documents uploaded successfully');
      } else {
        console.error('❌ Failed to upload documents');
      }
    } catch (err) {
      console.error('❌ Error uploading documents:', err);
    }
  };

  // Get KYC status info
  const getKycStatusInfo = () => {
    switch (kycStatus) {
      case 'verified': return { color: 'text-green-600', badge: 'default', icon: <CheckCircle className="h-5 w-5" /> };
      case 'pending': return { color: 'text-yellow-600', badge: 'secondary', icon: <Clock className="h-5 w-5" /> };
      case 'rejected': return { color: 'text-destructive', badge: 'destructive', icon: <XCircle className="h-5 w-5" /> };
    }
  };
  const statusInfo = getKycStatusInfo();

  return (
    <div className="space-y-6">
      {userId && <DocumentViewer userId={userId} />}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            KYC Status
            {statusInfo?.icon}
          </CardTitle>
          <CardDescription>Your document verification status</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                <Badge variant={statusInfo?.badge as any}>
                  {kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Last Updated: January 15, 2024
              </p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmitDocuments}>

            {documents.filter(doc => doc.required).map((document, idx) => {
              const docKey = document.name
                .toLowerCase()
                .replace(/\s+|\/|\.|-/g, '') as DocumentTypes; // normalize name to DocumentTypes keys

              return (
                <Card key={idx}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(document.status)}
                        <div>
                          <h4 className="font-medium">{document.name}</h4>
                          {document.status === 'pending' && (
                            <p className="text-sm text-muted-foreground">Upload required</p>
                          )}
                        </div>
                      </div>
                      {getStatusBadge(document.status)}
                    </div>

                    {document.feedback && document.status === 'rejected' && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertDescription>Admin Feedback: {document.feedback}</AlertDescription>
                      </Alert>
                    )}

                    <input
                      type="file"
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg"
                      ref={(el) => {
                        fileInputRefs.current[docKey] = el;
                      }}
                      onChange={(e) => handleDocumentChange(e, docKey)}
                      className="hidden"
                    />

                    <div className="flex items-center gap-2">
                      <Button
                        variant={document.status === 'rejected' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleButtonClick(docKey)}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {userDocuments[docKey]?.length > 0 ? 'Replace' : 'Upload'}
                      </Button>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Accepted formats: PDF, JPG, PNG</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {userDocuments[docKey] && userDocuments[docKey].length > 0 && (
                      <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                        {userDocuments[docKey].map((file, i) => (
                          <li key={i}>{file.name}</li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {/* Optional Documents */}
            {documents.filter(doc => !doc.required).map((document, idx) => {
              const docKey = document.name
                .toLowerCase()
                .replace(/\s+|\/|\.|-/g, '') as DocumentTypes;

              return (
                <Card key={`opt-${idx}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(document.status)}
                        <div>
                          <h4 className="font-medium">{document.name}</h4>
                          <p className="text-sm text-muted-foreground">Optional</p>
                        </div>
                      </div>
                      {getStatusBadge(document.status)}
                    </div>

                    <input
                      type="file"
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg"
                      ref={(el) => {
                        fileInputRefs.current[docKey] = el;
                      }}
                      onChange={(e) => handleDocumentChange(e, docKey)}
                      className="hidden"
                    />

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleButtonClick(docKey)}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {userDocuments[docKey]?.length > 0 ? 'Replace' : 'Upload'}
                      </Button>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Accepted formats: PDF, JPG, PNG</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {userDocuments[docKey] && userDocuments[docKey].length > 0 && (
                      <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                        {userDocuments[docKey].map((file, i) => (
                          <li key={i}>{file.name}</li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            <div className="flex justify-end">
              <Button
                type="submit"
                className="mt-6"
              >
                Upload Documents
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}