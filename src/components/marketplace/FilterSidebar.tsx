
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Filter, 
  MapPin, 
  DollarSign, 
  Calendar,
  Star,
  Shield,
  X
} from "lucide-react";

interface FilterSidebarProps {
  language: 'bn' | 'en';
}

export const FilterSidebar = ({ language }: FilterSidebarProps) => {
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [postedWithin, setPostedWithin] = useState("");

  const conditions = [
    { value: "new", label: language === 'bn' ? "নতুন" : "Brand New" },
    { value: "like-new", label: language === 'bn' ? "নতুনের মতো" : "Like New" },
    { value: "good", label: language === 'bn' ? "ভালো" : "Good" },
    { value: "fair", label: language === 'bn' ? "মোটামুটি" : "Fair" },
    { value: "poor", label: language === 'bn' ? "খারাপ" : "Poor" }
  ];

  const locations = [
    "Bancharampur",
    "Brahmanbaria",
    "Cumilla",
    "Chandpur",
    "Lakshmipur"
  ];

  const timeFilters = [
    { value: "1d", label: language === 'bn' ? "গত ২৪ ঘন্টা" : "Last 24 hours" },
    { value: "3d", label: language === 'bn' ? "গত ৩ দিন" : "Last 3 days" },
    { value: "1w", label: language === 'bn' ? "গত সপ্তাহ" : "Last week" },
    { value: "1m", label: language === 'bn' ? "গত মাস" : "Last month" }
  ];

  const handleConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setSelectedConditions(prev => [...prev, condition]);
    } else {
      setSelectedConditions(prev => prev.filter(c => c !== condition));
    }
  };

  const clearFilters = () => {
    setPriceRange([0, 100000]);
    setSelectedLocation("");
    setSelectedConditions([]);
    setVerifiedOnly(false);
    setMinRating(0);
    setPostedWithin("");
  };

  const activeFiltersCount = [
    priceRange[0] > 0 || priceRange[1] < 100000,
    selectedLocation,
    selectedConditions.length > 0,
    verifiedOnly,
    minRating > 0,
    postedWithin
  ].filter(Boolean).length;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            {language === 'bn' ? 'ফিল্টার' : 'Filters'}
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div className="space-y-3">
          <Label className="flex items-center text-sm font-medium">
            <DollarSign className="mr-2 h-4 w-4" />
            {language === 'bn' ? 'দামের পরিসর' : 'Price Range'}
          </Label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={100000}
              step={1000}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>৳{priceRange[0].toLocaleString()}</span>
            <span>৳{priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        <Separator />

        {/* Location */}
        <div className="space-y-3">
          <Label className="flex items-center text-sm font-medium">
            <MapPin className="mr-2 h-4 w-4" />
            {language === 'bn' ? 'স্থান' : 'Location'}
          </Label>
          <div className="space-y-2">
            {locations.map((location) => (
              <div key={location} className="flex items-center space-x-2">
                <Checkbox
                  id={`location-${location}`}
                  checked={selectedLocation === location}
                  onCheckedChange={(checked) => 
                    setSelectedLocation(checked ? location : "")
                  }
                />
                <Label htmlFor={`location-${location}`} className="text-sm">
                  {location}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Condition */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            {language === 'bn' ? 'অবস্থা' : 'Condition'}
          </Label>
          <div className="space-y-2">
            {conditions.map((condition) => (
              <div key={condition.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`condition-${condition.value}`}
                  checked={selectedConditions.includes(condition.value)}
                  onCheckedChange={(checked) => 
                    handleConditionChange(condition.value, checked as boolean)
                  }
                />
                <Label htmlFor={`condition-${condition.value}`} className="text-sm">
                  {condition.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Seller Rating */}
        <div className="space-y-3">
          <Label className="flex items-center text-sm font-medium">
            <Star className="mr-2 h-4 w-4" />
            {language === 'bn' ? 'বিক্রেতার রেটিং' : 'Seller Rating'}
          </Label>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={minRating === rating}
                  onCheckedChange={(checked) => 
                    setMinRating(checked ? rating : 0)
                  }
                />
                <Label htmlFor={`rating-${rating}`} className="flex items-center text-sm">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-1">
                    {language === 'bn' ? `${rating}+ তারকা` : `${rating}+ stars`}
                  </span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Verified Sellers */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="verified-only"
            checked={verifiedOnly}
            onCheckedChange={setVerifiedOnly}
          />
          <Label htmlFor="verified-only" className="flex items-center text-sm">
            <Shield className="mr-2 h-4 w-4 text-green-500" />
            {language === 'bn' ? 'শুধু যাচাইকৃত বিক্রেতা' : 'Verified sellers only'}
          </Label>
        </div>

        <Separator />

        {/* Posted Within */}
        <div className="space-y-3">
          <Label className="flex items-center text-sm font-medium">
            <Calendar className="mr-2 h-4 w-4" />
            {language === 'bn' ? 'পোস্ট করার সময়' : 'Posted Within'}
          </Label>
          <div className="space-y-2">
            {timeFilters.map((filter) => (
              <div key={filter.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`time-${filter.value}`}
                  checked={postedWithin === filter.value}
                  onCheckedChange={(checked) => 
                    setPostedWithin(checked ? filter.value : "")
                  }
                />
                <Label htmlFor={`time-${filter.value}`} className="text-sm">
                  {filter.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Apply Filters Button */}
        <Button className="w-full mt-6">
          {language === 'bn' ? 'ফিল্টার প্রয়োগ করুন' : 'Apply Filters'}
        </Button>
      </CardContent>
    </Card>
  );
};
