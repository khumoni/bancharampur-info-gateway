
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useData, EmergencyNewsInfo } from "@/contexts/DataContext";
import { useLocation } from "@/contexts/LocationContext";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, PlusCircle } from "lucide-react";

type EmergencyNewsFormData = Omit<EmergencyNewsInfo, 'id' | 'categoryId' | 'district' | 'upazila'>;

export const EmergencyNewsManager = () => {
  const { localInfoItems, addLocalInfoItem, updateLocalInfoItem, deleteLocalInfoItem } = useData();
  const { location } = useLocation();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EmergencyNewsInfo | null>(null);
  const [formData, setFormData] = useState<EmergencyNewsFormData>({
    icon: "Siren",
    title: "",
    details: "",
    date: "",
  });

  const emergencyNewsItems = useMemo(() =>
    localInfoItems.filter(
      (item): item is EmergencyNewsInfo =>
        item.categoryId === 'emergency_news' &&
        item.district === location.district &&
        item.upazila === location.upazila
    ),
    [localInfoItems, location]
  );

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (editingItem) {
      setFormData({
        icon: editingItem.icon || "Siren",
        title: editingItem.title,
        details: editingItem.details,
        date: editingItem.date,
      });
    } else {
      setFormData({ icon: "Siren", title: "", details: "", date: today });
    }
  }, [editingItem]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const itemData = { ...formData, categoryId: 'emergency_news' as const, district: location.district, upazila: location.upazila };
      if (editingItem) {
        await updateLocalInfoItem(editingItem.id, itemData);
        toast({ title: "সফল!", description: "জরুরি সংবাদ আপডেট করা হয়েছে।" });
      } else {
        await addLocalInfoItem(itemData);
        toast({ title: "সফল!", description: "নতুন জরুরি সংবাদ যোগ করা হয়েছে।" });
      }
      setIsDialogOpen(false); setEditingItem(null);
    } catch (error) {
      toast({ title: "ত্রুটি", description: "তথ্য সংরক্ষণ করা যায়নি।", variant: "destructive" });
    }
  };

  const handleEdit = (item: EmergencyNewsInfo) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("আপনি কি নিশ্চিত?")) {
      await deleteLocalInfoItem(id);
      toast({ title: "সফল!", description: "সংবাদটি মুছে ফেলা হয়েছে।" });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>জরুরি সংবাদ ম্যানেজমেন্ট ({location.upazila}, {location.district})</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingItem(null); }}>
          <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" /> নতুন সংবাদ</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingItem ? "সম্পাদনা করুন" : "নতুন জরুরি সংবাদ"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="title" placeholder="শিরোনাম" value={formData.title} onChange={handleInputChange} required />
              <Textarea name="details" placeholder="বিস্তারিত" value={formData.details} onChange={handleInputChange} required />
              <Input name="date" type="date" value={formData.date} onChange={handleInputChange} required />
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
          {emergencyNewsItems.map(item => (
            <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h4 className="font-semibold">{item.title}</h4>
                <p className="text-sm text-gray-600">তারিখ: {item.date}</p>
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
