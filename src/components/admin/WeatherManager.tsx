import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useData } from "@/contexts/DataContext";
import { WeatherInfo } from "@/types/localInfo";
import { useLocation } from "@/contexts/LocationContext";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, PlusCircle } from "lucide-react";

type WeatherFormData = Omit<WeatherInfo, 'id' | 'categoryId' | 'district' | 'upazila'>;

export const WeatherManager = () => {
  const { localInfoItems, addLocalInfoItem, updateLocalInfoItem, deleteLocalInfoItem } = useData();
  const { location } = useLocation();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WeatherInfo | null>(null);
  const [formData, setFormData] = useState<WeatherFormData>({
    icon: "Cloud",
    area: "",
    temperature: "",
    humidity: "",
    alert: "",
  });

  const weatherItems = useMemo(() =>
    localInfoItems.filter(
      (item): item is WeatherInfo =>
        item.categoryId === 'weather' &&
        item.district === location.district &&
        item.upazila === location.upazila
    ),
    [localInfoItems, location]
  );

  useEffect(() => {
    if (editingItem) setFormData(editingItem);
    else setFormData({ icon: "Cloud", area: "", temperature: "", humidity: "", alert: "" });
  }, [editingItem]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const itemData = { ...formData, categoryId: 'weather' as const, district: location.district, upazila: location.upazila };
      if (editingItem) {
        await updateLocalInfoItem(editingItem.id, itemData);
        toast({ title: "সফল!", description: "আবহাওয়ার তথ্য আপডেট করা হয়েছে।" });
      } else {
        await addLocalInfoItem(itemData);
        toast({ title: "সফল!", description: "নতুন আবহাওয়ার তথ্য যোগ করা হয়েছে।" });
      }
      setIsDialogOpen(false); setEditingItem(null);
    } catch (error) {
      toast({ title: "ত্রুটি", description: "তথ্য সংরক্ষণ করা যায়নি।", variant: "destructive" });
    }
  };

  const handleEdit = (item: WeatherInfo) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("আপনি কি নিশ্চিত?")) {
      await deleteLocalInfoItem(id);
      toast({ title: "সফল!", description: "আবহাওয়ার তথ্য মুছে ফেলা হয়েছে।" });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>আবহাওয়া ম্যানেজমেন্ট ({location.upazila}, {location.district})</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingItem(null); }}>
          <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" /> নতুন আবহাওয়া</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingItem ? "সম্পাদনা করুন" : "নতুন আবহাওয়ার তথ্য"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="area" placeholder="এলাকা" value={formData.area} onChange={handleInputChange} required />
              <Input name="temperature" placeholder="তাপমাত্রা" value={formData.temperature} onChange={handleInputChange} required />
              <Input name="humidity" placeholder="আর্দ্রতা" value={formData.humidity} onChange={handleInputChange} required />
              <Input name="alert" placeholder="সতর্কবার্তা" value={formData.alert} onChange={handleInputChange} required />
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary">বাতিল</Button></DialogClose>
                <Button type="submit">{editingItem ? "আপডেট" : "সংরক্ষণ"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weatherItems.map(item => (
            <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h4 className="font-semibold">{item.area}</h4>
                <p className="text-sm text-gray-600">তাপমাত্রা: {item.temperature}, আর্দ্রতা: {item.humidity}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(item)}><Edit className="h-4 w-4" /></Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
