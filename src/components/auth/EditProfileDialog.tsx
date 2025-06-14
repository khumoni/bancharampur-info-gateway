
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface EditProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  phone: z.string().optional(),
});

export const EditProfileDialog = ({ isOpen, onOpenChange }: EditProfileDialogProps) => {
  const { user, updateUserProfile, isLoading } = useAuth();
  const { language } = useApp();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    const success = await updateUserProfile(values);
    if (success) {
      toast({
        title: language === 'bn' ? 'সফল' : 'Success',
        description: language === 'bn' ? 'আপনার প্রোফাইল আপডেট করা হয়েছে।' : 'Your profile has been updated.',
      });
      onOpenChange(false);
    } else {
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: language === 'bn' ? 'প্রোফাইল আপডেট করা যায়নি।' : 'Failed to update profile.',
        variant: 'destructive',
      });
    }
  };
  
  // Reset form when user data changes or dialog opens
  React.useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        phone: user.phone || '',
      });
    }
  }, [user, isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{language === 'bn' ? 'প্রোফাইল সম্পাদনা করুন' : 'Edit Profile'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'bn' ? 'নাম' : 'Name'}</FormLabel>
                  <FormControl>
                    <Input placeholder={language === 'bn' ? 'আপনার নাম' : 'Your Name'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'bn' ? 'ফোন নম্বর' : 'Phone Number'}</FormLabel>
                  <FormControl>
                    <Input placeholder={language === 'bn' ? 'আপনার ফোন নম্বর' : 'Your Phone Number'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {language === 'bn' ? 'সংরক্ষণ' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
