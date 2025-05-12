import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Trash2, 
  Plus, 
  PlusCircle 
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import MenuItemForm, { MenuItemFormValues } from '@/components/Restaurant/MenuItemForm';
import RestaurantAnalytics from '@/components/Restaurant/RestaurantAnalytics';

// Mock data
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

interface Order {
  id: string;
  customerName: string;
  items: { menuItem: MenuItem, quantity: number }[];
  status: 'pending' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  total: number;
  address: string;
  phone: string;
  timestamp: Date;
  paymentMethod: string;
}

const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Spicy Tuna Sushi Burrito',
    description: 'Fresh tuna, avocado, cucumber, and spicy mayo wrapped in sushi rice and nori.',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format',
    category: 'Asian Fusion',
    available: true
  },
  {
    id: '2',
    name: 'Truffle Mushroom Pasta',
    description: 'Fettuccine pasta with wild mushrooms, truffle oil, and parmesan cheese.',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?q=80&w=2065&auto=format',
    category: 'Italian',
    available: true
  },
  {
    id: '3',
    name: 'Korean BBQ Tacos',
    description: 'Marinated beef bulgogi with kimchi slaw in soft corn tortillas.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=2070&auto=format',
    category: 'Korean-Mexican',
    available: false
  }
];

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    items: [
      { menuItem: mockMenuItems[0], quantity: 2 },
      { menuItem: mockMenuItems[1], quantity: 1 }
    ],
    status: 'pending',
    total: 50.97,
    address: '123 Main St, New York, NY 10001',
    phone: '+1-555-123-4567',
    timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
    paymentMethod: 'Credit Card'
  },
  {
    id: 'ORD-002',
    customerName: 'Jane Smith',
    items: [
      { menuItem: mockMenuItems[2], quantity: 3 },
    ],
    status: 'preparing',
    total: 44.97,
    address: '456 Oak St, New York, NY 10002',
    phone: '+1-555-987-6543',
    timestamp: new Date(Date.now() - 60 * 60000), // 1 hour ago
    paymentMethod: 'PayPal'
  },
  {
    id: 'ORD-003',
    customerName: 'Robert Johnson',
    items: [
      { menuItem: mockMenuItems[0], quantity: 1 },
      { menuItem: mockMenuItems[2], quantity: 2 }
    ],
    status: 'ready',
    total: 45.97,
    address: '789 Pine St, New York, NY 10003',
    phone: '+1-555-654-3210',
    timestamp: new Date(Date.now() - 90 * 60000), // 1.5 hours ago
    paymentMethod: 'Cash on Delivery'
  }
];

const RestaurantDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [restaurantOpen, setRestaurantOpen] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const { toast } = useToast();

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));

    toast({
      title: "Order Updated",
      description: `Order ${orderId} status changed to ${status.replace('_', ' ')}.`,
    });
  };

  const toggleItemAvailability = (itemId: string) => {
    setMenuItems(menuItems.map(item => 
      item.id === itemId ? { ...item, available: !item.available } : item
    ));

    const item = menuItems.find(i => i.id === itemId);
    toast({
      title: item?.available ? "Item Unavailable" : "Item Available",
      description: `${item?.name} is now ${item?.available ? "unavailable" : "available"} for ordering.`,
    });
  };

  const deleteMenuItem = (itemId: string) => {
    const item = menuItems.find(i => i.id === itemId);
    setMenuItems(menuItems.filter(item => item.id !== itemId));

    toast({
      title: "Item Deleted",
      description: `${item?.name} has been removed from your menu.`,
      variant: "destructive"
    });
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setShowMenuForm(true);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setShowMenuForm(true);
  };

  const handleMenuItemSubmit = (data: MenuItemFormValues) => {
    if (editingItem) {
      // Update existing item
      setMenuItems(menuItems.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...data } 
          : item
      ));
      
      toast({
        title: "Item Updated",
        description: `${data.name} has been updated successfully.`,
      });
    } else {
      // Add new item - ensure all required properties from MenuItem interface are provided
      const newItem: MenuItem = {
        id: `${Date.now()}`,
        name: data.name,           // Explicitly assign required properties
        description: data.description,
        price: data.price,
        image: data.image,
        category: data.category,
        available: true
      };
      
      setMenuItems([...menuItems, newItem]);
      
      toast({
        title: "Item Added",
        description: `${data.name} has been added to your menu.`,
      });
    }
    
    setShowMenuForm(false);
    setEditingItem(null);
  };

  const handleCancelForm = () => {
    setShowMenuForm(false);
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-white dark:bg-gray-900 shadow-sm py-4 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-food-charcoal dark:text-white">
              Restaurant Dashboard
            </h1>
            <p className="text-food-charcoal/70 dark:text-gray-400 text-sm">
              Manage your menu and orders
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm mr-2 dark:text-gray-300">Restaurant Status:</span>
            <Switch 
              checked={restaurantOpen} 
              onCheckedChange={setRestaurantOpen} 
              className="data-[state=checked]:bg-green-500"
            />
            <span
              className={`text-sm ml-1 ${restaurantOpen ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}
            >
              {restaurantOpen ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="orders">
          <TabsList className="w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="orders" className="flex-1">Orders</TabsTrigger>
            <TabsTrigger value="menu" className="flex-1">Menu Management</TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1">Analytics</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Pending Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-food-orange">
                    {orders.filter(o => o.status === 'pending').length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Preparing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-food-orange">
                    {orders.filter(o => o.status === 'preparing').length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Ready for Pickup</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-food-orange">
                    {orders.filter(o => o.status === 'ready').length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <h2 className="font-semibold text-xl mb-4">Active Orders</h2>
            
            <div className="space-y-4">
              {orders
                .filter(order => ['pending', 'preparing', 'ready'].includes(order.status))
                .map(order => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{order.id}</h3>
                            <Badge className={
                              order.status === 'pending' ? 'bg-yellow-500' :
                              order.status === 'preparing' ? 'bg-blue-500' :
                              order.status === 'ready' ? 'bg-green-500' : 'bg-gray-500'
                            }>
                              {order.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            <Clock className="inline-block mr-1" size={14} />
                            {new Intl.DateTimeFormat('en-US', {
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: true
                            }).format(order.timestamp)}
                          </p>

                          <p className="font-medium mb-3">{order.customerName} • {order.phone}</p>
                          
                          <div className="border-t border-b py-3 my-3">
                            <p className="font-medium mb-2">Order Items:</p>
                            <ul className="space-y-2">
                              {order.items.map((item, idx) => (
                                <li key={idx} className="flex justify-between">
                                  <span>{item.quantity}x {item.menuItem.name}</span>
                                  <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="flex justify-between font-medium mt-3 pt-2 border-t">
                              <span>Total</span>
                              <span>${order.total.toFixed(2)}</span>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm"><span className="font-medium">Payment:</span> {order.paymentMethod}</p>
                            <p className="text-sm"><span className="font-medium">Delivery Address:</span> {order.address}</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 min-w-[140px]">
                          {order.status === 'pending' && (
                            <>
                              <Button 
                                className="bg-blue-500 hover:bg-blue-600 w-full"
                                onClick={() => updateOrderStatus(order.id, 'preparing')}
                              >
                                Accept Order
                              </Button>
                              <Button 
                                variant="destructive"
                                className="w-full"
                                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              >
                                Reject
                              </Button>
                            </>
                          )}

                          {order.status === 'preparing' && (
                            <Button 
                              className="bg-green-500 hover:bg-green-600 w-full"
                              onClick={() => updateOrderStatus(order.id, 'ready')}
                            >
                              Mark as Ready
                            </Button>
                          )}

                          {order.status === 'ready' && (
                            <Button 
                              className="bg-purple-500 hover:bg-purple-600 w-full"
                              onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                            >
                              Hand to Delivery
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {orders.filter(order => ['pending', 'preparing', 'ready'].includes(order.status)).length === 0 && (
                <Card className="bg-muted/50">
                  <CardContent className="flex flex-col items-center justify-center p-8">
                    <ShoppingBag className="text-muted-foreground h-12 w-12 mb-2" />
                    <p className="text-muted-foreground">No active orders at the moment</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Menu Management Tab */}
          <TabsContent value="menu">
            {showMenuForm ? (
              <MenuItemForm 
                onSubmit={handleMenuItemSubmit}
                initialData={editingItem ? {
                  name: editingItem.name,
                  description: editingItem.description,
                  price: editingItem.price,
                  category: editingItem.category,
                  image: editingItem.image,
                } : undefined}
                onCancel={handleCancelForm}
              />
            ) : (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="font-semibold text-xl">Menu Items</h2>
                  <Button 
                    className="bg-food-orange hover:bg-food-orange/90"
                    onClick={handleAddItem}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add New Item
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menuItems.map(item => (
                    <Card key={item.id}>
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="object-cover w-full h-full"
                        />
                        <Badge className={`absolute top-2 right-2 ${item.available ? 'bg-green-500' : 'bg-red-500'}`}>
                          {item.available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <span className="text-food-orange font-medium">${item.price.toFixed(2)}</span>
                        </div>
                        <p className="text-food-charcoal/70 text-sm line-clamp-2 mb-2">{item.description}</p>
                        <Badge variant="outline" className="mb-3">{item.category}</Badge>
                        
                        <div className="flex gap-2 mt-2">
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => handleEditItem(item)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant={item.available ? "destructive" : "default"}
                            className={`flex-1 ${!item.available ? 'bg-green-500 hover:bg-green-600' : ''}`}
                            onClick={() => toggleItemAvailability(item.id)}
                          >
                            {item.available ? (
                              <>
                                <XCircle className="h-4 w-4 mr-1" />
                                Disable
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Enable
                              </>
                            )}
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            onClick={() => deleteMenuItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Card className="border-dashed border-2 bg-transparent flex flex-col items-center justify-center h-[300px]">
                    <Button 
                      variant="ghost" 
                      className="h-full w-full flex flex-col gap-2"
                      onClick={handleAddItem}
                    >
                      <Plus className="h-8 w-8" />
                      <span>Add New Menu Item</span>
                    </Button>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <RestaurantAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
