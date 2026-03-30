'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useFirestore } from '@/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import dynamic from 'next/dynamic';

const CartSheet = dynamic(() => import("@/components/cart-sheet").then(mod => mod.CartSheet), {
  ssr: false
});

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
  image?: string;
};

export type PaymentMethod = 'cod' | 'upi';
export type OrderType = 'delivery' | 'pickup';

export type CustomerInfo = {
  name: string;
  address: string;
  paymentMethod: PaymentMethod;
  orderType: OrderType;
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
  saveOrderToFirestore: () => Promise<string | null>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const RESTAURANT_ID = 'meow-momo';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({ 
    name: '', 
    address: '',
    paymentMethod: 'cod',
    orderType: 'pickup' // Changed default to 'pickup'
  });
  const db = useFirestore();

  useEffect(() => {
    const savedCart = localStorage.getItem('meow_momo_cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) setCart(parsed);
      } catch (e) {}
    }
    const savedInfo = localStorage.getItem('meow_momo_customer');
    if (savedInfo) {
      try {
        const parsed = JSON.parse(savedInfo);
        setCustomerInfo({
          name: parsed.name || '',
          address: parsed.address || '',
          paymentMethod: parsed.paymentMethod || 'cod',
          orderType: parsed.orderType || 'pickup'
        });
      } catch (e) {}
    }
  }, []);

  useEffect(() => { localStorage.setItem('meow_momo_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('meow_momo_customer', JSON.stringify(customerInfo)); }, [customerInfo]);

  const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i.id === newItem.id && i.variant === newItem.variant);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].quantity += 1;
        return updated;
      }
      return [...prev, { ...newItem, quantity: 1, variant: '5 Pieces' }]; // Ensure 5 Pieces terminology
    });
  };

  const removeFromCart = (id: string, variant?: string) => {
    setCart(prev => prev.filter(i => !(i.id === id && i.variant === variant)));
  };

  const updateQuantity = (id: string, quantity: number, variant?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, variant);
      return;
    }
    setCart(prev => prev.map(i => i.id === id && i.variant === variant ? { ...i, quantity } : i));
  };

  const updateCustomerInfo = (info: Partial<CustomerInfo>) => {
    setCustomerInfo(prev => ({ ...prev, ...info }));
  };

  const saveOrderToFirestore = async () => {
    if (cart.length === 0 || !db) return null;
    try {
      const orderId = `MM-${Date.now().toString().slice(-6)}`;
      const orderRef = doc(db, 'restaurants', RESTAURANT_ID, 'orders', orderId);
      const orderData = {
        id: orderId,
        restaurantId: RESTAURANT_ID,
        customerId: 'GUEST',
        orderDate: serverTimestamp(),
        customerName: customerInfo.name,
        customerContact: 'Guest',
        deliveryAddress: customerInfo.orderType === 'pickup' ? 'STORE PICKUP' : customerInfo.address,
        totalAmount: totalPrice,
        paymentMethod: customerInfo.paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery',
        status: 'Pending',
        notes: `Order Type: ${customerInfo.orderType}`
      };
      await setDoc(orderRef, orderData);
      for (const item of cart) {
        const itemRef = doc(db, 'restaurants', RESTAURANT_ID, 'orders', orderId, 'orderItems', `${item.id}-${item.variant || '5-pieces'}`);
        await setDoc(itemRef, {
          id: `${item.id}-${item.variant || '5-pieces'}`,
          orderId: orderId,
          menuItemId: item.id,
          quantity: item.quantity,
          priceAtOrder: item.price,
          name: item.name
        });
      }
      return orderId;
    } catch (e) {
      return null;
    }
  };

  const clearCart = () => { setCart([]); localStorage.removeItem('meow_momo_cart'); };
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, customerInfo, updateCustomerInfo, saveOrderToFirestore }}>
      {children}
      <CartSheet />
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
