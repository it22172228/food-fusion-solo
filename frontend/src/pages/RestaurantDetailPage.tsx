import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin, Info, Plus } from "lucide-react";
import { restaurants, menuItems } from "@/data/mockData";
import { useCart } from "@/contexts/CartContext";
import { Separator } from "@/components/ui/separator";

// --- Fix 1: Define correct MenuItem type for this file ---
type MenuItem = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isPopular?: boolean;
};

const RestaurantDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<any | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("Menu");

  const { addItem } = useCart();

  useEffect(() => {
    // Find the restaurant
    const foundRestaurant = restaurants.find((r) => r.id === id);
    setRestaurant(foundRestaurant || null);

    if (foundRestaurant) {
      // --- Fix 3: Match menu items by numeric part of restaurant id ---
      const restIdNum = foundRestaurant.id.replace("r", "");
      const restaurantMenu = (menuItems as MenuItem[]).filter(
        (item) => item.restaurantId === restIdNum
      );
      setMenu(restaurantMenu);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(restaurantMenu.map((item) => item.category)),
      ];
      setCategories(uniqueCategories);
    }
  }, [id]);

  if (!restaurant) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-bold">Restaurant not found</h2>
      </div>
    );
  }

  const groupedMenu = categories.map((category) => ({
    category,
    items: menu.filter((item) => item.category === category),
  }));

  return (
    <div className="flex flex-col">
      {/* Restaurant Cover Image */}
      <div
        className="h-64 md:h-80 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${restaurant.coverImage || restaurant.image})` }}
      >
        <div className="h-full w-full bg-black/50 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {restaurant.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white">
              <Badge className="bg-white/20 hover:bg-white/30 text-white">
                {restaurant.cuisine}
              </Badge>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-1 fill-yellow-400 text-yellow-400" />
                <span>{restaurant.rating}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-1" />
                <span>{restaurant.deliveryTime}</span>
              </div>
              {/* --- Fix 2: Use only allowed Badge variants --- */}
              {restaurant.isOpen ? (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                  Open
                </Badge>
              ) : (
                <Badge variant="destructive">Closed</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <Tabs defaultValue="Menu" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="Menu">Menu</TabsTrigger>
            <TabsTrigger value="Info">Info</TabsTrigger>
            <TabsTrigger value="Reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="Menu">
            {groupedMenu.length > 0 ? (
              groupedMenu.map((group) => (
                <div key={group.category} className="mb-10">
                  <h2 className="text-2xl font-bold mb-4">{group.category}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.items.map((menuItem) => (
                      <Card key={menuItem.id} className="overflow-hidden border hover:border-primary/30 transition-colors">
                        <div className="flex flex-col sm:flex-row h-full">
                          <div className="sm:w-1/3 h-32 sm:h-auto overflow-hidden">
                            <img
                              src={menuItem.image}
                              alt={menuItem.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardContent className="flex-1 flex flex-col p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">{menuItem.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1 mb-2 line-clamp-2">
                                  {menuItem.description}
                                </p>
                              </div>
                              {menuItem.price > 500 && (
                                <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                  Premium
                                </Badge>
                              )}
                            </div>
                            <div className="mt-auto flex items-center justify-between pt-2">
                              <span className="font-semibold">Rs. {menuItem.price.toFixed(2)}</span>
                              <Button
                                size="sm"
                                className="ml-auto"
                                onClick={() => addItem(menuItem)}
                                disabled={!restaurant.isOpen}
                              >
                                <Plus className="h-4 w-4 mr-1" /> Add
                              </Button>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No menu items found</h3>
                <p className="text-muted-foreground">This restaurant currently has no menu items.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="Info">
            <div className="max-w-3xl">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Restaurant Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Address</h3>
                      <p className="text-muted-foreground">{restaurant.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Delivery Time</h3>
                      <p className="text-muted-foreground">{restaurant.deliveryTime}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Info className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Minimum Order</h3>
                      <p className="text-muted-foreground">Rs. {restaurant.minimumOrder}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Delivery Fee</h3>
                      <p className="text-muted-foreground">Rs. {restaurant.deliveryFee}</p>
                    </div>
                  </div>
                </div>
              </div>
              <Separator className="my-8" />
              <div>
                <h2 className="text-2xl font-bold mb-4">About {restaurant.name}</h2>
                <p className="text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.
                  Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus
                  rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna
                  non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="Reviews">
            <div className="max-w-3xl">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">Customer Reviews</h2>
                  <div className="flex items-center">
                    <Star className="h-6 w-6 mr-1 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-semibold">{restaurant.rating}</span>
                    <span className="text-muted-foreground ml-2">(124 reviews)</span>
                  </div>
                </div>
                <div className="space-y-6">
                  {/* Mock reviews */}
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="p-5">
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">Customer {i + 1}</div>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, starIndex) => (
                            <Star
                              key={starIndex}
                              className={`h-4 w-4 ${
                                starIndex < 4 + (i % 2)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {new Date(Date.now() - 1000 * 60 * 60 * 24 * (i + 1)).toLocaleDateString()}
                      </div>
                      <p>
                        {[
                          "The food was amazing! Fast delivery and great packaging.",
                          "Really enjoyed the meal. Will definitely order again.",
                          "Good food but delivery was a bit delayed.",
                        ][i]}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
