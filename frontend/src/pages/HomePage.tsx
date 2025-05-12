
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Utensils, Clock, Star } from "lucide-react";
import { restaurants } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const featuredRestaurants = restaurants.filter(restaurant => restaurant.featured);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container mx-auto py-16 px-4 md:py-24 md:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Delicious Food Delivered to Your Doorstep
            </h1>
            <p className="text-lg mb-8 max-w-md">
              Order from your favorite restaurants and enjoy a hassle-free delivery experience with FoodFusion.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link to="/restaurants">Browse Restaurants</Link>
              </Button>
              {!isAuthenticated && (
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary" asChild>
                  <Link to="/register">Sign Up Now</Link>
                </Button>
              )}
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=768&q=80"
              alt="Delicious Food"
              className="rounded-lg shadow-xl max-w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Select Restaurant</h3>
              <p className="text-muted-foreground">Choose from a wide variety of restaurants in your area.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Meal</h3>
              <p className="text-muted-foreground">Browse menus and select your favorite dishes.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Enjoy Delivery</h3>
              <p className="text-muted-foreground">Track your order and get it delivered to your doorstep.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Restaurants Section */}
      <section className="py-16 px-4 bg-accent/50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Restaurants</h2>
            <Button variant="ghost" className="flex items-center" asChild>
              <Link to="/restaurants">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRestaurants.map((restaurant) => (
              <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link to={`/restaurants/${restaurant.id}`}>
                  <div className="relative h-48 w-full">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
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
                    <Utensils className="h-4 w-4 mr-1" />
                    <span className="mr-3">{restaurant.cuisine}</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-16 px-4 bg-background border-t">
        <div className="container mx-auto">
          <div className="bg-primary/10 rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">Join the FoodFusion Family</h2>
                <p className="text-lg mb-6">
                  Partner with us as a restaurant owner or delivery driver and grow your business.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="default" asChild>
                    <Link to="/register?role=restaurant">Register Restaurant</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/register?role=delivery">Become a Driver</Link>
                  </Button>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <img
                  src="https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  alt="Restaurant Partner"
                  className="max-h-64 rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
