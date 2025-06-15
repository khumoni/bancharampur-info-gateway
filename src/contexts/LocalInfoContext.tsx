
import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  LocalInfoItem
} from "@/types/localInfo";

interface LocalInfoContextType {
  localInfoItems: LocalInfoItem[];
  addLocalInfoItem: (item: Omit<LocalInfoItem, 'id'>) => Promise<void>;
  updateLocalInfoItem: (id: string, item: Partial<LocalInfoItem>) => Promise<void>;
  deleteLocalInfoItem: (id: string) => Promise<void>;
  loading: boolean;
  refetchLocalInfo: () => Promise<void>;
}

/** মূল DataContext থেকে এগুলো ইম্পোর্ট করা লাগবে */
const demoLocalInfoItemsKey = '_demoLocalInfoItems';
export const LocalInfoContext = createContext<LocalInfoContextType | undefined>(undefined);

export const useLocalInfo = () => {
  const context = useContext(LocalInfoContext);
  if (!context) {
    throw new Error('useLocalInfo must be used within a LocalInfoProvider');
  }
  return context;
};

export const LocalInfoProvider: React.FC<{ children: React.ReactNode; demoLocalInfoItems: LocalInfoItem[] }> = ({
  children,
  demoLocalInfoItems
}) => {
  const [localInfoItems, setLocalInfoItems] = useState<LocalInfoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const localInfoItemsQuery = query(collection(db, 'localInfoItems'));
    const unsubscribeLocalInfoItems = onSnapshot(localInfoItemsQuery, (snapshot) => {
      const itemsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LocalInfoItem[];
      setLocalInfoItems(itemsData.length ? itemsData : (demoLocalInfoItems as any));
      setLoading(false);
    }, (error) => {
      console.error('Error listening to local info items:', error);
      setLoading(false);
    });

    return () => {
      unsubscribeLocalInfoItems();
    }
  }, [demoLocalInfoItems]);

  const addLocalInfoItem = async (itemData: Omit<LocalInfoItem, 'id'>) => {
    await addDoc(collection(db, 'localInfoItems'), itemData);
  };

  const updateLocalInfoItem = async (id: string, itemData: Partial<LocalInfoItem>) => {
    const itemRef = doc(db, 'localInfoItems', id);
    await updateDoc(itemRef, itemData as Record<string, any>);
  };

  const deleteLocalInfoItem = async (id: string) => {
    const itemRef = doc(db, 'localInfoItems', id);
    await deleteDoc(itemRef);
  };

  /** শুধু localInfo re-fetch */
  const refetchLocalInfo = async () => {
    setLoading(true);
    try {
      const localInfoItemsQuery = query(collection(db, 'localInfoItems'));
      const localInfoItemsSnapshot = await import('firebase/firestore').then(({ getDocs }) => getDocs(localInfoItemsQuery));
      const itemsData = localInfoItemsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as LocalInfoItem[];
      setLocalInfoItems(itemsData.length ? itemsData : (demoLocalInfoItems as any));
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalInfoContext.Provider value={{
      localInfoItems,
      addLocalInfoItem,
      updateLocalInfoItem,
      deleteLocalInfoItem,
      loading,
      refetchLocalInfo
    }}>
      {children}
    </LocalInfoContext.Provider>
  );
};
