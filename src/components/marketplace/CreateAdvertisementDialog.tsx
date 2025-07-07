import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Upload, X } from "lucide-react";

interface CreateAdvertisementDialogProps {
  children: React.ReactNode;
  onAdCreated?: () => void;
}

const categories = [
  "ইলেকট্রনিক্স",
  "ফ্যাশন",
  "গাড়ি",
  "বাড়ি ও আসবাব",
  "চাকরি",
  "সেবা",
  "খাবার",
  "বই ও শিক্ষা",
  "খেলাধুলা",
  "অন্যান্য"
];

export const CreateAdvertisementDialog = ({ children, onAdCreated }: CreateAdvertisementDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
    contact_info: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + imageFiles.length > 5) {
      toast({
        title: "সর্বোচ্চ ৫টি ছবি",
        description: "সর্বোচ্চ ৫টি ছবি আপলোড করা যাবে",
        variant: "destructive",
      });
      return;
    }

    // Validate file size and type
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "ফাইল সাইজ বড়",
          description: `${file.name} সর্বোচ্চ ৫ MB সাইজের হতে হবে`,
          variant: "destructive",
        });
        return false;
      }
      if (!file.type.startsWith('image/')) {
        toast({
          title: "ভুল ফাইল টাইপ",
          description: `${file.name} একটি ছবি ফাইল নয়`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    setImageFiles(prev => [...prev, ...validFiles]);
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return [];

    const uploadPromises = imageFiles.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user!.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('advertisements')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('advertisements')
        .getPublicUrl(data.path);

      return publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const createAdvertisement = async () => {
    if (!user || !formData.title.trim() || !formData.description.trim() || !formData.category) {
      toast({
        title: "তথ্য অসম্পূর্ণ",
        description: "প্রয়োজনীয় সব ফিল্ড পূরণ করুন",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Upload images
      const imageUrls = await uploadImages();

      // Create advertisement
      const { error } = await supabase
        .from('advertisements')
        .insert({
          user_id: user.id,
          title: formData.title.trim(),
          description: formData.description.trim(),
          price: formData.price ? parseFloat(formData.price) : null,
          category: formData.category,
          location: formData.location.trim() || null,
          contact_info: formData.contact_info.trim() || null,
          images: imageUrls,
        });

      if (error) throw error;

      toast({
        title: "সফল",
        description: "বিজ্ঞাপন তৈরি হয়েছে। অনুমোদনের জন্য অপেক্ষা করুন।",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "",
        location: "",
        contact_info: ""
      });
      setImageFiles([]);
      setOpen(false);
      onAdCreated?.();

    } catch (error) {
      console.error('Error creating advertisement:', error);
      toast({
        title: "তৈরি করতে সমস্যা",
        description: "বিজ্ঞাপন তৈরি করতে সমস্যা হয়েছে",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            নতুন বিজ্ঞাপন দিন
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">শিরোনাম *</label>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="বিজ্ঞাপনের শিরোনাম"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-medium">বিবরণ *</label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="পণ্য বা সেবার বিস্তারিত বিবরণ"
              disabled={loading}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">দাম (ঐচ্ছিক)</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="৳ 0.00"
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-medium">ক্যাটেগরি *</label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">স্থান</label>
            <Input
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="এলাকা বা শহরের নাম"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-medium">যোগাযোগ</label>
            <Input
              value={formData.contact_info}
              onChange={(e) => handleInputChange('contact_info', e.target.value)}
              placeholder="ফোন নম্বর বা ইমেইল"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-medium">ছবি (সর্বোচ্চ ৫টি)</label>
            <div className="mt-2">
              {imageFiles.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => removeImage(index)}
                        disabled={loading}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {imageFiles.length < 5 && (
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="w-6 h-6 mb-2 text-gray-500" />
                    <p className="text-sm text-gray-500">ছবি আপলোড করুন</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    disabled={loading}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={createAdvertisement}
              disabled={loading || !formData.title.trim() || !formData.description.trim() || !formData.category}
              className="flex-1"
            >
              {loading ? "তৈরি হচ্ছে..." : "বিজ্ঞাপন দিন"}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              বাতিল
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};