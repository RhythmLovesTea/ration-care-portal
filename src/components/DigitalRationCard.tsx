import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { CreditCard, Download, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DigitalRationCardProps {
  profile: {
    name: string;
    aadhaar: string;
    ration_card_number: string;
    card_type: string;
    issue_date: string;
  };
  householdMembers: Array<{
    name: string;
    relationship: string;
    age: number;
  }>;
}

export const DigitalRationCard = ({ profile, householdMembers }: DigitalRationCardProps) => {
  const cardData = JSON.stringify({
    cardNumber: profile.ration_card_number,
    name: profile.name,
    aadhaar: profile.aadhaar,
    type: profile.card_type
  });

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 500;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(0, 0, canvas.width, 80);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('Digital Ration Card', 40, 50);

    // Card details
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`Name: ${profile.name}`, 40, 140);
    ctx.font = '16px Arial';
    ctx.fillText(`Card No: ${profile.ration_card_number}`, 40, 180);
    ctx.fillText(`Type: ${profile.card_type}`, 40, 210);
    ctx.fillText(`Aadhaar: ${profile.aadhaar}`, 40, 240);

    // Download
    const link = document.createElement('a');
    link.download = 'ration-card.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Digital Ration Card
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Card Number</p>
              <p className="font-mono text-lg font-semibold">{profile.ration_card_number}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cardholder Name</p>
              <p className="font-semibold">{profile.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Card Type</p>
              <p className="font-semibold">{profile.card_type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Issue Date</p>
              <p className="font-semibold">
                {new Date(profile.issue_date).toLocaleDateString('en-IN')}
              </p>
            </div>
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Card
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center space-y-4 p-4 bg-muted rounded-lg">
            <QRCodeSVG 
              value={cardData} 
              size={180}
              level="H"
              includeMargin
            />
            <p className="text-xs text-muted-foreground text-center">
              Scan this QR code at Fair Price Shops
            </p>
          </div>
        </div>

        {householdMembers && householdMembers.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-semibold flex items-center gap-2 mb-3">
              <Users className="h-4 w-4" />
              Household Members ({householdMembers.length})
            </h4>
            <div className="grid gap-2">
              {householdMembers.map((member, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 bg-muted rounded">
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.relationship}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{member.age} years</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
