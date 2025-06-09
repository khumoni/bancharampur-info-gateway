
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  orderBy, 
  query,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';

interface Comment {
  id: string;
  author: string;
  authorId: string;
  avatar: string;
  content: string;
  time: string;
  profilePicture?: string;
  createdAt: string;
}

interface Post {
  id: string;
  author: string;
  authorId: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  likedBy: string[];
  comments: Comment[];
  shares: number;
  hashtags: string[];
  profilePicture?: string;
  createdAt: string;
}

interface SocialContextType {
  posts: Post[];
  addPost: (content: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  loading: boolean;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
};

export const SocialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    console.log('Setting up posts listener...');
    
    const postsQuery = query(
      collection(db, 'posts'), 
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const postsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          comments: data.comments || [],
          likedBy: data.likedBy || []
        } as Post;
      });
      console.log('Posts updated:', postsData);
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      console.error('Error listening to posts:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addPost = async (content: string) => {
    if (!user) return;
    
    try {
      console.log('Adding post:', content);
      const hashtags = content.match(/#\w+/g) || [];
      
      await addDoc(collection(db, 'posts'), {
        author: user.name,
        authorId: user.id,
        avatar: user.name.charAt(0).toUpperCase(),
        content,
        likes: 0,
        likedBy: [],
        comments: [],
        shares: 0,
        hashtags,
        profilePicture: user.profilePicture || '',
        createdAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error adding post:', error);
      throw error;
    }
  };

  const addComment = async (postId: string, content: string) => {
    if (!user) return;
    
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const newComment: Comment = {
        id: Date.now().toString(),
        author: user.name,
        authorId: user.id,
        avatar: user.name.charAt(0).toUpperCase(),
        content,
        time: "এখনই",
        profilePicture: user.profilePicture || '',
        createdAt: new Date().toISOString()
      };

      const updatedComments = [...post.comments, newComment];
      
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        comments: updatedComments
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  const likePost = async (postId: string) => {
    if (!user) return;
    
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const isLiked = post.likedBy.includes(user.id);
      const updatedLikedBy = isLiked 
        ? post.likedBy.filter(id => id !== user.id)
        : [...post.likedBy, user.id];

      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likes: updatedLikedBy.length,
        likedBy: updatedLikedBy
      });
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  };

  return (
    <SocialContext.Provider value={{
      posts,
      addPost,
      addComment,
      likePost,
      loading
    }}>
      {children}
    </SocialContext.Provider>
  );
};
