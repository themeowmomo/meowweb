'use client';

import { useState, useEffect } from "react";
import { useCart } from "@/context/cart-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Trash2, Send, User, MapPin, CreditCard, Wallet, Loader2, History, Package, Calendar, Phone, LogIn, ArrowRight } from "lucide-react";
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
import Link from "next/link";

const RESTAURANT_ID = 'meow-momo';

export function CartSheet() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, customerInfo, updateCustomerInfo, clearCart, saveOrderToFirestore } = useCart();
  const { user } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Memoized query for order history - ONLY for non-anonymous users to prevent permission errors for guests
  const ordersQuery = useMemoFirebase(() => {
    // Only query server if user is logged in (not anonymous) and we have a DB instance
    if (!db || !user || user.isAnonymous) return null;
    
    return query(
      collection(db, 'restaurants', RESTAURANT_ID, 'orders'),
      where('customerId', '==', user.uid),
      orderBy('orderDate', 'desc')
    );
  }, [db, user]);

  const { data: orderHistory, isLoading: isHistoryLoading } = useCollection(ordersQuery);

  useEffect(() => {
    setMounted(true);
    // Silent anonymous sign-in for guests to support basic session tracking
    if (!user && auth) {
      signInAnonymously(auth).catch(() => {});
    }
  }, [user, auth]);

  const handleWhatsAppOrder = async () => {
    if (cart.length === 0) return;
    
    if (!customerInfo.name.trim() || !customerInfo.address.trim() || !customerInfo.mobile.trim()) {
      toast({
        title: "Missing Details",
        description: "Please enter your name, address, and mobile number.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({ title: "Session Error", description: "Waiting for secure session...", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    // Save to server only at the moment of ordering
    const orderId = await saveOrderToFirestore(user.uid);
    const shopNumber = "918850859140";
    
    const header = "*NEW ORDER - MEOW MOMO*%0A";
    const separator = "--------------------------%0A";
    const customerSection = `*Customer Details*%0AName: ${customerInfo.name}%0AMobile: ${customerInfo.mobile}%0AAddress: ${customerInfo.address}%0A${orderId ? `Order ID: ${orderId}%0A` : ""}`;
    
    const itemsSection = "%0A*Order Items*%0A" + cart
      .map(item => `- ${item.name}${item.variant ? ` (${item.variant})` : ""} x ${item.quantity}: Rs.${item.price * item.quantity}`)
      .join("%0A") + "%0A";
    
    const paymentText = customerInfo.paymentMethod === 'upi' ? "UPI (Digital)" : "Cash on Delivery";
    const summarySection = `%0A*Order Summary*%0APayment: ${paymentText}%0AItems: ${totalItems}%0A*Grand Total: Rs.${totalPrice}*%0A`;
    const footer = "--------------------------%0A_Sent via Meow Momo App_";

    const fullMessage = header + separator + customerSection + itemsSection + summarySection + footer;

    if (customerInfo.paymentMethod === 'upi') {
      const upiUrl = `upi://pay?pa=amitjaisawal0123-2@okhdfcbank&pn=Amit%20Jaisawal&am=${totalPrice}&cu=INR&tn=Order%20${orderId || 'MeowMomo'}`;
      window.location.href = upiUrl;
      setTimeout(() => {
        window.open(`https://wa.me/${shopNumber}?text=${fullMessage}`, "_blank");
      }, 2000);
    } else {
      window.open(`https://wa.me/${shopNumber}?text=${fullMessage}`, "_blank");
    }

    setIsProcessing(false);
    toast({ title: "Order Processed!", description: "WhatsApp opened to finalize your order." });
  };

  if (!mounted) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative border-primary/20 hover:bg-secondary">
          <ShoppingCart className="w-5 h-5 text-primary" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <Tabs defaultValue="cart" className="flex flex-col h-full">
          <div className="px-6 pt-6">
            <SheetHeader className="mb-4">
              <SheetTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" /> Checkout
              </SheetTitle>
            </SheetHeader>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="cart" className="gap-2"><ShoppingCart className="w-4 h-4" /> My Cart</TabsTrigger>
              <TabsTrigger value="history" className="gap-2"><History className="w-4 h-4" /> History</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="cart" className="flex-grow flex flex-col overflow-hidden m-0">
            {cart.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center space-y-4 opacity-40">
                <ShoppingCart className="w-16 h-16" />
                <p className="font-bold">Your cart is empty</p>
                <Button variant="outline" asChild className="rounded-xl mt-4">
                  <Link href="/#menu">Browse Menu</Link>
                </Button>
              </div>
            ) : (
              <>
                <ScrollArea className="flex-grow px-6">
                  <div className="space-y-6 pb-6">
                    {(!user || user.isAnonymous) && (
                      <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex items-center justify-between">
                        <div className="text-xs">
                          <p className="font-black text-primary">Returning customer?</p>
                          <p className="text-muted-foreground">Log in to see your order history.</p>
                        </div>
                        <Button variant="outline" size="sm" asChild className="rounded-xl border-primary text-primary">
                          <Link href="/login"><LogIn className="w-4 h-4 mr-1" /> Login</Link>
                        </Button>
                      </div>
                    )}

                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2"><User className="w-3.5 h-3.5" /> Recipient Details</h3>
                      <div className="grid gap-3">
                        <div className="space-y-1">
                          <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                          <Input placeholder="Enter your name" value={customerInfo.name} onChange={(e) => updateCustomerInfo({ name: e.target.value })} className="rounded-xl h-11" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mobile Number (WhatsApp)</Label>
                          <Input type="tel" placeholder="e.g. 9876543210" value={customerInfo.mobile} onChange={(e) => updateCustomerInfo({ mobile: e.target.value })} className="rounded-xl h-11" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Delivery Address</Label>
                          <Input placeholder="Enter full address" value={customerInfo.address} onChange={(e) => updateCustomerInfo({ address: e.target.value })} className="rounded-xl h-11" />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2"><CreditCard className="w-3.5 h-3.5" /> Payment Option</h3>
                      <RadioGroup value={customerInfo.paymentMethod} onValueChange={(val) => updateCustomerInfo({ paymentMethod: val as any })} className="grid grid-cols-2 gap-3">
                        <Label htmlFor="cod" className="flex items-center justify-center gap-2 rounded-xl border p-4 cursor-pointer hover:bg-muted/50 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 transition-all">
                          <RadioGroupItem value="cod" id="cod" className="sr-only" />
                          <Wallet className="w-4 h-4" /> <span className="text-xs font-bold">COD</span>
                        </Label>
                        <Label htmlFor="upi" className="flex items-center justify-center gap-2 rounded-xl border p-4 cursor-pointer hover:bg-muted/50 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 transition-all">
                          <RadioGroupItem value="upi" id="upi" className="sr-only" />
                          <Send className="w-4 h-4" /> <span className="text-xs font-bold">UPI</span>
                        </Label>
                      </RadioGroup>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex justify-between items-center"><h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Your Selection</h3><Button variant="ghost" size="sm" onClick={clearCart} className="text-[10px] text-destructive uppercase font-black">Clear All</Button></div>
                      {cart.map((item) => (
                        <div key={`${item.id}-${item.variant}`} className="flex gap-4 bg-muted/20 p-4 rounded-2xl border border-primary/5 group">
                          <div className="flex-grow space-y-1">
                            <h4 className="font-bold text-sm">{item.name} {item.variant && <span className="text-[10px] text-muted-foreground">({item.variant})</span>}</h4>
                            <p className="text-xs text-primary font-black">Rs.{item.price * item.quantity}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg hover:bg-primary hover:text-white" onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}><Minus className="h-3 w-3" /></Button>
                              <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                              <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg hover:bg-primary hover:text-white" onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}><Plus className="h-3 w-3" /></Button>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeFromCart(item.id, item.variant)}><Trash2 className="h-4 h-4" /></Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
                <div className="p-6 bg-white border-t space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Grand Total</span>
                    <span className="text-2xl font-black text-primary">Rs.{totalPrice}</span>
                  </div>
                  <Button onClick={handleWhatsAppOrder} disabled={isProcessing} className="w-full h-14 bg-primary text-lg font-black rounded-xl shadow-xl shadow-primary/20">
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Place WhatsApp Order <Send className="ml-2 w-4 h-4" /></>}
                  </Button>
                  <p className="text-[9px] text-center text-muted-foreground font-medium">By placing an order, you agree to our Terms of Service.</p>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="history" className="flex-grow flex flex-col overflow-hidden m-0">
            <ScrollArea className="flex-grow px-6">
              {isHistoryLoading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Loading history...</p>
                </div>
              ) : orderHistory && orderHistory.length > 0 ? (
                <div className="space-y-4 py-4">
                  <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 mb-2">
                    <p className="text-[10px] font-black uppercase text-primary mb-1">Loyalty Perk</p>
                    <p className="text-xs text-muted-foreground">Every plate counts towards a free Classic Steam plate!</p>
                  </div>
                  {orderHistory.map((order: any) => (
                    <div key={order.id} className="p-5 rounded-2xl border border-primary/10 bg-white shadow-sm hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-[10px] font-black uppercase text-primary tracking-tighter">{order.id}</p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5"><Calendar className="w-3 h-3" /> {order.orderDate?.toDate ? new Date(order.orderDate.toDate()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Processing...'}</p>
                        </div>
                        <span className="text-sm font-black text-primary">Rs.{order.totalAmount}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted text-[9px] font-black uppercase">{order.status}</div>
                        <div className="flex items-center gap-1 text-[9px] font-black uppercase text-muted-foreground">
                          <CreditCard className="w-3 h-3" /> {order.paymentMethod}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-8 text-center">
                    <p className="text-[10px] font-black uppercase text-muted-foreground opacity-30">End of History</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4 opacity-40 h-64 text-center">
                  <div className="bg-muted p-6 rounded-full">
                    {user?.isAnonymous ? <LogIn className="w-12 h-12" /> : <History className="w-12 h-12" />}
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-widest">{user?.isAnonymous ? "Login to see history" : "No orders found"}</p>
                    <p className="text-[10px] mt-1">{user?.isAnonymous ? "Guest sessions don't store history." : "Start your snack journey today!"}</p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}