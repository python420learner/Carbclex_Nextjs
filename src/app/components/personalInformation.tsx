"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Camera, Info } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react'
import { app, auth, getCurrentUser } from '../firebase';
import { useRouter } from 'next/navigation';
import {
  getAuth,
  sendPasswordResetEmail,
  EmailAuthProvider,
  linkWithCredential,
  reauthenticateWithCredential,
  updatePassword
} from "firebase/auth";
import PhoneOTP from './phoneOTP';


export function PersonalInformation() {

  type UserProfile = {
    name: string;
    email: string;
    address: string;
    pincode: string;
    state: string;
    country: string;
    phone: string;
    organization?: string;
    role: string;
    displayImage: string;
  };

  const router = useRouter();
  const auth = getAuth();
  const user_data_from_firebase = auth.currentUser;
  const loginMethod = user_data_from_firebase?.providerData[0]?.providerId;
  const backendURL = "https://carbclex.com"; // or your actual backend base URL



  const [user, setUser] = useState<UserProfile | null>(null);
  const [idToken, setIdtoken] = useState()
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    pinCode: '',
    state: '',
    country: '',
    mobileNumber: '',
    organization: '',
    role: ''
  });
  const [pinCode, setPinCode] = useState('');
  const [location, setLocation] = useState({
    block: '',
    region: '',
    city: '',
    state: '',
    country: 'India', // Assuming fixed
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [hasChanges, setHasChanges] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState(null);


  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setPreview(URL.createObjectURL(file));
  //   }
  // };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };


  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        router.push("/login");
        return false;
      }

      const token = await user.getIdToken();
      setIdtoken(token)

      const response = await fetch('/api/user/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      setUser(userData);
      // console.log("✅ User fetched:", userData);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  useEffect(() => {
    if (user) {
      console.log(user)
      const [addressLine1, addressLine2, addressLine3] = user.address?.split(' || ') || ["", "", ""];
      setProfileData({
        fullName: user.name ?? '',
        email: user.email ?? '',
        addressLine1: addressLine1 ?? '',
        addressLine2: addressLine2 ?? '',
        addressLine3: addressLine3 ?? '',
        pinCode: user.pincode ?? '',
        state: user.state ?? '',
        country: user.country ?? '',
        mobileNumber: user.phone ?? '',
        organization: user.organization ?? '',
        role: user.role ?? '',
      });
    }
  }, [user]);

  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPinCode(value);

    if (value.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const data = await res.json();
        const postOffice = data[0]?.PostOffice?.[0];
        if (postOffice) {
          // console.log(postOffice)
          setLocation({
            block: postOffice.Block,
            region: postOffice.Region,
            city: postOffice.District,
            state: postOffice.State,
            country: 'India',
          });
        }
      } catch (err) {
        console.error("Failed to fetch location", err);
      }
    }
  };


  // Handle User Input Change
  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));

    if (field === 'newPassword') {
      // Simple password strength calculation
      let strength = 0;
      if (value.length >= 8) strength += 25;
      if (/[A-Z]/.test(value)) strength += 25;
      if (/[0-9]/.test(value)) strength += 25;
      if (/[^A-Za-z0-9]/.test(value)) strength += 25;
      setPasswordStrength(strength);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return 'bg-destructive';
    if (passwordStrength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };


  const handlePasswordUpdate = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !user.email) {
      alert("User not found or not logged in.");
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      // 1. Re-authenticate user with old password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // 2. Now update the password
      await updatePassword(user, newPassword);

      alert("Password updated successfully!");
      // Optionally reset state here
    } catch (error: any) {
      if (error.code === "auth/wrong-password") {
        alert("The current password is incorrect.");
      } else {
        alert("Password update failed: " + error.message);
      }
    }
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Very Weak';
    if (passwordStrength < 50) return 'Weak';
    if (passwordStrength < 75) return 'Moderate';
    if (passwordStrength < 100) return 'Strong';
    return 'Very Strong';
  };

  // Reset email
  const handleSendResetEmail = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user?.email) return alert("Email not found.");
    try {
      await sendPasswordResetEmail(auth, user.email);
      alert("Password reset email sent.");
    } catch (err) {
      alert("Failed to send email: " + err.message);
    }
  };

  // Link password login
  const handleLinkPassword = async () => {
    const email = prompt("Enter your email:");
    const newPassword = prompt("Enter a new password:");

    if (!email || !newPassword) return;

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(email, newPassword);
      await linkWithCredential(user, credential);
      alert("Email/password login linked to your account!");
    } catch (err) {
      alert("Failed to link: " + err.message);
    }
  };

  const handleUpdate = async () => {
    try {
      const combinedAddress = `${profileData.addressLine1} || ${profileData.addressLine2} || ${location.block}, ${location.city}`;

      // Create UserMaster-like payload (excluding fields we don't want to update)
      const userPayload = {
        name: profileData.fullName,         // Optional — skip if you don't want to update
        phone: profileData.mobileNumber,
        address: combinedAddress,
        state: location.state,
        pincode: pinCode,
        // You can include other fields like country if needed
      };

      const formData = new FormData();
      formData.append("user", new Blob([JSON.stringify(userPayload)], { type: "application/json" }));

      // Attach image only if selected
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${idToken}`, // Firebase ID token
          // ❌ Do NOT manually set 'Content-Type' for FormData
        },
        body: formData,
      });

      const result = await res.text(); // or res.json() depending on your backend
      if (res.ok) {
        alert("Profile updated successfully!");
      } else {
        alert("Update failed: " + result);
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Something went wrong while updating profile.");
    }
  };


  return (
    <div className="grid gap-6">
      {/* Profile Picture and Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your basic profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture */}

          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={preview ||  (user?.displayImage ? `${backendURL}${user.displayImage}` : "")} alt="Profile" />
                <AvatarFallback>
                  {user?.name ? user?.name.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                onClick={handleButtonClick}
              >
                <Camera className="h-4 w-4" />
              </Button>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <div>
              <p className="font-medium">Profile Picture</p>
              <p className="text-sm text-muted-foreground">Click camera icon to update</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={profileData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)} disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)} disabled
                />
                <Badge variant="secondary" className="shrink-0">Verified</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Address</Label>
            <div className="grid gap-3">
              <Input
                placeholder="Address Line 1"
                value={profileData.addressLine1}
                onChange={(e) => handleInputChange('addressLine1', e.target.value)}
              />
              <Input
                placeholder="Address Line 2"
                value={profileData.addressLine2}
                onChange={(e) => handleInputChange('addressLine2', e.target.value)}
              />
              <Input
                placeholder="Address Line 3 (Optional)"
                value={`${profileData.addressLine3}` || `${location.block}, ${location.city}`}
                onChange={(e) => handleInputChange('addressLine3', e.target.value)} disabled
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={profileData.pinCode}
                  onChange={handlePincodeChange}
                  placeholder="Enter PIN code"
                />
                <Input
                  placeholder="State"
                  value={profileData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  disabled
                />
              </div>
              <Input
                placeholder="Country"
                value={location.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <div className="flex gap-2">
                <Input
                  id="mobile"
                  value={profileData.mobileNumber}
                  onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                />
                <Button variant="outline" size="sm">Verify</Button>
                {/* <PhoneOTP/> */}
              </div>
              <div id="recaptcha"></div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Organization / Company</Label>
              <Input
                id="organization"
                placeholder="Optional"
                value={profileData.organization}
                onChange={(e) => handleInputChange('organization', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="role"
                value={profileData.role}
                disabled
                className="max-w-xs"
              />
              <Badge variant="outline">Read-only after KYC</Badge>
            </div>
          </div>

          <Button disabled={!hasChanges} onClick={handleUpdate} className="w-fit">
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Password Change */}
      {loginMethod === 'password' ? (
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Use a strong password with symbols & numbers</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              />
              {passwordData.newPassword && (
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Password strength:</span>
                    <span className="font-medium">{getPasswordStrengthText()}</span>
                  </div>
                  <Progress
                    value={passwordStrength}
                    className={`h-2 ${getPasswordStrengthColor()}`}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              />
            </div>

            <Button
              onClick={handlePasswordUpdate}
              disabled={!passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
              className="w-fit"
            >
              Update Password
            </Button>
          </CardContent>
        </Card>

      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>You're signed in with Google. Password can't be changed directly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleSendResetEmail}>Send Reset Email</Button>
            <div className="text-sm text-muted-foreground">
              Want to also use email/password login? You can link a password to your Google account.
            </div>
            <Button variant="outline" onClick={handleLinkPassword}>
              Link Email & Password
            </Button>
          </CardContent>
        </Card>
      )}
    </div >
  );
}