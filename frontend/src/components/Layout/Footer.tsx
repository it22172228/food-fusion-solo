
import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t py-8">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">FoodFusion</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Connecting you with the best local restaurants for a seamless food delivery experience.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-base font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className="text-sm text-muted-foreground hover:text-primary">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-muted-foreground hover:text-primary">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm text-muted-foreground hover:text-primary">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Roles */}
          <div>
            <h3 className="text-base font-medium mb-4">Join Us</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/register?role=restaurant" className="text-sm text-muted-foreground hover:text-primary">
                  Register as Restaurant
                </Link>
              </li>
              <li>
                <Link to="/register?role=delivery" className="text-sm text-muted-foreground hover:text-primary">
                  Become a Delivery Partner
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-medium mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">
                Email: support@foodfusion.com
              </li>
              <li className="text-sm text-muted-foreground">
                Phone: +94 11 234 5678
              </li>
              <li className="text-sm text-muted-foreground">
                Address: 123 Main St, Colombo 3, Sri Lanka
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} FoodFusion. All rights reserved.
            </p>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="text-sm text-muted-foreground flex items-center">
                Made with <Heart className="h-4 w-4 mx-1 text-primary" /> in Sri Lanka
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
