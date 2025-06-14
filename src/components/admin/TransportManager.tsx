import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useData, TransportInfo } from "@/contexts/DataContext";
import { PlusCircle, Edit, Trash2, Save, X, Bus, icons } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const iconNames = Object.keys(icons);

const formSchema = z.object({
  routeName: z.string().min(1, "রুটের নাম আবশ্যক"),
  type: z.enum(['bus', 'train', 'auto-rickshaw']),
  schedule: z.string().min(1, "সময়সূচী আবশ্যক"),
  fare: z.string().min(1, "ভাড়া আবশ্যক"),
  icon: z.string().min(1, "আইকন আবশ্যক"),
});

export const TransportManager = () => {
  const { localInfoItems, addLocalInfoItem, updateLocalInfoItem, deleteLocalInfoItem } = useData();
  const [editingItem, setEditingItem] = useState<TransportInfo | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const categoryId = 'transport';
  const categoryName = "যাতায়াত ও পরিবহন";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { routeName: '', type: 'bus', schedule: '', fare: '', icon: 'Route' },
  });

  const categoryItems = localInfoItems.filter((item): item is TransportInfo => item.categoryId === categoryId);

  const handleEdit = (item: TransportInfo) => {
    setEditingItem(item);
    form.reset(item);
    setShowAddForm(true);
  };
  
  const handleCancel = () => {
    setEditingItem(null);
    setShowAddForm(false);
    form.reset({ routeName: '', type: 'bus', schedule: '', fare: '', icon: 'Route' });
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingItem) {
      updateLocalInfoItem(editingItem.id, values);
    } else {
      addLocalInfoItem({
        categoryId,
        routeName: values.routeName,
        type: values.type,
        schedule: values.schedule,
        fare: values.fare,
        icon: values.icon,
      });
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
          <Bus className="h-7 w-7 text-gray-700" />
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
            <CardTitle>{editingItem ? `এডিট করুন: ${editingItem.routeName}`: `নতুন ${categoryName} তথ্য যোগ করুন`}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="routeName" render={({ field }) => (<FormItem><FormLabel>রুটের নাম</FormLabel><FormControl><Input placeholder="যেমন: ঢাকা - চট্টগ্রাম" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="type" render={({ field }) => (
                  <FormItem>
                    <FormLabel>ধরন</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="ধরন নির্বাচন করুন" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="bus">বাস</SelectItem>
                        <SelectItem value="train">ট্রেন</SelectItem>
                        <SelectItem value="auto-rickshaw">অটো-রিকশা</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="schedule" render={({ field }) => (<FormItem><FormLabel>সময়সূচী</FormLabel><FormControl><Input placeholder="যেমন: সকাল ৮টা - রাত ১০টা" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="fare" render={({ field }) => (<FormItem><FormLabel>ভাড়া</FormLabel><FormControl><Input placeholder="ভাড়ার পরিমাণ" {...field} /></FormControl><FormMessage /></FormItem>)} />
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
            <TableHeader><TableRow><TableHead>আইকন</TableHead><TableHead>রুট</TableHead><TableHead>ধরন</TableHead><TableHead>সময়সূচী</TableHead><TableHead>ভাড়া</TableHead><TableHead>কার্যক্রম</TableHead></TableRow></TableHeader>
            <TableBody>
              {categoryItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{renderIcon(item.icon)}</TableCell>
                  <TableCell className="font-medium">{item.routeName}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.schedule}</TableCell>
                  <TableCell>{item.fare}</TableCell>
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
