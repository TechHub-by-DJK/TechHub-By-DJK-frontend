import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            setCart(null);
        }
    }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchCart = React.useCallback(async () => {
        if (!isAuthenticated) return;
        
        setLoading(true);
        try {
            const cartData = await ApiService.getCart();
            setCart(cartData);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setLoading(false);
        }    }, [isAuthenticated]);

    const addToCart = async (computerId, quantity = 1, includedComponents = []) => {
        if (!isAuthenticated) {
            throw new Error('Please login to add items to cart');
        }

        try {
            const cartItem = {
                computerId,
                quantity,
                includedComponents
            };
            
            const updatedCartItem = await ApiService.addToCart(cartItem);
            await fetchCart(); // Refresh cart
            return updatedCartItem;
        } catch (error) {
            console.error('Failed to add to cart:', error);
            throw error;
        }
    };

    const updateCartItem = async (cartItemId, quantity) => {
        try {
            const updateData = { cartItemId, quantity };
            await ApiService.updateCartItem(updateData);
            await fetchCart(); // Refresh cart
        } catch (error) {
            console.error('Failed to update cart item:', error);
            throw error;
        }
    };

    const removeFromCart = async (cartItemId) => {
        try {
            await ApiService.removeFromCart(cartItemId);
            await fetchCart(); // Refresh cart
        } catch (error) {
            console.error('Failed to remove from cart:', error);
            throw error;
        }
    };

    const clearCart = async () => {
        try {
            await ApiService.clearCart();
            await fetchCart(); // Refresh cart
        } catch (error) {
            console.error('Failed to clear cart:', error);
            throw error;
        }
    };

    const getCartItemCount = () => {
        if (!cart || !cart.item) return 0;
        return cart.item.reduce((total, item) => total + item.quantity, 0);
    };

    const getCartTotal = () => {
        if (!cart || !cart.item) return 0;
        return cart.item.reduce((total, item) => total + (item.totalPrice || 0), 0);
    };

    const value = {
        cart,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        fetchCart,
        getCartItemCount,
        getCartTotal
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
