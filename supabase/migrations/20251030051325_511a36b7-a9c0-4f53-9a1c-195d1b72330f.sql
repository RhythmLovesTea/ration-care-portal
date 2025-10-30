-- Fix search path for get_shop_avg_rating function
CREATE OR REPLACE FUNCTION public.get_shop_avg_rating(shop_uuid UUID)
RETURNS NUMERIC
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(AVG(rating), 0)
  FROM public.fps_ratings
  WHERE shop_id = shop_uuid
$$;