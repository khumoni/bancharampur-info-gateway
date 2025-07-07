import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Store, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";
import { ShopProduct, ShopOrder } from "@/types/advertisement";

interface Shop {
  id: string;
  name: string;
  description?: string;
  location?: string;
  status: 'pending' | 'approved' | 'rejected';
  highlighted: boolean;
  created_at: string;
}

export const ShopDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0
  });

  useEffect(() => {
    if (user) {
      loadShopData();
    }
  }, [user]);

  const loadShopData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Load shop info
      const { data: shopData, error: shopError } = await supabase
        .from('shops')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (shopError && shopError.code !== 'PGRST116') throw shopError;
      setShop(shopData);

      if (shopData) {
        // Load products
        const { data: productsData, error: productsError } = await supabase
          .from('shop_products')
          .select('*')
          .eq('shop_id', shopData.id)
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;
        setProducts(productsData || []);

        // Load orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('shop_orders')
          .select('*')
          .eq('shop_id', shopData.id)
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;
        setOrders((ordersData || []) as ShopOrder[]);

        // Calculate stats
        const totalProducts = productsData?.length || 0;
        const totalOrders = ordersData?.length || 0;
        const pendingOrders = ordersData?.filter(order => order.status === 'pending').length || 0;
        const revenue = ordersData?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

        setStats({
          totalProducts,
          totalOrders,
          pendingOrders,
          revenue
        });
      }
    } catch (error) {
      console.error('Error loading shop data:', error);
      toast({
        title: "লোড করতে সমস্যা",
        description: "দোকানের তথ্য লোড করতে সমস্যা হয়েছে",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('shop_orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "সফল",
        description: "অর্ডার স্ট্যাটাস আপডেট হয়েছে",
      });

      loadShopData();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "আপডেট করতে সমস্যা",
        description: "অর্ডার স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'confirmed': case 'approved': return 'default';
      case 'processing': return 'outline';
      case 'shipped': return 'outline';
      case 'delivered': return 'default';
      case 'cancelled': case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      'pending': 'অপেক্ষমাণ',
      'approved': 'অনুমোদিত',
      'rejected': 'প্রত্যাখ্যাত',
      'confirmed': 'নিশ্চিত',
      'processing': 'প্রক্রিয়াকরণ',
      'shipped': 'পাঠানো হয়েছে',
      'delivered': 'সরবরাহ করা হয়েছে',
      'cancelled': 'বাতিল'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <Card className="text-center p-8">
        <Store className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">আপনার কোন দোকান নেই</h3>
        <p className="text-muted-foreground mb-4">
          একটি দোকান তৈরি করুন এবং আপনার পণ্য বিক্রি শুরু করুন
        </p>
        <Button>দোকান তৈরি করুন</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Shop Status Alert */}
      {shop.status === 'pending' && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="flex items-center gap-3 p-4">
            <Clock className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800 dark:text-yellow-200">
                দোকান অনুমোদনের অপেক্ষায়
              </p>
              <p className="text-sm text-yellow-600 dark:text-yellow-300">
                আপনার দোকান এডমিন অনুমোদনের জন্য অপেক্ষা করছে
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {shop.status === 'rejected' && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="flex items-center gap-3 p-4">
            <XCircle className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-medium text-red-800 dark:text-red-200">
                দোকান প্রত্যাখ্যাত
              </p>
              <p className="text-sm text-red-600 dark:text-red-300">
                আপনার দোকান অনুমোদন পায়নি। সাহায্যের জন্য যোগাযোগ করুন
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Shop Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                {shop.name}
                <Badge variant={getStatusBadgeVariant(shop.status)}>
                  {getStatusText(shop.status)}
                </Badge>
              </CardTitle>
              {shop.description && (
                <p className="text-muted-foreground mt-2">{shop.description}</p>
              )}
            </div>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              সম্পাদনা
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">মোট পণ্য</p>
                <p className="text-2xl font-bold">{stats.totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">মোট অর্ডার</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">নতুন অর্ডার</p>
                <p className="text-2xl font-bold">{stats.pendingOrders}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">মোট আয়</p>
                <p className="text-2xl font-bold">৳{stats.revenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Content */}
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">পণ্যসমূহ</TabsTrigger>
          <TabsTrigger value="orders">অর্ডারসমূহ</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">আপনার পণ্য</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              নতুন পণ্য
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">৳{product.price}</span>
                      <Badge variant={product.is_available ? "default" : "secondary"}>
                        {product.is_available ? "উপলব্ধ" : "অনুপলব্ধ"}
                      </Badge>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        দেখুন
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3 mr-1" />
                        সম্পাদনা
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <h3 className="text-lg font-semibold">অর্ডার তালিকা</h3>

          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">অর্ডার #{order.id.slice(0, 8)}</span>
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        পরিমাণ: {order.quantity} | মোট: ৳{order.total_amount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('bn-BD')}
                      </p>
                    </div>
                    
                    {order.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => updateOrderStatus(order.id, 'confirmed')}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          নিশ্চিত করুন
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          বাতিল
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {orders.length === 0 && (
              <Card>
                <CardContent className="text-center p-8">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">এখনও কোন অর্ডার নেই</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};