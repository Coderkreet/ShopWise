import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load wishlist from AsyncStorage when component mounts
    useEffect(() => {
        const loadWishlist = async () => {
            try {
                setLoading(true);
                const savedWishlist = await AsyncStorage.getItem('wishlistItems');
                if (savedWishlist !== null) {
                    setWishlist(JSON.parse(savedWishlist));
                }
            } catch (error) {
                console.error('Error loading wishlist from storage:', error);
            } finally {
                setLoading(false);
            }
        };

        loadWishlist();
    }, []);

    // Save to AsyncStorage whenever wishlist changes
    useEffect(() => {
        const saveWishlist = async () => {
            try {
                await AsyncStorage.setItem('wishlistItems', JSON.stringify(wishlist));
            } catch (error) {
                console.error('Error saving wishlist to storage:', error);
            }
        };
        
        saveWishlist();
    }, [wishlist]);

    // Add item to wishlist
    const addToWishlist = (item) => {
        setWishlist((prevWishlist) => {
            // Check if item already exists in wishlist
            const existingItemIndex = prevWishlist.findIndex(wishlistItem => wishlistItem.id === item.id);
            
            if (existingItemIndex === -1) {
                // Item doesn't exist, add it
                return [...prevWishlist, item];
            }
            return prevWishlist;
        });
    };

    // Remove item from wishlist
    const removeFromWishlist = (itemId) => {
        setWishlist((prevWishlist) => prevWishlist.filter(item => item.id !== itemId));
    };

    // Clear wishlist
    const clearWishlist = async () => {
        try {
            await AsyncStorage.removeItem('wishlistItems');
            setWishlist([]);
        } catch (error) {
            console.error('Error clearing wishlist:', error);
        }
    };

    // Check if item is in wishlist
    const isInWishlist = (itemId) => {
        return wishlist.some(item => item.id === itemId);
    };

    return (
        <WishlistContext.Provider value={{ 
            wishlist, 
            addToWishlist, 
            removeFromWishlist, 
            clearWishlist, 
            loading,
            isInWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

// Create a custom hook for easier access to the context
export const useWishlist = () => useContext(WishlistContext); 