import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useData } from "@/contexts/DataContext";
import { LegalAidInfo } from "@/types/localInfo";
import { useLocation } from "@/contexts/LocationContext";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, PlusCircle } from "lucide-react";

type LegalAidFormData = Omit<LegalAidInfo, 'id' | 'categoryId' | 'district' | 'upazila'>;

export const LegalAidManager = () => {
  const { localInfoItems, addLocalInfoItem, updateLocalInfoItem, deleteLocalInfoItem } = useData();
  const { location } = useLocation();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LegalAidInfo | null>(null);
  const [formData, setFormData] = useState<LegalAidFormData>({
    icon: "Gavel",
    serviceName: "",
    provider: "",
    address: "",
    contact: "",
  });

  const legalAidItems = useMemo(() =>
    localInfoItems.filter(
      (item): item is LegalAidInfo =>
        item.categoryId === 'legal' &&
        item.district === location.district &&
        item.upazila === location.upazila
    ),
    [localInfoItems, location]
  );

  useEffect(() => {
    if (editingItem) {
      setFormData({
        icon: editingItem.icon || "Gavel",
        serviceName: editingItem.serviceName,
        provider: editingItem.provider,
        address: editingItem.address,
        contact: editingItem.contact,
      });
    } else {
      setFormData({
        icon: "Gavel",
        serviceName: "",
        provider: "",
        address: "",
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
      const itemData = {
        ...formData,
        categoryId: 'legal' as const,
        district: location.district,
        upazila: location.upazila,
      };
      if (editingItem) {
        await updateLocalInfoItem(editingItem.id, itemData);
        toast({ title: "সফল!", description: "আইনি সহায়তার তথ্য আপডেট করা হয়েছে।" });
      } else {
        await addLocalInfoItem(itemData);
        toast({ title: "সফল!", description: "নতুন আইনি সহায়তার তথ্য যোগ করা হয়েছে।" });
      }
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      toast({ title: "ত্রুটি", description: "তথ্য সংরক্ষণ করা যায়নি।", variant: "destructive" });
    }
  };

  const handleEdit = (item: LegalAidInfo) => {
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
        <CardTitle>আইনি সহায়তা ম্যানেজমেন্ট ({location.upazila}, {location.district})</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingItem(null); }}>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2 h-4 w-4" /> নতুন যোগ করুন</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? "সম্পাদনা করুন" : "নতুন আইনি সহায়তা যোগ করুন"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="serviceName" placeholder="সেবার নাম" value={formData.serviceName} onChange={handleInputChange} required />
              <Input name="provider" placeholder="প্রদানকারী" value={formData.provider} onChange={handleInputChange} required />
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
          {legalAidItems.length > 0 ? (
            legalAidItems.map(item => (
              <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-semibold">{item.serviceName}</h4>
                  <p className="text-sm text-gray-600">{item.provider} | {item.contact}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(item)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))
          ) : (
            <p>এই এলাকার জন্য কোনো আইনি সহায়তার তথ্য পাওয়া যায়নি।</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
