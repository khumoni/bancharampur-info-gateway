
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useData } from "@/contexts/DataContext";
import { LocalInfoItem } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2, icons, AlertTriangle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const categories = [
  { id: "education", title: "শিক্ষা" },
  { id: "health", title: "স্বাস্থ্য" },
  { id: "utilities", title: "বিদ্যুৎ ও গ্যাস" },
  { id: "weather", title: "আবহাওয়া ও দুর্যোগ" },
  { id: "market", title: "স্থানীয় বাজারদর" },
  { id: "projects", title: "সরকারি প্রকল্প ও কাজ" },
  { id: "admin", title: "প্রশাসনিক তথ্য" },
  { id: "announcements", title: "ঘোষণা ও নোটিশ" },
  { id: "transport", title: "যাতায়াত ও পরিবহন" },
];

export const LocalInfoManager = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const { localInfoItems, addLocalInfoItem, updateLocalInfoItem, deleteLocalInfoItem } = useData();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LocalInfoItem | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', icon: '' });

  const itemsForCategory = localInfoItems.filter(item => item.categoryId === selectedCategory);

  const handleOpenDialog = (item: LocalInfoItem | null = null) => {
    setEditingItem(item);
    if (item) {
      setFormData({ title: item.title, description: item.description, icon: item.icon });
    } else {
      setFormData({ title: '', description: '', icon: '' });
    }
    setIsDialogOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.icon) {
      toast({ title: "ত্রুটি", description: "সকল ঘর পূরণ করুন", variant: "destructive" });
      return;
    }

    try {
      if (editingItem) {
        await updateLocalInfoItem(editingItem.id, formData);
        toast({ title: "সফল", description: "তথ্য আপডেট করা হয়েছে" });
      } else {
        await addLocalInfoItem({ ...formData, categoryId: selectedCategory });
        toast({ title: "সফল", description: "নতুন তথ্য যোগ করা হয়েছে" });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: "ত্রুটি", description: "কিছু একটা ভুল হয়েছে", variant: "destructive" });
    }
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm("আপনি কি নিশ্চিতভাবে এই আইটেমটি মুছে ফেলতে চান?")) {
      try {
        await deleteLocalInfoItem(id);
        toast({ title: "সফল", description: "আইটেম মুছে ফেলা হয়েছে" });
      } catch (error) {
        toast({ title: "ত্রুটি", description: "আইটেমটি মুছতে সমস্যা হয়েছে", variant: "destructive" });
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>স্থানীয় তথ্য ব্যবস্থাপনা</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-1/2">
              <Label>ক্যাটেগরি নির্বাচন করুন</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="ক্যাটেগরি..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="mr-2 h-4 w-4" />
              নতুন তথ্য যোগ করুন
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{categories.find(c => c.id === selectedCategory)?.title} - আইটেমসমূহ</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2 pr-4">
                  {itemsForCategory.length > 0 ? itemsForCategory.map(item => {
                    const Icon = icons[item.icon as keyof typeof icons] || AlertTriangle;
                    return (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3 flex-1">
                          <Icon className="h-5 w-5 text-gray-600"/>
                          <div>
                            <p className="font-medium text-gray-800">{item.title}</p>
                            <p className="text-sm text-gray-600 truncate max-w-md">{item.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    )
                  }) : (
                    <p className="text-center text-gray-500 py-4">এই ক্যাটেগরিতে কোনো তথ্য নেই।</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "তথ্য সম্পাদনা করুন" : "নতুন তথ্য যোগ করুন"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">শিরোনাম</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleFormChange} required />
            </div>
            <div>
              <Label htmlFor="description">বিস্তারিত</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleFormChange} required />
            </div>
            <div>
              <Label htmlFor="icon">আইকন</Label>
              <Input id="icon" name="icon" value={formData.icon} onChange={handleFormChange} required placeholder="e.g., School, Hospital" />
              <p className="text-xs text-muted-foreground mt-1">
                <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Lucide Icons</a> থেকে আইকনের নাম দিন (e.g., 'Award', 'Hospital').
              </p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">বাতিল</Button>
              </DialogClose>
              <Button type="submit">{editingItem ? "আপডেট করুন" : "যোগ করুন"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
