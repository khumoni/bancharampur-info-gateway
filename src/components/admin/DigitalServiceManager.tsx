
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useData, DigitalServiceInfo } from "@/contexts/DataContext";
import { useLocation } from "@/contexts/LocationContext";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, PlusCircle } from "lucide-react";

type DigitalServiceFormData = Omit<DigitalServiceInfo, 'id' | 'categoryId' | 'district' | 'upazila'>;

export const DigitalServiceManager = () => {
  const { localInfoItems, addLocalInfoItem, updateLocalInfoItem, deleteLocalInfoItem } = useData();
  const { location } = useLocation();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DigitalServiceInfo | null>(null);
  const [formData, setFormData] = useState<DigitalServiceFormData>({
    icon: "Laptop",
    centerName: "",
    services: "",
    address: "",
    contact: "",
  });

  const digitalServiceItems = useMemo(() =>
    localInfoItems.filter(
      (item): item is DigitalServiceInfo =>
        item.categoryId === 'digital_services' &&
        item.district === location.district &&
        item.upazila === location.upazila
    ),
    [localInfoItems, location]
  );

  useEffect(() => {
    if (editingItem) {
      setFormData({
        icon: editingItem.icon || "Laptop",
        centerName: editingItem.centerName,
        services: editingItem.services,
        address: editingItem.address,
        contact: editingItem.contact,
      });
    } else {
      setFormData({ icon: "Laptop", centerName: "", services: "", address: "", contact: "" });
    }
  }, [editingItem]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const itemData = { ...formData, categoryId: 'digital_services' as const, district: location.district, upazila: location.upazila };
      if (editingItem) {
        await updateLocalInfoItem(editingItem.id, itemData);
        toast({ title: "সফল!", description: "ডিজিটাল সেবার তথ্য আপডেট করা হয়েছে।" });
      } else {
        await addLocalInfoItem(itemData);
        toast({ title: "সফল!", description: "নতুন ডিজিটাল সেবার তথ্য যোগ করা হয়েছে।" });
      }
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      toast({ title: "ত্রুটি", description: "তথ্য সংরক্ষণ করা যায়নি।", variant: "destructive" });
    }
  };

  const handleEdit = (item: DigitalServiceInfo) => {
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
        <CardTitle>ডিজিটাল সেবা ম্যানেজমেন্ট ({location.upazila}, {location.district})</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingItem(null); }}>
          <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" /> নতুন যোগ করুন</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingItem ? "সম্পাদনা করুন" : "নতুন ডিজিটাল সেবা কেন্দ্র"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="centerName" placeholder="কেন্দ্রের নাম" value={formData.centerName} onChange={handleInputChange} required />
              <Textarea name="services" placeholder="সেবা সমূহ (কমা দিয়ে আলাদা করুন)" value={formData.services} onChange={handleInputChange} required />
              <Textarea name="address" placeholder="ঠিকানা" value={formData.address} onChange={handleInputChange} required />
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
          {digitalServiceItems.map(item => (
            <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h4 className="font-semibold">{item.centerName}</h4>
                <p className="text-sm text-gray-600">{item.address}</p>
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
