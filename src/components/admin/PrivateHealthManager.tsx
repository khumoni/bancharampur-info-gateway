
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useData, PrivateHealthInfo } from "@/contexts/DataContext";
import { useLocation } from "@/contexts/LocationContext";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, PlusCircle } from "lucide-react";

type PrivateHealthFormData = Omit<PrivateHealthInfo, 'id' | 'categoryId' | 'district' | 'upazila'>;

export const PrivateHealthManager = () => {
  const { localInfoItems, addLocalInfoItem, updateLocalInfoItem, deleteLocalInfoItem } = useData();
  const { location } = useLocation();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PrivateHealthInfo | null>(null);
  const [formData, setFormData] = useState<PrivateHealthFormData>({
    icon: "Stethoscope",
    name: "",
    type: "clinic",
    specialty: "",
    address: "",
    contact: "",
  });

  const privateHealthItems = useMemo(() =>
    localInfoItems.filter(
      (item): item is PrivateHealthInfo =>
        item.categoryId === 'private_health' &&
        item.district === location.district &&
        item.upazila === location.upazila
    ),
    [localInfoItems, location]
  );

  useEffect(() => {
    if (editingItem) setFormData(editingItem);
    else setFormData({ icon: "Stethoscope", name: "", type: "clinic", specialty: "", address: "", contact: "" });
  }, [editingItem]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSelectChange = (value: 'clinic' | 'diagnostic') => {
    setFormData(prev => ({ ...prev, type: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const itemData = { ...formData, categoryId: 'private_health' as const, district: location.district, upazila: location.upazila };
      if (editingItem) {
        await updateLocalInfoItem(editingItem.id, itemData);
        toast({ title: "সফল!", description: "তথ্য আপডেট করা হয়েছে।" });
      } else {
        await addLocalInfoItem(itemData);
        toast({ title: "সফল!", description: "নতুন তথ্য যোগ করা হয়েছে।" });
      }
      setIsDialogOpen(false); setEditingItem(null);
    } catch (error) {
      toast({ title: "ত্রুটি", description: "তথ্য সংরক্ষণ করা যায়নি।", variant: "destructive" });
    }
  };

  const handleEdit = (item: PrivateHealthInfo) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("আপনি কি নিশ্চিত?")) {
      await deleteLocalInfoItem(id);
      toast({ title: "সফল!", description: "তথ্য মুছে ফেলা হয়েছে।" });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>বেসরকারি স্বাস্থ্যসেবা ম্যানেজমেন্ট ({location.upazila}, {location.district})</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingItem(null); }}>
          <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" /> নতুন যোগ করুন</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingItem ? "সম্পাদনা করুন" : "নতুন ক্লিনিক/ডায়াগনস্টিক"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="name" placeholder="নাম" value={formData.name} onChange={handleInputChange} required />
               <Select onValueChange={handleSelectChange} value={formData.type}>
                <SelectTrigger><SelectValue placeholder="ধরন নির্বাচন করুন" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="clinic">ক্লিনিক</SelectItem>
                  <SelectItem value="diagnostic">ডায়াগনস্টিক</SelectItem>
                </SelectContent>
              </Select>
              <Input name="specialty" placeholder="বিশেষত্ব" value={formData.specialty} onChange={handleInputChange} required />
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
          {privateHealthItems.map(item => (
            <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-sm text-gray-600">{item.specialty} | {item.contact}</p>
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
