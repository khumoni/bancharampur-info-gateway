import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  orderBy, 
  query,
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import { Post, Comment, SocialContextType } from '@/lib/social/types';
import { Product as MarketplaceProduct } from '@/lib/marketplace/types';

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
    
    // The previous query required a composite index in Firestore which is not available.
    // By removing the 'where' clause and filtering on the client, we avoid this requirement.
    const postsQuery = query(
      collection(db, 'posts'), 
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      console.log(`Fetched ${snapshot.docs.length} total posts from Firestore.`);
      const postsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          comments: data.comments || [],
          likedBy: data.likedBy || []
        } as Post;
      }).filter(post => post.status === 'active' || post.status === 'hidden'); // Client-side filtering
      
      console.log(`Displaying ${postsData.length} posts after filtering.`);
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      console.error('Error listening to posts:', error);
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up posts listener.');
      unsubscribe();
    };
  }, []);

  const addPost = async (content: string) => {
    if (!user) {
      console.error("User not authenticated. Cannot add post.");
      throw new Error("User not authenticated. Please log in to post.");
    }
    
    try {
      console.log(`Adding post for user: ${user.id} (${user.name})`);
      const hashtags = content.match(/#\w+/g) || [];
      
      const newPostData = {
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
        status: 'active' as const,
        createdAt: Timestamp.now()
      };

      console.log("Submitting new post data:", newPostData);
      const docRef = await addDoc(collection(db, 'posts'), newPostData);
      console.log("Post added successfully with ID:", docRef.id);
    } catch (error) {
      console.error('Error adding post to Firestore:', error);
      throw error;
    }
  };

  const shareProductAsPost = async (product: MarketplaceProduct, comment: string) => {
    if (!user) {
      console.error("User not authenticated. Cannot share post.");
      throw new Error("User not authenticated.");
    }

    try {
      console.log(`Sharing product as post for user: ${user.id} (${user.name})`);
      const hashtags = comment.match(/#\w+/g) || [];

      // Create a plain object from product to ensure it's serializable
      const serializableProduct = JSON.parse(JSON.stringify(product));

      const newPostData = {
        author: user.name,
        authorId: user.id,
        avatar: user.name.charAt(0).toUpperCase(),
        content: comment,
        likes: 0,
        likedBy: [],
        comments: [],
        shares: 0,
        hashtags,
        profilePicture: user.profilePicture || '',
        status: 'active' as const,
        createdAt: Timestamp.now(),
        postType: 'marketplace-share' as const,
        sharedProduct: serializableProduct,
      };

      console.log("Submitting new shared post data:", newPostData);
      const docRef = await addDoc(collection(db, 'posts'), newPostData);
      console.log("Shared post added successfully with ID:", docRef.id);
    } catch (error) {
      console.error('Error sharing product as post to Firestore:', error);
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

  const moderatePost = async (postId: string, newStatus: 'active' | 'hidden' | 'deleted', reason: string) => {
    if (!user || user.role !== 'admin') {
      console.error("Permission denied: Not an admin.");
      throw new Error("Permission denied: Not an admin.");
    }

    try {
      const postRef = doc(db, 'posts', postId);
      const postSnap = await getDoc(postRef);

      if (!postSnap.exists()) {
        throw new Error("Post not found");
      }

      const currentStatus = postSnap.data().status;

      await updateDoc(postRef, {
        status: newStatus,
        moderationDetails: {
          moderatedBy: user.id,
          moderatedAt: new Date().toISOString(),
          reason: reason,
          previousStatus: currentStatus,
        }
      });
      console.log(`Post ${postId} status changed to ${newStatus}`);
    } catch (error) {
      console.error('Error moderating post:', error);
      throw error;
    }
  };

  return (
    <SocialContext.Provider value={{
      posts,
      addPost,
      shareProductAsPost,
      addComment,
      likePost,
      moderatePost,
      loading
    }}>
      {children}
    </SocialContext.Provider>
  );
};
