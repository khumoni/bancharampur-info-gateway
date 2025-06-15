
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useData, ScholarshipInfo } from "@/contexts/DataContext";
import { useLocation } from "@/contexts/LocationContext";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, PlusCircle } from "lucide-react";

type ScholarshipFormData = Omit<ScholarshipInfo, 'id' | 'categoryId' | 'district' | 'upazila'>;

export const ScholarshipManager = () => {
  const { localInfoItems, addLocalInfoItem, updateLocalInfoItem, deleteLocalInfoItem } = useData();
  const { location } = useLocation();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScholarshipInfo | null>(null);
  const [formData, setFormData] = useState<ScholarshipFormData>({
    icon: "Award",
    title: "",
    provider: "",
    eligibility: "",
    deadline: "",
  });

  const scholarshipItems = useMemo(() =>
    localInfoItems.filter(
      (item): item is ScholarshipInfo =>
        item.categoryId === 'scholarship' &&
        item.district === location.district &&
        item.upazila === location.upazila
    ),
    [localInfoItems, location]
  );

  useEffect(() => {
    if (editingItem) {
      setFormData({
        icon: editingItem.icon || "Award",
        title: editingItem.title,
        provider: editingItem.provider,
        eligibility: editingItem.eligibility,
        deadline: editingItem.deadline,
      });
    } else {
      setFormData({
        icon: "Award",
        title: "",
        provider: "",
        eligibility: "",
        deadline: "",
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
        categoryId: 'scholarship' as const,
        district: location.district,
        upazila: location.upazila,
      };

      if (editingItem) {
        await updateLocalInfoItem(editingItem.id, itemData);
        toast({ title: "সফল!", description: "বৃত্তির তথ্য আপডেট করা হয়েছে।" });
      } else {
        await addLocalInfoItem(itemData);
        toast({ title: "সফল!", description: "নতুন বৃত্তির তথ্য যোগ করা হয়েছে।" });
      }
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving scholarship info:", error);
      toast({ title: "ত্রুটি", description: "তথ্য সংরক্ষণ করা যায়নি।", variant: "destructive" });
    }
  };

  const handleEdit = (item: ScholarshipInfo) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("আপনি কি নিশ্চিত যে আপনি এই আইটেমটি মুছতে চান?")) {
      try {
        await deleteLocalInfoItem(id);
        toast({ title: "সফল!", description: "বৃত্তির তথ্য মুছে ফেলা হয়েছে।" });
      } catch (error) {
        console.error("Error deleting item:", error);
        toast({ title: "ত্রুটি", description: "তথ্য মুছে ফেলা যায়নি।", variant: "destructive" });
      }
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>বৃত্তি ও প্রশিক্ষণ ম্যানেজমেন্ট ({location.upazila}, {location.district})</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingItem(null); }}>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2 h-4 w-4" /> নতুন যোগ করুন</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? "তথ্য সম্পাদনা করুন" : "নতুন বৃত্তির তথ্য যোগ করুন"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="title" placeholder="শিরোনাম" value={formData.title} onChange={handleInputChange} required />
              <Input name="provider" placeholder="প্রদানকারী" value={formData.provider} onChange={handleInputChange} required />
              <Textarea name="eligibility" placeholder="যোগ্যতা" value={formData.eligibility} onChange={handleInputChange} required />
              <Input name="deadline" placeholder="শেষ তারিখ" value={formData.deadline} onChange={handleInputChange} required type="date" />
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary">বাতিল</Button></DialogClose>
                <Button type="submit">{editingItem ? "আপডেট করুন" : "সংরক্ষণ করুন"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {scholarshipItems.length > 0 ? (
            scholarshipItems.map(item => (
              <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.provider} - শেষ তারিখ: {item.deadline}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(item)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))
          ) : (
            <p>এই এলাকার জন্য কোনো বৃত্তির তথ্য পাওয়া যায়নি।</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
