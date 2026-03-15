'use client';

import { useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, useAuth, useDoc } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, ShoppingCart, Image as ImageIcon, LogIn, ShieldAlert, Copy, Check } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { useToast } from '@/hooks/use-toast';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';

const RESTAURANT_ID = 'meow-momo';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('orders');
  const [copied, setCopied] = useState(false);

  // 1. Check if the user exists in the app_admins collection
  const adminDocRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'app_admins', user.uid);
  }, [db, user]);
  
  const { data: adminDoc, isLoading: isAdminDocLoading } = useDoc(adminDocRef);

  // 2. Fetch orders ONLY if we have confirmed the user is an admin
  const ordersQuery = useMemoFirebase(() => {
    if (!db || !user || !adminDoc) return null;
    return query(
      collection(db, 'restaurants', RESTAURANT_ID, 'orders'),
      orderBy('orderDate', 'desc')
    );
  }, [db, user, adminDoc]);
  
  const { data: orders, isLoading: isOrdersLoading } = useCollection(ordersQuery);

  const handleUpdatePhoto = (itemId: string, categoryId: string, newUrl: string) => {
    if (!db) return;
    const itemRef = doc(db, 'restaurants', RESTAURANT_ID, 'menuCategories', categoryId, 'menuItems', itemId);
    updateDocumentNonBlocking(itemRef, { imageUrl: newUrl });
    toast({ 
      title: "Update Initiated", 
      description: "The photo update has been sent to the server." 
    });
  };

  const copyUid = () => {
    if (user) {
      navigator.clipboard.writeText(user.uid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "UID Copied", description: "Now add this to your app_admins collection." });
    }
  };

  if (isUserLoading || isAdminDocLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // Not logged in at all
  if (!user) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-md w-full shadow-2xl rounded-[2rem] overflow-hidden">
            <div className="bg-primary p-8 text-white text-center">
              <ShieldAlert className="w-12 h-12 mx-auto mb-4" />
              <h1 className="text-2xl font-black">Admin Portal</h1>
            </div>
            <CardContent className="p-8 space-y-6 text-center">
              <p className="text-muted-foreground">Please sign in to access the Meow Momo management dashboard.</p>
              <Button onClick={() => initiateAnonymousSignIn(auth)} className="w-full h-14 text-lg font-bold rounded-xl bg-primary shadow-lg shadow-primary/20">
                <LogIn className="mr-2 w-5 h-5" /> Sign In as Admin
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Logged in but not in app_admins collection
  if (!adminDoc) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-lg w-full shadow-2xl rounded-[2rem] overflow-hidden border-2 border-destructive/20">
            <div className="bg-destructive p-8 text-white text-center">
              <ShieldAlert className="w-12 h-12 mx-auto mb-4" />
              <h1 className="text-2xl font-black">Access Denied</h1>
              <p className="text-destructive-foreground/80 mt-2 font-medium">Your account does not have admin privileges.</p>
            </div>
            <CardContent className="p-8 space-y-6 text-center">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  To access this page, you must add your User UID to the <strong>app_admins</strong> collection in the Firebase Console.
                </p>
                <div className="p-4 bg-muted rounded-xl border flex flex-col items-center gap-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Your User UID</p>
                  <code className="text-xs font-mono break-all bg-white px-3 py-2 rounded border w-full">{user.uid}</code>
                  <Button variant="outline" size="sm" onClick={copyUid} className="gap-2 font-bold h-10 w-full rounded-lg">
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied!" : "Copy UID"}
                  </Button>
                </div>
              </div>
              <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => auth.signOut()}>
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Authorized Admin UI
  return (
    <div className="min-h-screen bg-muted/10">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Shop Management</h1>
            <p className="text-muted-foreground font-medium">Manage your orders and menu in real-time.</p>
          </div>
          <Badge variant="secondary" className="px-4 py-2 rounded-full text-primary font-bold border-primary/10">
            Verified Admin
          </Badge>
        </div>

        <Tabs defaultValue="orders" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="bg-white p-1 h-14 rounded-2xl border shadow-sm grid grid-cols-2 w-full max-w-md mx-auto md:mx-0">
            <TabsTrigger value="orders" className="rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
              <ShoppingCart className="w-4 h-4 mr-2" /> Orders
            </TabsTrigger>
            <TabsTrigger value="menu" className="rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
              <ImageIcon className="w-4 h-4 mr-2" /> Menu Photos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-white border-b p-8">
                <CardTitle className="text-xl font-black">Recent Orders</CardTitle>
                <CardDescription>Track and manage customer requests.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {isOrdersLoading ? (
                  <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>
                ) : !orders || orders.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground font-medium italic">No orders found yet.</div>
                ) : (
                  <ScrollArea className="h-[600px]">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead className="font-bold">Date</TableHead>
                          <TableHead className="font-bold">Customer</TableHead>
                          <TableHead className="font-bold">Contact</TableHead>
                          <TableHead className="font-bold text-right">Amount</TableHead>
                          <TableHead className="font-bold">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order: any) => (
                          <TableRow key={order.id} className="hover:bg-muted/20">
                            <TableCell className="font-medium">
                              {order.orderDate?.toDate ? order.orderDate.toDate().toLocaleString() : new Date(order.orderDate).toLocaleString()}
                            </TableCell>
                            <TableCell className="font-bold">{order.customerName}</TableCell>
                            <TableCell className="text-muted-foreground">{order.customerContact}</TableCell>
                            <TableCell className="text-right font-black text-primary">Rs.{order.totalAmount}</TableCell>
                            <TableCell>
                              <Badge className={order.status === 'Completed' ? 'bg-green-500' : 'bg-orange-500'}>
                                {order.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="rounded-[2rem] shadow-lg border-2 border-primary/10 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <ImageIcon /> Category Images
                  </CardTitle>
                  <CardDescription>Update the photos for your main categories.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-xl space-y-4 border">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Classic Momos</p>
                    <Input placeholder="New Image URL..." className="rounded-lg h-10 bg-white" id="classic-img-url" />
                    <Button 
                      className="w-full bg-primary font-bold shadow-lg shadow-primary/20"
                      onClick={() => {
                        const url = (document.getElementById('classic-img-url') as HTMLInputElement).value;
                        if(url) handleUpdatePhoto('c1', 'classic-veg', url);
                      }}
                    >
                      Update Photo
                    </Button>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-xl space-y-4 border">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Paneer Momos</p>
                    <Input placeholder="New Image URL..." className="rounded-lg h-10 bg-white" id="paneer-img-url" />
                    <Button 
                      className="w-full bg-primary font-bold shadow-lg shadow-primary/20"
                      onClick={() => {
                        const url = (document.getElementById('paneer-img-url') as HTMLInputElement).value;
                        if(url) handleUpdatePhoto('p1', 'paneer-special', url);
                      }}
                    >
                      Update Photo
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-1 md:col-span-2 rounded-[2rem] shadow-lg bg-foreground text-white border-none">
                <CardHeader>
                  <CardTitle>Admin Dashboard Info</CardTitle>
                  <CardDescription className="text-white/60">Global Statistics for Meow Momo.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
                      <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1">Total Lifetime Orders</p>
                      <p className="text-4xl font-black">{orders?.length || 0}</p>
                    </div>
                    <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
                      <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1">Operating Location</p>
                      <p className="text-xl font-black">Malad East, Mumbai</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
