import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/components/ui/use-toast"
import { useApp } from "@/contexts/AppContext";
import { AgricultureInfo } from "@/types/localInfo";

export function AgricultureManager() {
  const { addLocalInfoItem, updateLocalInfoItem, deleteLocalInfoItem, localInfoItems } = useData();
  const { language } = useApp();
  const [newItem, setNewItem] = useState({
    district: 'Brahmanbaria',
    upazila: 'Bancharampur',
    serviceType: '',
    details: '',
    contact: '',
  });
  const [selectedItem, setSelectedItem] = useState<AgricultureInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast()

  const agricultureItems = localInfoItems.filter(item => item.categoryId === 'agriculture') as AgricultureInfo[];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleAddItem = async () => {
    try {
      await addLocalInfoItem({
        ...newItem,
        categoryId: 'agriculture',
        icon: 'Leaf', // choose the default icon for this category
        district: 'Brahmanbaria',
        upazila: 'Bancharampur',
      });
      setNewItem({
        district: 'Brahmanbaria',
        upazila: 'Bancharampur',
        serviceType: '',
        details: '',
        contact: '',
      });
      toast({
        title: language === "bn" ? "সাফল্য" : "Success",
        description: language === "bn" ? "নতুন আইটেম যুক্ত করা হয়েছে" : "New item added",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: language === "bn" ? "এরর" : "Error",
        description: language === "bn" ? "আইটেম যুক্ত করতে সমস্যা হয়েছে" : "Failed to add item",
      })
    }
  };

  const handleEditClick = (item: AgricultureInfo) => {
    setSelectedItem(item);
    setIsEditing(true);
  };

  const handleUpdateItem = async () => {
    if (!selectedItem) return;
    try {
      await updateLocalInfoItem(selectedItem.id, selectedItem);
      setSelectedItem(null);
      setIsEditing(false);
      toast({
        title: language === "bn" ? "সাফল্য" : "Success",
        description: language === "bn" ? "আইটেম আপডেট করা হয়েছে" : "Item updated",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: language === "bn" ? "এরর" : "Error",
        description: language === "bn" ? "আইটেম আপডেট করতে সমস্যা হয়েছে" : "Failed to update item",
      })
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteLocalInfoItem(id);
      setSelectedItem(null);
      setIsEditing(false);
      toast({
        title: language === "bn" ? "সাফল্য" : "Success",
        description: language === "bn" ? "আইটেম ডিলিট করা হয়েছে" : "Item deleted",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: language === "bn" ? "এরর" : "Error",
        description: language === "bn" ? "আইটেম ডিলিট করতে সমস্যা হয়েছে" : "Failed to delete item",
      })
    }
  };

  const handleSelectedItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!selectedItem) return;
    setSelectedItem({ ...selectedItem, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{language === "bn" ? "কৃষি তথ্য" : "Agriculture Info"}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Input
            type="text"
            name="serviceType"
            placeholder={language === "bn" ? "সেবার ধরন" : "Service Type"}
            value={newItem.serviceType}
            onChange={handleInputChange}
          />
          <Textarea
            name="details"
            placeholder={language === "bn" ? "বিস্তারিত" : "Details"}
            value={newItem.details}
            onChange={handleInputChange}
          />
          <Input
            type="text"
            name="contact"
            placeholder={language === "bn" ? "যোগাযোগ" : "Contact"}
            value={newItem.contact}
            onChange={handleInputChange}
          />
          <Button onClick={handleAddItem}>{language === "bn" ? "যোগ করুন" : "Add Item"}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{language === "bn" ? "কৃষি তথ্য তালিকা" : "Agriculture Info List"}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {agricultureItems.map((item) => (
              <li key={item.id} className="py-2 border-b">
                {item.serviceType} - {item.details}
                <Button variant="secondary" size="sm" onClick={() => handleEditClick(item)}>
                  {language === "bn" ? "সম্পাদনা" : "Edit"}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteItem(item.id)}>
                  {language === "bn" ? "মুছুন" : "Delete"}
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {isEditing && selectedItem && (
        <Card>
          <CardHeader>
            <CardTitle>{language === "bn" ? "আইটেম সম্পাদনা" : "Edit Item"}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input
              type="text"
              name="serviceType"
              placeholder={language === "bn" ? "সেবার ধরন" : "Service Type"}
              value={selectedItem.serviceType}
              onChange={handleSelectedItemChange}
            />
            <Textarea
              name="details"
              placeholder={language === "bn" ? "বিস্তারিত" : "Details"}
              value={selectedItem.details}
              onChange={handleSelectedItemChange}
            />
            <Input
              type="text"
              name="contact"
              placeholder={language === "bn" ? "যোগাযোগ" : "Contact"}
              value={selectedItem.contact}
              onChange={handleSelectedItemChange}
            />
            <Button onClick={handleUpdateItem}>{language === "bn" ? "আপডেট করুন" : "Update Item"}</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
