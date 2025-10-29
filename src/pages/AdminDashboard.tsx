import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, XCircle, MapPin, Package } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const [shops, setShops] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [shopsResponse, alertsResponse] = await Promise.all([
        supabase.functions.invoke('admin-shops'),
        supabase.functions.invoke('admin-alerts')
      ]);

      if (shopsResponse.error) throw shopsResponse.error;
      if (alertsResponse.error) throw alertsResponse.error;

      setShops(shopsResponse.data?.shops || []);
      setAlerts(alertsResponse.data?.alerts || []);
    } catch (error: any) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "success";
      case "low":
        return "warning";
      case "critical":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor FPS shops, deliveries, and fraud alerts</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total FPS Shops</CardDescription>
              <CardTitle className="text-3xl">124</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Beneficiaries</CardDescription>
              <CardTitle className="text-3xl">45,678</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending Deliveries</CardDescription>
              <CardTitle className="text-3xl">8</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Open Complaints</CardDescription>
              <CardTitle className="text-3xl">23</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Fraud Alerts */}
        <Card className="mb-8 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Fraud Detection Alerts
            </CardTitle>
            <CardDescription>AI-powered fraud detection alerts</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-3">
                {alerts.length > 0 ? (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth"
                    >
                      <div className="space-y-1 mb-2 sm:mb-0">
                        <div className="flex items-center gap-2">
                          <Badge variant={getSeverityColor(alert.severity) as any}>{alert.severity.toUpperCase()}</Badge>
                          <span className="font-semibold">{alert.message}</span>
                        </div>
                        {alert.shop_id && <p className="text-sm text-muted-foreground">Shop ID: {alert.shop_id}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {new Date(alert.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No alerts at this time</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* FPS Shop Stock Status */}
        <Card className="mb-8 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              FPS Shop Stock Status
            </CardTitle>
            <CardDescription>Real-time inventory monitoring across all shops</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-4">
                {shops.length > 0 ? (
                  shops.map((shop) => (
                    <div key={shop.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{shop.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {shop.location}
                          </p>
                        </div>
                        <Badge variant={getStatusColor(shop.status) as any}>
                          {shop.status === "good" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {shop.status === "critical" && <XCircle className="h-3 w-3 mr-1" />}
                          {shop.status === "low" && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {shop.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Rice:</span>
                          <span className="ml-2 font-semibold">{shop.rice_stock} kg</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Wheat:</span>
                          <span className="ml-2 font-semibold">{shop.wheat_stock} kg</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Sugar:</span>
                          <span className="ml-2 font-semibold">{shop.sugar_stock} kg</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No shops found</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-secondary" />
              System Statistics
            </CardTitle>
            <CardDescription>Overview of the distribution system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Shops:</span>
                <span className="ml-2 font-semibold">{shops.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Active Alerts:</span>
                <span className="ml-2 font-semibold">{alerts.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
