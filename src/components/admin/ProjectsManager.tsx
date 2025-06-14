import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useData, ProjectInfo } from "@/contexts/DataContext";
import { PlusCircle, Edit, Trash2, Save, X, HardHat, icons } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const iconNames = Object.keys(icons);

const formSchema = z.object({
  projectName: z.string().min(1, "প্রকল্পের নাম আবশ্যক"),
  implementingAgency: z.string().min(1, "বাস্তবায়নকারী সংস্থা আবশ্যক"),
  budget: z.string().min(1, "বাজেট আবশ্যক"),
  status: z.enum(['ongoing', 'completed', 'planned']),
  icon: z.string().min(1, "আইকন আবশ্যক"),
});

export const ProjectsManager = () => {
  const { localInfoItems, addLocalInfoItem, updateLocalInfoItem, deleteLocalInfoItem } = useData();
  const [editingItem, setEditingItem] = useState<ProjectInfo | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const categoryId = 'projects';
  const categoryName = "সরকারি প্রকল্প";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { projectName: '', implementingAgency: '', budget: '', status: 'ongoing', icon: 'Hammer' },
  });

  const categoryItems = localInfoItems.filter((item): item is ProjectInfo => item.categoryId === categoryId);

  const handleEdit = (item: ProjectInfo) => {
    setEditingItem(item);
    form.reset(item);
    setShowAddForm(true);
  };
  
  const handleCancel = () => {
    setEditingItem(null);
    setShowAddForm(false);
    form.reset({ projectName: '', implementingAgency: '', budget: '', status: 'ongoing', icon: 'Hammer' });
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingItem) {
      updateLocalInfoItem(editingItem.id, values);
    } else {
      addLocalInfoItem({
        categoryId,
        projectName: values.projectName,
        implementingAgency: values.implementingAgency,
        budget: values.budget,
        status: values.status,
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
          <HardHat className="h-7 w-7 text-gray-700" />
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
            <CardTitle>{editingItem ? `এডিট করুন: ${editingItem.projectName}`: `নতুন ${categoryName} তথ্য যোগ করুন`}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="projectName" render={({ field }) => (<FormItem><FormLabel>প্রকল্পের নাম</FormLabel><FormControl><Input placeholder="প্রকল্পের নাম" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="implementingAgency" render={({ field }) => (<FormItem><FormLabel>বাস্তবায়নকারী সংস্থা</FormLabel><FormControl><Input placeholder="সংস্থার নাম" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="budget" render={({ field }) => (<FormItem><FormLabel>বাজেট</FormLabel><FormControl><Input placeholder="বাজেটের পরিমাণ" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel>অবস্থা</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="অবস্থা নির্বাচন করুন" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="ongoing">চলমান</SelectItem>
                        <SelectItem value="completed">সম্পন্ন</SelectItem>
                        <SelectItem value="planned">পরিকল্পনাধীন</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
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
            <TableHeader><TableRow><TableHead>আইকন</TableHead><TableHead>প্রকল্পের নাম</TableHead><TableHead>সংস্থা</TableHead><TableHead>বাজেট</TableHead><TableHead>অবস্থা</TableHead><TableHead>কার্যক্রম</TableHead></TableRow></TableHeader>
            <TableBody>
              {categoryItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{renderIcon(item.icon)}</TableCell>
                  <TableCell className="font-medium">{item.projectName}</TableCell>
                  <TableCell>{item.implementingAgency}</TableCell>
                  <TableCell>{item.budget}</TableCell>
                  <TableCell>{item.status}</TableCell>
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
