
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/translations";
import { UserPlus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GoogleSignInButton } from "./GoogleSignInButton";

export const RegisterDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const { register, isLoading } = useAuth();
  const { language } = useApp();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate Bangladeshi phone number format
    if (phone && !phone.match(/^(\+880|880|0)?1[3-9]\d{8}$/)) {
      toast({
        title: language === 'bn' ? "ত্রুটি!" : "Error!",
        description: language === 'bn' ? "সঠিক বাংলাদেশী ফোন নম্বর দিন" : "Please enter a valid Bangladeshi phone number",
        variant: "destructive",
      });
      return;
    }

    const success = await register(email, password, name, phone);
    
    if (success) {
      toast({
        title: language === 'bn' ? "সফল!" : "Success!",
        description: language === 'bn' ? "সফলভাবে রেজিস্টার হয়েছে। ইমেইল যাচাই করুন।" : "Successfully registered. Please verify your email.",
      });
      setIsOpen(false);
      setEmail("");
      setPassword("");
      setName("");
      setPhone("");
    } else {
      toast({
        title: language === 'bn' ? "ত্রুটি!" : "Error!",
        description: language === 'bn' ? "রেজিস্ট্রেশন ব্যর্থ" : "Registration failed",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-green-600 hover:bg-green-700">
          <UserPlus className="h-4 w-4 mr-2" />
          {t("register", language)}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("register", language)}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              {language === 'bn' ? "ইউজারনেম" : "Username"}
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder={language === 'bn' ? "আপনার ইউজারনেম লিখুন" : "Enter your username"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-email">
              {language === 'bn' ? "ইমেইল" : "Email"}
            </Label>
            <Input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={language === 'bn' ? "আপনার ইমেইল লিখুন" : "Enter your email"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">
              {t("phone", language)} {language === 'bn' ? "(ঐচ্ছিক)" : "(Optional)"}
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={language === 'bn' ? "বাংলাদেশী মোবাইল নম্বর" : "Bangladeshi mobile number"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-password">
              {language === 'bn' ? "পাসওয়ার্ড" : "Password"}
            </Label>
            <Input
              id="reg-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={language === 'bn' ? "আপনার পাসওয়ার্ড লিখুন" : "Enter your password"}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("register", language)}
          </Button>
        </form>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {language === 'bn' ? 'অথবা' : 'Or'}
            </span>
          </div>
        </div>
        <GoogleSignInButton onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
