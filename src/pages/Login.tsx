import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import transparencyIcon from "@/assets/transparency-icon.png";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    aadhaar: "",
    phone: "",
    password: "",
    userType: "beneficiary",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${loginData.userType === "beneficiary" ? "Beneficiary" : "Admin"}!`,
      });
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src={transparencyIcon} alt="Logo" className="h-16 w-16" />
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to access your ration transparency portal</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="beneficiary" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger
                value="beneficiary"
                onClick={() => setLoginData({ ...loginData, userType: "beneficiary" })}
              >
                Beneficiary
              </TabsTrigger>
              <TabsTrigger value="admin" onClick={() => setLoginData({ ...loginData, userType: "admin" })}>
                Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="beneficiary">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="aadhaar">Aadhaar Number</Label>
                  <Input
                    id="aadhaar"
                    placeholder="Enter 12-digit Aadhaar"
                    value={loginData.aadhaar}
                    onChange={(e) => setLoginData({ ...loginData, aadhaar: e.target.value })}
                    maxLength={12}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="Enter 10-digit phone number"
                    value={loginData.phone}
                    onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
                    maxLength={10}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" variant="hero" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <a href="#" className="text-primary hover:underline">
                    Register here
                  </a>
                </p>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-id">Admin ID</Label>
                  <Input
                    id="admin-id"
                    placeholder="Enter admin ID"
                    value={loginData.aadhaar}
                    onChange={(e) => setLoginData({ ...loginData, aadhaar: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter admin password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" variant="hero" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Admin Sign In"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
