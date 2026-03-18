
'use client';

import { useState, useEffect } from "react";
import { useCart } from "@/context/cart-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Trash2, Send, User, MapPin, CreditCard, Wallet, Loader2, Package, ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function CartSheet() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, customerInfo, updateCustomerInfo, clearCart, saveOrderToFirestore } = useCart();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Professional short-codes for UPI transaction notes
  const getShortItemName = (name: string, variant?: string) => {
    const shortName = name
      .replace(/Classic/gi, 'C')
      .replace(/Veg/gi, 'V')
      .replace(/Paneer/gi, 'Pn')
      .replace(/Cheese/gi, 'Ch')
      .replace(/Kurkure/gi, 'Kk')
      .replace(/Jain/gi, 'Jn')
      .replace(/Fries/gi, 'Fs')
      .replace(/Meal/gi, 'Ml')
      .replace(/\s+/g, '');
    
    let vCode = '';
    if (variant) {
      vCode = '-' + variant
        .replace(/Steam/gi, 'St')
        .replace(/Fried/gi, 'Fr')
        .replace(/PCS/gi, '')
        .replace(/Half/gi, 'H')
        .replace(/Full/gi, 'F')
        .replace(/Combo/gi, 'Cb')
        .trim();
    }
    
    return shortName + vCode;
  };

  const handleWhatsAppOrder = async () => {
    if (cart.length === 0) return;
    
    if (!customerInfo.name.trim() || !customerInfo.address.trim()) {
      toast({
        title: "Details Required",
        description: "Please fill in your name and delivery address.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    const orderId = await saveOrderToFirestore();
    const shopNumber = "918850859140";
    
    const header = "*NEW MOMO ORDER*%0A";
    const separator = "--------------------------%0A";
    const customerSection = `*Recipient Details*%0AName: ${customerInfo.name}%0AAddress: ${customerInfo.address}%0A${orderId ? `Order ID: ${orderId}%0A` : ""}`;
    const itemsSection = "%0A*Items Selection*%0A" + cart.map(item => `- ${item.name}${item.variant ? ` (${item.variant})` : ""} x ${item.quantity}: Rs.${item.price * item.quantity}`).join("%0A") + "%0A";
    const paymentText = customerInfo.paymentMethod === 'upi' ? "Digital UPI" : "Cash on Delivery";
    const summarySection = `%0A*Summary*%0APayment: ${paymentText}%0A*Total: Rs.${totalPrice}*%0A`;
    const footer = "--------------------------%0A_Sent via Meow Momo Web App_";

    const fullMessage = header + separator + customerSection + itemsSection + summarySection + footer;

    if (customerInfo.paymentMethod === 'upi') {
      // Strictly item codes for transaction note: 1xCV-St, 2xPn-Fr
      const upiNote = cart.map(item => `${item.quantity}x${getShortItemName(item.name, item.variant)}`).join(',').slice(0, 50);
      const upiUrl = `upi://pay?pa=amitjaisawal0123-2@okhdfcbank&pn=Meow%20Momo&am=${totalPrice}&cu=INR&tn=${encodeURIComponent(upiNote)}`;
      
      window.location.href = upiUrl;
      setTimeout(() => {
        window.open(`https://wa.me/${shopNumber}?text=${fullMessage}`, "_blank");
      }, 3500);
    } else {
      window.open(`https://wa.me/${shopNumber}?text=${fullMessage}`, "_blank");
    }

    setIsProcessing(false);
    toast({ title: "Order Ready", description: "Opening WhatsApp to finalize your snack!" });
  };

  if (!mounted) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        {totalItems > 0 ? (
          <div className="fixed bottom-6 left-4 right-4 z-[60] animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Button className="w-full max-w-2xl mx-auto h-16 bg-foreground text-white rounded-[1.5rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)] flex items-center justify-between px-8 group hover:bg-foreground/95 transition-all border-none ring-1 ring-white/10">
              <div className="flex items-center gap-5">
                <div className="bg-primary p-2.5 rounded-xl text-white shadow-lg">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Cart Total</p>
                  <p className="text-xl font-black tracking-tight">Rs.{totalPrice} <span className="text-xs opacity-40 ml-2 font-medium">({totalItems} Items)</span></p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 px-5 py-2.5 rounded-xl group-hover:bg-white/20 transition-all">
                <span className="text-[10px] font-black uppercase tracking-widest">Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="icon" className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-white border-primary/20 shadow-xl z-50 hover:bg-secondary">
            <ShoppingCart className="w-6 h-6 text-primary" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l-0 sm:border-l rounded-t-[3rem] sm:rounded-l-[3rem] overflow-hidden">
        <div className="px-8 pt-10 pb-6 border-b bg-muted/5">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-3 font-black tracking-tighter text-3xl text-foreground">
              <div className="bg-primary/10 p-2 rounded-xl"><Package className="w-7 h-7 text-primary" /></div>
              Finalize Order
            </SheetTitle>
          </SheetHeader>
        </div>

        <ScrollArea className="flex-grow px-8">
          <div className="py-8 space-y-10">
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2.5">
                <User className="w-4 h-4 text-primary" /> Recipient Profile
              </h3>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Full Name</Label>
                  <Input placeholder="E.g. Rohan Sawant" value={customerInfo.name} onChange={(e) => updateCustomerInfo({ name: e.target.value })} className="rounded-[1.25rem] h-14 border-muted/50 focus:border-primary px-5" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Delivery Landmark</Label>
                  <Input placeholder="Building name, Floor, House number" value={customerInfo.address} onChange={(e) => updateCustomerInfo({ address: e.target.value })} className="rounded-[1.25rem] h-14 border-muted/50 focus:border-primary px-5" />
                </div>
              </div>
            </div>

            <Separator className="bg-muted/30" />

            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-primary" /> Payment Method
              </h3>
              <RadioGroup value={customerInfo.paymentMethod} onValueChange={(val) => updateCustomerInfo({ paymentMethod: val as any })} className="grid grid-cols-2 gap-4">
                <Label htmlFor="cod" className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-6 cursor-pointer hover:bg-muted/20 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 transition-all">
                  <RadioGroupItem value="cod" id="cod" className="sr-only" />
                  <Wallet className="w-6 h-6 text-muted-foreground group-data-[state=checked]:text-primary" /> <span className="text-[10px] font-black uppercase tracking-widest">Cash / COD</span>
                </Label>
                <Label htmlFor="upi" className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-6 cursor-pointer hover:bg-muted/20 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 transition-all">
                  <RadioGroupItem value="upi" id="upi" className="sr-only" />
                  <Send className="w-6 h-6 text-muted-foreground group-data-[state=checked]:text-primary" /> <span className="text-[10px] font-black uppercase tracking-widest">UPI Digital</span>
                </Label>
              </RadioGroup>
            </div>

            <Separator className="bg-muted/30" />

            <div className="space-y-6 pb-10">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Order Basket</h3>
                <Button variant="ghost" size="sm" onClick={clearCart} className="text-[9px] text-destructive uppercase font-black hover:bg-destructive/10 px-3 h-8">Clear All</Button>
              </div>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.variant}`} className="flex gap-5 bg-muted/20 p-5 rounded-[1.5rem] border border-primary/5 group transition-all hover:bg-white hover:shadow-lg">
                    <div className="flex-grow space-y-2">
                      <h4 className="font-black text-sm tracking-tight uppercase text-foreground">{item.name} <span className="text-[10px] text-muted-foreground font-medium ml-1">({item.variant})</span></h4>
                      <p className="text-sm text-primary font-black">Rs.{item.price * item.quantity}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary hover:text-white border-primary/20" onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}><Minus className="h-3 w-3" /></Button>
                        <span className="text-xs font-black w-5 text-center">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary hover:text-white border-primary/20" onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}><Plus className="h-3 w-3" /></Button>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeFromCart(item.id, item.variant)}><Trash2 className="h-5 w-5" /></Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-8 bg-white border-t space-y-5 shadow-[0_-20px_40px_-10px_rgba(0,0,0,0.1)] relative z-10">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Total Payable</p>
              <span className="text-4xl font-black text-primary tracking-tighter">Rs.{totalPrice}</span>
            </div>
            <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mb-1 italic">Pure Veg Selection</p>
          </div>
          <Button onClick={handleWhatsAppOrder} disabled={isProcessing} className="w-full h-20 bg-primary text-xl font-black rounded-2xl shadow-2xl shadow-primary/30 transition-all active:scale-[0.97] hover:bg-primary/95">
            {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Complete Order on WhatsApp <Send className="ml-3 w-6 h-6" /></>}
          </Button>
          <div className="flex items-center justify-center gap-2">
             <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
             <p className="text-[9px] text-center text-muted-foreground font-bold uppercase tracking-widest">Verified Kitchen Operations Live</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
