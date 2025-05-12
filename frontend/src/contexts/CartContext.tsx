import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  restaurantId: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  restaurantId: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  useEffect(() => {
    // Load cart from local storage
    const savedCart = localStorage.getItem("foodFusionCart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setItems(parsedCart.items || []);
      setRestaurantId(parsedCart.restaurantId || null);
    }
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("foodFusionCart", JSON.stringify({ items, restaurantId }));
  }, [items, restaurantId]);

  const addItem = (item: MenuItem, quantity = 1) => {
    if (restaurantId && item.restaurantId !== restaurantId) {
      toast({
        title: "Items from different restaurants",
        description: "Your cart contains items from a different restaurant. Would you like to clear your cart and add this item?",
        action: {
          label: "Clear and add",
          onClick: () => {
            setItems([{ ...item, quantity }]);
            setRestaurantId(item.restaurantId);
            toast.success(`Added ${item.name} to your cart.`);
          },
        },
      });
      return;
    }

    setItems((currentItems) => {
      const existingItem = currentItems.find((i) => i.id === item.id);
      if (existingItem) {
        return currentItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        if (!restaurantId) {
          setRestaurantId(item.restaurantId);
        }
        return [...currentItems, { ...item, quantity }];
      }
    });
    
    toast.success(`${quantity} x ${item.name} added to cart.`);
  };

  const removeItem = (itemId: string) => {
    setItems((currentItems) => {
      const newItems = currentItems.filter((item) => item.id !== itemId);
      if (newItems.length === 0) {
        setRestaurantId(null);
      }
      return newItems;
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantId(null);
    toast.success("Cart cleared");
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemCount,
        restaurantId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
