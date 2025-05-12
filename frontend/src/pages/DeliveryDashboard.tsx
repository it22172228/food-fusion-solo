
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Navigation, 
  Phone, 
  MapPin, 
  Clock, 
  ChevronRight, 
  CheckCircle,
  AlertCircle,
  ShoppingBag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data
interface DeliveryOrder {
  id: string;
  customerName: string;
  restaurantName: string;
  restaurantAddress: string;
  deliveryAddress: string;
  customerPhone: string;
  status: 'assigned' | 'picked_up' | 'delivered' | 'cancelled';
  estimatedTime: number; // in minutes
  distance: number; // in km
  timestamp: Date;
  items: { name: string; quantity: number }[];
  totalAmount: number;
  paymentMethod: string;
  paid: boolean;
}

const mockDeliveries: DeliveryOrder[] = [
  {
    id: 'DEL-001',
    customerName: 'John Doe',
    restaurantName: 'Sakura Fusion',
    restaurantAddress: '123 Restaurant Ave, New York, NY 10001',
    deliveryAddress: '456 Customer St, New York, NY 10002',
    customerPhone: '+1-555-123-4567',
    status: 'assigned',
    estimatedTime: 25,
    distance: 3.2,
    timestamp: new Date(),
    items: [
      { name: 'Spicy Tuna Sushi Burrito', quantity: 2 },
      { name: 'Miso Soup', quantity: 1 }
    ],
    totalAmount: 42.97,
    paymentMethod: 'Card',
    paid: true
  },
  {
    id: 'DEL-002',
    customerName: 'Jane Smith',
    restaurantName: 'Olive & Spice',
    restaurantAddress: '789 Cuisine Blvd, New York, NY 10003',
    deliveryAddress: '101 Residential Ln, New York, NY 10004',
    customerPhone: '+1-555-987-6543',
    status: 'picked_up',
    estimatedTime: 15,
    distance: 1.8,
    timestamp: new Date(Date.now() - 20 * 60000), // 20 minutes ago
    items: [
      { name: 'Truffle Mushroom Pasta', quantity: 1 },
      { name: 'Tiramisu', quantity: 1 }
    ],
    totalAmount: 28.98,
    paymentMethod: 'Cash',
    paid: false
  }
];

const completedDeliveries: DeliveryOrder[] = [
  {
    id: 'DEL-003',
    customerName: 'Robert Johnson',
    restaurantName: 'Seoul Taco House',
    restaurantAddress: '555 Korean St, New York, NY 10005',
    deliveryAddress: '777 Apartment Complex, New York, NY 10006',
    customerPhone: '+1-555-456-7890',
    status: 'delivered',
    estimatedTime: 30,
    distance: 4.5,
    timestamp: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
    items: [
      { name: 'Korean BBQ Tacos', quantity: 3 },
      { name: 'Kimchi Fries', quantity: 1 }
    ],
    totalAmount: 52.96,
    paymentMethod: 'Card',
    paid: true
  }
];

