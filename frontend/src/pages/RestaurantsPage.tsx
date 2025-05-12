
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Search, 
  Utensils, 
  Clock, 
  Star, 
  MapPin,
  List
} from "lucide-react";
import { restaurants } from "@/data/mockData";
import RestaurantMap from "@/components/Maps/RestaurantMap";

const cuisineTypes = [
  "All",
  "Italian",
  "American",
  "Indian",
  "Japanese",
  "Chinese",
  "Sri Lankan",
];

const RestaurantsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = 
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCuisine = selectedCuisine === "All" || restaurant.cuisine === selectedCuisine;
    
    return matchesSearch && matchesCuisine;
  });

  const mapLocations = useMemo(() => {
    return filteredRestaurants.map(restaurant => ({
      id: restaurant.id,
      name: restaurant.name,
      lat: restaurant.coordinates?.lat || 0,
      lng: restaurant.coordinates?.lng || 0,
      address: restaurant.address || "",
    }));
  }, [filteredRestaurants]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Restaurants</h1>
      
      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search restaurants or cuisines..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-2">
            {cuisineTypes.map((cuisine) => (
              <Button
                key={cuisine}
                variant={selectedCuisine === cuisine ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCuisine(cuisine)}
                className={selectedCuisine === cuisine ? "" : "hover:bg-primary/10"}
              >
                {cuisine}
              </Button>
            ))}
          </div>
          
          <Tabs 
            defaultValue="list" 
            value={viewMode} 
            onValueChange={(val) => setViewMode(val as "list" | "map")}
            className="w-auto"
          >
            <TabsList className="grid w-32 grid-cols-2">
              <TabsTrigger value="list"><List className="h-4 w-4 mr-1" /> List</TabsTrigger>
              <TabsTrigger value="map"><MapPin className="h-4 w-4 mr-1" /> Map</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* View Mode Content */}
      <div className="mb-8">
        {viewMode === "map" ? (
          <RestaurantMap locations={mapLocations} height="500px" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((restaurant) => (
                <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Link to={`/restaurants/${restaurant.id}`}>
                    <div className="relative h-48 w-full">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                      {!restaurant.isOpen && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Badge variant="destructive" className="text-lg py-1 px-3">Currently Closed</Badge>
                        </div>
                      )}
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">
                          <Link to={`/restaurants/${restaurant.id}`}>{restaurant.name}</Link>
                        </h3>
                        <p className="text-muted-foreground text-sm mb-2">{restaurant.cuisine}</p>
                      </div>
                      <div className="flex items-center bg-primary/10 text-primary px-2 py-1 rounded">
                        <Star className="h-4 w-4 mr-1 fill-primary text-primary" />
                        <span>{restaurant.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="mr-3">{restaurant.deliveryTime}</span>
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>Rs. {restaurant.deliveryFee} delivery fee</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                      <Utensils className="h-4 w-4 mr-1" />
                      <span>Min. order: Rs. {restaurant.minimumOrder}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-xl font-medium mb-2">No restaurants found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantsPage;
