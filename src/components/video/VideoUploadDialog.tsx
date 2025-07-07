import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Upload, Video, X } from "lucide-react";

interface VideoUploadDialogProps {
  children: React.ReactNode;
  onVideoUploaded?: () => void;
}

export const VideoUploadDialog = ({ children, onVideoUploaded }: VideoUploadDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "ফাইল সাইজ বড়",
          description: "সর্বোচ্চ ১০০ MB সাইজের ভিডিও আপলোড করুন",
          variant: "destructive",
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('video/')) {
        toast({
          title: "ভুল ফাইল টাইপ",
          description: "শুধুমাত্র ভিডিও ফাইল আপলোড করুন",
          variant: "destructive",
        });
        return;
      }

      setVideoFile(file);
    }
  };

  const uploadVideo = async () => {
    if (!user || !videoFile || !title.trim()) {
      toast({
        title: "তথ্য অসম্পূর্ণ",
        description: "সব ফিল্ড পূরণ করুন",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = videoFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload video to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, videoFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(uploadData.path);

      // Save video metadata to database
      const { error: dbError } = await supabase
        .from('videos')
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim() || null,
          video_url: publicUrl,
          file_size: videoFile.size,
        });

      if (dbError) throw dbError;

      toast({
        title: "সফল",
        description: "ভিডিও সফলভাবে আপলোড হয়েছে",
      });

      // Reset form
      setTitle("");
      setDescription("");
      setVideoFile(null);
      setOpen(false);
      onVideoUploaded?.();

    } catch (error) {
      console.error('Video upload error:', error);
      toast({
        title: "আপলোড ব্যর্থ",
        description: "ভিডিও আপলোড করতে সমস্যা হয়েছে",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            ভিডিও আপলোড করুন
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">শিরোনাম *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ভিডিওর শিরোনাম লিখুন"
              disabled={uploading}
            />
          </div>

          <div>
            <label className="text-sm font-medium">বিবরণ</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ভিডিও সম্পর্কে লিখুন"
              disabled={uploading}
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium">ভিডিও ফাইল *</label>
            <div className="mt-2">
              {!videoFile ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">ক্লিক করুন</span> অথবা ড্র্যাগ করুন
                    </p>
                    <p className="text-xs text-gray-500">MP4, AVI, MOV (সর্বোচ্চ ১০০ MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="video/*"
                    onChange={handleVideoSelect}
                    disabled={uploading}
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    <span className="text-sm truncate">{videoFile.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVideoFile(null)}
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {uploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} />
              <p className="text-sm text-center text-muted-foreground">
                আপলোড হচ্ছে... {Math.round(uploadProgress)}%
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              onClick={uploadVideo}
              disabled={!title.trim() || !videoFile || uploading}
              className="flex-1"
            >
              {uploading ? "আপলোড হচ্ছে..." : "আপলোড করুন"}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={uploading}>
              বাতিল
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};