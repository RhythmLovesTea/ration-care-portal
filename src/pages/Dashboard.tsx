import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calendar, MapPin, FileText } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatBot } from "@/components/ChatBot";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const [complaintText, setComplaintText] = useState("");
  const [loading, setLoading] = useState(true);
  const [entitlements, setEntitlements] = useState({
    rice: { total: 25, used: 0, remaining: 25 },
    wheat: { total: 20, used: 0, remaining: 20 },
    sugar: { total: 5, used: 0, remaining: 5 },
  });
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchBeneficiaryData();
  }, []);

  const fetchBeneficiaryData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('beneficiary-data');
      
      if (error) throw error;

      if (data?.entitlements) {
        const ent = data.entitlements;
        setEntitlements({
          rice: { total: ent.rice_total, used: ent.rice_used, remaining: ent.rice_total - ent.rice_used },
          wheat: { total: ent.wheat_total, used: ent.wheat_used, remaining: ent.wheat_total - ent.wheat_used },
          sugar: { total: ent.sugar_total, used: ent.sugar_used, remaining: ent.sugar_total - ent.sugar_used },
        });
      }

      if (data?.transactions) {
        setTransactions(data.transactions);
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load your data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReportMissing = async () => {
    if (!complaintText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a complaint description",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('submit-complaint', {
        body: { subject: "Missing Ration", description: complaintText }
      });

      if (error) throw error;

      toast({
        title: "Complaint Submitted",
        description: `Your complaint has been registered. Reference ID: ${data.complaint.id}`,
      });
      setComplaintText("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to submit complaint",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Alert Banner */}
        <Alert className="mb-6 border-warning bg-warning/10">
          <Calendar className="h-4 w-4 text-warning" />
          <AlertDescription className="text-foreground ml-2">
            <strong>Next ration delivery expected on:</strong> February 5, 2025
          </AlertDescription>
        </Alert>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Beneficiary Dashboard</h1>
          <p className="text-muted-foreground">Track your ration entitlements and transactions</p>
        </div>

        {/* Entitlement Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.entries(entitlements).map(([item, data]) => (
            <Card key={item} className="shadow-sm hover:shadow-md transition-smooth">
              <CardHeader>
                <CardTitle className="capitalize text-xl">{item}</CardTitle>
                <CardDescription>Monthly Entitlement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-semibold">{data.total} kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Used:</span>
                    <span className="font-semibold text-destructive">{data.used} kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Remaining:</span>
                    <span className="font-semibold text-success">{data.remaining} kg</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-3">
                    <div
                      className="bg-primary h-2 rounded-full transition-smooth"
                      style={{ width: `${(data.used / data.total) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="lg">
                <AlertCircle className="mr-2 h-5 w-5" />
                Report Missing Ration
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report Missing Ration</DialogTitle>
                <DialogDescription>
                  Please provide details about the missing ration. Your complaint will be registered and tracked.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="complaint">Complaint Description</Label>
                  <Textarea
                    id="complaint"
                    placeholder="Describe the issue in detail..."
                    value={complaintText}
                    onChange={(e) => setComplaintText(e.target.value)}
                    rows={5}
                  />
                </div>
                <Button onClick={handleReportMissing} className="w-full" variant="destructive">
                  Submit Complaint
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="lg">
            <MapPin className="mr-2 h-5 w-5" />
            Find Nearby FPS
          </Button>

          <Button variant="outline" size="lg">
            <FileText className="mr-2 h-5 w-5" />
            Download Passbook
          </Button>
        </div>

        {/* Transaction History */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your recent ration collection records</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-4">
                {transactions.length > 0 ? (
                  transactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth"
                    >
                      <div className="space-y-1 mb-2 sm:mb-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{txn.item_type}</Badge>
                          <span className="font-semibold">{txn.amount} kg</span>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {txn.fps_name}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {new Date(txn.transaction_date).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No transactions yet</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
      <ChatBot />
    </div>
  );
}
