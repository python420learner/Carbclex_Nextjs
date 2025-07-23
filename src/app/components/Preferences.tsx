"use client"
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

export function Preferences() {
  const [preferences, setPreferences] = useState({
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    language: 'English',
    emailAlerts: true,
    smsAlerts: false,
    inAppNotifications: true,
    darkMode: false
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const currencies = [
    { value: 'INR', label: 'INR (₹)', description: 'Indian Rupee' },
    { value: 'USD', label: 'USD ($)', description: 'US Dollar' },
    { value: 'EUR', label: 'EUR (€)', description: 'Euro' },
    { value: 'GBP', label: 'GBP (£)', description: 'British Pound' }
  ];

  const languages = [
    { value: 'English', label: 'English' },
    { value: 'Hindi', label: 'हिंदी (Hindi)' },
    { value: 'Bengali', label: 'বাংলা (Bengali)' }
  ];

  return (
    <div className="space-y-6">
      {/* Display Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Display Preferences</CardTitle>
          <CardDescription>Customize how information is displayed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency Preference</Label>
              <Select 
                value={preferences.currency} 
                onValueChange={(value) => handlePreferenceChange('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      <div>
                        <div>{currency.label}</div>
                        <div className="text-sm text-muted-foreground">{currency.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Affects wallet view, pricing, and credit purchase screens
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateFormat">Date Format</Label>
              <Select 
                value={preferences.dateFormat} 
                onValueChange={(value) => handlePreferenceChange('dateFormat', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="YYYY/MM/DD">YYYY/MM/DD</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Applied across dashboard
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select 
              value={preferences.language} 
              onValueChange={(value) => handlePreferenceChange('language', value)}
            >
              <SelectTrigger className="max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((language) => (
                  <SelectItem key={language.value} value={language.value}>
                    {language.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Optional for future regional scaling
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="darkMode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch to dark theme for better comfort
              </p>
            </div>
            <Switch 
              id="darkMode"
              checked={preferences.darkMode}
              onCheckedChange={(checked) => handlePreferenceChange('darkMode', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Control how you receive updates and alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="emailAlerts">Email Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  KYC updates, purchases, project status notifications
                </p>
              </div>
              <Switch 
                id="emailAlerts"
                checked={preferences.emailAlerts}
                onCheckedChange={(checked) => handlePreferenceChange('emailAlerts', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="smsAlerts">SMS Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Only important updates and security notifications
                </p>
              </div>
              <Switch 
                id="smsAlerts"
                checked={preferences.smsAlerts}
                onCheckedChange={(checked) => handlePreferenceChange('smsAlerts', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="inAppNotifications">In-app Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Show notifications within the application
                </p>
              </div>
              <Switch 
                id="inAppNotifications"
                checked={preferences.inAppNotifications}
                onCheckedChange={(checked) => handlePreferenceChange('inAppNotifications', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Changes */}
      <div className="flex justify-end">
        <Button disabled={!hasChanges}>
          Save Preferences
        </Button>
      </div>
    </div>
  );
}