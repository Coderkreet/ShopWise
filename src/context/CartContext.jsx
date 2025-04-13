import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    // Load cart from AsyncStorage when component mounts
    useEffect(() => {
        const loadCart = async () => {
            try {
                setLoading(true);
                const savedCart = await AsyncStorage.getItem('cartItems');
                if (savedCart !== null) {
                    setCart(JSON.parse(savedCart));
                }
            } catch (error) {
                console.error('Error loading cart from storage:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCart();
    }, []);

    // Update totalItems and totalAmount whenever cart changes
    useEffect(() => {
        const items = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const amount = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        
        setTotalItems(items);
        setTotalAmount(amount);
        
        // Save to AsyncStorage whenever cart changes
        const saveCart = async () => {
            try {
                await AsyncStorage.setItem('cartItems', JSON.stringify(cart));
            } catch (error) {
                console.error('Error saving cart to storage:', error);
            }
        };
        
        saveCart();
    }, [cart]);

    // Add item to cart
    const addToCart = (item) => {
        setCart((prevCart) => {
            // Check if item already exists in cart
            const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);
            
            if (existingItemIndex !== -1) {
                // Item exists, increase quantity
                const updatedCart = [...prevCart];
                const existingItem = updatedCart[existingItemIndex];
                updatedCart[existingItemIndex] = {
                    ...existingItem,
                    quantity: (existingItem.quantity || 1) + (item.quantity || 1)
                };
                return updatedCart;
            } else {
                // Item doesn't exist, add it with quantity
                return [...prevCart, { ...item, quantity: item.quantity || 1 }];
            }
        });
    };

    // Remove item from cart
    const removeFromCart = (itemId) => {
        setCart((prevCart) => prevCart.filter(item => item.id !== itemId));
    };

    // Update item quantity
    const updateQuantity = (itemId, newQuantity) => {
        console.log("inside update ")
        if (newQuantity < 1) return;
        
        setCart((prevCart) => prevCart.map(item => 
            item.id === itemId ? { ...item, quantity: newQuantity } : item
        ));
    };

    // Clear cart
    const clearCart = async () => {
        try {
            await AsyncStorage.removeItem('cartItems');
            setCart([]);
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    // Check if item is in cart
    const isInCart = (itemId) => {
        return cart.some(item => item.id === itemId);
    };

    // Get item quantity from cart
    const getItemQuantity = (itemId) => {
        const item = cart.find(item => item.id === itemId);
        return item ? item.quantity : 0;
    };

    // Get subtotal for a specific item
    const getItemSubtotal = (itemId) => {
        const item = cart.find(item => item.id === itemId);
        return item ? item.price * item.quantity : 0;
    };

    // Format price to 2 decimal places with currency symbol
    const formatPrice = (price) => {
        return `$${price.toFixed(2)}`;
    };

    console.log(cart);

    return (
        <CartContext.Provider value={{ 
            cart, 
            addToCart, 
            removeFromCart, 
            updateQuantity, 
            clearCart, 
            loading,
            totalItems,
            totalAmount,
            isInCart,
            getItemQuantity,
            getItemSubtotal,
            formatPrice
        }}>
            {children}
        </CartContext.Provider>
    );
};

// Create a custom hook for easier access to the context
export const useCart = () => useContext(CartContext);