const DeliveryDashboard: React.FC = () => {
  const [activeDeliveries, setActiveDeliveries] = useState<DeliveryOrder[]>(mockDeliveries);
  const [pastDeliveries, setPastDeliveries] = useState<DeliveryOrder[]>(completedDeliveries);
  const [deliveryStatus, setDeliveryStatus] = useState<'available' | 'busy'>('available');
  const { toast } = useToast();

  const updateDeliveryStatus = (deliveryId: string, status: DeliveryOrder['status']) => {
    setActiveDeliveries(activeDeliveries.map(delivery => 
      delivery.id === deliveryId ? { ...delivery, status } : delivery
    ));

    if (status === 'delivered' || status === 'cancelled') {
      const completedDelivery = activeDeliveries.find(d => d.id === deliveryId);
      if (completedDelivery) {
        const updatedDelivery = { ...completedDelivery, status };
        setPastDeliveries([updatedDelivery, ...pastDeliveries]);
        setActiveDeliveries(activeDeliveries.filter(d => d.id !== deliveryId));
      }
    }

    toast({
      title: "Delivery Updated",
      description: `Delivery ${deliveryId} status changed to ${status.replace('_', ' ')}.`,
    });
  };

  const toggleAvailability = () => {
    const newStatus = deliveryStatus === 'available' ? 'busy' : 'available';
    setDeliveryStatus(newStatus);
    
    toast({
      title: "Status Updated",
      description: `You are now ${newStatus}.`,
    });
  };

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-white dark:bg-gray-900 shadow-sm py-4 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-food-charcoal dark:text-white">
              Delivery Dashboard
            </h1>
            <p className="text-food-charcoal/70 dark:text-gray-400 text-sm">
              Manage your deliveries
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={deliveryStatus === 'available' ? 'default' : 'outline'}
              className={
                deliveryStatus === 'available' 
                  ? 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'
                  : 'border-red-500 text-red-500 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-gray-800'
              }
              onClick={toggleAvailability}
            >
              {deliveryStatus === 'available' ? 'Available for Delivery' : 'Currently Busy'}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-food-orange">
                {activeDeliveries.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Today's Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-food-orange">
                $86.50
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Completed Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-food-orange">
                {pastDeliveries.filter(d => 
                  d.timestamp.toDateString() === new Date().toDateString()
                ).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active">
          <TabsList className="w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="active" className="flex-1">Active Deliveries</TabsTrigger>
            <TabsTrigger value="history" className="flex-1">Delivery History</TabsTrigger>
          </TabsList>

          {/* Active Deliveries Tab */}
          <TabsContent value="active">
            <div className="space-y-4">
              {activeDeliveries.length > 0 ? (
                activeDeliveries.map((delivery) => (
                  <Card key={delivery.id} className="overflow-hidden">
                    <div className="border-l-4 border-l-food-orange">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex-grow">
                            <div className="flex justify-between mb-2">
                              <h3 className="font-semibold text-lg">{delivery.id}</h3>
                              <Badge className={
                                delivery.status === 'assigned' ? 'bg-yellow-500' :
                                delivery.status === 'picked_up' ? 'bg-blue-500' :
                                delivery.status === 'delivered' ? 'bg-green-500' : 'bg-red-500'
                              }>
                                {delivery.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-4">
                              <Clock className="inline-block mr-1" size={14} />
                              {new Intl.DateTimeFormat('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true
                              }).format(delivery.timestamp)} • {delivery.distance} km • ~{delivery.estimatedTime} min
                            </p>

                            <div className="space-y-4 mb-4">
                              <div className="flex gap-3">
                                <div className="min-w-6 flex justify-center">
                                  <div className="h-6 w-6 rounded-full bg-food-orange flex items-center justify-center text-white">
                                    1
                                  </div>
                                </div>
                                <div>
                                  <p className="font-medium">{delivery.restaurantName}</p>
                                  <p className="text-sm text-muted-foreground">{delivery.restaurantAddress}</p>
                                </div>
                              </div>

                              <div className="flex gap-3">
                                <div className="min-w-6 flex justify-center">
                                  <div className="h-6 w-6 rounded-full bg-food-burgundy flex items-center justify-center text-white">
                                    2
                                  </div>
                                </div>
                                <div>
                                  <p className="font-medium">{delivery.customerName}</p>
                                  <p className="text-sm text-muted-foreground">{delivery.deliveryAddress}</p>
                                  <p className="text-sm">{delivery.customerPhone}</p>
                                </div>
                              </div>
                            </div>

                            <div>
                              <p className="font-medium mb-1">Order Details:</p>
                              <ul className="text-sm space-y-1">
                                {delivery.items.map((item, idx) => (
                                  <li key={idx}>{item.quantity}x {item.name}</li>
                                ))}
                              </ul>
                              <div className="flex justify-between mt-2 pt-2 border-t">
                                <div>
                                  <span className="text-sm font-medium">Total: ${delivery.totalAmount.toFixed(2)}</span>
                                  <span className="block text-xs text-muted-foreground">
                                    {delivery.paymentMethod} • {delivery.paid ? 'Paid' : 'Collect Payment'}
                                  </span>
                                </div>
                                {!delivery.paid && (
                                  <Badge variant="outline" className="border-orange-500 text-orange-500">
                                    Collect ${delivery.totalAmount.toFixed(2)}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 min-w-[140px]">
                            <Button
                              className="w-full bg-blue-500 hover:bg-blue-600 mb-2"
                              onClick={() => window.open(`https://maps.google.com/?q=${
                                delivery.status === 'assigned' ? 
                                  delivery.restaurantAddress : 
                                  delivery.deliveryAddress
                              }`, '_blank')}
                            >
                              <Navigation className="h-4 w-4 mr-2" />
                              Navigate
                            </Button>

                            <Button
                              className="w-full"
                              variant="outline"
                              onClick={() => window.open(`tel:${delivery.customerPhone}`)}
                            >
                              <Phone className="h-4 w-4 mr-2" />
                              Call
                            </Button>

                            {delivery.status === 'assigned' && (
                              <Button 
                                className="w-full bg-green-500 hover:bg-green-600 mt-2"
                                onClick={() => updateDeliveryStatus(delivery.id, 'picked_up')}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Picked Up
                              </Button>
                            )}

                            {delivery.status === 'picked_up' && (
                              <Button 
                                className="w-full bg-green-500 hover:bg-green-600 mt-2"
                                onClick={() => updateDeliveryStatus(delivery.id, 'delivered')}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Delivered
                              </Button>
                            )}

                            <Button 
                              className="w-full"
                              variant="destructive"
                              onClick={() => updateDeliveryStatus(delivery.id, 'cancelled')}
                            >
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Issue
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="bg-muted/50">
                  <CardContent className="flex flex-col items-center justify-center p-8">
                    <ShoppingBag className="text-muted-foreground h-12 w-12 mb-2" />
                    <p className="text-muted-foreground">No active deliveries at the moment</p>
                    {deliveryStatus === 'busy' && (
                      <Button 
                        className="mt-4"
                        variant="outline"
                        onClick={toggleAvailability}
                      >
                        Set yourself available
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Delivery History Tab */}
          <TabsContent value="history">
            <div className="space-y-2">
              {pastDeliveries.map((delivery) => (
                <Card key={delivery.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{delivery.id}</h3>
                          <Badge className={
                            delivery.status === 'delivered' ? 'bg-green-500' : 'bg-red-500'
                          }>
                            {delivery.status}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {new Intl.DateTimeFormat('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true
                          }).format(delivery.timestamp)} • {delivery.distance} km
                        </p>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-3 w-3 text-food-orange" />
                          <span className="text-xs truncate max-w-[250px]">
                            {delivery.customerName} • {delivery.deliveryAddress}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="text-right mr-2">
                          <p className="font-medium">
                            ${delivery.totalAmount.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {delivery.items.reduce((total, item) => total + item.quantity, 0)} items
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {pastDeliveries.length === 0 && (
                <Card className="bg-muted/50">
                  <CardContent className="flex flex-col items-center justify-center p-8">
                    <ShoppingBag className="text-muted-foreground h-12 w-12 mb-2" />
                    <p className="text-muted-foreground">No delivery history found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DeliveryDashboard;