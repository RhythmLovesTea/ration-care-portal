import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, TrendingUp, MessageCircle, MapPin, FileText } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const features = [
    {
      icon: Shield,
      title: "Complete Transparency",
      description: "Track every grain from warehouse to your plate with blockchain-backed records",
    },
    {
      icon: Users,
      title: "Beneficiary Empowerment",
      description: "Real-time access to entitlements, transactions, and complaint redressal",
    },
    {
      icon: TrendingUp,
      title: "Fraud Detection",
      description: "AI-powered monitoring to identify and prevent distribution irregularities",
    },
    {
      icon: MessageCircle,
      title: "24/7 AI Support",
      description: "Multilingual chatbot assistance in Hindi, English, and regional languages",
    },
    {
      icon: MapPin,
      title: "Live Tracking",
      description: "Monitor delivery routes and FPS shop stock levels in real-time",
    },
    {
      icon: FileText,
      title: "Easy Complaints",
      description: "File grievances with voice input, photo evidence, and automated follow-ups",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Ensuring <span className="gradient-text">Food Security</span> with Transparency
              </h1>
              <p className="text-lg text-muted-foreground">
                Empowering millions of beneficiaries with real-time access to their ration entitlements, 
                fraud detection, and seamless complaint resolution.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/login">
                  <Button variant="hero" size="lg" className="text-base">
                    Get Started
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" size="lg" className="text-base">
                    View Dashboard
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <p className="text-3xl font-bold text-primary">45,678</p>
                  <p className="text-sm text-muted-foreground">Active Beneficiaries</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-secondary">124</p>
                  <p className="text-sm text-muted-foreground">FPS Shops</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-accent">98%</p>
                  <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="card-elevated rounded-2xl overflow-hidden">
                <img
                  src={heroImage}
                  alt="Families receiving rations with dignity"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built with cutting-edge technology to ensure every beneficiary gets their rightful entitlement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <Card key={idx} className="shadow-sm hover:shadow-md transition-smooth">
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Ready to Experience Transparent Distribution?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of beneficiaries and administrators who trust our platform for fair ration distribution
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/login">
              <Button variant="hero" size="lg" className="text-base">
                Sign In Now
              </Button>
            </Link>
            <Link to="/complaints">
              <Button variant="outline" size="lg" className="text-base">
                File a Complaint
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
