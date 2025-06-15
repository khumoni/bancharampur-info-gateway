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
import { Product } from '@/lib/marketplace/types';

export interface Notice {
  id: string;
  type: 'electricity' | 'weather' | 'gas' | 'emergency';
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  createdAt: string;
  isActive: boolean;
}

export interface MarketRate {
  id: string;
  item: string;
  price: string;
  unit: string;
  lastUpdated: string;
}

// New Local Info Types
export interface BaseInfoItem {
  id: string;
  categoryId: string;
  icon: string;
  district: string;
  upazila: string;
}

export interface EducationInfo extends BaseInfoItem {
  categoryId: 'education';
  institutionName: string;
  type: 'school' | 'college' | 'university' | 'madrasha';
  address: string;
  contact: string;
}

export interface HealthInfo extends BaseInfoItem {
  categoryId: 'health';
  name: string;
  type: 'hospital' | 'clinic' | 'diagnostic' | 'pharmacy';
  address: string;
  phone: string;
  services: string;
}

export interface TransportInfo extends BaseInfoItem {
  categoryId: 'transport';
  routeName: string;
  type: 'bus' | 'train' | 'auto-rickshaw';
  schedule: string;
  fare: string;
}

export interface AdministrativeInfo extends BaseInfoItem {
  categoryId: 'admin';
  officeName: string;
  officerName: string;
  designation: string;
  contact: string;
}

export interface UtilitiesInfo extends BaseInfoItem {
  categoryId: 'utilities';
  serviceType: 'electricity' | 'gas' | 'water';
  officeAddress: string;
  complaintNumber: string;
}

export interface WeatherInfo extends BaseInfoItem {
  categoryId: 'weather';
  area: string;
  temperature: string;
  humidity: string;
  alert: string;
}

export interface ProjectInfo extends BaseInfoItem {
  categoryId: 'projects';
  projectName: string;
  implementingAgency: string;
  budget: string;
  status: 'ongoing' | 'completed' | 'planned';
}

export interface AnnouncementInfo extends BaseInfoItem {
  categoryId: 'announcements';
  title: string;
  details: string;
  date: string;
}

export type LocalInfoItem = EducationInfo | HealthInfo | TransportInfo | AdministrativeInfo | UtilitiesInfo | WeatherInfo | ProjectInfo | AnnouncementInfo;


interface DataContextType {
  notices: Notice[];
  marketRates: MarketRate[];
  localInfoItems: LocalInfoItem[];
  products: Product[];
  addNotice: (notice: Omit<Notice, 'id' | 'createdAt' | 'isActive'>) => Promise<void>;
  updateMarketRate: (id: string, rate: Partial<MarketRate>) => Promise<void>;
  addMarketRate: (rate: Omit<MarketRate, 'id' | 'lastUpdated'>) => Promise<void>;
  deleteMarketRate: (id: string) => Promise<void>;
  addLocalInfoItem: (item: Omit<LocalInfoItem, 'id'>) => Promise<void>;
  updateLocalInfoItem: (id: string, item: Partial<LocalInfoItem>) => Promise<void>;
  deleteLocalInfoItem: (id: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
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
  const [products, setProducts] = useState<Product[]>([]);
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

    // Listen to products collection
    const productsQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      const productsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        } as Product;
      });
      console.log('Products updated:', productsData);
      setProducts(productsData);
    }, (error) => {
      console.error('Error listening to products:', error);
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
      unsubscribeProducts();
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

  const updateLocalInfoItem = async (id: string, itemData: Partial<LocalInfoItem>) => {
    try {
      console.log('Updating local info item:', id, itemData);
      const itemRef = doc(db, 'localInfoItems', id);
      await updateDoc(itemRef, itemData as Record<string, any>);
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

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      console.log('Adding product:', productData);
      await addDoc(collection(db, 'products'), {
        ...productData,
        createdAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      console.log('Updating product:', id, productData);
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, productData as Record<string, any>);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      console.log('Deleting product:', id);
      const productRef = doc(db, 'products', id);
      await deleteDoc(productRef);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider value={{
      notices,
      marketRates,
      localInfoItems,
      products,
      addNotice,
      updateMarketRate,
      addMarketRate,
      deleteMarketRate,
      addLocalInfoItem,
      updateLocalInfoItem,
      deleteLocalInfoItem,
      addProduct,
      updateProduct,
      deleteProduct,
      loading
    }}>
      {children}
    </DataContext.Provider>
  );
};
