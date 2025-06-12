
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { Flag, Loader2 } from "lucide-react";

interface ReportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  reportType: 'user' | 'post';
  targetId: string;
  targetName?: string;
}

export const ReportDialog = ({ isOpen, onOpenChange, reportType, targetId, targetName }: ReportDialogProps) => {
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { language } = useApp();
  const { toast } = useToast();

  const reportReasons = {
    user: [
      { value: 'fake-profile', label: language === 'bn' ? 'ভুয়া প্রোফাইল' : 'Fake Profile' },
      { value: 'harassment', label: language === 'bn' ? 'হয়রানি' : 'Harassment' },
      { value: 'spam', label: language === 'bn' ? 'স্প্যাম' : 'Spam' },
      { value: 'inappropriate', label: language === 'bn' ? 'অনুপযুক্ত আচরণ' : 'Inappropriate Behavior' },
      { value: 'other', label: language === 'bn' ? 'অন্যান্য' : 'Other' }
    ],
    post: [
      { value: 'fake-info', label: language === 'bn' ? 'ভুয়া তথ্য' : 'False Information' },
      { value: 'offensive', label: language === 'bn' ? 'আপত্তিকর বিষয়বস্তু' : 'Offensive Content' },
      { value: 'spam', label: language === 'bn' ? 'স্প্যাম' : 'Spam' },
      { value: 'violence', label: language === 'bn' ? 'সহিংসতা' : 'Violence' },
      { value: 'hate-speech', label: language === 'bn' ? 'ঘৃণামূলক বক্তব্য' : 'Hate Speech' },
      { value: 'other', label: language === 'bn' ? 'অন্যান্য' : 'Other' }
    ]
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason) {
      toast({
        title: language === 'bn' ? "ত্রুটি!" : "Error!",
        description: language === 'bn' ? "রিপোর্টের কারণ নির্বাচন করুন" : "Please select a reason for reporting",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    
    try {
      // Simulate report submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Report submitted:', {
        type: reportType,
        targetId,
        reason,
        comment,
        timestamp: new Date().toISOString()
      });

      toast({
        title: language === 'bn' ? "ধন্যবাদ!" : "Thank you!",
        description: language === 'bn' ? "রিপোর্ট পর্যালোচনার জন্য জমা দেওয়া হয়েছে" : "Report submitted for review",
      });

      onOpenChange(false);
      setReason("");
      setComment("");
    } catch (error) {
      console.error('Report submission error:', error);
      toast({
        title: language === 'bn' ? "ত্রুটি!" : "Error!",
        description: language === 'bn' ? "রিপোর্ট জমা দিতে ব্যর্থ" : "Failed to submit report",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Flag className="h-5 w-5 text-red-600" />
            <span>
              {language === 'bn' ? 'রিপোর্ট করুন' : 'Report'} {targetName && `"${targetName}"`}
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-medium">
              {language === 'bn' ? 'রিপোর্টের কারণ নির্বাচন করুন:' : 'Select reason for reporting:'}
            </Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              {reportReasons[reportType].map((reasonOption) => (
                <div key={reasonOption.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={reasonOption.value} id={reasonOption.value} />
                  <Label htmlFor={reasonOption.value} className="cursor-pointer">
                    {reasonOption.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="report-comment">
              {language === 'bn' ? 'অতিরিক্ত মন্তব্য (ঐচ্ছিক):' : 'Additional comments (optional):'}
            </Label>
            <Textarea
              id="report-comment"
              placeholder={language === 'bn' ? 'বিস্তারিত বলুন...' : 'Please provide details...'}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={submitting}
            >
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button
              type="submit"
              variant="destructive"
              className="flex-1"
              disabled={submitting || !reason}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {language === 'bn' ? 'জমা দিচ্ছে...' : 'Submitting...'}
                </>
              ) : (
                <>
                  <Flag className="mr-2 h-4 w-4" />
                  {language === 'bn' ? 'রিপোর্ট করুন' : 'Submit Report'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
