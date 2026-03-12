"use client";

import { useCart } from "@/context/cart-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Trash2, Send, User, MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export function CartSheet() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, customerInfo, updateCustomerInfo, clearCart } = useCart();
  const { toast } = useToast();

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;
    
    if (!customerInfo.name.trim() || !customerInfo.address.trim()) {
      toast({
        title: "Missing Details",
        description: "Please enter your name and delivery address.",
        variant: "destructive",
      });
      return;
    }

    const shopNumber = "918850859140";
    
    // Professional Message Formatting
    const header = "*🍔 NEW ORDER - MEOW MOMO*%0A";
    const separator = "--------------------------%0A";
    const customerSection = `*Customer Details:*%0A👤 Name: ${customerInfo.name}%0A📍 Address: ${customerInfo.address}%0A%0A`;
    
    const itemsSection = "*Order Items:*%0A" + cart
      .map(item => {
        const variantText = item.variant ? ` (${item.variant})` : "";
        return `• ${item.name}${variantText} x ${item.quantity}: ₹${item.price * item.quantity}`;
      })
      .join("%0A") + "%0A%0A";
    
    const summarySection = `*Order Summary:*%0A📦 Total Items: ${totalItems}%0A💰 *Grand Total: ₹${totalPrice}*%0A`;
    const footer = "--------------------------%0A_Sent via Meow Momo Web App_";

    const fullMessage = header + separator + customerSection + itemsSection + summarySection + footer;

    window.open(`https://wa.me/${shopNumber}?text=${fullMessage}`, "_blank");

    // Clear cart after a short delay to allow the window to open
    setTimeout(() => {
      clearCart();
      toast({
        title: "Order Initiated!",
        description: "Your cart has been cleared. Thank you for ordering!",
      });
    }, 1000);
  };

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
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" /> Your Cart
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center space-y-4 opacity-50">
            <ShoppingCart className="w-16 h-16" />
            <p className="text-lg font-medium">Your cart is empty</p>
            <p className="text-sm text-center px-8">Add some delicious momos to get started!</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-grow pr-4 -mr-4 mt-6">
              <div className="space-y-6">
                <div className="space-y-4 pb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <User className="w-4 h-4" /> Delivery Details
                  </h3>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name" className="text-xs">Your Name</Label>
                      <Input 
                        id="name" 
                        placeholder="e.g. Rahul Sharma" 
                        value={customerInfo.name}
                        onChange={(e) => updateCustomerInfo({ name: e.target.value })}
                        className="h-10"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address" className="text-xs">Full Address</Label>
                      <Input 
                        id="address" 
                        placeholder="e.g. Bldg 4, Apt 201, Kurar Village..." 
                        value={customerInfo.address}
                        onChange={(e) => updateCustomerInfo({ address: e.target.value })}
                        className="h-10"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Order Items</h3>
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.variant}`} className="flex gap-4">
                      <div className="flex-grow space-y-1">
                        <h4 className="font-bold text-sm leading-none">
                          {item.name}
                          {item.variant && <span className="ml-2 text-xs font-normal text-muted-foreground">({item.variant})</span>}
                        </h4>
                        <p className="text-xs text-muted-foreground">₹{item.price} each</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7 rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7 rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="font-bold text-sm text-primary">₹{item.price * item.quantity}</p>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => removeFromCart(item.id, item.variant)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>

            <div className="space-y-4 mt-auto pt-6 border-t">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{totalPrice}</span>
                </div>
              </div>
              <Button onClick={handleWhatsAppOrder} className="w-full h-14 bg-primary text-lg font-bold shadow-lg shadow-primary/20">
                Order via WhatsApp <Send className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}