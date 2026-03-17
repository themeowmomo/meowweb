
'use client';

import { useState, useEffect } from "react";
import { useCart } from "@/context/cart-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Trash2, Send, User, MapPin, CreditCard, Wallet, Loader2, Package } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

export function CartSheet() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, customerInfo, updateCustomerInfo, clearCart, saveOrderToFirestore } = useCart();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getShortItemName = (name: string, variant?: string) => {
    // Map full names to very short codes to fit in UPI transaction note
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
    
    // Attempt to save order record in Firestore
    const orderId = await saveOrderToFirestore();
    const shopNumber = "918850859140";
    
    const header = "*NEW MOMO ORDER*%0A";
    const separator = "--------------------------%0A";
    const customerSection = `*Recipient Details*%0AName: ${customerInfo.name}%0AAddress: ${customerInfo.address}%0A${orderId ? `Order ID: ${orderId}%0A` : ""}`;
    
    const itemsSection = "%0A*Items Selection*%0A" + cart
      .map(item => `- ${item.name}${item.variant ? ` (${item.variant})` : ""} x ${item.quantity}: Rs.${item.price * item.quantity}`)
      .join("%0A") + "%0A";
    
    const paymentText = customerInfo.paymentMethod === 'upi' ? "Digital UPI" : "Cash on Delivery";
    const summarySection = `%0A*Summary*%0APayment: ${paymentText}%0A*Total: Rs.${totalPrice}*%0A`;
    const footer = "--------------------------%0A_Sent via Meow Momo Web App_";

    const fullMessage = header + separator + customerSection + itemsSection + summarySection + footer;

    if (customerInfo.paymentMethod === 'upi') {
      // Create a short summary for the UPI transaction note: e.g. "1xCV-St,2xPn-Fr"
      // Pure item string as requested by user
      const upiNote = encodeURIComponent(cart.map(item => `${item.quantity}x${getShortItemName(item.name, item.variant)}`).join(',').slice(0, 50));
      
      const upiUrl = `upi://pay?pa=amitjaisawal0123-2@okhdfcbank&pn=Meow%20Momo&am=${totalPrice}&cu=INR&tn=${upiNote}`;
      
      window.location.href = upiUrl;
      
      // Delay WhatsApp to allow UPI app to open
      setTimeout(() => {
        window.open(`https://wa.me/${shopNumber}?text=${fullMessage}`, "_blank");
      }, 3500);
    } else {
      window.open(`https://wa.me/${shopNumber}?text=${fullMessage}`, "_blank");
    }

    setIsProcessing(false);
    toast({ title: "Order Ready", description: "WhatsApp is opening to finalize your snack!" });
  };

  if (!mounted) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative border-primary/20 bg-white hover:bg-secondary">
          <ShoppingCart className="w-5 h-5 text-primary" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l-0 sm:border-l">
        <div className="px-6 pt-8 pb-4 border-b">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 font-black tracking-tighter text-2xl">
              <Package className="w-6 h-6 text-primary" /> Checkout
            </SheetTitle>
          </SheetHeader>
        </div>

        <ScrollArea className="flex-grow px-6">
          <div className="py-6 space-y-8">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                <ShoppingCart className="w-16 h-16 mb-4" />
                <p className="font-black uppercase tracking-widest text-xs">Your bag is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> Delivery Information
                  </h3>
                  <div className="grid gap-3">
                    <div className="space-y-1">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                      <Input placeholder="Enter your name" value={customerInfo.name} onChange={(e) => updateCustomerInfo({ name: e.target.value })} className="rounded-xl h-11" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Address</Label>
                      <Input placeholder="Flat/House, Building, Landmark" value={customerInfo.address} onChange={(e) => updateCustomerInfo({ address: e.target.value })} className="rounded-xl h-11" />
                    </div>
                  </div>
                </div>

                <Separator className="bg-muted/50" />

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5" /> Preferred Payment
                  </h3>
                  <RadioGroup value={customerInfo.paymentMethod} onValueChange={(val) => updateCustomerInfo({ paymentMethod: val as any })} className="grid grid-cols-2 gap-3">
                    <Label htmlFor="cod" className="flex items-center justify-center gap-2 rounded-xl border p-4 cursor-pointer hover:bg-muted/30 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 transition-all">
                      <RadioGroupItem value="cod" id="cod" className="sr-only" />
                      <Wallet className="w-4 h-4" /> <span className="text-xs font-black uppercase tracking-widest">COD</span>
                    </Label>
                    <Label htmlFor="upi" className="flex items-center justify-center gap-2 rounded-xl border p-4 cursor-pointer hover:bg-muted/30 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 transition-all">
                      <RadioGroupItem value="upi" id="upi" className="sr-only" />
                      <Send className="w-4 h-4" /> <span className="text-xs font-black uppercase tracking-widest">UPI</span>
                    </Label>
                  </RadioGroup>
                </div>

                <Separator className="bg-muted/50" />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Selection Summary</h3>
                    <Button variant="ghost" size="sm" onClick={clearCart} className="text-[9px] text-destructive uppercase font-black hover:bg-destructive/10">Clear Bag</Button>
                  </div>
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={`${item.id}-${item.variant}`} className="flex gap-4 bg-muted/20 p-4 rounded-2xl border border-primary/5 group">
                        <div className="flex-grow space-y-1">
                          <h4 className="font-bold text-sm tracking-tight">{item.name} {item.variant && <span className="text-[10px] text-muted-foreground">({item.variant})</span>}</h4>
                          <p className="text-xs text-primary font-black">Rs.{item.price * item.quantity}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg hover:bg-primary hover:text-white" onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}><Minus className="h-3 w-3" /></Button>
                            <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                            <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg hover:bg-primary hover:text-white" onClick={() => updateQuantity(item.id, quantity + 1, item.variant)}><Plus className="h-3 w-3" /></Button>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeFromCart(item.id, item.variant)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        {cart.length > 0 && (
          <div className="p-6 bg-white border-t space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Order Total</span>
              <span className="text-2xl font-black text-primary">Rs.{totalPrice}</span>
            </div>
            <Button onClick={handleWhatsAppOrder} disabled={isProcessing} className="w-full h-14 bg-primary text-lg font-black rounded-xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98]">
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Confirm Order <Send className="ml-2 w-4 h-4" /></>}
            </Button>
            <p className="text-[9px] text-center text-muted-foreground font-medium uppercase tracking-widest">Open 4:00 PM – 10:30 PM Daily</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
