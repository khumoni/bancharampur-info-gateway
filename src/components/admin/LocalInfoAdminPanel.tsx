
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React from "react";

interface Category {
  id: string;
  label: string;
  manager: React.ComponentType;
}

interface LocalInfoProps {
  localInfoCategories: Category[];
  localInfoTab: string | null;
  setLocalInfoTab: (cat: string | null) => void;
}

export const LocalInfoAdminPanel = ({ localInfoCategories, localInfoTab, setLocalInfoTab }: LocalInfoProps) => {
  if (!localInfoTab) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">স্থানীয় তথ্যের ক্যাটেগরি নির্বাচন করুন</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {localInfoCategories.map(cat => (
            <button
              key={cat.id}
              className="flex flex-col p-5 items-center border rounded-lg shadow-sm bg-white hover:bg-green-50 active:scale-95 transition-all"
              onClick={() => setLocalInfoTab(cat.id)}
            >
              <span className="text-green-700 text-2xl mb-1">📂</span>
              <span className="font-medium text-gray-700">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }
  // Manager component render
  const selectedCat = localInfoCategories.find(cat => cat.id === localInfoTab);
  if (!selectedCat) return <div>ক্যাটেগরি খুঁজে পাওয়া যায়নি।</div>;
  const ManagerComp = selectedCat.manager;
  return (
    <div className="mt-4">
      <Button variant="outline" size="sm" onClick={() => setLocalInfoTab(null)}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        ক্যাটেগরি নির্বাচন পাতায় ফিরুন
      </Button>
      <div className="mt-4">
        <ManagerComp />
      </div>
    </div>
  );
};
