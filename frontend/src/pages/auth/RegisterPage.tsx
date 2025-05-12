import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { useNotification } from "@/contexts/NotificationContext"; // Import the notification context

const RegisterPage = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification(); // Use the notification context
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<"customer" | "restaurant" | "delivery">("customer");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Advanced user-friendly validations
        if (!/^[a-zA-Z\s]{2,50}$/.test(name)) {
            setError("Please enter a valid name (letters only, 2–50 characters).");
            return;
        }
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        // Password: min 8 chars, at least one number, one uppercase, one lowercase, one special char
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
            setError(
                "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
            );
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/api/auth/register", {
                name,
                email,
                password,
                role,
            });
            setIsLoading(false);
            showNotification("Registration successful! Your account is awaiting admin approval.", "success"); // Show success notification
            navigate("/login"); // Redirect to login after successful registration
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed");
            setIsLoading(false);
        }
    };

    return (
        <div className="container max-w-md mx-auto py-16 px-4">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Create an account</CardTitle>
                    <CardDescription>
                        Join our platform to enjoy our services
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={role} onValueChange={setRole}>
                        <TabsList className="grid grid-cols-3 mb-6">
                            <TabsTrigger value="customer">Customer</TabsTrigger>
                            <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
                            <TabsTrigger value="delivery">Delivery</TabsTrigger>
                        </TabsList>
                        <TabsContent value="customer">
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    {error && (
                                        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                                            {error}
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <Label htmlFor="customer-name">Name</Label>
                                        <Input
                                            id="customer-name"
                                            type="text"
                                            placeholder="Your Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="customer-email">Email</Label>
                                        <Input
                                            id="customer-email"
                                            type="email"
                                            placeholder="customer@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="customer-password">Password</Label>
                                        <Input
                                            id="customer-password"
                                            type="password"
                                            placeholder="********"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="customer-confirm-password">Confirm Password</Label>
                                        <Input
                                            id="customer-confirm-password"
                                            type="password"
                                            placeholder="********"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Creating account..." : "Sign up"}
                                    </Button>
                                </div>
                            </form>
                        </TabsContent>
                        <TabsContent value="restaurant">
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    {error && (
                                        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                                            {error}
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <Label htmlFor="restaurant-name">Restaurant Name</Label>
                                        <Input
                                            id="restaurant-name"
                                            type="text"
                                            placeholder="Restaurant Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="restaurant-email">Restaurant Email</Label>
                                        <Input
                                            id="restaurant-email"
                                            type="email"
                                            placeholder="restaurant@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="restaurant-password">Password</Label>
                                        <Input
                                            id="restaurant-password"
                                            type="password"
                                            placeholder="********"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="restaurant-confirm-password">Confirm Password</Label>
                                        <Input
                                            id="restaurant-confirm-password"
                                            type="password"
                                            placeholder="********"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Creating account..." : "Sign up as Restaurant"}
                                    </Button>
                                </div>
                            </form>
                        </TabsContent>
                        <TabsContent value="delivery">
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    {error && (
                                        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                                            {error}
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <Label htmlFor="delivery-name">Your Name</Label>
                                        <Input
                                            id="delivery-name"
                                            type="text"
                                            placeholder="Your Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="delivery-email">Delivery Email</Label>
                                        <Input
                                            id="delivery-email"
                                            type="email"
                                            placeholder="delivery@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="delivery-password">Password</Label>
                                        <Input
                                            id="delivery-password"
                                            type="password"
                                            placeholder="********"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="delivery-confirm-password">Confirm Password</Label>
                                        <Input
                                            id="delivery-confirm-password"
                                            type="password"
                                            placeholder="********"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Creating account..." : "Sign up as Delivery"}
                                    </Button>
                                </div>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter className="text-center">
                    <div className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link to={`/login${role ? `?role=${role}` : ""}`} className="text-primary underline-offset-4 hover:underline font-medium">
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default RegisterPage;
