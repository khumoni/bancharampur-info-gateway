-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);

-- Create storage bucket for advertisements
INSERT INTO storage.buckets (id, name, public) VALUES ('advertisements', 'advertisements', true);

-- Create messages table for user-to-user messaging
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video')),
  attachment_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create conversations table for organizing messages
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_1 UUID NOT NULL,
  participant_2 UUID NOT NULL,
  last_message_id UUID,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(participant_1, participant_2)
);

-- Create videos table for video uploads
CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER, -- in seconds
  file_size BIGINT, -- in bytes
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft', 'removed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create advertisements table for marketplace ads
CREATE TABLE public.advertisements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  shop_id UUID,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2),
  category TEXT NOT NULL,
  location TEXT,
  contact_info TEXT,
  images TEXT[], -- array of image URLs
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  featured BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '30 days'),
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create shop_products table for shop inventory
CREATE TABLE public.shop_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  images TEXT[], -- array of image URLs
  stock_quantity INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create shop_orders table for order management
CREATE TABLE public.shop_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID NOT NULL,
  customer_id UUID NOT NULL,
  product_id UUID NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  customer_info JSONB, -- name, phone, address
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for messages
CREATE POLICY "Users can view their own messages"
ON public.messages FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
ON public.messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their received messages"
ON public.messages FOR UPDATE
USING (auth.uid() = receiver_id);

CREATE POLICY "Admins can manage all messages"
ON public.messages FOR ALL
USING (is_admin(auth.uid()));

-- RLS Policies for conversations
CREATE POLICY "Users can view their conversations"
ON public.conversations FOR SELECT
USING (auth.uid() = participant_1 OR auth.uid() = participant_2);

CREATE POLICY "Users can create conversations"
ON public.conversations FOR INSERT
WITH CHECK (auth.uid() = participant_1 OR auth.uid() = participant_2);

CREATE POLICY "Users can update their conversations"
ON public.conversations FOR UPDATE
USING (auth.uid() = participant_1 OR auth.uid() = participant_2);

CREATE POLICY "Admins can manage all conversations"
ON public.conversations FOR ALL
USING (is_admin(auth.uid()));

-- RLS Policies for videos
CREATE POLICY "Everyone can view published videos"
ON public.videos FOR SELECT
USING (status = 'published');

CREATE POLICY "Users can manage their own videos"
ON public.videos FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all videos"
ON public.videos FOR ALL
USING (is_admin(auth.uid()));

-- RLS Policies for advertisements
CREATE POLICY "Everyone can view approved ads"
ON public.advertisements FOR SELECT
USING (status = 'approved');

CREATE POLICY "Users can manage their own ads"
ON public.advertisements FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all ads"
ON public.advertisements FOR ALL
USING (is_admin(auth.uid()));

-- RLS Policies for shop_products
CREATE POLICY "Everyone can view available products"
ON public.shop_products FOR SELECT
USING (is_available = true);

CREATE POLICY "Shop owners can manage their products"
ON public.shop_products FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.shops 
    WHERE shops.id = shop_products.shop_id 
    AND shops.owner_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all products"
ON public.shop_products FOR ALL
USING (is_admin(auth.uid()));

-- RLS Policies for shop_orders
CREATE POLICY "Shop owners can view their orders"
ON public.shop_orders FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.shops 
    WHERE shops.id = shop_orders.shop_id 
    AND shops.owner_id = auth.uid()
  )
);

CREATE POLICY "Customers can view their orders"
ON public.shop_orders FOR SELECT
USING (auth.uid() = customer_id);

CREATE POLICY "Customers can create orders"
ON public.shop_orders FOR INSERT
WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Shop owners can update order status"
ON public.shop_orders FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.shops 
    WHERE shops.id = shop_orders.shop_id 
    AND shops.owner_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all orders"
ON public.shop_orders FOR ALL
USING (is_admin(auth.uid()));

-- Storage policies for videos bucket
CREATE POLICY "Anyone can view videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can upload videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own videos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for advertisements bucket
CREATE POLICY "Anyone can view advertisement images"
ON storage.objects FOR SELECT
USING (bucket_id = 'advertisements');

CREATE POLICY "Authenticated users can upload ad images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'advertisements' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own ad images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'advertisements' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own ad images"
ON storage.objects FOR DELETE
USING (bucket_id = 'advertisements' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create indexes for better performance
CREATE INDEX idx_messages_sender_receiver ON public.messages(sender_id, receiver_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_conversations_participants ON public.conversations(participant_1, participant_2);
CREATE INDEX idx_videos_user_id ON public.videos(user_id);
CREATE INDEX idx_videos_status ON public.videos(status);
CREATE INDEX idx_advertisements_user_id ON public.advertisements(user_id);
CREATE INDEX idx_advertisements_status ON public.advertisements(status);
CREATE INDEX idx_advertisements_category ON public.advertisements(category);
CREATE INDEX idx_shop_products_shop_id ON public.shop_products(shop_id);
CREATE INDEX idx_shop_orders_shop_id ON public.shop_orders(shop_id);
CREATE INDEX idx_shop_orders_customer_id ON public.shop_orders(customer_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_advertisements_updated_at
  BEFORE UPDATE ON public.advertisements
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_shop_products_updated_at
  BEFORE UPDATE ON public.shop_products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_shop_orders_updated_at
  BEFORE UPDATE ON public.shop_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();