import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Clock, Star, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FPSDetailsProps {
  shops: Array<{
    id: string;
    name: string;
    location: string;
    contact_number?: string;
    working_hours?: string;
    last_inspection_date?: string;
    rice_stock: number;
    wheat_stock: number;
    sugar_stock: number;
    status: string;
  }>;
}

export const FPSDetails = ({ shops }: FPSDetailsProps) => {
  const [ratings, setRatings] = useState<Record<string, { rating: number; comment: string; avgRating: number }>>({});
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRatings();
  }, [shops]);

  const fetchRatings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const ratingsData: Record<string, { rating: number; comment: string; avgRating: number }> = {};

    for (const shop of shops) {
      // Get user's rating
      const { data: userRating } = await supabase
        .from('fps_ratings')
        .select('rating, comment')
        .eq('shop_id', shop.id)
        .eq('user_id', user.id)
        .maybeSingle();

      // Get average rating
      const { data: allRatings } = await supabase
        .from('fps_ratings')
        .select('rating')
        .eq('shop_id', shop.id);

      const avgRating = allRatings && allRatings.length > 0
        ? allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length
        : 0;

      ratingsData[shop.id] = {
        rating: userRating?.rating || 0,
        comment: userRating?.comment || '',
        avgRating
      };
    }

    setRatings(ratingsData);
  };

  const handleRateShop = async (shopId: string, rating: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Error",
        description: "Please login to rate shops",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('fps_ratings')
      .upsert({
        shop_id: shopId,
        user_id: user.id,
        rating,
        comment: ratings[shopId]?.comment || ''
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit rating",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Rating submitted successfully"
      });
      fetchRatings();
      setSelectedShop(null);
    }
  };

  const updateComment = (shopId: string, comment: string) => {
    setRatings(prev => ({
      ...prev,
      [shopId]: { ...prev[shopId], comment }
    }));
  };

  return (
    <div className="space-y-4">
      {shops.map(shop => (
        <Card key={shop.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{shop.name}</span>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">
                  {ratings[shop.id]?.avgRating.toFixed(1) || '0.0'}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{shop.location}</span>
              </div>
              {shop.contact_number && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{shop.contact_number}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{shop.working_hours || '9 AM - 5 PM'}</span>
              </div>
              {shop.last_inspection_date && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Last Inspected: {new Date(shop.last_inspection_date).toLocaleDateString('en-IN')}</span>
                </div>
              )}
            </div>

            <div className="border-t pt-3">
              <p className="text-sm font-semibold mb-2">Current Stock</p>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Rice</p>
                  <p className="font-semibold">{shop.rice_stock} kg</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Wheat</p>
                  <p className="font-semibold">{shop.wheat_stock} kg</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Sugar</p>
                  <p className="font-semibold">{shop.sugar_stock} kg</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-3">
              <p className="text-sm font-semibold mb-2">Rate this FPS</p>
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => {
                      setRatings(prev => ({
                        ...prev,
                        [shop.id]: { ...prev[shop.id], rating: star }
                      }));
                      setSelectedShop(shop.id);
                    }}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= (ratings[shop.id]?.rating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {selectedShop === shop.id && (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Add a comment (optional)"
                    value={ratings[shop.id]?.comment || ''}
                    onChange={(e) => updateComment(shop.id, e.target.value)}
                    rows={2}
                  />
                  <Button
                    onClick={() => handleRateShop(shop.id, ratings[shop.id]?.rating)}
                    size="sm"
                  >
                    Submit Rating
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
