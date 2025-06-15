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

// Newly Added Info Types
export interface ScholarshipInfo extends BaseInfoItem {
  categoryId: 'scholarship';
  title: string;
  provider: string;
  eligibility: string;
  deadline: string;
}

export interface LegalAidInfo extends BaseInfoItem {
  categoryId: 'legal';
  serviceName: string;
  provider: string;
  address: string;
  contact: string;
}

export interface AgricultureInfo extends BaseInfoItem {
  categoryId: 'agriculture';
  serviceType: string;
  details: string;
  contact: string;
}

export interface HousingInfo extends BaseInfoItem {
  categoryId: 'housing';
  projectName: string;
  details: string;
  contact: string;
}

export interface DigitalServiceInfo extends BaseInfoItem {
  categoryId: 'digital_services';
  centerName: string;
  services: string;
  address: string;
  contact: string;
}

export interface CultureInfo extends BaseInfoItem {
  categoryId: 'culture';
  eventName: string;
  date: string;
  location: string;
  details: string;
}

export interface PrivateHealthInfo extends BaseInfoItem {
  categoryId: 'private_health';
  name: string;
  type: 'clinic' | 'diagnostic';
  specialty: string;
  address: string;
  contact: string;
}

export interface EmergencyNewsInfo extends BaseInfoItem {
  categoryId: 'emergency_news';
  title: string;
  details: string;
  date: string;
}

export interface JobInfo extends BaseInfoItem {
  categoryId: 'jobs';
  title: string;
  company: string;
  location: string;
  deadline: string;
}

export type LocalInfoItem = 
  | EducationInfo 
  | HealthInfo 
  | TransportInfo 
  | AdministrativeInfo 
  | UtilitiesInfo 
  | WeatherInfo 
  | ProjectInfo 
  | AnnouncementInfo
  | ScholarshipInfo 
  | LegalAidInfo 
  | AgricultureInfo 
  | HousingInfo 
  | DigitalServiceInfo 
  | CultureInfo 
  | PrivateHealthInfo 
  | EmergencyNewsInfo 
  | JobInfo;


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
  refetchData: () => Promise<void>; // NEW!
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

  // Demo/Seed data for new categories
  const demoLocalInfoItems = [
    {
      id: "job_1",
      categoryId: "jobs",
      icon: "Briefcase",
      district: "Bancharampur",
      upazila: "Bancharampur",
      title: "সহকারী শিক্ষক",
      company: "বাঞ্ছারামপুর রেসিডেন্ট স্কুল",
      location: "বাঞ্ছারামপুর পৌরসভা",
      deadline: "2025-07-01"
    },
    {
      id: "sch_1",
      categoryId: "scholarship",
      icon: "Award",
      district: "Bancharampur",
      upazila: "Bancharampur",
      title: "উচ্চমাধ্যমিক বৃত্তি",
      provider: "সরকারি শিক্ষা বোর্ড",
      eligibility: "SSC পাস",
      deadline: "2025-08-15"
    },
    {
      id: "leg_1",
      categoryId: "legal",
      icon: "Gavel",
      district: "Bancharampur",
      upazila: "Bancharampur",
      serviceName: "ফ্রি লিগ্যাল কনসালটেশন",
      provider: "ডিস্ট্রিক্ট লিগ্যাল এইড অফিস",
      address: "জজ কোর্ট ভবন, বাঞ্ছারামপুর",
      contact: "01799999999"
    },
    {
      id: "agr_1",
      categoryId: "agriculture",
      icon: "Leaf",
      district: "Bancharampur",
      upazila: "Bancharampur",
      serviceType: "কৃষি পরামর্শ",
      details: "আধুনিক ধান চাষ্র পরামর্শ",
      contact: "01888888888"
    },
    {
      id: "hsg_1",
      categoryId: "housing",
      icon: "Landmark",
      district: "Bancharampur",
      upazila: "Bancharampur",
      projectName: "বিআরআরডিবি আবাসন প্রকল্প",
      details: "সাশ্রয়ী মূল্যে ৮০০ ফ্ল্যাট",
      contact: "01977777777"
    },
    {
      id: "dig_1",
      categoryId: "digital_services",
      icon: "Laptop",
      district: "Bancharampur",
      upazila: "Bancharampur",
      centerName: "বাঞ্ছারামপুর ডিজিটাল সেন্টার",
      services: "জন্ম নিবন্ধন, নাগরিক সনদ",
      address: "উপজেলা পরিষদ ভবন",
      contact: "01733333333"
    },
    {
      id: "cul_1",
      categoryId: "culture",
      icon: "Theater",
      district: "Bancharampur",
      upazila: "Bancharampur",
      eventName: "মুক্তিযুদ্ধ নাট্যোৎসব",
      date: "2025-12-16",
      location: "তালশহর কমিউনিটি হল",
      details: "স্থানীয় নাট্যদল অংশগ্রহণ করবে"
    },
    {
      id: "emg_1",
      categoryId: "emergency_news",
      icon: "Siren",
      district: "Bancharampur",
      upazila: "Bancharampur",
      title: "বন্যা পরিস্থিতির আপডেট",
      details: "মেঘনা নদীর পানি বিপৎসীমার উপর দিয়ে প্রবাহিত হচ্ছে। সতর্ক থাকুন।",
      date: "2025-06-20"
    },
    {
      id: "ph_1",
      categoryId: "private_health",
      icon: "Stethoscope",
      district: "Bancharampur",
      upazila: "Bancharampur",
      name: "আবির ক্লিনিক",
      type: "clinic",
      specialty: "জেনারেল মেডিসিন",
      address: "চরদাউদকান্দি, বাঞ্ছারামপুর",
      contact: "01744444444"
    }
  ];

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
      // Demo: যদি localinfoitems ফাঁকা থাকে তাহলে ডেমো ডেটা দেখাও (admin/ডেমো)
      if (localInfoItems.length === 0) {
        setLocalInfoItems(demoLocalInfoItems as any);
      }
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

  // ----------- REFETCH FUNCTION -----------
  /** Re-fetch all main data sets (local info, notices, products, marketRates) from Firestore */
  const refetchData = async () => {
    setLoading(true);
    try {
      // Notices
      const noticesQuery = query(
        collection(db, 'notices'),
        orderBy('createdAt', 'desc')
      );
      const noticesSnapshot = await import('firebase/firestore').then(({ getDocs }) => getDocs(noticesQuery));
      const noticesData = noticesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        } as Notice;
      });
      setNotices(noticesData);

      // Products
      const productsQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const productsSnapshot = await import('firebase/firestore').then(({ getDocs }) => getDocs(productsQuery));
      const productsData = productsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        } as Product;
      });
      setProducts(productsData);

      // Market Rates
      const marketRatesQuery = query(collection(db, 'marketRates'));
      const marketRatesSnapshot = await import('firebase/firestore').then(({ getDocs }) => getDocs(marketRatesQuery));
      const marketRatesData = marketRatesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as MarketRate[];
      setMarketRates(marketRatesData);

      // Local Info Items
      const localInfoItemsQuery = query(collection(db, 'localInfoItems'));
      const localInfoItemsSnapshot = await import('firebase/firestore').then(({ getDocs }) => getDocs(localInfoItemsQuery));
      const itemsData = localInfoItemsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as LocalInfoItem[];
      // Fallback to demo data if empty
      setLocalInfoItems(itemsData.length > 0 ? itemsData : (demoLocalInfoItems as any));
    } catch (err) {
      console.error('Error during manual data refetch:', err);
    }
    setLoading(false);
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
      loading,
      refetchData, // NEW!
    }}>
      {children}
    </DataContext.Provider>
  );
};
