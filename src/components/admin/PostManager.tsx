
import { useState } from 'react';
import { useSocial } from '@/contexts/SocialContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';

export const PostManager = () => {
  const { posts, moderatePost, loading } = useSocial();
  const { toast } = useToast();
  const [reason, setReason] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isModerating, setIsModerating] = useState(false);
  const [selectedPost, setSelectedPost] = useState<{postId: string, newStatus: 'active' | 'hidden' | 'deleted', author: string, content: string} | null>(null);

  const openDialog = (postId: string, newStatus: 'active' | 'hidden' | 'deleted', author: string, content: string) => {
    setSelectedPost({ postId, newStatus, author, content });
    setIsDialogOpen(true);
  };

  const handleModerate = async () => {
    if (!selectedPost || !reason.trim()) {
        toast({ title: "ত্রুটি", description: "অনুগ্রহ করে কারণ উল্লেখ করুন।", variant: 'destructive' });
        return;
    }
    
    setIsModerating(true);
    try {
        await moderatePost(selectedPost.postId, selectedPost.newStatus, reason);
        toast({ title: "সফল!", description: "পোস্টের অবস্থা আপডেট করা হয়েছে।" });
    } catch (error) {
        toast({ title: "ত্রুটি", description: "পোস্টের অবস্থা আপডেট করতে ব্যর্থ হয়েছে।", variant: 'destructive' });
    } finally {
        setIsModerating(false);
        setIsDialogOpen(false);
        setSelectedPost(null);
        setReason('');
    }
  };

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>পোস্ট ব্যবস্থাপনা</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className='flex-grow'>
                    <p className="text-sm text-gray-500">লিখেছেন: @{post.author}</p>
                    <p className="mt-1 break-all">{post.content}</p>
                    <div className="mt-2">
                      {post.status === 'active' && <Badge variant="default" className="bg-green-500 hover:bg-green-600">সক্রিয়</Badge>}
                      {post.status === 'hidden' && <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white">লুকানো</Badge>}
                    </div>
                  </div>
                  
                  <div className="flex flex-shrink-0 flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                      {post.status === 'active' && (
                          <Button className="w-full" variant="outline" size="sm" onClick={() => openDialog(post.id, 'hidden', post.author, post.content)}>
                              <EyeOff className="h-4 w-4 mr-2" /> লুকান
                          </Button>
                      )}
                      {post.status === 'hidden' && (
                          <Button className="w-full" variant="outline" size="sm" onClick={() => openDialog(post.id, 'active', post.author, post.content)}>
                              <Eye className="h-4 w-4 mr-2" /> দেখান
                          </Button>
                      )}
                      <Button className="w-full" variant="destructive" size="sm" onClick={() => openDialog(post.id, 'deleted', post.author, post.content)}>
                          <Trash2 className="h-4 w-4 mr-2" /> ডিলিট
                      </Button>
                  </div>
                </div>
              ))}
              {posts.length === 0 && <p className='text-center text-gray-500 py-8'>কোন পোস্ট পাওয়া যায়নি।</p>}
            </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>আপনি কি নিশ্চিত?</DialogTitle>
            <DialogDescription>
                এই কাজটি পোস্টের দৃশ্যমানতা পরিবর্তন করবে। অনুগ্রহ করে কারণ উল্লেখ করুন।
            </DialogDescription>
            </DialogHeader>
            <div className="text-sm text-muted-foreground bg-gray-100 dark:bg-gray-800 p-2 rounded-md my-4">
                <p><strong>@{selectedPost?.author}</strong> এর পোস্ট:</p>
                <p className='truncate'>"{selectedPost?.content}"</p>
            </div>
            <div className="grid gap-4">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="reason">কারণ</Label>
                    <Textarea
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="এখানে কারণ লিখুন..."
                    />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="ghost">বাতিল</Button>
                </DialogClose>
                <Button onClick={handleModerate} disabled={!reason.trim() || isModerating}>
                    {isModerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {selectedPost?.newStatus === 'hidden' && 'পোস্ট লুকান'}
                    {selectedPost?.newStatus === 'active' && 'পোস্ট দেখান'}
                    {selectedPost?.newStatus === 'deleted' && 'পোস্ট ডিলিট করুন'}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
