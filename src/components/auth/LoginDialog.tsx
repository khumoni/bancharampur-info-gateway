import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/translations";
import { LogIn, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginDialogProps {
  triggerComponent?: React.ReactNode;
}

export const LoginDialog: React.FC<LoginDialogProps> = ({ triggerComponent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();
  const { language } = useApp();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    
    if (success) {
      toast({
        title: language === 'bn' ? "সফল!" : "Success!",
        description: language === 'bn' ? "সফলভাবে লগইন হয়েছে" : "Successfully logged in",
      });
      setIsOpen(false);
      setEmail("");
      setPassword("");
    } else {
      toast({
        title: language === 'bn' ? "ত্রুটি!" : "Error!",
        description: language === 'bn' ? "ভুল ইমেইল বা পাসওয়ার্ড" : "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  const defaultTrigger = (
    <Button variant="ghost" size="sm">
      <LogIn className="h-4 w-4 mr-2" />
      {t("login", language)}
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerComponent || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("login", language)}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">
              {language === 'bn' ? "ইমেইল" : "Email"}
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={language === 'bn' ? "আপনার ইমেইল লিখুন" : "Enter your email"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">
              {language === 'bn' ? "পাসওয়ার্ড" : "Password"}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={language === 'bn' ? "আপনার পাসওয়ার্ড লিখুন" : "Enter your password"}
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {language === 'bn' ? "ডেমো: demo@example.com / password" : "Demo: demo@example.com / password"}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("login", language)}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
