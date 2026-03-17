'use client';

import { useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, useAuth, useDoc } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, ShoppingCart, ShieldAlert, Copy, Check, Lock, LogOut, Users, DollarSign, Activity } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { useToast } from '@/hooks/use-toast';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { cn } from '@/lib/utils';
import { signInWithEmailAndPassword } from 'firebase/auth';

const RESTAURANT_ID = 'meow-momo';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAdminUid, setNewAdminUid] = useState('');

  // 1. Get admin record for current user
  const adminDocRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'app_admins', user.uid);
  }, [db, user]);
  
  const { data: adminDoc, isLoading: isAdminDocLoading } = useDoc(adminDocRef);

  // 2. Query orders only if admin verified
  const ordersQuery = useMemoFirebase(() => {
    if (!db || !adminDoc) return null;
    return query(
      collection(db, 'restaurants', RESTAURANT_ID, 'orders'),
      orderBy('orderDate', 'desc')
    );
  }, [db, adminDoc]);
  
  const { data: orders, isLoading: isOrdersLoading } = useCollection(ordersQuery);

  // 3. Query staff members
  const adminsQuery = useMemoFirebase(() => {
    if (!db || !adminDoc) return null;
    return collection(db, 'app_admins');
  }, [db, adminDoc]);
  
  const { data: allAdmins, isLoading: isAdminsLoading } = useCollection(adminsQuery);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Welcome back", description: "Admin access granted." });
    } catch (err: any) {
      toast({ title: "Login Failed", description: "Invalid credentials.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTeamMember = () => {
    if (!db || !newAdminUid.trim()) return;
    const newAdminRef = doc(db, 'app_admins', newAdminUid.trim());
    setDocumentNonBlocking(newAdminRef, { 
      addedBy: user?.uid, 
      addedAt: new Date().toISOString(),
      label: 'Staff Member'
    }, { merge: true });
    
    toast({ title: "Staff Added", description: "Authorization pending login." });
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

  if (isUserLoading || (user && isAdminDocLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  // Login Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-md w-full shadow-2xl rounded-[2.5rem] overflow-hidden border-none bg-white">
            <div className="bg-foreground p-10 text-white text-center">
              <Lock className="w-10 h-10 text-primary mx-auto mb-4" />
              <h1 className="text-2xl font-black tracking-tight">Staff Login</h1>
              <p className="text-[10px] uppercase tracking-widest opacity-40">Restricted Area</p>
            </div>
            <CardContent className="p-8">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Admin Email</Label>
                  <Input type="email" placeholder="admin@meowmomo.com" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl h-12" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Password</Label>
                  <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl h-12" required />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full h-12 font-black rounded-xl bg-primary shadow-lg">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Authorize Access"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Not Admin Screen
  if (!adminDoc && !isAdminDocLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-lg w-full shadow-2xl rounded-[3rem] p-12 text-center border-none bg-white">
            <ShieldAlert className="w-12 h-12 mx-auto mb-6 text-primary" />
            <h1 className="text-2xl font-black mb-2 tracking-tight">Access Not Active</h1>
            <p className="text-muted-foreground mb-8 text-sm">Your account exists but is not authorized to view orders.</p>
            <div className="flex items-center gap-2 justify-center mb-8">
              <code className="text-xs bg-muted p-4 rounded-xl border font-mono">{user.uid}</code>
              <Button variant="outline" size="icon" onClick={copyUid} className="h-12 w-12 rounded-xl">
                {copied ? <Check className="text-green-500" /> : <Copy />}
              </Button>
            </div>
            <Button variant="ghost" onClick={() => auth.signOut()} className="font-black text-[10px] uppercase">Sign Out</Button>
          </Card>
        </div>
      </div>
    );
  }

  const totalRevenue = orders?.reduce((acc: number, order: any) => acc + (order.totalAmount || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">Control Center</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
              <Activity className="w-3.5 h-3.5 text-green-500" /> Operations Live
            </p>
          </div>
          <Button variant="outline" onClick={() => auth.signOut()} className="rounded-xl">
            <LogOut className="mr-2 w-4 h-4" /> Exit Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Revenue", value: `Rs.${totalRevenue}`, icon: DollarSign, color: "text-green-600" },
            { label: "Orders", value: orders?.length || 0, icon: ShoppingCart, color: "text-blue-600" },
            { label: "Team", value: allAdmins?.length || 0, icon: Users, color: "text-purple-600" },
          ].map((stat, i) => (
            <Card key={i} className="rounded-2xl border-none shadow-sm p-6 bg-white">
              <div className="flex items-center gap-4">
                <div className={cn("p-2.5 rounded-xl bg-muted/30", stat.color)}><stat.icon className="w-5 h-5" /></div>
                <div>
                  <p className="text-[10px] font-black uppercase text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-black">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="bg-white border rounded-xl h-14 p-1">
            <TabsTrigger value="orders" className="rounded-lg text-[10px] font-black uppercase tracking-widest h-full">Order Feed</TabsTrigger>
            <TabsTrigger value="team" className="rounded-lg text-[10px] font-black uppercase tracking-widest h-full">Staffing</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white">
              <ScrollArea className="h-[600px]">
                {isOrdersLoading ? (
                  <div className="p-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto opacity-10" /></div>
                ) : orders && orders.length > 0 ? (
                  <Table>
                    <TableHeader className="bg-muted/30 h-14">
                      <TableRow>
                        <TableHead className="pl-10 font-black text-[9px] uppercase">Customer</TableHead>
                        <TableHead className="font-black text-[9px] uppercase">Contact</TableHead>
                        <TableHead className="font-black text-[9px] uppercase">Amount</TableHead>
                        <TableHead className="text-center pr-10 font-black text-[9px] uppercase">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order: any) => (
                        <TableRow key={order.id} className="h-20">
                          <TableCell className="pl-10 font-bold">{order.customerName}</TableCell>
                          <TableCell className="text-xs text-muted-foreground font-medium">{order.customerContact}</TableCell>
                          <TableCell className="font-black text-primary">Rs.{order.totalAmount}</TableCell>
                          <TableCell className="text-center pr-10">
                            <Badge variant={order.status === 'Pending' ? 'destructive' : 'secondary'} className="text-[9px] rounded-full uppercase">
                              {order.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="p-20 text-center text-muted-foreground font-bold">No orders found.</div>
                )}
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card className="rounded-[2rem] border-none shadow-xl bg-white p-8">
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex-grow p-4 bg-muted/20 border-dashed border-2 flex flex-col justify-center rounded-xl">
                  <p className="font-black text-sm">Add Staff Access</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Authorize a unique User ID</p>
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Enter Staff UID..." value={newAdminUid} onChange={(e) => setNewAdminUid(e.target.value)} className="rounded-xl h-12 w-64" />
                  <Button onClick={handleAddTeamMember} className="h-12 px-8 font-black rounded-xl">Authorize</Button>
                </div>
              </div>
              <div className="grid gap-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Currently Authorized</h4>
                {allAdmins?.map((admin: any) => (
                  <div key={admin.id} className="flex items-center justify-between p-4 bg-muted/10 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border shadow-sm">
                        <Users className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="font-mono text-[10px] font-bold">{admin.id}</span>
                    </div>
                    {admin.id === user.uid && <Badge className="text-[9px] font-black uppercase">Current Session</Badge>}
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