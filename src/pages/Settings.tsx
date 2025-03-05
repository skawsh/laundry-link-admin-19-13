
import React, { useState } from "react";
import { 
  Settings as SettingsIcon, 
  Bell, 
  User, 
  Lock, 
  Shield, 
  Globe, 
  Monitor, 
  Activity,
  MessageSquare
} from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

type NotificationSetting = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

type SecuritySetting = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

const Settings = () => {
  // Profile form
  const profileForm = useForm({
    defaultValues: {
      name: "Admin User",
      email: "admin@example.com",
      phone: "+1 (555) 123-4567",
      avatar: ""
    }
  });

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: "email-notifications",
      title: "Email Notifications",
      description: "Receive email notifications for important events",
      enabled: true
    },
    {
      id: "order-notifications",
      title: "Order Updates",
      description: "Get notified when an order status changes",
      enabled: true
    },
    {
      id: "payment-notifications",
      title: "Payment Alerts",
      description: "Receive alerts for new payments and refunds",
      enabled: true
    },
    {
      id: "system-notifications",
      title: "System Alerts",
      description: "Get notified about system updates and maintenance",
      enabled: false
    },
    {
      id: "marketing-notifications",
      title: "Marketing Communications",
      description: "Receive updates about new features and promotions",
      enabled: false
    }
  ]);

  // Security settings
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([
    {
      id: "two-factor",
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account",
      enabled: false
    },
    {
      id: "session-timeout",
      title: "Session Timeout",
      description: "Automatically log out after 30 minutes of inactivity",
      enabled: true
    },
    {
      id: "login-alerts",
      title: "Login Alerts",
      description: "Get notified of suspicious login attempts",
      enabled: true
    }
  ]);

  // Display settings
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("english");
  const [timezone, setTimezone] = useState("America/New_York");

  // Toggle notification setting
  const toggleNotification = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, enabled: !notification.enabled } 
        : notification
    ));
  };

  // Toggle security setting
  const toggleSecurity = (id: string) => {
    setSecuritySettings(securitySettings.map(setting => 
      setting.id === id 
        ? { ...setting, enabled: !setting.enabled } 
        : setting
    ));
  };

  const onProfileSubmit = (data: any) => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully",
    });
  };

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <PageHeader 
          title="Settings" 
          subtitle="Manage your account settings and preferences"
          icon={<SettingsIcon className="h-6 w-6 text-muted-foreground" />}
        />

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 w-full h-auto gap-2">
            <TabsTrigger value="profile" className="flex gap-2 items-center">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex gap-2 items-center">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex gap-2 items-center">
              <Lock className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex gap-2 items-center">
              <Monitor className="h-4 w-4" />
              <span>Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="flex gap-2 items-center">
              <MessageSquare className="h-4 w-4" />
              <span>Support</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Section */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end">
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Section */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control which notifications you receive and how they're delivered
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-medium">{notification.title}</h3>
                      <p className="text-xs text-muted-foreground">{notification.description}</p>
                    </div>
                    <ToggleSwitch 
                      isEnabled={notification.enabled} 
                      onChange={() => toggleNotification(notification.id)} 
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Section */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and authentication methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {securitySettings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-medium">{setting.title}</h3>
                      <p className="text-xs text-muted-foreground">{setting.description}</p>
                    </div>
                    <ToggleSwitch 
                      isEnabled={setting.enabled} 
                      onChange={() => toggleSecurity(setting.id)} 
                    />
                  </div>
                ))}

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Change Password</h3>
                    <div className="space-y-3">
                      <Input type="password" placeholder="Current password" />
                      <Input type="password" placeholder="New password" />
                      <Input type="password" placeholder="Confirm new password" />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button>Update Password</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Section */}
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize how the application looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Theme</h3>
                  <RadioGroup value={theme} onValueChange={setTheme} className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="theme-light" />
                      <label htmlFor="theme-light" className="text-sm cursor-pointer">Light</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="theme-dark" />
                      <label htmlFor="theme-dark" className="text-sm cursor-pointer">Dark</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="theme-system" />
                      <label htmlFor="theme-system" className="text-sm cursor-pointer">System</label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator className="my-2" />

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Language</h3>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="my-2" />

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Timezone</h3>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Section */}
          <TabsContent value="support" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Support</CardTitle>
                <CardDescription>
                  Get help with using the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Contact Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Having issues? Our support team is here to help.
                  </p>
                  <Button variant="outline" className="mt-2">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact Support
                  </Button>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Documentation</h3>
                  <p className="text-sm text-muted-foreground">
                    Read our detailed documentation to learn more about using the platform.
                  </p>
                  <Button variant="outline" className="mt-2">
                    View Documentation
                  </Button>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">System Information</h3>
                  <div className="text-sm grid grid-cols-2 gap-2">
                    <div className="text-muted-foreground">Version:</div>
                    <div>1.2.5</div>
                    <div className="text-muted-foreground">Last Updated:</div>
                    <div>June 15, 2023</div>
                    <div className="text-muted-foreground">Environment:</div>
                    <div>Production</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Settings;
