"use client"
import React, { useEffect, useState } from 'react';

type DocumentMap = {
  [key: string]: string; // key: document name, value: URL
};

const DocumentViewer: React.FC<{ userId: string }> = ({ userId }) => {
  const [oldDocuments, setOldDocuments] = useState<DocumentMap>({});
  const [loading, setLoading] = useState<boolean>(true);

  console.log(userId)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch(`/api/user/get-documents/${userId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch documents');
        }

        const data = await res.json();
        setOldDocuments(data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [userId]);
  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-lg font-semibold">Uploaded Documents</h2>

      {loading ? (
        <p>Loading documents...</p>
      ) : Object.keys(oldDocuments).length === 0 ? (
        <p className="text-sm text-gray-500">No documents uploaded yet.</p>
      ) : (
        <ul className="space-y-2">
          {Object.entries(oldDocuments).map(([key, url]) => (
            <li key={key} className="flex items-center justify-between p-2 bg-gray-100 rounded">
              <span className="capitalize">{key.replace(/_/g, ' ')}</span>
              <a
                href={`https://carbclex.com/${url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                View / Download
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DocumentViewer;
