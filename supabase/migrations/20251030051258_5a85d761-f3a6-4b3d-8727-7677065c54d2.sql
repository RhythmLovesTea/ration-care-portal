-- Add household members table
CREATE TABLE public.household_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  age INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.household_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own household members"
ON public.household_members FOR SELECT
USING (auth.uid() = user_id);

-- Add FPS ratings table
CREATE TABLE public.fps_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(shop_id, user_id)
);

ALTER TABLE public.fps_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view ratings"
ON public.fps_ratings FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own ratings"
ON public.fps_ratings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
ON public.fps_ratings FOR UPDATE
USING (auth.uid() = user_id);

-- Add ration card number to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS ration_card_number VARCHAR(20) DEFAULT '0000000000000000',
ADD COLUMN IF NOT EXISTS card_type TEXT DEFAULT 'APL',
ADD COLUMN IF NOT EXISTS issue_date DATE DEFAULT CURRENT_DATE;

-- Add contact info to shops
ALTER TABLE public.shops
ADD COLUMN IF NOT EXISTS contact_number VARCHAR(15),
ADD COLUMN IF NOT EXISTS working_hours TEXT DEFAULT '9 AM - 5 PM',
ADD COLUMN IF NOT EXISTS last_inspection_date DATE;

-- Create function to calculate average rating for a shop
CREATE OR REPLACE FUNCTION public.get_shop_avg_rating(shop_uuid UUID)
RETURNS NUMERIC
LANGUAGE SQL
STABLE
AS $$
  SELECT COALESCE(AVG(rating), 0)
  FROM public.fps_ratings
  WHERE shop_id = shop_uuid
$$;