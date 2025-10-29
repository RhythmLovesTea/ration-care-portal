import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, CheckCircle, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatBot } from "@/components/ChatBot";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Complaints() {
  const [complaintData, setComplaintData] = useState({
    subject: "",
    description: "",
  });
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchComplaints();
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      setIsAdmin(!!data);
    }
  };

  const fetchComplaints = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComplaints(data || []);
    } catch (error: any) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintData.subject || !complaintData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('submit-complaint', {
        body: complaintData
      });

      if (error) throw error;

      toast({
        title: "Complaint Submitted",
        description: `Your complaint has been registered successfully.`,
      });

      setComplaintData({ subject: "", description: "" });
      fetchComplaints();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to submit complaint",
        variant: "destructive",
      });
    }
  };

  const handleResolveComplaint = async (complaintId: string) => {
    try {
      const { error } = await supabase.functions.invoke('resolve-complaint', {
        body: { complaintId }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Complaint marked as resolved",
      });
      fetchComplaints();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to resolve complaint",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Complaints & Grievances</h1>
          <p className="text-muted-foreground">File and track your complaints</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* File New Complaint */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                File New Complaint
              </CardTitle>
              <CardDescription>Submit your grievance for review</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of the issue"
                    value={complaintData.subject}
                    onChange={(e) => setComplaintData({ ...complaintData, subject: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide complete details of your complaint..."
                    value={complaintData.description}
                    onChange={(e) => setComplaintData({ ...complaintData, description: e.target.value })}
                    rows={6}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Upload Supporting Document (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <Input id="image" type="file" accept="image/*" className="flex-1" />
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Upload photos or documents as evidence</p>
                </div>

                <Button type="submit" className="w-full" variant="hero" size="lg">
                  Submit Complaint
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Complaint History */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Your Complaints</CardTitle>
              <CardDescription>Track the status of your submitted complaints</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center text-muted-foreground">Loading...</p>
              ) : (
                <div className="space-y-4">
                  {complaints.length > 0 ? (
                    complaints.map((complaint) => (
                      <div key={complaint.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{complaint.subject}</h4>
                            <p className="text-xs text-muted-foreground">{complaint.id}</p>
                          </div>
                          <Badge
                            variant={complaint.status === "resolved" ? "success" : "warning"}
                          >
                            {complaint.status === "resolved" ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {complaint.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{complaint.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Filed on: {new Date(complaint.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No complaints filed yet</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Admin Section (shown conditionally) */}
        {isAdmin && (
          <Card className="mt-8 shadow-sm">
            <CardHeader>
              <CardTitle>Admin: Pending Complaints</CardTitle>
              <CardDescription>Review and resolve beneficiary complaints (Admin Only)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {complaints
                  .filter((c) => c.status === "pending")
                  .map((complaint) => (
                    <div
                      key={complaint.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="mb-2 sm:mb-0">
                        <h4 className="font-semibold">{complaint.subject}</h4>
                        <p className="text-sm text-muted-foreground">{complaint.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {complaint.id} • {new Date(complaint.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="success"
                          onClick={() => handleResolveComplaint(complaint.id)}
                        >
                          Mark Resolved
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
      <ChatBot />
    </div>
  );
}
