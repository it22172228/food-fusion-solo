import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  Home,
  Utensils,
  Package,
  UserCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import NotificationBell from "@/components/Notification/NotificationBell";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/", icon: <Home className="h-4 w-4 mr-2" /> },
    { name: "Restaurants", path: "/restaurants", icon: <Utensils className="h-4 w-4 mr-2" /> },
  ];

  const roleSpecificLinks = {
    customer: [
      { name: "Orders", path: "/orders", icon: <Package className="h-4 w-4 mr-2" /> },
    ],
    restaurant: [
      { name: "Dashboard", path: "/restaurant/dashboard", icon: <Utensils className="h-4 w-4 mr-2" /> },
      { name: "Menu", path: "/restaurant/menu", icon: <Utensils className="h-4 w-4 mr-2" /> },
      { name: "Orders", path: "/restaurant/orders", icon: <Package className="h-4 w-4 mr-2" /> },
    ],
    delivery: [
      { name: "Deliveries", path: "/delivery/dashboard", icon: <Package className="h-4 w-4 mr-2" /> },
    ],
  };

  const getLinksByRole = () => {
    if (!user?.role) return [];
    return roleSpecificLinks[user.role as keyof typeof roleSpecificLinks] || [];
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const itemCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">FoodFusion</span>
          </Link>
          
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          {isAuthenticated &&
            getLinksByRole().map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
        </nav>

        <div className="flex items-center space-x-2">
          {user?.role === "customer" && (
            <Button
              variant="ghost"
              className="relative"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 rounded-full bg-primary text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <NotificationBell />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <UserCircle className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user?.name}</span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {user?.role}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background md:hidden transition-transform transform",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <Link to="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
              <span className="text-xl font-bold text-primary">FoodFusion</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex-1 overflow-auto py-2">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center px-4 py-3 text-sm font-medium hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              {isAuthenticated &&
                getLinksByRole().map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center px-4 py-3 text-sm font-medium hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
            </nav>
          </div>

          <div className="p-4 border-t">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-4 py-2">
                  <UserCircle className="h-8 w-8" />
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user?.role}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/profile");
                    setMobileMenuOpen(false);
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={() => {
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate("/register");
                    setMobileMenuOpen(false);
                  }}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
