import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, XCircle, MapPin, Package } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Dummy data
const fpsShops = [
  { id: 1, name: "FPS Shop #234", location: "Mumbai Central", stock: { rice: 450, wheat: 380, sugar: 120 }, status: "good" },
  { id: 2, name: "FPS Shop #567", location: "Andheri West", stock: { rice: 120, wheat: 90, sugar: 25 }, status: "low" },
  { id: 3, name: "FPS Shop #891", location: "Bandra East", stock: { rice: 550, wheat: 480, sugar: 150 }, status: "good" },
  { id: 4, name: "FPS Shop #432", location: "Dadar", stock: { rice: 50, wheat: 40, sugar: 10 }, status: "critical" },
];

const fraudAlerts = [
  { id: 1, shop: "FPS Shop #567", type: "Duplicate Transaction", severity: "high", date: "2025-01-20" },
  { id: 2, shop: "FPS Shop #432", type: "Stock Mismatch", severity: "medium", date: "2025-01-19" },
  { id: 3, shop: "FPS Shop #234", type: "Unusual Pattern", severity: "low", date: "2025-01-18" },
];

const deliveryRoutes = [
  { id: 1, route: "Route A", vehicle: "MH-01-AB-1234", status: "In Transit", eta: "2 hours" },
  { id: 2, route: "Route B", vehicle: "MH-02-CD-5678", status: "Delivered", eta: "Completed" },
  { id: 3, route: "Route C", vehicle: "MH-03-EF-9012", status: "Scheduled", eta: "Tomorrow 9 AM" },
];

export default function AdminDashboard() {
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
            <CardDescription>Recent suspicious activities requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {fraudAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth"
                >
                  <div className="space-y-1 mb-2 sm:mb-0">
                    <div className="flex items-center gap-2">
                      <Badge variant={getSeverityColor(alert.severity) as any}>{alert.severity.toUpperCase()}</Badge>
                      <span className="font-semibold">{alert.type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.shop}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{alert.date}</span>
                    <Button size="sm" variant="outline">
                      Investigate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
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
            <div className="space-y-4">
              {fpsShops.map((shop) => (
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
                      <span className="ml-2 font-semibold">{shop.stock.rice} kg</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Wheat:</span>
                      <span className="ml-2 font-semibold">{shop.stock.wheat} kg</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sugar:</span>
                      <span className="ml-2 font-semibold">{shop.stock.sugar} kg</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Delivery Routes */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-secondary" />
              Delivery Routes
            </CardTitle>
            <CardDescription>Track live delivery status and schedules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deliveryRoutes.map((route) => (
                <div
                  key={route.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-border rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold">{route.route}</h4>
                    <p className="text-sm text-muted-foreground">Vehicle: {route.vehicle}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-2 sm:mt-0">
                    <Badge
                      variant={
                        route.status === "Delivered"
                          ? "success"
                          : route.status === "In Transit"
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {route.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">ETA: {route.eta}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
