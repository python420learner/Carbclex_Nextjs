"use client"
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
// import * as Switch from "@radix-ui/react-switch";

import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { ArrowLeft, Bell, Mail, MessageSquare, UserIcon, Volume2, VolumeX } from 'lucide-react';

interface NotificationSettingsProps {
  userId: string;
  notificationSettings: NotificationSettings;
  onBack: () => void;
}

interface NotificationSettings {
  emailNotifications: boolean;
  inAppNotifications: boolean;
  smsNotifications: boolean;
  notificationSound: boolean;
  kycAlerts: boolean;
  projectUpdates: boolean;
  marketplaceUpdates: boolean;
  systemNotifications: boolean;
  priceTrends: boolean;
  marketNews: boolean;
  policyUpdates: boolean;
  techUpdates: boolean;
  alertPriority: 'all_alerts' | 'critical_only';
  defaultView: 'alerts_first' | 'reminders_first';
  updateFrequency: 'daily' | 'weekly' | 'monthly';
}


export function NotificationSettings({ notificationSettings, userId, onBack }: NotificationSettingsProps) {
  const [loading, setLoading] = useState(true);

  const [userSettings, setUserSettings] = useState<NotificationSettings | null>(null);

  // const [settings, setSettings] = useState({
  //   defaultView: 'alerts',
  //   alertPriority: 'all',
  //   email: true,
  //   inApp: true,
  //   sms: false,
  //   sound: true,

  //   // Alert specific settings
  //   kycAlerts: true,
  //   projectAlerts: true,
  //   marketplaceAlerts: true,
  //   systemAlerts: true,

  //   // Reminder settings
  //   projectDeadlines: true,
  //   cartExpiration: true,
  //   creditExpiration: true,
  //   documentRenewal: true,

  //   // Market insights settings
  //   policyUpdates: true,
  //   priceAlerts: true,
  //   techUpdates: false,
  //   marketNews: true,
  //   insightFrequency: 'daily'
  // });

  useEffect(() => {
    if (notificationSettings) {
      setUserSettings(notificationSettings);
    }
  }, [notificationSettings]);

  if (userSettings) {

    console.log(userSettings)
  }

  // const handleSettingChange = (key: string, value: boolean | string) => {
  //   setUserSettings(prev => ({ ...prev, [key]: value }));
  // };

  const handleSettingChange = (key: keyof typeof userSettings, value: boolean | string) => {
    setUserSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetToDefaults = () => {
    setUserSettings({
      defaultView: 'alerts_first',
      alertPriority: 'all_alerts',
      emailNotifications: true,
      inAppNotifications: true,
      smsNotifications: false,
      notificationSound: true,
      kycAlerts: true,
      projectUpdates: true,
      marketplaceUpdates: true,
      systemNotifications: true,
      // projectDeadlines: true,
      // cartExpiration: true,
      // creditExpiration: true,
      // documentRenewal: true,
      policyUpdates: true,
      priceTrends: true,
      techUpdates: false,
      marketNews: true,
      updateFrequency: 'daily'
    });
  };

  const handleSaveSettings = async () => {
    try {
      const res = await fetch(`/api/notification-settings/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userSettings),
      });

      if (!res.ok) throw new Error("Failed to save settings");

      const data = await res.json();
      alert("Notification settings saved successfully.");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings.");
    }
  };


  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-0 h-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Notifications
        </Button>
        <h2 className="text-2xl font-medium">Notification Settings</h2>
      </div>

      {userSettings && <div className="grid gap-6"> 
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="defaultView">Default View</Label>
                <Select
                  value={userSettings.defaultView}
                  onValueChange={(value) => handleSettingChange('defaultView', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='bg-white'>
                    <SelectItem value="alerts_first">Alerts First</SelectItem>
                    <SelectItem value="reminders_first">Reminders First</SelectItem>
                    {/* <SelectItem value="insights">Insights First</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alertPriority">Alert Priority</Label>
                <Select
                  value={userSettings.alertPriority}
                  onValueChange={(value) => handleSettingChange('alertPriority', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_alerts">All Alerts</SelectItem>
                    {/* <SelectItem value="high">High Priority Only</SelectItem> */}
                    <SelectItem value="critical_only">Critical Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Channels */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Channels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="email">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
              </div>
              <Switch
                id="email"
                checked={userSettings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="inApp">In-app Notifications</Label>
                  <p className="text-sm text-muted-foreground">Show notifications within the app</p>
                </div>
              </div>
              <Switch
                id="inApp"
                checked={userSettings.inAppNotifications}
                onCheckedChange={(checked) => handleSettingChange('inAppNotifications', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="sms">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Critical updates via SMS</p>
                </div>
              </div>
              <Switch
                id="sms"
                checked={userSettings.smsNotifications}
                onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {userSettings.notificationSound ? (
                  <Volume2 className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <VolumeX className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <Label htmlFor="sound">Notification Sound</Label>
                  <p className="text-sm text-muted-foreground">Play sound for new notifications</p>
                </div>
              </div>
              <Switch
                id="sound"
                checked={userSettings.notificationSound}
                onCheckedChange={(checked) => handleSettingChange('notificationSound', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Alert Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="kycAlerts">KYC & Verification</Label>
                <p className="text-sm text-muted-foreground">Document verification updates</p>
              </div>
              <Switch
                id="kycAlerts"
                checked={userSettings.kycAlerts}
                onCheckedChange={(checked) => handleSettingChange('kycAlerts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="projectAlerts">Project Updates</Label>
                <p className="text-sm text-muted-foreground">Project approval and status changes</p>
              </div>
              <Switch
                id="projectAlerts"
                checked={userSettings.projectUpdates}
                onCheckedChange={(checked) => handleSettingChange('projectUpdates', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketplaceAlerts">Marketplace</Label>
                <p className="text-sm text-muted-foreground">Price changes and trading updates</p>
              </div>
              <Switch
                id="marketplaceAlerts"
                checked={userSettings.marketplaceUpdates}
                onCheckedChange={(checked) => handleSettingChange('marketplaceUpdates', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="systemAlerts">System Notifications</Label>
                <p className="text-sm text-muted-foreground">Maintenance and system updates</p>
              </div>
              <Switch
                id="systemAlerts"
                checked={userSettings.systemNotifications}
                onCheckedChange={(checked) => handleSettingChange('systemNotifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Market Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Market Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="insightFrequency">Update Frequency</Label>
              <Select
                value={userSettings.updateFrequency}
                onValueChange={(value) => handleSettingChange('updateFrequency', value)}
              >
                <SelectTrigger className="max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="off">Turn Off</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="policyUpdates">Policy Updates</Label>
                  <p className="text-sm text-muted-foreground">Regulatory changes</p>
                </div>
                <Switch
                  id="policyUpdates"
                  checked={userSettings.policyUpdates}
                  onCheckedChange={(checked) => handleSettingChange('policyUpdates', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="priceAlerts">Price Trends</Label>
                  <p className="text-sm text-muted-foreground">Market price changes</p>
                </div>
                <Switch
                  id="priceAlerts"
                  checked={userSettings.priceTrends}
                  onCheckedChange={(checked) => handleSettingChange('priceTrends', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="techUpdates">Tech Updates</Label>
                  <p className="text-sm text-muted-foreground">Technical standards</p>
                </div>
                <Switch
                  id="techUpdates"
                  checked={userSettings.techUpdates}
                  onCheckedChange={(checked) => handleSettingChange('techUpdates', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketNews">Market News</Label>
                  <p className="text-sm text-muted-foreground">Industry updates</p>
                </div>
                <Switch
                  id="marketNews"
                  checked={userSettings.marketNews}
                  onCheckedChange={(checked) => handleSettingChange('marketNews', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSaveSettings}>
            Save Settings
          </Button>
        </div>
      </div>}
    </div>
  );
}