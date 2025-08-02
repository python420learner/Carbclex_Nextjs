"use client"
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { AlertTriangle, CheckCircle, XCircle, Clock, MoreHorizontal, Upload } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'error' | 'success' | 'warning';
  category: 'KYC' | 'Project' | 'Marketplace' | 'System';
  source: 'Admin' | 'System' | 'Automated';
  timestamp: string;
  isRead: boolean;
  hasAction: boolean;
  actionLabel?: string;
}

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

interface AlertsSectionProps {
  alertNotifications: Notification[];
  notificationSettings: NotificationSettings[];
}

export const AlertsSection = ({ notificationSettings, alertNotifications }: AlertsSectionProps) => {
  const [filter, setFilter] = useState('All');
  const [selectedAlerts, setSelectedAlerts] = useState<number[]>([]);
  const [userNotificationSettings, setuserNotificationSettings] = useState<NotificationSettings[] | null>(null);
  // const [selectedNotificationIds, setSelectedNotificationIds] = useState<number[]>([]);

  // console.log(alertNotifications)

  const [alerts, setAlerts] = useState<Notification[]>([]);
  // {
  //   id: '1',
  //   title: 'PAN Verification Rejected',
  //   message: 'Your PAN verification was rejected. Please re-upload with clear, readable images.',
  //   type: 'error',
  //   category: 'KYC',
  //   source: 'Admin',
  //   timestamp: '2 hours ago',
  //   isRead: false,
  //   hasAction: true,
  //   actionLabel: 'Re-upload Now'
  // },
  // {
  //   id: '2',
  //   title: 'Project Approved',
  //   message: 'Project #123 "Solar Farm Initiative" has been approved by admin and is now live.',
  //   type: 'success',
  //   category: 'Project',
  //   source: 'Admin',
  //   timestamp: '4 hours ago',
  //   isRead: false,
  //   hasAction: false
  // },
  // {
  //   id: '3',
  //   title: 'Price Alert',
  //   message: 'Price of Biochar credits dropped to ₹598/tonne (15% decrease from yesterday).',
  //   type: 'warning',
  //   category: 'Marketplace',
  //   source: 'System',
  //   timestamp: '6 hours ago',
  //   isRead: true,
  //   hasAction: false
  // },
  // {
  //   id: '4',
  //   title: 'Document Upload Required',
  //   message: 'Additional documentation needed for your Forestry project verification.',
  //   type: 'warning',
  //   category: 'Project',
  //   source: 'Admin',
  //   timestamp: '1 day ago',
  //   isRead: false,
  //   hasAction: true,
  //   actionLabel: 'Upload Documents'
  // }

  useEffect(() => {
    if(alerts.length===0){

      if (alertNotifications && alertNotifications.length > 0) {
        setAlerts(alertNotifications);
      }
      if(notificationSettings && notificationSettings.length>0){
        setuserNotificationSettings(notificationSettings)
      }
    }
  }, [alertNotifications]);

  const getStatusIcon = (type: string) => {
    switch (type) {
      case ('KYC_REJECTED'):
      case ('PROJECT_REJECTED'):
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'KYC_APPROVED':
      case 'PROJECT_APPROVED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case ('KYC_REJECTED'):
      case ('PROJECT_REJECTED'):
        return 'bg-red-100 text-red-700 border-red-200';
      case 'KYC_APPROVED':
      case 'PROJECT_APPROVED':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Marketplace':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'System':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredAlerts = filter === 'All'
    ? alerts
    : alerts.filter(alert => alert.event.type.name === filter);

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  const handleMarkAsRead = (alertId: number) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  const markSelectedAsRead = async () => {
    if (selectedAlerts.length === 0) return;

    try {
      const res = await fetch("/api/notifications/mark-as-read", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedAlerts),
      });

      if (!res.ok) throw new Error("Failed to update notifications");

      // Update the local `alerts` state
      setAlerts(prevAlerts =>
        prevAlerts.map(alert =>
          selectedAlerts.includes(alert.id)
            ? { ...alert, isRead: true }
            : alert
        )
      );

      // Clear selected IDs only after updating state
      setSelectedAlerts([]);

      // alert("Notifications marked as read!");
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const handleMarkAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
  };

  const handleDeleteAlert = (alertId: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleSelectAlert = (alertId: number, checked: boolean) => {
    if (checked) {
      setSelectedAlerts(prev => [...prev, alertId]);
    } else {
      setSelectedAlerts(prev => prev.filter(id => id !== alertId));
    }
  };

  // const handleBulkAction = (action: 'read' | 'delete') => {
  //   if (action === 'read') {
  //     setAlerts(prev => prev.map(alert =>
  //       selectedAlerts.includes(alert.id) ? { ...alert, isRead: true } : alert
  //     ));
  //   } else if (action === 'delete') {
  //     setAlerts(prev => prev.filter(alert => !selectedAlerts.includes(alert.id)));
  //   }
  //   setSelectedAlerts([]);
  // };

  const handleBulkAction = async (action: 'read' | 'delete') => {
  if (action === 'read') {
    const allAlertIds = alerts.map(alert => alert.id);
    try {
      // Send selected IDs to backend
      const res = await fetch("/api/notifications/mark-as-read", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(allAlertIds),
      });

      if (!res.ok) throw new Error("Failed to mark as read");

      // Update local UI state
      setAlerts(prev =>
        prev.map(alert =>
          allAlertIds.includes(alert.id) ? { ...alert, isRead: true } : alert
        )
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  } else if (action === 'delete') {
    // Just update UI; assumes separate delete endpoint is triggered elsewhere
    setAlerts(prev => prev.filter(alert => !selectedAlerts.includes(alert.id)));
  }

  // Clear selection
  setSelectedAlerts([]);
};

  // console.log(selectedAlerts)

  if (alerts) {
    console.log(alerts)
    console.log(selectedAlerts)
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4 bg-white">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="KYC">KYC Related</SelectItem>
              <SelectItem value="Project">Project Related</SelectItem>
              <SelectItem value="Marketplace">Marketplace</SelectItem>
              <SelectItem value="System">System</SelectItem>
            </SelectContent>
          </Select>

          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={()=>handleBulkAction('read')}>
              Mark All as Read ({unreadCount})
            </Button>
          )}
        </div>

        {selectedAlerts.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => markSelectedAsRead()}
            >
              Mark Selected as Read
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('delete')}
            >
              Delete Selected
            </Button>
          </div>
        )}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <Card
            key={alert.id}
            className={`transition-all hover:shadow-md ${!alert.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
              }`}
          >
            <CardContent className="pt-4">
              <div className="flex items-start gap-4">
                {!alert.isRead && <Checkbox
                  checked={selectedAlerts.includes(alert.id)}
                  onCheckedChange={(checked) => handleSelectAlert(alert.id, checked === true)}
                />}
                <div className="flex-shrink-0">
                  {getStatusIcon(alert.event.code)}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className={`font-medium ${!alert.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {alert.event.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {alert.customMessage}
                      </p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!alert.isRead && (
                          <DropdownMenuItem onClick={() => handleMarkAsRead(alert.id)}>
                            Mark as Read
                          </DropdownMenuItem>
                        )}
                        {/* <DropdownMenuItem onClick={() => handleDeleteAlert(alert.id)}>
                          Delete
                        </DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${getCategoryColor(alert.event.code)}`}
                      >
                        {alert.event.code}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Admin • {alert.createdAt}
                      </span>
                    </div>

                    {/* {alert.hasAction && (
                      <Button size="sm" variant="default">
                        <Upload className="h-4 w-4 mr-2" />
                        {alert.actionLabel}
                      </Button>
                    )} */}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredAlerts.length === 0 && (
          <Card>
            <CardContent className="pt-8 pb-8 text-center">
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No alerts found</h3>
              <p className="text-sm text-muted-foreground">
                {filter === 'All'
                  ? "You're all caught up! No new alerts at the moment."
                  : `No alerts found for ${filter} category.`
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}