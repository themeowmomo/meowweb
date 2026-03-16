
'use client';

import { useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, useAuth, useDoc, setDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, ShoppingCart, Image as ImageIcon, ShieldAlert, Copy, Check, Lock, Mail, LogOut, MapPin, Users, TrendingUp, Store } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { useToast } from '@/hooks/use-toast';
import { initiateEmailSignIn, initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { cn } from '@/lib/utils';

const RESTAURANT_ID = 'meow-momo';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Management state
  const [newAdminUid, setNewAdminUid] = useState('');

  // 1. Check if the user exists in the app_admins collection
  const adminDocRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'app_admins', user.uid);
  }, [db, user]);
  
  const { data: adminDoc, isLoading: isAdminDocLoading } = useDoc(adminDocRef);

  // 2. Fetch Restaurant Profile
  const profileRef = useMemoFirebase(() => {
    if (!db || !user || !adminDoc) return null;
    return doc(db, 'restaurants', RESTAURANT_ID);
  }, [db, user, adminDoc]);
  const { data: profile } = useDoc(profileRef);

  // 3. Fetch orders
  const ordersQuery = useMemoFirebase(() => {
    if (!db || !user || !adminDoc) return null;
    return query(
      collection(db, 'restaurants', RESTAURANT_ID, 'orders'),
      orderBy('orderDate', 'desc')
    );
  }, [db, user, adminDoc]);
  const { data: orders, isLoading: isOrdersLoading } = useCollection(ordersQuery);

  // 4. Fetch all admins
  const adminsQuery = useMemoFirebase(() => {
    if (!db || !user || !adminDoc) return null;
    return collection(db, 'app_admins');
  }, [db, user, adminDoc]);
  const { data: allAdmins, isLoading: isAdminsLoading } = useCollection(adminsQuery);

  // 5. Fetch Menu Categories
  const categoriesQuery = useMemoFirebase(() => {
    if (!db || !user || !adminDoc) return null;
    return collection(db, 'restaurants', RESTAURANT_ID, 'menuCategories');
  }, [db, user, adminDoc]);
  const { data: categories, isLoading: isCategoriesLoading } = useCollection(categoriesQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Required Fields",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    if (isRegisterMode) {
      initiateEmailSignUp(auth, email, password);
      toast({ title: "Account Registration", description: "Creating your admin account..." });
    } else {
      initiateEmailSignIn(auth, email, password);
      toast({ title: "Logging In", description: "Verifying credentials..." });
    }
    
    setTimeout(() => setIsSubmitting(false), 2000); 
  };

  const handleUpdateItemPhoto = (catId: string, itemId: string, newUrl: string) => {
    if (!db || !newUrl.trim()) return;
    const itemRef = doc(db, 'restaurants', RESTAURANT_ID, 'menuCategories', catId, 'menuItems', itemId);
    updateDocumentNonBlocking(itemRef, { imageUrl: newUrl });
    toast({ title: "Updated", description: "Menu item photo has been updated." });
  };

  const handleUpdateCategoryPhoto = (catId: string, newUrl: string) => {
    if (!db || !newUrl.trim()) return;
    const catRef = doc(db, 'restaurants', RESTAURANT_ID, 'menuCategories', catId);
    updateDocumentNonBlocking(catRef, { imageUrl: newUrl });
    toast({ title: "Updated", description: "Category icon has been updated." });
  };

  const handleUpdateProfilePhoto = (newUrl: string) => {
    if (!db || !newUrl.trim()) return;
    const profileRef = doc(db, 'restaurants', RESTAURANT_ID);
    updateDocumentNonBlocking(profileRef, { imageUrl: newUrl });
    toast({ title: "Updated", description: "Hero background has been updated." });
  };

  const handleAddTeamMember = () => {
    if (!db || !newAdminUid.trim()) return;
    const newAdminRef = doc(db, 'app_admins', newAdminUid.trim());
    setDocumentNonBlocking(newAdminRef, { 
      addedBy: user?.uid, 
      addedAt: new Date().toISOString() 
    }, { merge: true });
    
    toast({ title: "Staff Authorized", description: "UID added to admin pool." });
    setNewAdminUid('');
  };

  const copyUid = () => {
    if (user) {
      navigator.clipboard.writeText(user.uid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "UID Copied" });
    }
  };

  if (isUserLoading || isAdminDocLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/10">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-md w-full shadow-2xl rounded-[3rem] overflow-hidden border-none bg-white">
            <div className="bg-foreground p-12 text-white text-center">
              <ShieldAlert className="w-12 h-12 text-primary mx-auto mb-6" />
              <h1 className="text-3xl font-black tracking-tight mb-2">
                {isRegisterMode ? "Create Admin" : "Shop Login"}
              </h1>
              <p className="text-white/40 font-bold text-[10px] uppercase tracking-widest">Security Gate</p>
            </div>
            <CardContent className="p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email</Label>
                  <Input 
                    type="email" 
                    placeholder="admin@meowmomo.com" 
                    className="h-14 rounded-2xl bg-muted/30 border-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Password</Label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-14 rounded-2xl bg-muted/30 border-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-16 text-lg font-black rounded-2xl bg-primary shadow-xl"
                >
                  {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : isRegisterMode ? "Register Account" : "Sign In"}
                </Button>
              </form>
              <Button 
                variant="ghost" 
                className="w-full mt-6 text-xs font-black uppercase tracking-widest text-muted-foreground"
                onClick={() => setIsRegisterMode(!isRegisterMode)}
              >
                {isRegisterMode ? "Already have an account? Login" : "First time? Register here"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!adminDoc) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4 text-center">
          <Card className="max-w-2xl w-full shadow-2xl rounded-[3rem] overflow-hidden border-none bg-white p-12">
            <ShieldAlert className="w-16 h-16 mx-auto mb-4 text-destructive" />
            <h1 className="text-4xl font-black mb-4">Pending Approval</h1>
            <p className="text-muted-foreground mb-8">Copy your UID and add it to the 'app_admins' collection.</p>
            <div className="flex items-center gap-3 justify-center mb-8">
              <code className="text-sm font-mono bg-muted p-5 rounded-2xl border">{user.uid}</code>
              <Button variant="outline" size="icon" onClick={copyUid} className="h-16 w-16 rounded-2xl">
                {copied ? <Check className="w-6 h-6 text-green-500" /> : <Copy className="w-6 h-6 text-primary" />}
              </Button>
            </div>
            <Button variant="ghost" onClick={() => auth.signOut()}>Sign Out</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-foreground leading-none">Management</h1>
            <p className="text-muted-foreground font-medium mt-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Live Control Panel
            </p>
          </div>
          <Button variant="outline" className="h-14 px-8 rounded-2xl" onClick={() => auth.signOut()}>
            <LogOut className="mr-2 w-4 h-4" /> Sign Out
          </Button>
        </div>

        <Tabs defaultValue="orders" className="space-y-8">
          <TabsList className="bg-white p-2 h-20 rounded-[1.5rem] border shadow-sm grid grid-cols-4 w-full max-w-4xl">
            <TabsTrigger value="orders" className="rounded-xl font-black text-xs">Orders</TabsTrigger>
            <TabsTrigger value="menu" className="rounded-xl font-black text-xs">Menu Items</TabsTrigger>
            <TabsTrigger value="store" className="rounded-xl font-black text-xs">Storefront</TabsTrigger>
            <TabsTrigger value="team" className="rounded-xl font-black text-xs">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader className="bg-muted/30 h-16">
                    <TableRow>
                      <TableHead className="pl-12">Customer</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-center pr-12">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders?.map((order: any) => (
                      <TableRow key={order.id} className="h-24">
                        <TableCell className="pl-12 font-black">{order.customerName}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{order.deliveryAddress}</TableCell>
                        <TableCell className="text-right font-black text-primary">Rs.{order.totalAmount}</TableCell>
                        <TableCell className="text-center pr-12">
                          <Badge variant="secondary">{order.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="menu">
            <div className="space-y-12">
              {isCategoriesLoading ? <Loader2 className="animate-spin mx-auto" /> : categories?.map((cat: any) => (
                <div key={cat.id} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-black text-primary uppercase tracking-tight">{cat.name}</h2>
                    <div className="flex-grow border-t border-dashed" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <MenuItemList catId={cat.id} />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="store">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="rounded-[2.5rem] p-8 border-none bg-white shadow-sm">
                <Store className="w-10 h-10 text-primary mb-6" />
                <h3 className="text-2xl font-black mb-4">Hero Background</h3>
                <div className="space-y-4">
                  <div className="aspect-video relative rounded-2xl overflow-hidden bg-muted">
                    {profile?.imageUrl && <img src={profile.imageUrl} className="object-cover w-full h-full" />}
                  </div>
                  <Input 
                    placeholder="New Image URL..." 
                    className="h-12 rounded-xl"
                    defaultValue={profile?.imageUrl}
                    onBlur={(e) => handleUpdateProfilePhoto(e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">Auto-saves on blur</p>
                </div>
              </Card>

              <Card className="rounded-[2.5rem] p-8 border-none bg-white shadow-sm">
                <ImageIcon className="w-10 h-10 text-primary mb-6" />
                <h3 className="text-2xl font-black mb-4">Category Icons</h3>
                <div className="space-y-4">
                  {categories?.map((cat: any) => (
                    <div key={cat.id} className="flex items-center gap-4 p-4 bg-muted/20 rounded-2xl">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white">
                        <img src={cat.imageUrl} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <Label className="text-[10px] font-black uppercase mb-1 block">{cat.name}</Label>
                        <Input 
                          placeholder="Icon URL..." 
                          className="h-10 text-xs"
                          defaultValue={cat.imageUrl}
                          onBlur={(e) => handleUpdateCategoryPhoto(cat.id, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="team">
            <Card className="rounded-[3rem] border-none shadow-2xl bg-white p-12">
              <div className="flex flex-col md:flex-row justify-between gap-6 mb-12">
                <div>
                  <h2 className="text-3xl font-black">Authorized Team</h2>
                  <p className="text-muted-foreground">Manage who has access to this dashboard.</p>
                </div>
                <div className="flex gap-4">
                  <Input 
                    placeholder="Enter Staff UID..." 
                    className="h-14 w-80 rounded-2xl"
                    value={newAdminUid}
                    onChange={(e) => setNewAdminUid(e.target.value)}
                  />
                  <Button className="h-14 px-8 bg-primary font-black rounded-2xl" onClick={handleAddTeamMember}>
                    Add Member
                  </Button>
                </div>
              </div>
              <div className="grid gap-4">
                {allAdmins?.map((admin: any) => (
                  <div key={admin.id} className="flex items-center justify-between p-6 bg-muted/20 rounded-[1.5rem]">
                    <span className="font-mono text-sm font-bold">{admin.id}</span>
                    {admin.id === user.uid && <Badge className="bg-primary/20 text-primary border-none">YOU</Badge>}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function MenuItemList({ catId }: { catId: string }) {
  const db = useFirestore();
  const { toast } = useToast();
  const itemsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'restaurants', RESTAURANT_ID, 'menuCategories', catId, 'menuItems');
  }, [db, catId]);
  
  const { data: items, isLoading } = useCollection(itemsQuery);

  const updatePhoto = (itemId: string, newUrl: string) => {
    if (!db || !newUrl.trim()) return;
    const itemRef = doc(db, 'restaurants', RESTAURANT_ID, 'menuCategories', catId, 'menuItems', itemId);
    updateDocumentNonBlocking(itemRef, { imageUrl: newUrl });
    toast({ title: "Updated" });
  };

  if (isLoading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <>
      {items?.map((item: any) => (
        <Card key={item.id} className="rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border-none bg-white overflow-hidden group">
          <div className="h-40 relative bg-muted">
            {item.imageUrl && <img src={item.imageUrl} className="w-full h-full object-cover" />}
          </div>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-black text-lg truncate">{item.name}</h3>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-muted-foreground">Photo URL</Label>
              <Input 
                defaultValue={item.imageUrl}
                placeholder="Unsplash Link..." 
                className="h-10 rounded-xl bg-muted/30 border-none"
                onBlur={(e) => updatePhoto(item.id, e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
