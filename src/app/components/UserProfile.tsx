"use client"
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { PersonalInformation } from './personalInformation';
import { DocumentVerification } from './DocumentVerification';
import { Preferences } from './Preferences';

export function UserProfile() {
  const [activeTab, setActiveTab] = useState('account')
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2>User Profile & Settings</h2>
        <div className="flex items-center space-x-2">
          {/* Optional: Add actions like export, sync, etc. */}
        </div>
      </div>
      
      <p className="text-muted-foreground">
        Manage your account information, documents, and preferences
      </p>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account" onClick={()=> setActiveTab('account')} className={`${activeTab==='account'?'bg-gray-800 text-white':''}  mt-6`}>Account Information</TabsTrigger>
          <TabsTrigger value="documents" onClick={()=> setActiveTab('documents')} className={`${activeTab==='documents'?'bg-gray-800 text-white':''}  mt-6`}>Document Verification</TabsTrigger>
          <TabsTrigger value="preferences" onClick={()=> setActiveTab('preferences')} className={`${activeTab==='preferences'?'bg-gray-800 text-white':''}  mt-6`}>Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className='mt-10'>
          <PersonalInformation />
        </TabsContent>
        
        <TabsContent value="documents"className='mt-10' >
          <DocumentVerification />
        </TabsContent>
        
        <TabsContent value="preferences" className='mt-10'>
          <Preferences />
        </TabsContent>
      </Tabs>
    </div>
  );
}