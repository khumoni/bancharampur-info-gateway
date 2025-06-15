import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useData, HealthInfo } from "@/contexts/DataContext";
import { PlusCircle, Edit, Trash2, Save, X, Heart, icons } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLocation } from "@/contexts/LocationContext";

const iconNames = Object.keys(icons);

const formSchema = z.object({
  name: z.string().min(1, "নাম আবশ্যক"),
  type: z.enum(['hospital', 'clinic', 'diagnostic', 'pharmacy']),
  address: z.string().min(1, "ঠিকানা আবশ্যক"),
  phone: z.string().min(1, "ফোন নম্বর আবশ্যক"),
  services: z.string().min(1, "সেবার বিবরণ আবশ্যক"),
  icon: z.string().min(1, "আইকন আবশ্যক"),
});

export const HealthManager = () => {
  const { localInfoItems, addLocalInfoItem, updateLocalInfoItem, deleteLocalInfoItem } = useData();
  const { location } = useLocation();
  const [editingItem, setEditingItem] = useState<HealthInfo | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const categoryId = 'health';
  const categoryName = "স্বাস্থ্য";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', type: 'hospital', address: '', phone: '', services: '', icon: 'Stethoscope' },
  });

  const categoryItems = localInfoItems.filter((item): item is HealthInfo => item.categoryId === categoryId);

  const handleEdit = (item: HealthInfo) => {
    setEditingItem(item);
    form.reset(item);
    setShowAddForm(true);
  };
  
  const handleCancel = () => {
    setEditingItem(null);
    setShowAddForm(false);
    form.reset({ name: '', type: 'hospital', address: '', phone: '', services: '', icon: 'Stethoscope' });
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingItem) {
      updateLocalInfoItem(editingItem.id, values);
    } else {
      const newItem: Omit<HealthInfo, 'id'> = {
        categoryId,
        district: location.district,
        upazila: location.upazila,
        name: values.name,
        type: values.type,
        address: values.address,
        phone: values.phone,
        services: values.services,
        icon: values.icon,
      };
      addLocalInfoItem(newItem);
    }
    handleCancel();
  };
  
  const renderIcon = (name: string) => {
    const Icon = icons[name as keyof typeof icons] || X;
    return <Icon className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Heart className="h-7 w-7 text-gray-700" />
          <h2 className="text-2xl font-bold text-gray-800">{categoryName} ব্যবস্থাপনা</h2>
        </div>
        {!showAddForm && (
          <Button onClick={() => { setShowAddForm(true); setEditingItem(null); }} className="bg-green-600 hover:bg-green-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            নতুন তথ্য যোগ করুন
          </Button>
        )}
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingItem ? `এডিট করুন: ${editingItem.name}`: `নতুন ${categoryName} তথ্য যোগ করুন`}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>প্রতিষ্ঠানের নাম</FormLabel><FormControl><Input placeholder="হাসপাতাল/ক্লিনিকের নাম" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="type" render={({ field }) => (
                  <FormItem>
                    <FormLabel>ধরন</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="ধরন নির্বাচন করুন" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="hospital">হাসপাতাল</SelectItem>
                        <SelectItem value="clinic">ক্লিনিক</SelectItem>
                        <SelectItem value="diagnostic">ডায়াগনস্টিক সেন্টার</SelectItem>
                        <SelectItem value="pharmacy">ফার্মেসি</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="address" render={({ field }) => (<FormItem><FormLabel>ঠিকানা</FormLabel><FormControl><Input placeholder="ঠিকানা" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>ফোন</FormLabel><FormControl><Input placeholder="ফোন নম্বর" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="services" render={({ field }) => (<FormItem><FormLabel>সেবাসমূহ</FormLabel><FormControl><Textarea placeholder="এখানে কি কি সেবা পাওয়া যায় তার বিবরণ" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="icon" render={({ field }) => (<FormItem><FormLabel>আইকন</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="আইকন নির্বাচন করুন" /></SelectTrigger></FormControl><SelectContent><ScrollArea className="h-72">{iconNames.map(iconName => (<SelectItem key={iconName} value={iconName}><div className="flex items-center space-x-2">{renderIcon(iconName)}<span>{iconName}</span></div></SelectItem>))}</ScrollArea></SelectContent></Select><FormMessage /></FormItem>)} />
                <div className="flex space-x-2">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700"><Save className="mr-2 h-4 w-4" />সংরক্ষণ করুন</Button>
                  <Button type="button" variant="outline" onClick={handleCancel}><X className="mr-2 h-4 w-4" />বাতিল</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>বর্তমান {categoryName} তথ্য</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>আইকন</TableHead><TableHead>নাম</TableHead><TableHead>ধরন</TableHead><TableHead>ঠিকানা</TableHead><TableHead>ফোন</TableHead><TableHead>সেবাসমূহ</TableHead><TableHead>কার্যক্রম</TableHead></TableRow></TableHeader>
            <TableBody>
              {categoryItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{renderIcon(item.icon)}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.address}</TableCell>
                  <TableCell>{item.phone}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.services}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(item)}><Edit className="h-4 w-4" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteLocalInfoItem(item.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
