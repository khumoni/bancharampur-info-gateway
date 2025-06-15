
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export const ForgotPasswordDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const { sendPasswordReset, isLoading } = useAuth();
  const { language } = useApp();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await sendPasswordReset(email);
    if (success) {
      toast({
        title: language === 'bn' ? "ইমেইল পাঠানো হয়েছে" : "Email Sent",
        description: language === 'bn' ? `আপনার ${email} ঠিকানায় একটি পাসওয়ার্ড রিসেট লিঙ্ক পাঠানো হয়েছে।` : `A password reset link has been sent to ${email}.`,
      });
      setIsOpen(false);
      setEmail("");
    } else {
      toast({
        title: language === 'bn' ? "ত্রুটি!" : "Error!",
        description: language === 'bn' ? "পাসওয়ার্ড রিসেট লিঙ্ক পাঠাতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।" : "Failed to send password reset link. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button type="button" className="text-sm text-blue-600 hover:underline focus:outline-none">
          {language === 'bn' ? "পাসওয়ার্ড ভুলে গেছি?" : "Forgot Password?"}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{language === 'bn' ? "পাসওয়ার্ড রিসেট" : "Reset Password"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">
              {language === 'bn' ? "ইমেইল" : "Email"}
            </Label>
            <Input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={language === 'bn' ? "আপনার রেজিস্টার্ড ইমেইল দিন" : "Enter your registered email"}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {language === 'bn' ? "রিসেট লিঙ্ক পাঠান" : "Send Reset Link"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
