'use client';

import { useState, useEffect } from "react";
import { useCart } from "@/context/cart-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Trash2, Send, User, MapPin, CreditCard, Wallet, Loader2, Package, ArrowRight, ChevronRight, ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { placeholderImages as PlaceHolderImages } from "@/app/lib/placeholder-images.json";

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
    const itemsSection = "%0A*Items Selection*%0A" + cart.map(item => `- ${item.name} (${item.variant}) x ${item.quantity}: Rs.${item.price * item.quantity}`).join("%0A") + "%0A";
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
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] w-full px-4 sm:px-0 sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
          <SheetTrigger asChild>
            <Button className="w-full sm:w-[350px] h-16 bg-foreground text-white rounded-[2rem] shadow-2xl flex items-center justify-between px-2 group hover:bg-foreground/95 border-none overflow-hidden">
              <div className="flex items-center gap-4 pl-4">
                <div className="flex flex-col text-left">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-40 leading-none mb-1">{totalItems} Items</p>
                  <p className="text-lg font-black tracking-tight">Rs. {totalPrice}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-primary px-6 h-12 rounded-[1.5rem] group-hover:px-8 transition-all duration-300">
                <span className="text-[10px] font-black uppercase tracking-widest">View Cart</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </Button>
          </SheetTrigger>
        </div>
      )}

      <SheetContent 
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-full sm:max-w-md flex flex-col p-0 border-none rounded-t-[3rem] sm:rounded-l-[3rem] overflow-hidden shadow-2xl"
      >
        <div className="px-8 pt-12 pb-6 border-b bg-muted/5">
          <SheetHeader className="relative">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="absolute -left-2 -top-2 rounded-full h-10 w-10 md:hidden bg-white shadow-sm border"><ArrowLeft className="w-5 h-5 text-primary" /></Button>
            <SheetTitle className="flex items-center gap-4 font-black tracking-tighter text-3xl text-foreground">
              <div className="bg-primary/10 p-2.5 rounded-2xl"><ShoppingCart className="w-7 h-7 text-primary" /></div>
              Your Basket
            </SheetTitle>
            <SheetDescription className="sr-only">Checkout summary.</SheetDescription>
          </SheetHeader>
        </div>

        <ScrollArea className="flex-grow px-8">
          <div className="py-8 space-y-10">
            {/* Items */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order Items</h3>
                <Button variant="ghost" size="sm" onClick={clearCart} className="text-[9px] text-destructive uppercase font-black px-3 h-8">Clear</Button>
              </div>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-muted/20 p-4 rounded-3xl group transition-all hover:bg-white hover:shadow-lg border border-transparent hover:border-primary/5">
                    <div className="relative h-16 w-16 shrink-0 rounded-2xl overflow-hidden shadow-inner bg-white">
                      <Image src={item.image || DEFAULT_IMAGE} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-grow space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 flex items-center justify-center border border-green-600 rounded-sm"><span className="h-1.5 w-1.5 rounded-full bg-green-600" /></span>
                        <h4 className="font-black text-[11px] uppercase text-foreground">{item.name}</h4>
                      </div>
                      <p className="text-[10px] text-primary font-black uppercase tracking-widest">₹{item.price * item.quantity}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg border-primary/20" onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}><Minus className="h-3 w-3" /></Button>
                        <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg border-primary/20" onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}><Plus className="h-3 w-3" /></Button>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => removeFromCart(item.id, item.variant)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-muted/30" />

            {/* Form */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2.5">
                <User className="w-4 h-4 text-primary" /> Delivery Info
              </h3>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Name</Label>
                  <Input placeholder="E.g. Rohan Sawant" value={customerInfo.name} onChange={(e) => updateCustomerInfo({ name: e.target.value })} className="rounded-2xl h-14 border-muted/50 focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Address</Label>
                  <Input placeholder="Building, Room, Landmark" value={customerInfo.address} onChange={(e) => updateCustomerInfo({ address: e.target.value })} className="rounded-2xl h-14 border-muted/50 focus:border-primary" />
                </div>
              </div>
            </div>

            <Separator className="bg-muted/30" />

            {/* Payment */}
            <div className="space-y-6 pb-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-primary" /> Payment
              </h3>
              <RadioGroup value={customerInfo.paymentMethod} onValueChange={(val) => updateCustomerInfo({ paymentMethod: val as any })} className="grid grid-cols-2 gap-4">
                <Label 
                  htmlFor="cod" 
                  className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-6 cursor-pointer transition-all ${customerInfo.paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-muted/50 bg-white hover:bg-muted/20'}`}
                >
                  <RadioGroupItem value="cod" id="cod" className="sr-only" />
                  <Wallet className={`w-6 h-6 ${customerInfo.paymentMethod === 'cod' ? 'text-primary' : 'text-muted-foreground'}`} /> 
                  <span className="text-[9px] font-black uppercase tracking-widest">Cash on Delivery</span>
                </Label>
                <Label 
                  htmlFor="upi" 
                  className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-6 cursor-pointer transition-all ${customerInfo.paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-muted/50 bg-white hover:bg-muted/20'}`}
                >
                  <RadioGroupItem value="upi" id="upi" className="sr-only" />
                  <Send className={`w-6 h-6 ${customerInfo.paymentMethod === 'upi' ? 'text-primary' : 'text-muted-foreground'}`} /> 
                  <span className="text-[9px] font-black uppercase tracking-widest">Pay via UPI</span>
                </Label>
              </RadioGroup>
            </div>
          </div>
        </ScrollArea>

        <div className="p-8 bg-white border-t space-y-4 shadow-2xl relative z-10">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Payable</p>
              <span className="text-4xl font-black text-primary tracking-tighter">Rs. {totalPrice}</span>
            </div>
            <div className="text-right">
               <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest">Inclusive of taxes</p>
            </div>
          </div>
          <Button onClick={handleWhatsAppOrder} disabled={isProcessing} className="w-full h-16 bg-primary text-lg font-black rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98]">
            {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Complete Order <Send className="ml-2 w-5 h-5" /></>}
          </Button>
          <Button variant="ghost" onClick={() => setIsOpen(false)} className="w-full h-10 font-black uppercase text-[9px] tracking-widest text-muted-foreground rounded-xl">Continue Shopping</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
