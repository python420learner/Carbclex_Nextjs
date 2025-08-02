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
          <TabsTrigger value="account" onClick={()=> setActiveTab('account')} >Account Information</TabsTrigger>
          <TabsTrigger value="documents" onClick={()=> setActiveTab('documents')} >Document Verification</TabsTrigger>
          <TabsTrigger value="preferences" onClick={()=> setActiveTab('preferences')} >Preferences</TabsTrigger>
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

// INSERT INTO user_notifications (
//     created_at,
//     custom_message,
//     is_read,
//     related_entity_id,
//     related_entity_type,
//     user_id,
//     event_id
// ) VALUES (
//     NOW(6),
//     'Your project "EcoCarbonX" has been approved successfully.',
//     0,
//     18,
//     'project',
//     'G4ZqcuqevYUI1EU40tDjDkbQF4u2',
//     9
// );
