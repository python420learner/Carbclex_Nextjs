"use client"
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Bell } from 'lucide-react';
import { AlertsSection } from './notification/AlertsSection';
import { NotificationSettings } from './notification/NotificationSettings';
import { MarketInsightsSection } from './notification/MarketInsightsSection';
import { RemindersSection } from './notification/RemindersSection';

export function NotificationsAndUpdates({ notifications, alertNotifications, reminders, marketInsights, userId, handlePendingSubmit }) {
  const [unreadCounts, setUnreadCounts] = useState({
    alerts: 3,
    reminders: 2,
    insights: 5
  });

  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('alert')
  const [userNotificationSettings, setUserNotificationSettings] = useState(null);
  // const [userNotificationSettings, setUserNotificationSettings] = useState<NotificationSettings | null>(null);


  const totalUnread = unreadCounts.alerts + unreadCounts.reminders + unreadCounts.insights;

  // const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`/api/notification-settings/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch notification settings');
        const data = await res.json();
        setUserNotificationSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSettings();
    }
  }, [userId]);

  if (userNotificationSettings) {
    console.log(userNotificationSettings.defaultView)
  }

  if (showSettings) {
    return <NotificationSettings notificationSettings={userNotificationSettings} userId={userId} onBack={() => setShowSettings(false)} />;
  }


  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="h-6 w-6" />
            {totalUnread > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {totalUnread}
              </Badge>
            )}
          </div>
          <h2 className="text-2xl font-medium">Notifications & Updates</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(true)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Settings
          </button>
        </div>
      </div>

      <p className="text-muted-foreground">
        Stay updated with alerts, reminders, and market insights
      </p>

      <Tabs defaultValue="alerts" className="w-full">
        {userNotificationSettings?.defaultView === 'alerts_first' &&
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger onClick={() => setActiveTab('alert')} value="alerts">
              🔔 Alerts
              {alertNotifications.length > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-2 h-5 w-5 rounded-full p-0 bg-red-600 flex items-center justify-center text-xs"
                >
                  {alertNotifications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger onClick={() => setActiveTab('reminder')} value="reminders">
              ⏰ Reminders
              {reminders.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-yellow-500 text-white"
                >
                  {reminders.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger onClick={() => setActiveTab('insights')} value="insights">
              📊 Market Insights
              {unreadCounts.insights > 0 && (
                <Badge
                  variant="outline"
                  className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-blue-500 text-white border-blue-500"
                >
                  {unreadCounts.insights}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        }
        {userNotificationSettings?.defaultView === 'reminders_first' &&
          <TabsList className="grid w-full grid-cols-3 bg-gray-300">
            <TabsTrigger onClick={() => setActiveTab('reminder')} value="reminders">
              ⏰ Reminders
              {unreadCounts.reminders > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-yellow-500 text-white"
                >
                  {reminders.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger onClick={() => setActiveTab('alert')} value="alerts">
              🔔 Alerts
              {alertNotifications.length > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-2 h-5 w-5 rounded-full p-0 bg-red-600 flex items-center justify-center text-xs"
                >
                  {alertNotifications.length}
                </Badge>
              )}
            </TabsTrigger>

            <TabsTrigger onClick={() => setActiveTab('insights')} value="insights">
              📊 Market Insights
              {unreadCounts.insights > 0 && (
                <Badge
                  variant="outline"
                  className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-blue-500 text-white border-blue-500"
                >
                  {unreadCounts.insights}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        }


        <TabsContent value="alerts" className="mt-6">
          <AlertsSection notificationSettings={userNotificationSettings} alertNotifications={alertNotifications} />
        </TabsContent>

        <TabsContent value="reminders" className="mt-6">
          <RemindersSection userId={userId} handlePendingSubmit={handlePendingSubmit} reminderNotifications={reminders} />
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <MarketInsightsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}