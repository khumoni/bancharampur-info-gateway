
import React, { createContext, useContext, useState } from 'react';

interface Notice {
  id: string;
  type: 'electricity' | 'weather' | 'gas' | 'emergency';
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  createdAt: string;
  isActive: boolean;
}

interface MarketRate {
  id: string;
  item: string;
  price: string;
  unit: string;
  lastUpdated: string;
}

interface DataContextType {
  notices: Notice[];
  marketRates: MarketRate[];
  addNotice: (notice: Omit<Notice, 'id' | 'createdAt' | 'isActive'>) => void;
  updateMarketRate: (id: string, rate: Partial<MarketRate>) => void;
  addMarketRate: (rate: Omit<MarketRate, 'id' | 'lastUpdated'>) => void;
  deleteMarketRate: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notices, setNotices] = useState<Notice[]>([
    {
      id: '1',
      type: 'electricity',
      title: 'বিদ্যুৎ বিভ্রাট সংক্রান্ত',
      message: 'আগামীকাল (১৫ ডিসেম্বর) সকাল ৯টা থেকে বিকেল ৩টা পর্যন্ত রক্ষণাবেক্ষণের কাজে বিদ্যুৎ বন্ধ থাকবে।',
      severity: 'high',
      createdAt: new Date().toISOString(),
      isActive: true
    }
  ]);

  const [marketRates, setMarketRates] = useState<MarketRate[]>([
    { id: '1', item: 'চাল (মোটা)', price: '৫৫', unit: 'কেজি', lastUpdated: new Date().toLocaleDateString('bn-BD') },
    { id: '2', item: 'চাল (চিকন)', price: '৬৫', unit: 'কেজি', lastUpdated: new Date().toLocaleDateString('bn-BD') },
    { id: '3', item: 'ডাল (মসুর)', price: '১২০', unit: 'কেজি', lastUpdated: new Date().toLocaleDateString('bn-BD') },
    { id: '4', item: 'পেঁয়াজ', price: '৮০', unit: 'কেজি', lastUpdated: new Date().toLocaleDateString('bn-BD') },
    { id: '5', item: 'আলু', price: '৩৫', unit: 'কেজি', lastUpdated: new Date().toLocaleDateString('bn-BD') },
  ]);

  const addNotice = (noticeData: Omit<Notice, 'id' | 'createdAt' | 'isActive'>) => {
    const newNotice: Notice = {
      ...noticeData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isActive: true
    };
    setNotices(prev => [newNotice, ...prev]);
  };

  const updateMarketRate = (id: string, rateData: Partial<MarketRate>) => {
    setMarketRates(prev => 
      prev.map(rate => 
        rate.id === id 
          ? { ...rate, ...rateData, lastUpdated: new Date().toLocaleDateString('bn-BD') }
          : rate
      )
    );
  };

  const addMarketRate = (rateData: Omit<MarketRate, 'id' | 'lastUpdated'>) => {
    const newRate: MarketRate = {
      ...rateData,
      id: Date.now().toString(),
      lastUpdated: new Date().toLocaleDateString('bn-BD')
    };
    setMarketRates(prev => [...prev, newRate]);
  };

  const deleteMarketRate = (id: string) => {
    setMarketRates(prev => prev.filter(rate => rate.id !== id));
  };

  return (
    <DataContext.Provider value={{
      notices,
      marketRates,
      addNotice,
      updateMarketRate,
      addMarketRate,
      deleteMarketRate
    }}>
      {children}
    </DataContext.Provider>
  );
};
