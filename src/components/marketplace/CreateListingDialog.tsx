
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  X, 
  Eye, 
  MapPin, 
  DollarSign,
  Tag,
  FileText,
  Camera
} from "lucide-react";

interface CreateListingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateListingDialog = ({ isOpen, onOpenChange }: CreateListingDialogProps) => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    condition: "",
    location: "",
    description: "",
    negotiable: false
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const { language } = useApp();
  const { toast } = useToast();

  const categories = [
    { value: "electronics", label: language === 'bn' ? "ইলেকট্রনিক্স" : "Electronics" },
    { value: "vehicles", label: language === 'bn' ? "যানবাহন" : "Vehicles" },
    { value: "furniture", label: language === 'bn' ? "আসবাবপত্র" : "Furniture" },
    { value: "fashion", label: language === 'bn' ? "ফ্যাশন" : "Fashion" },
    { value: "books", label: language === 'bn' ? "বই" : "Books" },
    { value: "others", label: language === 'bn' ? "অন্যান্য" : "Others" }
  ];

  const conditions = [
    { value: "new", label: language === 'bn' ? "নতুন" : "Brand New" },
    { value: "like-new", label: language === 'bn' ? "নতুনের মতো" : "Like New" },
    { value: "good", label: language === 'bn' ? "ভালো" : "Good" },
    { value: "fair", label: language === 'bn' ? "মোটামুটি" : "Fair" },
    { value: "poor", label: language === 'bn' ? "খারাপ" : "Poor" }
  ];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: language === 'bn' ? "ত্রুটি!" : "Error!",
          description: language === 'bn' ? "শুধুমাত্র ছবি ফাইল আপলোড করুন" : "Please upload image files only",
          variant: "destructive",
        });
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: language === 'bn' ? "ত্রুটি!" : "Error!",
          description: language === 'bn' ? "ছবির সাইজ ৫ এমবি এর বেশি হতে পারবে না" : "Image size must be less than 5MB",
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    setSelectedImages(prev => [...prev, ...validFiles].slice(0, 8));
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.category || !formData.condition) {
      toast({
        title: language === 'bn' ? "ত্রুটি!" : "Error!",
        description: language === 'bn' ? "সব প্রয়োজনীয় তথ্য পূরণ করুন" : "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: language === 'bn' ? "সফল!" : "Success!",
        description: language === 'bn' ? "আপনার বিজ্ঞাপন প্রকাশ হয়েছে" : "Your listing has been published",
      });
      
      // Reset form
      setFormData({
        title: "",
        price: "",
        category: "",
        condition: "",
        location: "",
        description: "",
        negotiable: false
      });
      setSelectedImages([]);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: language === 'bn' ? "ত্রুটি!" : "Error!",
        description: language === 'bn' ? "বিজ্ঞাপন প্রকাশ ব্যর্থ" : "Failed to publish listing",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const PreviewCard = () => (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          {selectedImages.length > 0 ? (
            <img
              src={URL.createObjectURL(selectedImages[0])}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-lg"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
              <Camera className="h-8 w-8 text-gray-400" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{formData.title || "Product Title"}</h3>
            <p className="text-2xl font-bold text-green-600">
              ৳{formData.price || "0"}
              {formData.negotiable && (
                <Badge variant="secondary" className="ml-2">
                  {language === 'bn' ? "দরদাম" : "Negotiable"}
                </Badge>
              )}
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
              <MapPin className="h-4 w-4" />
              <span>{formData.location || "Location"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {language === 'bn' ? 'নতুন বিজ্ঞাপন দিন' : 'Create New Listing'}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? (language === 'bn' ? 'সম্পাদনা' : 'Edit') : (language === 'bn' ? 'প্রিভিউ' : 'Preview')}
            </Button>
          </DialogTitle>
        </DialogHeader>

        {previewMode ? (
          <div>
            <PreviewCard />
            <div className="space-y-2">
              <h4 className="font-medium">{language === 'bn' ? 'বর্ণনা' : 'Description'}</h4>
              <p className="text-gray-600">{formData.description || "No description provided"}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Images Upload */}
            <div className="space-y-3">
              <Label className="flex items-center">
                <Camera className="h-4 w-4 mr-2" />
                {language === 'bn' ? 'ছবি আপলোড করুন (সর্বোচ্চ ৮টি)' : 'Upload Images (Max 8)'}
              </Label>
              
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {selectedImages.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
                id="listing-images"
                disabled={uploading || selectedImages.length >= 8}
              />
              <Button
                type="button"
                variant="outline"
                disabled={uploading || selectedImages.length >= 8}
                asChild
                className="w-full h-20 border-2 border-dashed"
              >
                <label htmlFor="listing-images" className="cursor-pointer flex flex-col items-center">
                  <Upload className="h-6 w-6 mb-2" />
                  {language === 'bn' ? 'ছবি যোগ করুন' : 'Add Images'}
                  {selectedImages.length > 0 && ` (${selectedImages.length}/8)`}
                </label>
              </Button>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                {language === 'bn' ? 'শিরোনাম *' : 'Title *'}
              </Label>
              <Input
                id="title"
                placeholder={language === 'bn' ? "আপনার পণ্যের শিরোনাম লিখুন" : "Enter your product title"}
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price" className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                {language === 'bn' ? 'দাম (টাকা) *' : 'Price (BDT) *'}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="price"
                  type="number"
                  placeholder={language === 'bn' ? "দাম লিখুন" : "Enter price"}
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                />
                <Button
                  type="button"
                  variant={formData.negotiable ? "default" : "outline"}
                  onClick={() => setFormData(prev => ({ ...prev, negotiable: !prev.negotiable }))}
                  className="whitespace-nowrap"
                >
                  {language === 'bn' ? 'দরদাম' : 'Negotiable'}
                </Button>
              </div>
            </div>

            {/* Category and Condition */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === 'bn' ? 'ক্যাটেগরি *' : 'Category *'}</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'bn' ? "ক্যাটেগরি নির্বাচন করুন" : "Select category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{language === 'bn' ? 'অবস্থা *' : 'Condition *'}</Label>
                <Select value={formData.condition} onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'bn' ? "অবস্থা নির্বাচন করুন" : "Select condition"} />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem key={condition.value} value={condition.value}>
                        {condition.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {language === 'bn' ? 'স্থান' : 'Location'}
              </Label>
              <Input
                id="location"
                placeholder={language === 'bn' ? "আপনার এলাকার নাম" : "Your area name"}
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                {language === 'bn' ? 'বিস্তারিত বর্ণনা' : 'Detailed Description'}
              </Label>
              <Textarea
                id="description"
                placeholder={language === 'bn' ? "আপনার পণ্য সম্পর্কে বিস্তারিত লিখুন..." : "Write detailed description about your product..."}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={uploading} className="w-full">
              {uploading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
                  {language === 'bn' ? "প্রকাশ হচ্ছে..." : "Publishing..."}
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {language === 'bn' ? "বিজ্ঞাপন প্রকাশ করুন" : "Publish Listing"}
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
