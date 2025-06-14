
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useData } from "@/contexts/DataContext";
import { LocalInfoItem } from "@/contexts/DataContext";
import { PlusCircle, Edit, Trash2, Save, X, Heart, icons } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

const iconNames = Object.keys(icons);

export const HealthManager = () => {
  const { localInfoItems, addLocalInfoItem, updateLocalInfoItem, deleteLocalInfoItem } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const categoryId = 'health';
  const categoryName = "স্বাস্থ্য";
  const initialFormState = { icon: 'Stethoscope', title: '', description: '' };
  const [editForm, setEditForm] = useState(initialFormState);
  const [addForm, setAddForm] = useState(initialFormState);

  const categoryItems = localInfoItems.filter(item => item.categoryId === categoryId);

  const handleEdit = (item: LocalInfoItem) => {
    setEditingId(item.id);
    setEditForm({ icon: item.icon, title: item.title, description: item.description });
    setShowAddForm(true);
  };
  
  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setEditForm(initialFormState);
    setAddForm(initialFormState);
  }

  const handleSave = (id: string) => {
    if (!editForm.title || !editForm.description) return;
    updateLocalInfoItem(id, editForm);
    handleCancel();
  };

  const handleAdd = () => {
    if (!addForm.title || !addForm.description) return;
    addLocalInfoItem({ ...addForm, categoryId });
    handleCancel();
  };
  
  const renderIcon = (name: string) => {
    const Icon = icons[name as keyof typeof icons] || X;
    return <Icon className="h-5 w-5" />;
  };

  const currentForm = editingId ? editForm : addForm;
  const setCurrentForm = editingId ? setEditForm : setAddForm;
  const handleSubmit = editingId ? () => handleSave(editingId) : handleAdd;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Heart className="h-7 w-7 text-gray-700" />
          <h2 className="text-2xl font-bold text-gray-800">{categoryName} ব্যবস্থাপনা</h2>
        </div>
        {!showAddForm && (
          <Button onClick={() => { setShowAddForm(true); setEditingId(null); }} className="bg-green-600 hover:bg-green-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            নতুন তথ্য যোগ করুন
          </Button>
        )}
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? `এডিট করুন: ${editForm.title}`: `নতুন ${categoryName} তথ্য যোগ করুন`}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">শিরোনাম</Label>
                <Input 
                  placeholder="শিরোনাম লিখুন" 
                  value={currentForm.title}
                  onChange={(e) => setCurrentForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">বিস্তারিত</Label>
                <Textarea 
                  placeholder="বিস্তারিত তথ্য লিখুন" 
                  className="min-h-[100px]"
                  value={currentForm.description}
                  onChange={(e) => setCurrentForm(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">আইকন</Label>
                <Select value={currentForm.icon} onValueChange={(value) => setCurrentForm(prev => ({ ...prev, icon: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="আইকন নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-72">
                      {iconNames.map(iconName => (
                        <SelectItem key={iconName} value={iconName}>
                          <div className="flex items-center space-x-2">
                            {renderIcon(iconName)}
                            <span>{iconName}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
            <div className="flex space-x-2">
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                <Save className="mr-2 h-4 w-4" />
                সংরক্ষণ করুন
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                বাতিল
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>বর্তমান {categoryName} তথ্য</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>আইকন</TableHead>
                <TableHead>শিরোনাম</TableHead>
                <TableHead>বিস্তারিত</TableHead>
                <TableHead>কার্যক্রম</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{renderIcon(item.icon)}</TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell className="text-sm text-gray-600 max-w-sm truncate">{item.description}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteLocalInfoItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
