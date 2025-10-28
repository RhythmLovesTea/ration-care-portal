-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  aadhaar VARCHAR(12) UNIQUE NOT NULL,
  phone VARCHAR(10) NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create user roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'beneficiary');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- User roles policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Create entitlements table
CREATE TABLE public.entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rice_total INTEGER DEFAULT 25 NOT NULL,
  rice_used INTEGER DEFAULT 0 NOT NULL,
  wheat_total INTEGER DEFAULT 20 NOT NULL,
  wheat_used INTEGER DEFAULT 0 NOT NULL,
  sugar_total INTEGER DEFAULT 5 NOT NULL,
  sugar_used INTEGER DEFAULT 0 NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, month, year)
);

ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own entitlements"
  ON public.entitlements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all entitlements"
  ON public.entitlements FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  fps_shop_id UUID,
  fps_name TEXT NOT NULL,
  transaction_date TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions"
  ON public.transactions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create FPS shops table
CREATE TABLE public.shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  rice_stock INTEGER DEFAULT 0 NOT NULL,
  wheat_stock INTEGER DEFAULT 0 NOT NULL,
  sugar_stock INTEGER DEFAULT 0 NOT NULL,
  status TEXT DEFAULT 'good' NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view shops"
  ON public.shops FOR SELECT
  USING (true);

CREATE POLICY "Admins can update shops"
  ON public.shops FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create complaints table
CREATE TABLE public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own complaints"
  ON public.complaints FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create complaints"
  ON public.complaints FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all complaints"
  ON public.complaints FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update complaints"
  ON public.complaints FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all alerts"
  ON public.alerts FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger function to auto-create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, aadhaar, phone, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'aadhaar', '000000000000'),
    COALESCE(NEW.raw_user_meta_data->>'phone', '0000000000'),
    COALESCE(NEW.raw_user_meta_data->>'name', 'User')
  );
  
  -- Default to beneficiary role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'beneficiary');
  
  -- Create initial entitlement for current month
  INSERT INTO public.entitlements (user_id, month, year)
  VALUES (NEW.id, EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER, EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER);
  
  RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample FPS shops
INSERT INTO public.shops (name, location, latitude, longitude, rice_stock, wheat_stock, sugar_stock, status) VALUES
  ('FPS Shop #234', 'Mumbai Central', 19.0176, 72.8562, 450, 380, 120, 'good'),
  ('FPS Shop #567', 'Andheri West', 19.1136, 72.8697, 120, 90, 25, 'low'),
  ('FPS Shop #891', 'Bandra East', 19.0596, 72.8395, 550, 480, 150, 'good'),
  ('FPS Shop #432', 'Dadar', 19.0176, 72.8479, 50, 40, 10, 'critical');

-- Insert sample fraud alerts
INSERT INTO public.alerts (shop_id, message, severity) VALUES
  ((SELECT id FROM public.shops WHERE name = 'FPS Shop #567'), 'Duplicate Transaction detected in system', 'high'),
  ((SELECT id FROM public.shops WHERE name = 'FPS Shop #432'), 'Stock levels do not match reported data', 'medium'),
  ((SELECT id FROM public.shops WHERE name = 'FPS Shop #234'), 'Unusual distribution pattern detected', 'low');