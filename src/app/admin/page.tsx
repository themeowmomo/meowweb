'use client';

import { useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, useAuth, useDoc } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, ShoppingCart, Image as ImageIcon, LogIn, ShieldAlert, Copy, Check, Lock, Mail } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { useToast } from '@/hooks/use-toast';
import { initiateEmailSignIn } from '@/firebase/non-blocking-login';

const RESTAURANT_ID = 'meow-momo';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('orders');
  const [copied, setCopied] = useState(false);
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Required Fields",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
      return;
    }
    setIsLoggingIn(true);
    initiateEmailSignIn(auth, email, password);
    // Note: Success/Failure will be reflected by the useUser hook and FirebaseErrorListener
    setTimeout(() => setIsLoggingIn(false), 2000); 
  };

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
          <Card className="max-w-md w-full shadow-2xl rounded-[2.5rem] overflow-hidden border-none">
            <div className="bg-primary p-10 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <ShieldAlert className="w-14 h-14 mx-auto mb-4" />
              <h1 className="text-3xl font-black tracking-tight">Admin Portal</h1>
              <p className="text-primary-foreground/80 mt-2 font-medium">Authorized Access Only</p>
            </div>
            <CardContent className="p-8 pt-10">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Admin Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="admin@meowmomo.com" 
                      className="pl-10 h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-primary"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10 h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-primary"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoggingIn}
                  className="w-full h-14 text-lg font-black rounded-2xl bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {isLoggingIn ? <Loader2 className="w-6 h-6 animate-spin" /> : <><LogIn className="mr-2 w-5 h-5" /> Sign In</>}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="pb-8 justify-center">
              <p className="text-xs text-muted-foreground font-medium italic">Contact main owner if you lost your credentials.</p>
            </CardFooter>
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
              <Button variant="ghost" className="w-full text-muted-foreground font-bold" onClick={() => auth.signOut()}>
                Sign Out & Try Again
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
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-4 py-2 rounded-full text-primary font-bold border-primary/10">
              Verified Admin: {user.email}
            </Badge>
            <Button variant="ghost" size="sm" className="font-bold text-muted-foreground hover:text-destructive" onClick={() => auth.signOut()}>
              Sign Out
            </Button>
          </div>
        </div>

        <Tabs defaultValue="orders" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="bg-white p-1 h-14 rounded-2xl border shadow-sm grid grid-cols-2 w-full max-w-md mx-auto md:mx-0">
            <TabsTrigger value="orders" className="rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              <ShoppingCart className="w-4 h-4 mr-2" /> Orders
            </TabsTrigger>
            <TabsTrigger value="menu" className="rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
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
                            <TableCell className="font-medium text-xs">
                              {order.orderDate?.toDate ? order.orderDate.toDate().toLocaleString() : new Date(order.orderDate).toLocaleString()}
                            </TableCell>
                            <TableCell className="font-black text-sm">{order.customerName}</TableCell>
                            <TableCell className="text-muted-foreground text-xs">{order.customerContact}</TableCell>
                            <TableCell className="text-right font-black text-primary">Rs.{order.totalAmount}</TableCell>
                            <TableCell>
                              <Badge className={cn(
                                "font-bold rounded-lg",
                                order.status === 'Completed' ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'
                              )}>
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
              <Card className="rounded-[2.5rem] shadow-lg border-none bg-white overflow-hidden">
                <CardHeader className="bg-primary/5 p-8">
                  <CardTitle className="flex items-center gap-2 text-primary font-black">
                    <ImageIcon className="w-6 h-6" /> Category Images
                  </CardTitle>
                  <CardDescription className="font-medium text-primary/60">Update the photos for your main categories.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="p-5 bg-muted/30 rounded-2xl space-y-4 border-2 border-dashed border-muted">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Classic Momos</p>
                      <Input placeholder="New Image URL..." className="rounded-xl h-11 bg-white border-none shadow-sm" id="classic-img-url" />
                      <Button 
                        className="w-full bg-primary font-black shadow-lg shadow-primary/20 rounded-xl h-11"
                        onClick={() => {
                          const url = (document.getElementById('classic-img-url') as HTMLInputElement).value;
                          if(url) handleUpdatePhoto('c1', 'classic-veg', url);
                        }}
                      >
                        Update Photo
                      </Button>
                    </div>
                    <div className="p-5 bg-muted/30 rounded-2xl space-y-4 border-2 border-dashed border-muted">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Paneer Momos</p>
                      <Input placeholder="New Image URL..." className="rounded-xl h-11 bg-white border-none shadow-sm" id="paneer-img-url" />
                      <Button 
                        className="w-full bg-primary font-black shadow-lg shadow-primary/20 rounded-xl h-11"
                        onClick={() => {
                          const url = (document.getElementById('paneer-img-url') as HTMLInputElement).value;
                          if(url) handleUpdatePhoto('p1', 'paneer-special', url);
                        }}
                      >
                        Update Photo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-1 md:col-span-2 rounded-[2.5rem] shadow-xl bg-foreground text-white border-none relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
                <CardHeader className="p-10">
                  <CardTitle className="text-2xl font-black tracking-tight">Shop Statistics</CardTitle>
                  <CardDescription className="text-white/40 font-medium">Real-time performance metrics for Meow Momo.</CardDescription>
                </CardHeader>
                <CardContent className="p-10 pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-inner group hover:bg-white/10 transition-all">
                      <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-2">Total Orders</p>
                      <p className="text-5xl font-black tracking-tighter group-hover:scale-110 transition-transform origin-left">{orders?.length || 0}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-inner group hover:bg-white/10 transition-all">
                      <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-2">Primary Hub</p>
                      <p className="text-2xl font-black tracking-tight group-hover:translate-x-1 transition-transform">Malad East, Mumbai</p>
                      <p className="text-xs text-white/40 mt-1">Kurar Village Branch</p>
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

// Helper for conditional classes
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
