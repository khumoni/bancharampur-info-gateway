import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  orderBy, 
  query,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

interface LocalInfoItem {
  id: string;
  categoryId: string; // e.g., 'education', 'health'
  icon: string; // lucide-react icon name
  title: string;
  description: string;
}

interface DataContextType {
  notices: Notice[];
  marketRates: MarketRate[];
  localInfoItems: LocalInfoItem[];
  addNotice: (notice: Omit<Notice, 'id' | 'createdAt' | 'isActive'>) => Promise<void>;
  updateMarketRate: (id: string, rate: Partial<MarketRate>) => Promise<void>;
  addMarketRate: (rate: Omit<MarketRate, 'id' | 'lastUpdated'>) => Promise<void>;
  deleteMarketRate: (id: string) => Promise<void>;
  addLocalInfoItem: (item: Omit<LocalInfoItem, 'id'>) => Promise<void>;
  updateLocalInfoItem: (id: string, item: Partial<Omit<LocalInfoItem, 'id' | 'categoryId'>>) => Promise<void>;
  deleteLocalInfoItem: (id: string) => Promise<void>;
  loading: boolean;
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
  const [notices, setNotices] = useState<Notice[]>([]);
  const [marketRates, setMarketRates] = useState<MarketRate[]>([]);
  const [localInfoItems, setLocalInfoItems] = useState<LocalInfoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up Firestore listeners...');
    
    // Listen to notices collection
    const noticesQuery = query(
      collection(db, 'notices'), 
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribeNotices = onSnapshot(noticesQuery, (snapshot) => {
      const noticesData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        } as Notice;
      });
      console.log('Notices updated:', noticesData);
      setNotices(noticesData);
    }, (error) => {
      console.error('Error listening to notices:', error);
    });

    // Listen to market rates collection
    const marketRatesQuery = query(collection(db, 'marketRates'));
    
    const unsubscribeMarketRates = onSnapshot(marketRatesQuery, (snapshot) => {
      const marketRatesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MarketRate[];
      console.log('Market rates updated:', marketRatesData);
      setMarketRates(marketRatesData);
      setLoading(false); // Set loading to false after all initial data is fetched
    }, (error) => {
      console.error('Error listening to market rates:', error);
      setLoading(false);
    });

    // Listen to local info items collection
    const localInfoItemsQuery = query(collection(db, 'localInfoItems'));
    const unsubscribeLocalInfoItems = onSnapshot(localInfoItemsQuery, (snapshot) => {
      const itemsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LocalInfoItem[];
      console.log('Local info items updated:', itemsData);
      setLocalInfoItems(itemsData);
      setLoading(false); // Set loading to false after all initial data is fetched
    }, (error) => {
      console.error('Error listening to local info items:', error);
      setLoading(false);
    });

    return () => {
      unsubscribeNotices();
      unsubscribeMarketRates();
      unsubscribeLocalInfoItems();
    };
  }, []);

  const addNotice = async (noticeData: Omit<Notice, 'id' | 'createdAt' | 'isActive'>) => {
    try {
      console.log('Adding notice:', noticeData);
      await addDoc(collection(db, 'notices'), {
        ...noticeData,
        createdAt: Timestamp.now(),
        isActive: true
      });
    } catch (error) {
      console.error('Error adding notice:', error);
      throw error;
    }
  };

  const updateMarketRate = async (id: string, rateData: Partial<MarketRate>) => {
    try {
      console.log('Updating market rate:', id, rateData);
      const rateRef = doc(db, 'marketRates', id);
      await updateDoc(rateRef, {
        ...rateData,
        lastUpdated: new Date().toLocaleDateString('bn-BD')
      });
    } catch (error) {
      console.error('Error updating market rate:', error);
      throw error;
    }
  };

  const addMarketRate = async (rateData: Omit<MarketRate, 'id' | 'lastUpdated'>) => {
    try {
      console.log('Adding market rate:', rateData);
      await addDoc(collection(db, 'marketRates'), {
        ...rateData,
        lastUpdated: new Date().toLocaleDateString('bn-BD')
      });
    } catch (error) {
      console.error('Error adding market rate:', error);
      throw error;
    }
  };

  const deleteMarketRate = async (id: string) => {
    try {
      console.log('Deleting market rate:', id);
      const rateRef = doc(db, 'marketRates', id);
      await deleteDoc(rateRef);
    } catch (error) {
      console.error('Error deleting market rate:', error);
      throw error;
    }
  };

  const addLocalInfoItem = async (itemData: Omit<LocalInfoItem, 'id'>) => {
    try {
      console.log('Adding local info item:', itemData);
      await addDoc(collection(db, 'localInfoItems'), itemData);
    } catch (error) {
      console.error('Error adding local info item:', error);
      throw error;
    }
  };

  const updateLocalInfoItem = async (id: string, itemData: Partial<Omit<LocalInfoItem, 'id' | 'categoryId'>>) => {
    try {
      console.log('Updating local info item:', id, itemData);
      const itemRef = doc(db, 'localInfoItems', id);
      await updateDoc(itemRef, itemData);
    } catch (error) {
      console.error('Error updating local info item:', error);
      throw error;
    }
  };

  const deleteLocalInfoItem = async (id: string) => {
    try {
      console.log('Deleting local info item:', id);
      const itemRef = doc(db, 'localInfoItems', id);
      await deleteDoc(itemRef);
    } catch (error) {
      console.error('Error deleting local info item:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider value={{
      notices,
      marketRates,
      localInfoItems,
      addNotice,
      updateMarketRate,
      addMarketRate,
      deleteMarketRate,
      addLocalInfoItem,
      updateLocalInfoItem,
      deleteLocalInfoItem,
      loading
    }}>
      {children}
    </DataContext.Provider>
  );
};
