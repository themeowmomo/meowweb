
"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/cart-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Trash2, Send, User, MapPin, CreditCard, Wallet, Loader2, History, Package, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, useCollection, useMemoFirebase, useAuth } from "@/firebase";
import { collection, query, where, orderBy } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

const RESTAURANT_ID = 'meow-momo';

export function CartSheet() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, customerInfo, updateCustomerInfo, clearCart, saveOrderToFirestore } = useCart();
  const { user } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch Order History for the current user
  const ordersQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'restaurants', RESTAURANT_ID, 'orders'),
      where('customerId', '==', user.uid),
      orderBy('orderDate', 'desc')
    );
  }, [db, user]);

  const { data: orderHistory, isLoading: isHistoryLoading } = useCollection(ordersQuery);

  useEffect(() => {
    setMounted(true);
    // Ensure anonymous sign-in if no user
    if (!user && auth) {
      signInAnonymously(auth).catch(console.error);
    }
  }, [user, auth]);

  const upiBaseUrl = "upi://pay?pa=amitjaisawal0123-2@okhdfcbank&pn=Amit%20Jaisawal&aid=uGICAgIDrvPOJZw";

  const handleWhatsAppOrder = async () => {
    if (cart.length === 0) return;
    
    if (!customerInfo.name.trim() || !customerInfo.address.trim()) {
      toast({
        title: "Missing Details",
        description: "Please enter your name and delivery address.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({ title: "Session Error", description: "Waiting for secure session...", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    
    // Save to Firestore first
    const orderId = await saveOrderToFirestore(user.uid);
    
    const shopNumber = "918850859140";
    
    const header = "*NEW ORDER - MEOW MOMO*%0A";
    const separator = "--------------------------%0A";
    const orderRefText = orderId ? `Order ID: ${orderId}%0A` : "";
    const customerSection = `*Customer Details*%0AName: ${customerInfo.name}%0AAddress: ${customerInfo.address}%0A${orderRefText}%0A`;
    
    const itemsSection = "*Order Items*%0A" + cart
      .map(item => {
        const variantText = item.variant ? ` (${item.variant})` : "";
        return `- ${item.name}${variantText} x ${item.quantity}: Rs.${item.price * item.quantity}`;
      })
      .join("%0A") + "%0A%0A";
    
    const paymentText = customerInfo.paymentMethod === 'upi' ? "UPI (Amount Pre-filled)" : "Cash on Delivery";
    const summarySection = `*Order Summary*%0APayment Method: ${paymentText}%0ATotal Items: ${totalItems}%0A*Grand Total: Rs.${totalPrice}*%0A`;
    const footer = "--------------------------%0A_Sent via Meow Momo Web App_";

    const fullMessage = header + separator + customerSection + itemsSection + summarySection + footer;

    if (customerInfo.paymentMethod === 'upi') {
      const upiUrl = `${upiBaseUrl}&am=${totalPrice}&cu=INR&tn=Order%20${orderId || 'MeowMomo'}`;
      window.location.href = upiUrl;
      
      setTimeout(() => {
        window.open(`https://wa.me/${shopNumber}?text=${fullMessage}`, "_blank");
      }, 2000);
    } else {
      window.open(`https://wa.me/${shopNumber}?text=${fullMessage}`, "_blank");
    }

    setIsProcessing(false);
    toast({
      title: "Order Shared!",
      description: "WhatsApp opened. Items remain in cart until you clear them.",
    });
  };

  if (!mounted) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative border-primary/20 hover:bg-secondary" aria-label="Cart">
          <ShoppingCart className="w-5 h-5 text-primary" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 overflow-hidden">
        <Tabs defaultValue="cart" className="flex flex-col h-full">
          <div className="px-6 pt-6">
            <SheetHeader className="mb-6">
              <SheetTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" /> Order Management
              </SheetTitle>
            </SheetHeader>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="cart" className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" /> My Cart
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="w-4 h-4" /> History
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="cart" className="flex-grow flex flex-col overflow-hidden m-0">
            {cart.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center space-y-4 opacity-50">
                <ShoppingCart className="w-16 h-16" />
                <p className="text-lg font-medium">Your cart is empty</p>
                <p className="text-sm text-center px-8">Add some delicious momos to get started!</p>
              </div>
            ) : (
              <>
                <ScrollArea className="flex-grow px-6">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <User className="w-3.5 h-3.5" /> Delivery Details
                      </h3>
                      <div className="grid gap-3">
                        <Input 
                          placeholder="Your Name" 
                          value={customerInfo.name}
                          onChange={(e) => updateCustomerInfo({ name: e.target.value })}
                          className="h-12 rounded-xl"
                        />
                        <Input 
                          placeholder="Full Address (e.g. Kurar Village)" 
                          value={customerInfo.address}
                          onChange={(e) => updateCustomerInfo({ address: e.target.value })}
                          className="h-12 rounded-xl"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5" /> Payment
                      </h3>
                      <RadioGroup 
                        value={customerInfo.paymentMethod} 
                        onValueChange={(val) => updateCustomerInfo({ paymentMethod: val as any })}
                        className="grid grid-cols-2 gap-3"
                      >
                        <Label htmlFor="cod" className="flex items-center justify-center gap-2 rounded-xl border p-4 cursor-pointer hover:bg-muted/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
                          <RadioGroupItem value="cod" id="cod" className="sr-only" />
                          <Wallet className="w-4 h-4" /> <span className="text-xs font-bold">COD</span>
                        </Label>
                        <Label htmlFor="upi" className="flex items-center justify-center gap-2 rounded-xl border p-4 cursor-pointer hover:bg-muted/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
                          <RadioGroupItem value="upi" id="upi" className="sr-only" />
                          <Send className="w-4 h-4" /> <span className="text-xs font-bold">UPI</span>
                        </Label>
                      </RadioGroup>
                    </div>

                    <Separator />

                    <div className="space-y-4 pb-8">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Order Items</h3>
                        <Button variant="ghost" size="sm" onClick={clearCart} className="text-[10px] font-black uppercase text-destructive">Clear All</Button>
                      </div>
                      {cart.map((item) => (
                        <div key={`${item.id}-${item.variant}`} className="flex gap-4 bg-muted/20 p-4 rounded-2xl border border-primary/5">
                          <div className="flex-grow space-y-1">
                            <h4 className="font-bold text-sm">
                              {item.name} {item.variant && <span className="text-[10px] text-muted-foreground">({item.variant})</span>}
                            </h4>
                            <p className="text-xs text-primary font-black">Rs.{item.price * item.quantity}</p>
                            
                            <div className="flex items-center gap-2 mt-2">
                              <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg" onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}><Minus className="h-3 w-3" /></Button>
                              <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                              <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg" onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}><Plus className="h-3 w-3" /></Button>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => removeFromCart(item.id, item.variant)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>

                <div className="p-6 bg-white border-t space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-muted-foreground">Grand Total</span>
                    <span className="text-2xl font-black text-primary">Rs.{totalPrice}</span>
                  </div>
                  <Button onClick={handleWhatsAppOrder} disabled={isProcessing} className="w-full h-14 bg-primary text-lg font-black shadow-xl rounded-xl">
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Order Now <Send className="ml-2 w-4 h-4" /></>}
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="history" className="flex-grow flex flex-col overflow-hidden m-0">
            <ScrollArea className="flex-grow px-6">
              {isHistoryLoading ? (
                <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" /></div>
              ) : orderHistory && orderHistory.length > 0 ? (
                <div className="space-y-4 py-4">
                  {orderHistory.map((order: any) => (
                    <div key={order.id} className="p-4 rounded-2xl border border-primary/10 bg-white hover:bg-primary/5 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-[10px] font-black uppercase text-primary tracking-widest">{order.id}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3" /> 
                            {order.orderDate?.toDate ? new Date(order.orderDate.toDate()).toLocaleDateString() : 'Just now'}
                          </p>
                        </div>
                        <span className="text-sm font-black text-primary">Rs.{order.totalAmount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-secondary text-primary">{order.status}</span>
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{order.paymentMethod}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center space-y-4 opacity-50 h-64">
                  <History className="w-12 h-12" />
                  <p className="text-sm font-bold">No orders yet</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
