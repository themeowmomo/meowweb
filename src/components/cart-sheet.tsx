'use client';

import { useState, useEffect } from "react";
import { useCart } from "@/context/cart-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Trash2, Send, User, MapPin, CreditCard, Wallet, Loader2, Package, ChevronRight, ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { placeholderImages as PlaceHolderImages } from "@/app/lib/placeholder-images.json";
import { cn } from "@/lib/utils";

const DEFAULT_IMAGE = PlaceHolderImages.find(img => img.id === "brand-logo")?.imageUrl || "https://picsum.photos/seed/momo/100/100";

export function CartSheet() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, customerInfo, updateCustomerInfo, clearCart, saveOrderToFirestore } = useCart();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      window.history.pushState({ sheetOpen: true }, '');
      const handlePopState = () => setIsOpen(false);
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [isOpen]);

  const handleWhatsAppOrder = async () => {
    if (cart.length === 0) return;
    if (!customerInfo.name.trim() || !customerInfo.address.trim()) {
      toast({ title: "Details Required", description: "Please fill in your name and delivery address.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    const orderId = await saveOrderToFirestore();
    const shopNumber = "918850859140";
    
    const header = "*NEW MOMO ORDER*%0A";
    const separator = "--------------------------%0A";
    const customerSection = `*Recipient Details*%0AName: ${customerInfo.name}%0AAddress: ${customerInfo.address}%0A${orderId ? `Order ID: ${orderId}%0A` : ""}`;
    const itemsSection = "%0A*Items Selection*%0A" + cart.map(item => `- ${item.name} (5 Pieces) x ${item.quantity}: Rs.${item.price * item.quantity}`).join("%0A") + "%0A";
    const paymentText = customerInfo.paymentMethod === 'upi' ? "Digital UPI" : "Cash on Delivery";
    const summarySection = `%0A*Summary*%0APayment: ${paymentText}%0A*Total: Rs.${totalPrice}*%0A`;
    const footer = "--------------------------%0A_Sent via Meow Momo App_";

    const fullMessage = header + separator + customerSection + itemsSection + summarySection + footer;

    if (customerInfo.paymentMethod === 'upi') {
      const upiUrl = `upi://pay?pa=amitjaisawal0123-2@okhdfcbank&pn=Meow%20Momo&am=${totalPrice}&cu=INR&tn=Order-${orderId || 'Momo'}`;
      window.location.href = upiUrl;
      setTimeout(() => { window.open(`https://wa.me/${shopNumber}?text=${fullMessage}`, "_blank"); }, 3500);
    } else {
      window.open(`https://wa.me/${shopNumber}?text=${fullMessage}`, "_blank");
    }
    setIsProcessing(false);
  };

  if (!mounted) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {totalItems > 0 && !isOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-full px-4 sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
          <SheetTrigger asChild>
            <Button className="w-full sm:w-[320px] h-14 bg-foreground text-white rounded-full shadow-2xl flex items-center justify-between px-2 group hover:bg-foreground/95 border-none">
              <div className="flex flex-col text-left pl-4">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none mb-1">{totalItems} Portions</p>
                <p className="text-base font-black tracking-tight">₹{totalPrice}</p>
              </div>
              <div className="flex items-center gap-2 bg-primary px-5 h-10 rounded-full transition-all duration-300">
                <span className="text-[10px] font-black uppercase tracking-widest">Basket</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Button>
          </SheetTrigger>
        </div>
      )}

      <SheetContent 
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-full sm:max-w-md flex flex-col p-0 border-none rounded-t-[2.5rem] sm:rounded-l-[2.5rem] overflow-hidden shadow-2xl"
      >
        <div className="px-6 pt-10 pb-4 border-b bg-white">
          <SheetHeader className="text-left">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl"><ShoppingCart className="w-6 h-6 text-primary" /></div>
              <div>
                <SheetTitle className="text-2xl font-black tracking-tighter text-foreground">Your Basket</SheetTitle>
                <SheetDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Confirm & Order via WhatsApp</SheetDescription>
              </div>
            </div>
          </SheetHeader>
        </div>

        <ScrollArea className="flex-grow px-6">
          <div className="py-6 space-y-8">
            {/* Items */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order Items</h3>
                <Button variant="ghost" size="sm" onClick={clearCart} className="text-[9px] text-destructive uppercase font-black h-7 px-2">Clear All</Button>
              </div>
              <div className="space-y-3">
                {cart.length === 0 ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                      <Package className="w-8 h-8 text-muted-foreground/40" />
                    </div>
                    <p className="text-sm font-bold text-muted-foreground">Your basket is empty!</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-3 bg-muted/20 p-3 rounded-2xl group transition-all hover:bg-white hover:shadow-md border border-transparent hover:border-primary/5">
                      <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-white shadow-inner">
                        <Image src={item.image || DEFAULT_IMAGE} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-grow flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-sm text-foreground leading-tight">{item.name}</h4>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-6 w-6 -mt-1 -mr-1" onClick={() => removeFromCart(item.id, item.variant)}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm font-black text-primary">₹{item.price * item.quantity}</p>
                          <div className="flex items-center gap-2 bg-white rounded-lg border px-1.5 py-0.5">
                            <button className="text-primary hover:bg-primary/5 rounded h-5 w-5 flex items-center justify-center" onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}><Minus className="h-3 w-3" /></button>
                            <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                            <button className="text-primary hover:bg-primary/5 rounded h-5 w-5 flex items-center justify-center" onClick={() => updateQuantity(item.id, quantity + 1, item.variant)}><Plus className="h-3 w-3" /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {cart.length > 0 && (
              <>
                <Separator className="bg-muted/30" />
                <div className="space-y-5">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" /> Recipient Details
                  </h3>
                  <div className="grid gap-3">
                    <div className="space-y-1">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                      <Input placeholder="E.g. Rohan Sawant" value={customerInfo.name} onChange={(e) => updateCustomerInfo({ name: e.target.value })} className="rounded-xl h-12 border-muted/50 focus:border-primary text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Delivery Address</Label>
                      <Input placeholder="Flat, Building, Landmark" value={customerInfo.address} onChange={(e) => updateCustomerInfo({ address: e.target.value })} className="rounded-xl h-12 border-muted/50 focus:border-primary text-sm" />
                    </div>
                  </div>
                </div>

                <Separator className="bg-muted/30" />

                <div className="space-y-4 pb-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" /> Payment Method
                  </h3>
                  <RadioGroup value={customerInfo.paymentMethod} onValueChange={(val) => updateCustomerInfo({ paymentMethod: val as any })} className="grid grid-cols-2 gap-3">
                    <Label 
                      htmlFor="cod" 
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 rounded-xl border p-4 cursor-pointer transition-all",
                        customerInfo.paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-muted/50 bg-white'
                      )}
                    >
                      <RadioGroupItem value="cod" id="cod" className="sr-only" />
                      <Wallet className={cn("w-5 h-5", customerInfo.paymentMethod === 'cod' ? 'text-primary' : 'text-muted-foreground')} /> 
                      <span className="text-[9px] font-black uppercase tracking-widest">Cash</span>
                    </Label>
                    <Label 
                      htmlFor="upi" 
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 rounded-xl border p-4 cursor-pointer transition-all",
                        customerInfo.paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-muted/50 bg-white'
                      )}
                    >
                      <RadioGroupItem value="upi" id="upi" className="sr-only" />
                      <Send className={cn("w-5 h-5", customerInfo.paymentMethod === 'upi' ? 'text-primary' : 'text-muted-foreground')} /> 
                      <span className="text-[9px] font-black uppercase tracking-widest">UPI</span>
                    </Label>
                  </RadioGroup>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        {cart.length > 0 && (
          <div className="p-6 bg-white border-t shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Grand Total</p>
                <span className="text-3xl font-black text-primary tracking-tighter">₹{totalPrice}</span>
              </div>
              <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest">Incl. of all taxes</p>
            </div>
            <Button onClick={handleWhatsAppOrder} disabled={isProcessing} className="w-full h-14 bg-primary text-base font-black rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Complete Order <Send className="ml-2 w-4 h-4" /></>}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
