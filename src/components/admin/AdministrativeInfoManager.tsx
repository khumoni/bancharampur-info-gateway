import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useData, AdministrativeInfo } from "@/contexts/DataContext";
import { PlusCircle, Edit, Trash2, Save, X, UserCog, icons } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const iconNames = Object.keys(icons);

const formSchema = z.object({
  officeName: z.string().min(1, "অফিসের নাম আবশ্যক"),
  officerName: z.string().min(1, "কর্মকর্তার নাম আবশ্যক"),
  designation: z.string().min(1, "পদবি আবশ্যক"),
  contact: z.string().min(1, "যোগাযোগের তথ্য আবশ্যক"),
  icon: z.string().min(1, "আইকন আবশ্যক"),
});

export const AdministrativeInfoManager = () => {
  const { localInfoItems, addLocalInfoItem, updateLocalInfoItem, deleteLocalInfoItem } = useData();
  const [editingItem, setEditingItem] = useState<AdministrativeInfo | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const categoryId = 'admin';
  const categoryName = "প্রশাসনিক তথ্য";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { officeName: '', officerName: '', designation: '', contact: '', icon: 'Building' },
  });

  const categoryItems = localInfoItems.filter((item): item is AdministrativeInfo => item.categoryId === categoryId);

  const handleEdit = (item: AdministrativeInfo) => {
    setEditingItem(item);
    form.reset(item);
    setShowAddForm(true);
  };
  
  const handleCancel = () => {
    setEditingItem(null);
    setShowAddForm(false);
    form.reset({ officeName: '', officerName: '', designation: '', contact: '', icon: 'Building' });
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingItem) {
      updateLocalInfoItem(editingItem.id, values);
    } else {
      const newItem: Omit<AdministrativeInfo, 'id'> = {
        categoryId,
        officeName: values.officeName,
        officerName: values.officerName,
        designation: values.designation,
        contact: values.contact,
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
          <UserCog className="h-7 w-7 text-gray-700" />
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
            <CardTitle>{editingItem ? `এডিট করুন: ${editingItem.officeName}`: `নতুন ${categoryName} তথ্য যোগ করুন`}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="officeName" render={({ field }) => (<FormItem><FormLabel>অফিসের নাম</FormLabel><FormControl><Input placeholder="অফিসের নাম" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="officerName" render={({ field }) => (<FormItem><FormLabel>কর্মকর্তার নাম</FormLabel><FormControl><Input placeholder="কর্মকর্তার নাম" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="designation" render={({ field }) => (<FormItem><FormLabel>পদবি</FormLabel><FormControl><Input placeholder="পদবি" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="contact" render={({ field }) => (<FormItem><FormLabel>যোগাযোগ</FormLabel><FormControl><Input placeholder="যোগাযোগের তথ্য" {...field} /></FormControl><FormMessage /></FormItem>)} />
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
            <TableHeader><TableRow><TableHead>আইকন</TableHead><TableHead>অফিস</TableHead><TableHead>কর্মকর্তা</TableHead><TableHead>পদবি</TableHead><TableHead>যোগাযোগ</TableHead><TableHead>কার্যক্রম</TableHead></TableRow></TableHeader>
            <TableBody>
              {categoryItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{renderIcon(item.icon)}</TableCell>
                  <TableCell className="font-medium">{item.officeName}</TableCell>
                  <TableCell>{item.officerName}</TableCell>
                  <TableCell>{item.designation}</TableCell>
                  <TableCell>{item.contact}</TableCell>
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
