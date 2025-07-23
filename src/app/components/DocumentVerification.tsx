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
    { name: 'Company Registration', status: 'pending', required: false }
  ]);

  type DocumentTypes = 'panCard' | 'aadhaarCard' | 'proofOfIdentity' | 'proofOfAddress' | 'gstCertificate' | 'companyRegistration' | 'utilityBill';
  const [userId, setUserId] = useState('')

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
    // Check session and fetch user data
    const checkSessionAndFetchUser = async () => {
      try {
        // 1. Check backend session
        const sessionRes = await fetch('/api/auth/check-session', {
          credentials: 'include',
        });

        if (!sessionRes.ok) {
          throw new Error('Session invalid');
        }

        // 2. Get Firebase user
        onAuthStateChanged(auth, (user) => {
          if (user) {
            setUserId(user.uid); // Store Firebase UID in state
          }
        });

      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
      }
    };

    checkSessionAndFetchUser();

  }, [auth]);



  const handleSubmitDocuments = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    const user = getCurrentUser(); // ⬅️ Use your logged-in user's UID here

    if (!user) {
      console.error("Required Login!!!");
      return;
    }

    Object.entries(userDocuments).forEach(([docKey, files]) => {
      files.forEach((file, index) => {
        const ext = file.name.split('.').pop();
        const newName = `${docKey}_${index + 1}.${ext}`;
        const renamedFile = new File([file], newName, { type: file.type });

        // Append to form data under key docKey (this matches backend's field expectations)
        formData.append(docKey, renamedFile);
      });
    });

    try {
      const idToken = await auth.currentUser?.getIdToken(); // ⬅️ Optional: for auth header
      const res = await fetch(`/api/user/upload-documents/${userId}`, {
        method: 'POST',
        headers: {
          ...(idToken && { Authorization: `Bearer ${idToken}` }),
        },
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


  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>, docType: DocumentTypes) => {
    const files = Array.from(e.target.files || []);
    setUserDocuments((prev) => ({
      ...prev,
      [docType]: files,
    }));
  };

  console.log(userDocuments)

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [currentDocName, setCurrentDocName] = useState<string | null>(null);

  const handleButtonClick = (docName: string) => {
    setCurrentDocName(docName);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0 && currentDocName) {
      const file = event.target.files[0];
      setSelectedFiles(prev => ({ ...prev, [currentDocName]: file }));
      // TODO: trigger upload API here
      console.log(`Selected file for ${currentDocName}:`, file.name);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'uploaded':
        return <FileText className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      verified: 'default',
      pending: 'secondary',
      rejected: 'destructive',
      uploaded: 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getKycStatusInfo = () => {
    switch (kycStatus) {
      case 'verified':
        return { color: 'text-green-600', badge: 'default', icon: <CheckCircle className="h-5 w-5" /> };
      case 'pending':
        return { color: 'text-yellow-600', badge: 'secondary', icon: <Clock className="h-5 w-5" /> };
      case 'rejected':
        return { color: 'text-destructive', badge: 'destructive', icon: <XCircle className="h-5 w-5" /> };
    }
  };

  const statusInfo = getKycStatusInfo();

  return (
    <div className="space-y-6">      
    {userId &&
    
    <DocumentViewer userId={userId} />
    }



      {/* KYC Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            KYC Status
            {statusInfo.icon}
          </CardTitle>
          <CardDescription>Your document verification status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                <Badge variant={statusInfo.badge as any}>
                  {kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Last Updated: January 15, 2024
              </p>
            </div>

            {kycStatus === 'pending' && (
              // <Alert className="max-w-sm">
              //   <AlertDescription>
              //     Complete KYC before 30th July (60 days after signup)
              //   </AlertDescription>
              // </Alert>
              <div></div>
            )}
          </div>
        </CardContent>

        <form className="space-y-6">
          {(Object.keys(userDocuments) as (keyof typeof userDocuments)[]).map((docKey) => (
            <div key={docKey}>
              <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                {docKey
                  .replace(/([A-Z])/g, ' $1') // Add space before capital letters
                  .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
                }
              </label>

              <input
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => handleDocumentChange(e, docKey)}
                className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
              />

              {/* Preview selected file names */}
              {userDocuments[docKey] && userDocuments[docKey].length > 0 && (
                <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                  {userDocuments[docKey].map((file, idx) => (
                    <li key={idx}>{file.name}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <button
            type="submit" onClick={handleSubmitDocuments}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Upload Documents
          </button>
        </form>


      </Card>
      {/* <div>
          Document Upload Cards
          <div className="grid gap-4">
            <input
              type="file"
              accept=".pdf,image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <h3>Required Documents</h3>

            {documents.filter(doc => doc.required).map((document, index) => (
              <Card key={index}>
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
                      <AlertDescription>
                        Admin Feedback: {document.feedback}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex items-center gap-2">
                    <Button
                    variant={document.status === 'rejected' ? 'default' : 'outline'}
                    size="sm"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {document.status === 'pending' ? 'Upload' : 'Replace'}
                  </Button>

                    <Button
                      variant={document.status === 'rejected' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleButtonClick(document.name)}
                    ></Button>

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
                </CardContent>
              </Card>
            ))}

            <h3>Optional Documents</h3>

            {documents.filter(doc => !doc.required).map((document, index) => (
              <Card key={index}>
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

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
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
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end">
            <Button>Submit for Review</Button>
          </div>
        </div> */}
    </div>
  );
}