
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
import { RecaptchaVerifier, ConfirmationResult } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

// Extend window type for reCAPTCHA verifier
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

export const RegisterDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const { register, isLoading, verifyPhoneNumber, confirmOtp } = useAuth();
  const { language } = useApp();
  const { toast } = useToast();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setPhone("");
    setOtp("");
    setStep('details');
    setConfirmationResult(null);
  };

  const handleRegister = async () => {
    const success = await register(email, password, name, phone);
    
    if (success) {
      toast({
        title: language === 'bn' ? "সফল!" : "Success!",
        description: language === 'bn' ? "সফলভাবে রেজিস্টার হয়েছে। ইমেইল যাচাই করুন।" : "Successfully registered. Please verify your email.",
      });
      setIsOpen(false);
      resetForm();
    } else {
      toast({
        title: language === 'bn' ? "ত্রুটি!" : "Error!",
        description: language === 'bn' ? "রেজিস্ট্রেশন ব্যর্থ" : "Registration failed",
        variant: "destructive",
      });
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
        }
      });
    }
    return window.recaptchaVerifier;
  };

  const handleSendOtp = async () => {
    if (!phone.match(/^(\+880|880|0)?1[3-9]\d{8}$/)) {
      toast({
        title: language === 'bn' ? "ত্রুটি!" : "Error!",
        description: language === 'bn' ? "সঠিক বাংলাদেশী ফোন নম্বর দিন" : "Please enter a valid Bangladeshi phone number",
        variant: "destructive",
      });
      return;
    }

    try {
      const appVerifier = setupRecaptcha();
      const formattedPhone = phone.startsWith('+') ? phone : `+88${phone.slice(-10)}`;
      const confirmation = await verifyPhoneNumber(formattedPhone, appVerifier);
      
      if (confirmation) {
        setConfirmationResult(confirmation);
        setStep('otp');
        toast({
          title: language === 'bn' ? "ওটিপি পাঠানো হয়েছে" : "OTP Sent",
          description: language === 'bn' ? `${formattedPhone} নম্বরে একটি ওটিপি পাঠানো হয়েছে` : `An OTP has been sent to ${formattedPhone}`,
        });
      } else {
        throw new Error("Failed to get confirmation result.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast({
        title: language === 'bn' ? "ত্রুটি!" : "Error!",
        description: language === 'bn' ? "ওটিপি পাঠাতে ব্যর্থ। আবার চেষ্টা করুন।" : "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleVerifyOtpAndRegister = async () => {
    if (!confirmationResult || otp.length < 6) {
      toast({
        title: language === 'bn' ? "অবৈধ ওটিপি" : "Invalid OTP",
        description: language === 'bn' ? "অনুগ্রহ করে ৬-সংখ্যার ওটিপি দিন।" : "Please enter the 6-digit OTP.",
        variant: "destructive",
      });
      return;
    }

    const isOtpVerified = await confirmOtp(confirmationResult, otp);
    if (isOtpVerified) {
      toast({
        title: language === 'bn' ? "ফোন যাচাই হয়েছে!" : "Phone Verified!",
        description: language === 'bn' ? "আপনার রেজিস্ট্রেশন সম্পন্ন করা হচ্ছে..." : "Completing your registration...",
      });
      await handleRegister();
    } else {
      toast({
        title: language === 'bn' ? "ত্রুটি!" : "Error!",
        description: language === 'bn' ? "ভুল ওটিপি। আবার চেষ্টা করুন।" : "Incorrect OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'details') {
      if (phone) {
        await handleSendOtp();
      } else {
        await handleRegister();
      }
    } else { // step === 'otp'
      await handleVerifyOtpAndRegister();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-green-600 hover:bg-green-700">
          <UserPlus className="h-4 w-4 mr-2" />
          {t("register", language)}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {step === 'details' ? t("register", language) : (language === 'bn' ? "ওটিপি যাচাই করুন" : "Verify OTP")}
          </DialogTitle>
        </DialogHeader>
        <div id="recaptcha-container"></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 'details' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">{language === 'bn' ? "ইউজারনেম" : "Username"}</Label>
                <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder={language === 'bn' ? "আপনার ইউজারনেম লিখুন" : "Enter your username"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">{language === 'bn' ? "ইমেইল" : "Email"}</Label>
                <Input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder={language === 'bn' ? "আপনার ইমেইল লিখুন" : "Enter your email"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t("phone", language)} {language === 'bn' ? "(ঐচ্ছিক)" : "(Optional)"}</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={language === 'bn' ? "বাংলাদেশী মোবাইল নম্বর" : "Bangladeshi mobile number"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">{language === 'bn' ? "পাসওয়ার্ড" : "Password"}</Label>
                <Input id="reg-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder={language === 'bn' ? "আপনার পাসওয়ার্ড লিখুন" : "Enter your password"} />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {phone ? (language === 'bn' ? "ওটিপি পাঠান" : "Send OTP") : t("register", language)}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2 text-center">
                <Label htmlFor="otp">{language === 'bn' ? "আপনার ফোনে পাঠানো ওটিপি দিন" : "Enter the OTP sent to your phone"}</Label>
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {language === 'bn' ? "যাচাই ও রেজিস্টার করুন" : "Verify & Register"}
              </Button>
              <Button variant="link" size="sm" onClick={() => setStep('details')} className="w-full">
                 {language === 'bn' ? "ফিরে যান" : "Go Back"}
              </Button>
            </>
          )}
        </form>
        {step === 'details' && (
          <>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">{language === 'bn' ? 'অথবা' : 'Or'}</span></div>
            </div>
            <GoogleSignInButton onSuccess={() => setIsOpen(false)} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
