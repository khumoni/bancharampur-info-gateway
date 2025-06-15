import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useData, WeatherInfo } from "@/contexts/DataContext";
import { PlusCircle, Edit, Trash2, Save, X, CloudSun, icons } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLocation } from "@/contexts/LocationContext";

const iconNames = Object.keys(icons);

const formSchema = z.object({
  area: z.string().min(1, "এলাকা আবশ্যক"),
  temperature: z.string().min(1, "তাপমাত্রা আবশ্যক"),
  humidity: z.string().min(1, "আর্দ্রতা আবশ্যক"),
  alert: z.string(),
  icon: z.string().min(1, "আইকন আবশ্যক"),
});

export const WeatherManager = () => {
  const { localInfoItems, addLocalInfoItem, updateLocalInfoItem, deleteLocalInfoItem } = useData();
  const { location } = useLocation();
  const [editingItem, setEditingItem] = useState<WeatherInfo | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const categoryId = 'weather';
  const categoryName = "আবহাওয়া ও দুর্যোগ";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { area: '', temperature: '', humidity: '', alert: '', icon: 'Sun' },
  });

  const categoryItems = localInfoItems.filter((item): item is WeatherInfo => item.categoryId === categoryId);

  const handleEdit = (item: WeatherInfo) => {
    setEditingItem(item);
    form.reset(item);
    setShowAddForm(true);
  };
  
  const handleCancel = () => {
    setEditingItem(null);
    setShowAddForm(false);
    form.reset({ area: '', temperature: '', humidity: '', alert: '', icon: 'Sun' });
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingItem) {
      updateLocalInfoItem(editingItem.id, values);
    } else {
      const newItem: Omit<WeatherInfo, 'id'> = {
        categoryId,
        district: location.district,
        upazila: location.upazila,
        area: values.area,
        temperature: values.temperature,
        humidity: values.humidity,
        alert: values.alert,
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
          <CloudSun className="h-7 w-7 text-gray-700" />
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
            <CardTitle>{editingItem ? `এডিট করুন: ${editingItem.area}`: `নতুন ${categoryName} তথ্য যোগ করুন`}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="area" render={({ field }) => (<FormItem><FormLabel>এলাকা</FormLabel><FormControl><Input placeholder="এলাকার নাম" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="temperature" render={({ field }) => (<FormItem><FormLabel>তাপমাত্রা</FormLabel><FormControl><Input placeholder="যেমন: ৩০° সেলসিয়াস" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="humidity" render={({ field }) => (<FormItem><FormLabel>আর্দ্রতা</FormLabel><FormControl><Input placeholder="যেমন: ৭০%" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="alert" render={({ field }) => (<FormItem><FormLabel>সতর্কবার্তা</FormLabel><FormControl><Textarea placeholder="কোনো সতর্কবার্তা থাকলে লিখুন" {...field} /></FormControl><FormMessage /></FormItem>)} />
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
            <TableHeader><TableRow><TableHead>আইকন</TableHead><TableHead>এলাকা</TableHead><TableHead>তাপমাত্রা</TableHead><TableHead>আর্দ্রতা</TableHead><TableHead>সতর্কবার্তা</TableHead><TableHead>কার্যক্রম</TableHead></TableRow></TableHeader>
            <TableBody>
              {categoryItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{renderIcon(item.icon)}</TableCell>
                  <TableCell className="font-medium">{item.area}</TableCell>
                  <TableCell>{item.temperature}</TableCell>
                  <TableCell>{item.humidity}</TableCell>
                  <TableCell className="max-w-sm truncate">{item.alert}</TableCell>
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
