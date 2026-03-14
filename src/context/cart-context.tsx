"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
};

export type PaymentMethod = 'cod' | 'upi';

export type CustomerInfo = {
  name: string;
  address: string;
  paymentMethod: PaymentMethod;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string, variant?: string) => void;
  updateQuantity: (id: string, quantity: number, variant?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  customerInfo: CustomerInfo;
  updateCustomerInfo: (info: Partial<CustomerInfo>) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({ 
    name: '', 
    address: '',
    paymentMethod: 'cod'
  });

  // Load data from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('meow_momo_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to load cart", e);
      }
    }

    const savedInfo = localStorage.getItem('meow_momo_customer');
    if (savedInfo) {
      try {
        const parsed = JSON.parse(savedInfo);
        setCustomerInfo({
          name: parsed.name || '',
          address: parsed.address || '',
          paymentMethod: parsed.paymentMethod || 'cod'
        });
      } catch (e) {
        console.error("Failed to load customer info", e);
      }
    }
  }, []);

  // Save cart to local storage on change
  useEffect(() => {
    localStorage.setItem('meow_momo_cart', JSON.stringify(cart));
  }, [cart]);

  // Save customer info to local storage on change
  useEffect(() => {
    localStorage.setItem('meow_momo_customer', JSON.stringify(customerInfo));
  }, [customerInfo]);

  const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.id === newItem.id && item.variant === newItem.variant
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      }

      return [...prevCart, { ...newItem, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string, variant?: string) => {
    setCart(prevCart => prevCart.filter(item => !(item.id === id && item.variant === variant)));
  };

  const updateQuantity = (id: string, quantity: number, variant?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, variant);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id && item.variant === variant ? { ...item, quantity } : item
      )
    );
  };

  const updateCustomerInfo = (info: Partial<CustomerInfo>) => {
    setCustomerInfo(prev => ({ ...prev, ...info }));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      totalItems, 
      totalPrice,
      customerInfo,
      updateCustomerInfo
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
