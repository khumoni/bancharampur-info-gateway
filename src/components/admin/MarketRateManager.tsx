
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useData } from "@/contexts/DataContext";
import { PlusCircle, Edit, Trash2, Save, X } from "lucide-react";

export const MarketRateManager = () => {
  const { marketRates, updateMarketRate, addMarketRate, deleteMarketRate } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editForm, setEditForm] = useState({ item: '', price: '', unit: '' });
  const [addForm, setAddForm] = useState({ item: '', price: '', unit: '' });

  const handleEdit = (rate: any) => {
    setEditingId(rate.id);
    setEditForm({ item: rate.item, price: rate.price, unit: rate.unit });
  };

  const handleSave = (id: string) => {
    updateMarketRate(id, editForm);
    setEditingId(null);
  };

  const handleAdd = () => {
    addMarketRate(addForm);
    setAddForm({ item: '', price: '', unit: '' });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">বাজার দর ব্যবস্থাপনা</h2>
        <Button onClick={() => setShowAddForm(true)} className="bg-green-600 hover:bg-green-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          নতুন পণ্য যোগ করুন
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>নতুন বাজার দর যোগ করুন</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>পণ্যের নাম</Label>
                <Input
                  value={addForm.item}
                  onChange={(e) => setAddForm(prev => ({ ...prev, item: e.target.value }))}
                  placeholder="যেমন: চাল"
                />
              </div>
              <div>
                <Label>দাম</Label>
                <Input
                  value={addForm.price}
                  onChange={(e) => setAddForm(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="যেমন: ৫৫"
                />
              </div>
              <div>
                <Label>একক</Label>
                <Input
                  value={addForm.unit}
                  onChange={(e) => setAddForm(prev => ({ ...prev, unit: e.target.value }))}
                  placeholder="যেমন: কেজি"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
                <Save className="mr-2 h-4 w-4" />
                সংরক্ষণ করুন
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                <X className="mr-2 h-4 w-4" />
                বাতিল
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>বর্তমান বাজার দর</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>পণ্যের নাম</TableHead>
                <TableHead>দাম</TableHead>
                <TableHead>একক</TableHead>
                <TableHead>সর্বশেষ আপডেট</TableHead>
                <TableHead>কার্যক্রম</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marketRates.map((rate) => (
                <TableRow key={rate.id}>
                  <TableCell>
                    {editingId === rate.id ? (
                      <Input
                        value={editForm.item}
                        onChange={(e) => setEditForm(prev => ({ ...prev, item: e.target.value }))}
                      />
                    ) : (
                      rate.item
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === rate.id ? (
                      <Input
                        value={editForm.price}
                        onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                      />
                    ) : (
                      `৳${rate.price}`
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === rate.id ? (
                      <Input
                        value={editForm.unit}
                        onChange={(e) => setEditForm(prev => ({ ...prev, unit: e.target.value }))}
                      />
                    ) : (
                      rate.unit
                    )}
                  </TableCell>
                  <TableCell>{rate.lastUpdated}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {editingId === rate.id ? (
                        <>
                          <Button size="sm" onClick={() => handleSave(rate.id)} className="bg-green-600">
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(rate)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteMarketRate(rate.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
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
