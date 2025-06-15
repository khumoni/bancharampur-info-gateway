
import React, { useState, useMemo } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { districts, District, Upazila } from '@/lib/bd-locations';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useApp } from '@/contexts/AppContext';

interface LocationSelectorDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const LocationSelectorDialog: React.FC<LocationSelectorDialogProps> = ({ isOpen, onOpenChange }) => {
  const { location, setLocation } = useLocation();
  const { language } = useApp();
  const [selectedDistrict, setSelectedDistrict] = useState<District | undefined>(
    districts.find(d => d.name.en === location.district)
  );
  const [selectedUpazila, setSelectedUpazila] = useState<Upazila | undefined>(
    selectedDistrict?.upazilas.find(u => u.name.en === location.upazila)
  );
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDistricts = useMemo(() => {
    if (!searchQuery) return districts;
    return districts.filter(d => 
      d.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.name.bn.includes(searchQuery)
    );
  }, [searchQuery, districts]);

  const handleDistrictChange = (districtNameEn: string) => {
    const district = districts.find(d => d.name.en === districtNameEn);
    setSelectedDistrict(district);
    setSelectedUpazila(undefined);
  };

  const handleUpazilaChange = (upazilaNameEn: string) => {
    const upazila = selectedDistrict?.upazilas.find(u => u.name.en === upazilaNameEn);
    setSelectedUpazila(upazila);
  };

  const handleSave = () => {
    if (selectedDistrict && selectedUpazila) {
      setLocation({
        district: selectedDistrict.name.en,
        upazila: selectedUpazila.name.en,
      });
      onOpenChange(false);
    }
  };

  const t = (en: string, bn: string) => language === 'bn' ? bn : en;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('Select Your Location', 'আপনার এলাকা নির্বাচন করুন')}</DialogTitle>
          <DialogDescription>
            {t('Select your district and upazila to get localized information.', 'স্থানীয় তথ্য পেতে আপনার জেলা ও উপজেলা নির্বাচন করুন।')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input 
            placeholder={t('Search District...', 'জেলা খুঁজুন...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select onValueChange={handleDistrictChange} value={selectedDistrict?.name.en}>
            <SelectTrigger>
              <SelectValue placeholder={t('Select District', 'জেলা নির্বাচন করুন')} />
            </SelectTrigger>
            <SelectContent>
              {filteredDistricts.map(d => (
                <SelectItem key={d.name.en} value={d.name.en}>
                  {t(d.name.en, d.name.bn)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={handleUpazilaChange} value={selectedUpazila?.name.en} disabled={!selectedDistrict}>
            <SelectTrigger>
              <SelectValue placeholder={t('Select Upazila', 'উপজেলা নির্বাচন করুন')} />
            </SelectTrigger>
            <SelectContent>
              {selectedDistrict?.upazilas.map(u => (
                <SelectItem key={u.name.en} value={u.name.en}>
                  {t(u.name.en, u.name.bn)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={!selectedDistrict || !selectedUpazila}>
            {t('Save Changes', 'সংরক্ষণ করুন')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
