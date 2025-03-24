"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"

export default function SettingsPage() {
  // Business settings
  const [businessName, setBusinessName] = useState("ScanPOS Demo Store")
  const [businessAddress, setBusinessAddress] = useState("123 Main Street, City, State, 123456")
  const [businessPhone, setBusinessPhone] = useState("9876543210")
  const [businessEmail, setBusinessEmail] = useState("contact@scanpos.com")
  const [businessGST, setBusinessGST] = useState("22AAAAA0000A1Z5")
  const [businessLogo, setBusinessLogo] = useState<string | null>(null)

  // Invoice settings
  const [invoicePrefix, setInvoicePrefix] = useState("INV-")
  const [invoiceFooter, setInvoiceFooter] = useState("Thank you for your business!")
  const [showGST, setShowGST] = useState(true)
  const [showLogo, setShowLogo] = useState(true)
  const [showQR, setShowQR] = useState(true)

  // User settings
  const [name, setName] = useState("Admin User")
  const [email, setEmail] = useState("admin@example.com")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(true)
  const [lowStockAlerts, setLowStockAlerts] = useState(true)
  const [paymentAlerts, setPaymentAlerts] = useState(true)

  useEffect(() => {
    // Load business settings from localStorage
    const storedSettings = localStorage.getItem("business-settings")
    if (storedSettings) {
      const settings = JSON.parse(storedSettings)
      setBusinessName(settings.businessName || "ScanPOS Demo Store")
      setBusinessAddress(settings.businessAddress || "123 Main Street, City, State, 123456")
      setBusinessPhone(settings.businessPhone || "9876543210")
      setBusinessEmail(settings.businessEmail || "contact@scanpos.com")
      setBusinessGST(settings.businessGST || "22AAAAA0000A1Z5")
      setBusinessLogo(settings.businessLogo || null)
    }
  }, [])

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setBusinessLogo(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveBusinessSettings = () => {
    // Save business settings to localStorage
    const businessSettings = {
      businessName,
      businessAddress,
      businessPhone,
      businessEmail,
      businessGST,
      businessLogo,
    }
    localStorage.setItem("business-settings", JSON.stringify(businessSettings))
    alert("Business settings saved successfully!")
  }

  const handleSaveInvoiceSettings = () => {
    // This would be replaced with an actual API call
    alert("Invoice settings saved successfully!")
  }

  const handleSaveUserSettings = () => {
    // Validate passwords
    if (newPassword && newPassword !== confirmPassword) {
      alert("New passwords do not match!")
      return
    }

    // This would be replaced with an actual API call
    alert("User settings saved successfully!")
  }

  const handleSaveNotificationSettings = () => {
    // This would be replaced with an actual API call
    alert("Notification settings saved successfully!")
  }

  return (
    <DashboardLayout>
      <DashboardShell>
        <DashboardHeader heading="Settings" text="Manage your account and application settings." />

        <Tabs defaultValue="business" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="invoice">Invoice</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="business">
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>
                  Update your business details that will appear on invoices and receipts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input id="businessName" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <Textarea
                    id="businessAddress"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessPhone">Phone Number</Label>
                    <Input
                      id="businessPhone"
                      value={businessPhone}
                      onChange={(e) => setBusinessPhone(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessEmail">Email Address</Label>
                    <Input
                      id="businessEmail"
                      type="email"
                      value={businessEmail}
                      onChange={(e) => setBusinessEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessGST">GST Number</Label>
                  <Input id="businessGST" value={businessGST} onChange={(e) => setBusinessGST(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessLogo">Business Logo</Label>
                  <div className="flex items-center gap-4">
                    {businessLogo && (
                      <div className="w-32 h-16 border rounded-md overflow-hidden">
                        <img
                          src={businessLogo || "/placeholder.svg"}
                          alt="Business Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <Label
                        htmlFor="logo-upload"
                        className="flex items-center justify-center w-full h-16 border border-dashed rounded-md cursor-pointer hover:bg-muted"
                      >
                        <div className="flex flex-col items-center">
                          <Upload className="h-4 w-4 mb-1" />
                          <span className="text-sm">Upload Logo</span>
                        </div>
                        <Input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoUpload}
                        />
                      </Label>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Recommended size: 300x150 pixels. Max file size: 2MB.</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveBusinessSettings}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="invoice">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Settings</CardTitle>
                <CardDescription>Customize how your invoices are generated and displayed.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="invoicePrefix">Invoice Number Prefix</Label>
                  <Input id="invoicePrefix" value={invoicePrefix} onChange={(e) => setInvoicePrefix(e.target.value)} />
                  <p className="text-xs text-muted-foreground">Example: {invoicePrefix}001</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoiceFooter">Invoice Footer Text</Label>
                  <Textarea
                    id="invoiceFooter"
                    value={invoiceFooter}
                    onChange={(e) => setInvoiceFooter(e.target.value)}
                    rows={3}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Invoice Display Options</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="showGST">Show GST Information</Label>
                      <p className="text-xs text-muted-foreground">Display GST breakdown on invoices</p>
                    </div>
                    <Switch id="showGST" checked={showGST} onCheckedChange={setShowGST} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="showLogo">Show Business Logo</Label>
                      <p className="text-xs text-muted-foreground">Display your business logo on invoices</p>
                    </div>
                    <Switch id="showLogo" checked={showLogo} onCheckedChange={setShowLogo} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="showQR">Show QR Code</Label>
                      <p className="text-xs text-muted-foreground">Display payment QR code on invoices</p>
                    </div>
                    <Switch id="showQR" checked={showQR} onCheckedChange={setShowQR} />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveInvoiceSettings}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Update your account information and change your password.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Change Password</h3>

                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveUserSettings}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how and when you receive notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive notifications via SMS</p>
                  </div>
                  <Switch id="smsNotifications" checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                </div>

                <Separator />

                <h3 className="text-sm font-medium">Notification Types</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="lowStockAlerts">Low Stock Alerts</Label>
                    <p className="text-xs text-muted-foreground">Get notified when inventory items are running low</p>
                  </div>
                  <Switch id="lowStockAlerts" checked={lowStockAlerts} onCheckedChange={setLowStockAlerts} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="paymentAlerts">Payment Alerts</Label>
                    <p className="text-xs text-muted-foreground">Get notified when payments are received or failed</p>
                  </div>
                  <Switch id="paymentAlerts" checked={paymentAlerts} onCheckedChange={setPaymentAlerts} />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveNotificationSettings}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </DashboardLayout>
  )
}

