"use client"
import { useEffect, useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Clock, X, Calendar, ShoppingCart, FileText } from 'lucide-react';
import { ReminderCard } from './ReminderCard';
import Link from 'next/link';


interface Notification {
  id: number;
  createdAt: string;
  customMessage: string;
  isRead: boolean;
  relatedEntityId: number;
  relatedEntityType: string;
  userId: string;

  event: {
    id: number;
    code: string;
    title: string;
    message: string;

    type: {
      id: number;
      name: string;
      label: string | null;
    };
  };
}

export const RemindersSection = ({ userId, reminderNotifications, handlePendingSubmit }) => {
  const [reminders, setReminders] = useState<Notification[]>([]);

  useEffect(() => {
    if (reminderNotifications && reminderNotifications.length > 0) {
      setReminders(reminderNotifications);
    }
  }, [reminderNotifications]);

  const [settings, setSettings] = useState({
    notifyExpiringProjects: true,
    notifyCartCreditsExpiring: true,
    notifyDocumentRenewal: true
  });

  const filteredReminders = reminders.filter(reminder => {
    const code = reminder.event.code;
    if (code === "CART_EXPIRY") return settings.notifyCartCreditsExpiring;
    if (code === "PROJECT_DRAFT") return settings.notifyExpiringProjects;
    if (code === "KYC_EXPIRE") return settings.notifyDocumentRenewal;
    // For other reminder types that do not have specific notifications setting, keep them visible (or change logic as needed)
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CART_EXPIRY':
        return <ShoppingCart className="h-5 w-5" />;
      case 'PROJECT_DRAFT':
        return <FileText className="h-5 w-5" />;
      case 'CREDIT_VALIDITY_REMINDER':
        return <Calendar className="h-5 w-5" />;
      case 'KYC_EXPIRE':
        return <FileText className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const deleteNotification = async (notificationId: number) => {
    try {
      const res = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete');

      // Optimistically update UI by removing the notification from state
      setReminders(prev => prev.filter(n => n.id !== notificationId));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const handleDeleteAllReminders = async () => {
    try {
      const res = await fetch(`/api/notifications/clear?userId=${userId}&typeId=2`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete');

      // Optimistically update UI by removing the notification from state
      setReminders([]);
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  // if (reminders.length > 0) {
  //   console.log("Reminders:", reminders);
  // }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="font-bold">Active Reminders ({reminders.length})</h3>
        </div>

        {reminders.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleDeleteAllReminders}>
            Clear All Reminders
          </Button>
        )}
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        {filteredReminders.map((reminder) => (
          <Card key={reminder.id} className="hover:shadow-md transition-all">
            <CardContent className="pt-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(reminder.event.code)}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{reminder.event.title}</h4>
                        {/* <Badge 
                          variant="outline" 
                          className={`text-xs ${getUrgencyColor(reminder.urgency)}`}
                        >
                          {reminder.urgency.toUpperCase()}
                        </Badge> */}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {reminder.customMessage}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => deleteNotification(reminder.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <ReminderCard reminder={reminder} />
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {reminder.event.code === "CART_EXPIRY" && (
                      <Link href="/cartpage"><Button size="sm">Complete Purchase</Button></Link>
                    )}
                    {reminder.event.code === "PROJECT_DRAFT" && (
                      <Button size="sm" onClick={() => handlePendingSubmit(reminder.relatedEntityId)}>Submit Project</Button>
                    )}
                    {reminder.event.code === 'CREDIT_VALIDITY_REMINDER' && (
                      <Button size="sm" variant="outline">View Credits</Button>
                    )}
                    {reminder.event.code === "KYC_EXPIRE" && (
                      <Button size="sm">Renew Document</Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {reminders.length === 0 && (
          <Card>
            <CardContent className="pt-8 pb-8 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No active reminders</h3>
              <p className="text-sm text-muted-foreground">
                You're all caught up! No pending actions or deadlines at the moment.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Reminder Settings */}
      <Card>
        <CardContent className="pt-6">
          <h4 className="font-medium mb-4">Reminder Settings</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Expiring Projects</p>
                <p className="text-sm text-muted-foreground">Get notified about project deadlines</p>
              </div>
              <Button
                variant={settings.notifyExpiringProjects ? "default" : "outline"}
                size="sm"
                onClick={() => setSettings(prev => ({ ...prev, notifyExpiringProjects: !prev.notifyExpiringProjects }))}
              >
                {settings.notifyExpiringProjects ? 'ON' : 'OFF'}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Cart Credits Expiring</p>
                <p className="text-sm text-muted-foreground">Get notified about cart expiration</p>
              </div>
              <Button
                variant={settings.notifyCartCreditsExpiring ? "default" : "outline"}
                size="sm"
                onClick={() => setSettings(prev => ({ ...prev, notifyCartCreditsExpiring: !prev.notifyCartCreditsExpiring }))}
              >
                {settings.notifyCartCreditsExpiring ? 'ON' : 'OFF'}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Document Renewal</p>
                <p className="text-sm text-muted-foreground">Get notified about document renewals</p>
              </div>
              <Button
                variant={settings.notifyDocumentRenewal ? "default" : "outline"}
                size="sm"
                onClick={() => setSettings(prev => ({ ...prev, notifyDocumentRenewal: !prev.notifyDocumentRenewal }))}
              >
                {settings.notifyDocumentRenewal ? 'ON' : 'OFF'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// logic for progress bar for project draft expiry
// reminder ---> fetch(entity) from reminder.entityId ----> expiry=entity.createdAt+validity ----> progressBar(expiry-DateToday)
// expiry = 17 Aug 20205, today = 2Aug 2025 -------> difference 15days

