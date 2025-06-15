
export interface Upazila {
  name: {
    en: string;
    bn: string;
  };
}

export interface District {
  name: {
    en: string;
    bn: string;
  };
  upazilas: Upazila[];
}

export const districts: District[] = [
  {
    name: { en: 'Brahmanbaria', bn: 'ব্রাহ্মণবাড়িয়া' },
    upazilas: [
      { name: { en: 'Bancharampur', bn: 'বাঞ্ছারামপুর' } },
      { name: { en: 'Nabinagar', bn: 'নবীনগর' } },
      { name: { en: 'Akhaura', bn: 'আখাউড়া' } },
      { name: { en: 'Sarail', bn: 'সরাইল' } },
      { name: { en: 'Kasba', bn: 'কসবা' } },
      { name: { en: 'Brahmanbaria Sadar', bn: 'ব্রাহ্মণবাড়িয়া সদর' } },
      { name: { en: 'Ashuganj', bn: 'আশুগঞ্জ' } },
      { name: { en: 'Nasirnagar', bn: 'নাসিরনগর' } },
      { name: { en: 'Bijoynagar', bn: 'বিজয়নগর' } },
    ],
  },
  {
    name: { en: 'Dhaka', bn: 'ঢাকা' },
    upazilas: [
      { name: { en: 'Dhamrai', bn: 'ধামরাই' } },
      { name: { en: 'Dohar', bn: 'দোহার' } },
      { name: { en: 'Keraniganj', bn: 'কেরানীগঞ্জ' } },
      { name: { en: 'Nawabganj', bn: 'নবাবগঞ্জ' } },
      { name: { en: 'Savar', bn: 'সাভার' } },
    ],
  },
  // For demonstration, a few districts are added. More can be added later.
];
