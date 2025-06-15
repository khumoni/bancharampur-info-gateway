
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";

interface LocalAdminPanelProps {
  localAdminForm: any;
  setLocalAdminForm: React.Dispatch<React.SetStateAction<any>>;
  isAddingLocalAdmin: boolean;
  handleLocalAdminSubmit: (e: React.FormEvent) => void;
  localAdmins: any[];
}

export function LocalAdminPanel({
  localAdminForm,
  setLocalAdminForm,
  isAddingLocalAdmin,
  handleLocalAdminSubmit,
  localAdmins
}: LocalAdminPanelProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">লোকাল অ্যাডমিন ব্যবস্থাপনা</h1>
      <form onSubmit={handleLocalAdminSubmit} className="p-4 bg-white mb-8 rounded-lg shadow space-y-3 max-w-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">ইমেইল <span className="text-red-500">*</span></label>
            <Input required value={localAdminForm.email} onChange={e => setLocalAdminForm((f: any) => ({ ...f, email: e.target.value }))} placeholder="Email" />
          </div>
          <div>
            <label className="block font-medium mb-1">নাম <span className="text-red-500">*</span></label>
            <Input required value={localAdminForm.name} onChange={e => setLocalAdminForm((f: any) => ({ ...f, name: e.target.value }))} placeholder="Name" />
          </div>
          <div>
            <label className="block font-medium mb-1">মোবাইল</label>
            <Input value={localAdminForm.phone} onChange={e => setLocalAdminForm((f: any) => ({ ...f, phone: e.target.value }))} placeholder="Phone" />
          </div>
          <div>
            <label className="block font-medium mb-1">জেলা <span className="text-red-500">*</span></label>
            <Input required value={localAdminForm.district} onChange={e => setLocalAdminForm((f: any) => ({ ...f, district: e.target.value }))} placeholder="District" />
          </div>
          <div>
            <label className="block font-medium mb-1">উপজেলা <span className="text-red-500">*</span></label>
            <Input required value={localAdminForm.upazila} onChange={e => setLocalAdminForm((f: any) => ({ ...f, upazila: e.target.value }))} placeholder="Upazila" />
          </div>
        </div>
        <Button type="submit" className="bg-green-600 text-white" disabled={isAddingLocalAdmin}>
          {isAddingLocalAdmin ? "রেজিস্টার হচ্ছে..." : "নতুন Local Admin যোগ করুন"}
        </Button>
      </form>
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold mb-4 text-lg">বর্তমান Local Admins</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">নাম</th>
                <th className="p-2 text-left">ইমেইল</th>
                <th className="p-2 text-left">জেলা</th>
                <th className="p-2 text-left">উপজেলা</th>
                <th className="p-2 text-left">মোবাইল</th>
              </tr>
            </thead>
            <tbody>
              {localAdmins.map((x: any, i: number) => (
                <tr key={x.id || i} className="border-b">
                  <td className="p-2">{x.name}</td>
                  <td className="p-2">{x.email}</td>
                  <td className="p-2">{x.assignedLocations?.[0]?.district || '—'}</td>
                  <td className="p-2">{x.assignedLocations?.[0]?.upazila || '—'}</td>
                  <td className="p-2">{x.phone}</td>
                </tr>
              ))}
              {localAdmins.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">কোনো Local Admin পাওয়া যায়নি</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
