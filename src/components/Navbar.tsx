import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import transparencyIcon from "@/assets/transparency-icon.png";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<"EN" | "HI">("EN");

  const toggleLanguage = () => {
    setLanguage(language === "EN" ? "HI" : "EN");
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3">
            <img src={transparencyIcon} alt="Logo" className="h-10 w-10" />
            <span className="font-semibold text-lg text-foreground hidden sm:block">
              Ration Transparency Portal
            </span>
            <span className="font-semibold text-base text-foreground sm:hidden">
              RTP
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition-smooth">
              Home
            </Link>
            <Link to="/dashboard" className="text-foreground hover:text-primary transition-smooth">
              Dashboard
            </Link>
            <Link to="/complaints" className="text-foreground hover:text-primary transition-smooth">
              Complaints
            </Link>
            <Button variant="outline" size="sm" onClick={toggleLanguage}>
              {language}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/"
              className="block py-2 text-foreground hover:text-primary transition-smooth"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className="block py-2 text-foreground hover:text-primary transition-smooth"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/complaints"
              className="block py-2 text-foreground hover:text-primary transition-smooth"
              onClick={() => setIsOpen(false)}
            >
              Complaints
            </Link>
            <Button variant="outline" size="sm" onClick={toggleLanguage} className="w-full">
              Switch to {language === "EN" ? "हिंदी" : "English"}
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
