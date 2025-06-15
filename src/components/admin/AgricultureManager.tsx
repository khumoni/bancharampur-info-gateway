
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useData, AgricultureInfo } from "@/contexts/DataContext";
import { useLocation } from "@/contexts/LocationContext";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, PlusCircle } from "lucide-react";

type AgricultureFormData = Omit<AgricultureInfo, 'id' | 'categoryId' | 'district' | 'upazila'>;

export const AgricultureManager = () => {
  const { localInfoItems, addLocalInfoItem, updateLocalInfoItem, deleteLocalInfoItem } = useData();
  const { location } = useLocation();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AgricultureInfo | null>(null);
  const [formData, setFormData] = useState<AgricultureFormData>({
    icon: "Leaf",
    serviceType: "",
    details: "",
    contact: "",
  });

  const agricultureItems = useMemo(() =>
    localInfoItems.filter(
      (item): item is AgricultureInfo =>
        item.categoryId === 'agriculture' &&
        item.district === location.district &&
        item.upazila === location.upazila
    ),
    [localInfoItems, location]
  );

  useEffect(() => {
    if (editingItem) {
      setFormData({
        icon: editingItem.icon || "Leaf",
        serviceType: editingItem.serviceType,
        details: editingItem.details,
        contact: editingItem.contact,
      });
    } else {
      setFormData({
        icon: "Leaf",
        serviceType: "",
        details: "",
        contact: "",
      });
    }
  }, [editingItem]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const itemData = { ...formData, categoryId: 'agriculture' as const, district: location.district, upazila: location.upazila };
      if (editingItem) {
        await updateLocalInfoItem(editingItem.id, itemData);
        toast({ title: "সফল!", description: "কৃষি তথ্য আপডেট করা হয়েছে।" });
      } else {
        await addLocalInfoItem(itemData);
        toast({ title: "সফল!", description: "নতুন কৃষি তথ্য যোগ করা হয়েছে।" });
      }
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      toast({ title: "ত্রুটি", description: "তথ্য সংরক্ষণ করা যায়নি।", variant: "destructive" });
    }
  };

  const handleEdit = (item: AgricultureInfo) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("আপনি কি নিশ্চিত যে আপনি এই আইটেমটি মুছতে চান?")) {
      await deleteLocalInfoItem(id);
      toast({ title: "সফল!", description: "তথ্য মুছে ফেলা হয়েছে।" });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>কৃষি তথ্য ম্যানেজমেন্ট ({location.upazila}, {location.district})</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingItem(null); }}>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2 h-4 w-4" /> নতুন যোগ করুন</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? "সম্পাদনা করুন" : "নতুন কৃষি তথ্য যোগ করুন"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="serviceType" placeholder="সেবার ধরন" value={formData.serviceType} onChange={handleInputChange} required />
              <Textarea name="details" placeholder="বিস্তারিত" value={formData.details} onChange={handleInputChange} required />
              <Input name="contact" placeholder="যোগাযোগ" value={formData.contact} onChange={handleInputChange} required />
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
          {agricultureItems.map(item => (
            <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h4 className="font-semibold">{item.serviceType}</h4>
                <p className="text-sm text-gray-600">{item.contact}</p>
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
