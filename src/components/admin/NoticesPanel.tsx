
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";
import React from "react";

interface NoticesPanelProps {
  noticeForm: {
    type: string;
    title: string;
    message: string;
    severity: string;
  };
  setNoticeForm: React.Dispatch<React.SetStateAction<any>>;
  handleNoticeSubmit: (e: React.FormEvent) => void;
}

export const NoticesPanel = ({ noticeForm, setNoticeForm, handleNoticeSubmit }: NoticesPanelProps) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">বিজ্ঞপ্তি ব্যবস্থাপনা</h1>
    </div>
    <Card>
      <CardHeader>
        <CardTitle>নতুন জরুরি বিজ্ঞপ্তি যোগ করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleNoticeSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">বিজ্ঞপ্তির ধরন</label>
              <Select value={noticeForm.type} onValueChange={(value: any) => setNoticeForm((p: any) => ({ ...p, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="ধরন নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electricity">বিদ্যুৎ</SelectItem>
                  <SelectItem value="gas">গ্যাস</SelectItem>
                  <SelectItem value="weather">আবহাওয়া</SelectItem>
                  <SelectItem value="emergency">জরুরি</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">গুরুত্ব</label>
              <Select value={noticeForm.severity} onValueChange={(value: any) => setNoticeForm((p: any) => ({ ...p, severity: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="গুরুত্ব নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">উচ্চ</SelectItem>
                  <SelectItem value="medium">মাঝারি</SelectItem>
                  <SelectItem value="low">কম</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">শিরোনাম</label>
            <Input 
              placeholder="বিজ্ঞপ্তির শিরোনাম লিখুন" 
              value={noticeForm.title}
              onChange={(e) => setNoticeForm((p: any) => ({ ...p, title: (e.target as HTMLInputElement).value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">বিস্তারিত</label>
            <Textarea 
              placeholder="বিস্তারিত তথ্য লিখুন" 
              className="min-h-[100px]"
              value={noticeForm.message}
              onChange={(e) => setNoticeForm((p: any) => ({ ...p, message: (e.target as HTMLTextAreaElement).value }))}
              required
            />
          </div>
          <Button type="submit" className="bg-red-600 hover:bg-red-700">
            <AlertTriangle className="mr-2 h-4 w-4" />
            জরুরি বিজ্ঞপ্তি প্রকাশ করুন
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
);
