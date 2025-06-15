
import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useApp } from "@/contexts/AppContext";
import { ShopCategory } from "@/lib/marketplace/types";

const CATEGORIES: { id: ShopCategory; name: string }[] = [
  { id: 'grocery', name: 'Grocery' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'hardware', name: 'Hardware' },
  { id: 'furniture', name: 'Furniture' },
  { id: 'stationery', name: 'Stationery' },
  { id: 'food', name: 'Food' },
  { id: 'sports', name: 'Sports' },
  { id: 'other', name: 'Other' },
];

export function ShopRegistrationForm() {
  const { addShop } = useData();
  const { language } = useApp();
  const [form, setForm] = useState({
    name: "",
    category: "grocery" as ShopCategory,
    description: "",
    address: "",
    district: "Brahmanbaria",
    upazila: "Bancharampur",
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (cat: string) => {
    setForm({ ...form, category: cat as ShopCategory });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await addShop({
        name: form.name,
        description: form.description,
        category: form.category,
        address: form.address,
        district: form.district,
        upazila: form.upazila,
        photo: "",
        owner: {
          id: "",
          name: form.ownerName,
          phone: form.ownerPhone,
          email: form.ownerEmail,
          verified: false,
        },
      });
      setSuccess(true);
      setForm({
        name: "",
        category: "grocery",
        description: "",
        address: "",
        district: "Brahmanbaria",
        upazila: "Bancharampur",
        ownerName: "",
        ownerPhone: "",
        ownerEmail: "",
      });
    } catch (err) {
      alert(language === "bn" ? "দোকান রেজিস্টার করতে সমস্যা হয়েছে" : "Could not register shop");
    }
    setLoading(false);
  };

  return (
    <Card className="max-w-xl mx-auto my-8">
      <CardHeader>
        <CardTitle>
          {language === "bn" ? "নতুন দোকান নিবন্ধন" : "Register New Shop"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <Input
            name="name"
            placeholder={language === "bn" ? "দোকানের নাম" : "Shop Name"}
            value={form.name}
            onChange={handleChange}
            required
          />
          <Select value={form.category} onValueChange={handleCategoryChange}>
            <option value="" disabled>{language === "bn" ? "ক্যাটাগরি" : "Category"}</option>
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </Select>
          <Input
            name="description"
            placeholder={language === "bn" ? "বর্ণনা" : "Description"}
            value={form.description}
            onChange={handleChange}
            required
          />
          <Input
            name="address"
            placeholder={language === "bn" ? "ঠিকানা" : "Address"}
            value={form.address}
            onChange={handleChange}
            required
          />
          {/* Owner info */}
          <Input
            name="ownerName"
            placeholder={language === "bn" ? "মালিকের নাম" : "Owner Name"}
            value={form.ownerName}
            onChange={handleChange}
            required
          />
          <Input
            name="ownerPhone"
            placeholder={language === "bn" ? "মালিকের ফোন" : "Owner Phone"}
            value={form.ownerPhone}
            onChange={handleChange}
            required
          />
          <Input
            name="ownerEmail"
            placeholder={language === "bn" ? "মালিকের ইমেইল" : "Owner Email"}
            value={form.ownerEmail}
            type="email"
            onChange={handleChange}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? (language === "bn" ? "দাখিল হচ্ছে..." : "Registering...")
              : (language === "bn" ? "দাখিল করুন" : "Register")}
          </Button>
          {success && (
            <div className="text-green-600 mt-2 text-center">
              {language === "bn" ? "দোকান সফলভাবে নিবন্ধিত হয়েছে!" : "Shop registered successfully!"}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
