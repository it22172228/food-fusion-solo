import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { restaurants } from "@/data/mockData";
import { toast } from "sonner";
import { useNotification } from "@/contexts/NotificationContext";

// --- Helper function to send SMS via your backend ---
async function sendOrderSMS(to: string, body: string) {
  try {
    const response = await fetch("http://localhost:5000/api/send-sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, body }),
    });
    const data = await response.json();
    return data.success;
  } catch {
    return false;
  }
}

const CartPage = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, getCartTotal, restaurantId } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { showNotification } = useNotification();

  const [isProcessing, setIsProcessing] = useState(false);

  // restaurantId is "1", "2", etc. Restaurant mock data uses "r1", "r2", etc.
  const restaurantKey = restaurantId ? `r${restaurantId}` : undefined;
  const restaurant = restaurants.find((r) => r.id === restaurantKey);

  const subtotal = getCartTotal();
  const deliveryFee = restaurant?.deliveryFee || 0;
  const total = subtotal + deliveryFee;

  // --- Main checkout handler ---
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast("Please login to continue with your order");
      return;
    }

    if (user?.role !== "customer") {
      toast.error("Only customers can place orders");
      return;
    }

    setIsProcessing(true);

    // --- Send SMS before proceeding ---
    // Replace with user's phone number from profile if available
    const smsSuccess = await sendOrderSMS(
      "+94751170942",
      `Your order at ${restaurant?.name || "FoodFusion"} has been placed successfully! Thank you for ordering with us.`
    );
    if (!smsSuccess) {
      toast.error("Failed to send SMS notification.");
      setIsProcessing(false);
      return;
    }

    // Continue with order logic
    setTimeout(() => {
      toast.success("Your order has been placed successfully!");

      showNotification(
        "Your order has been placed successfully! We'll notify you when a driver accepts your order.",
        "success"
      );

      setTimeout(() => {
        showNotification(
          "A driver has accepted your order and is heading to the restaurant.",
          "info"
        );
      }, 5000);

      setTimeout(() => {
        showNotification(
          "Your order is being prepared by the restaurant.",
          "info"
        );
      }, 8000);

      clearCart();
      navigate("/orders");
      setIsProcessing(false);
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Button asChild>
            <Link to="/restaurants">Browse Restaurants</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Button variant="ghost" className="mr-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Your Cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {restaurant && (
            <div className="mb-4 flex items-center">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="h-12 w-12 rounded-md object-cover mr-3"
              />
              <div>
                <h2 className="font-medium">{restaurant.name}</h2>
                <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
              </div>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Items ({items.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded object-cover mr-3"
                    />
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">Rs. {item.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={isProcessing}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="mx-2 w-6 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={isProcessing}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeItem(item.id)}
                      disabled={isProcessing}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={clearCart}
                disabled={isProcessing}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate(`/restaurants/${restaurantKey}`)}
                disabled={isProcessing}
              >
                Add More Items
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>Rs. {deliveryFee.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Proceed to Checkout"}
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              By placing your order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
