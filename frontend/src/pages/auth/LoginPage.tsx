import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { useAuth, UserRole } from "../../contexts/AuthContext";
import { toast } from "sonner";

// Define the fixed admin credentials
const ADMIN_USERNAME = "admin@foodfusion.com";
const ADMIN_PASSWORD = "admin123";

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loginError, setLoginError] = useState<string | null>(null);

    // Parse the role from the URL query parameter, defaulting to "customer"
    const query = new URLSearchParams(location.search);
    const defaultRole = (query.get("role") as UserRole) || "customer";
    // Add 'admin' as a possible role
    const [role, setRole] = useState<UserRole | "admin">(defaultRole);

    const { setUser, setIsAuthenticated } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoginError(null);
        setIsLoading(true);

        if (!email || !password) {
            setError("Please fill in all fields");
            setIsLoading(false);
            return;
        }

        // Handle admin login locally
        if (role === "admin") {
            if (email === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                const userData = {
                    id: "admin",
                    name: "Admin",
                    email: ADMIN_USERNAME,
                    role: "admin"
                };
                sessionStorage.setItem("foodFusionUser", JSON.stringify(userData));
                setUser(userData);
                setIsAuthenticated(true);
                toast.success("Welcome, Admin!");
                navigate("/admin");
            } else {
                setLoginError("Invalid admin credentials");
                toast.error("Invalid admin credentials");
            }
            setIsLoading(false);
            return;
        }

        // Normal login for other roles
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password,
                role,
            });

            const userData = response.data.user;

            // Save to sessionStorage for tab isolation
            sessionStorage.setItem("foodFusionUser", JSON.stringify(userData));

            // Update global state
            setUser(userData);
            setIsAuthenticated(true);

            toast.success(`Welcome back, ${userData.name}!`);

            // Redirect based on role
            if (role === "customer") {
                navigate("/");
            } else if (role === "restaurant") {
                navigate("/restaurant/dashboard");
            } else if (role === "delivery") {
                navigate("/delivery-dashboard");
            } else {
                navigate("/admin");
            }
        } catch (error: any) {
            setLoginError(error.response?.data?.message || "Login failed");
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to render the form for each role
    const renderForm = (roleLabel: string, roleValue: UserRole | "admin") => (
        <form onSubmit={handleLogin}>
            <div className="space-y-4">
                {loginError && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                        {loginError}
                    </div>
                )}
                {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                        {error}
                    </div>
                )}
                <div className="space-y-2">
                    <Label htmlFor={`${roleValue}-email`}>{roleLabel} Email</Label>
                    <Input
                        id={`${roleValue}-email`}
                        type="email"
                        placeholder={`${roleLabel.toLowerCase()}@example.com`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete={roleValue === "admin" ? "username" : undefined}
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor={`${roleValue}-password`}>Password</Label>
                        {roleValue !== "admin" && (
                            <Link
                                to="/forgot-password"
                                className="text-sm text-primary underline-offset-4 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>
                    <Input
                        id={`${roleValue}-password`}
                        type="password"
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete={roleValue === "admin" ? "current-password" : undefined}
                    />
                </div>
                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading ? "Signing in..." : `Sign in${roleValue !== "customer" ? ` as ${roleLabel}` : ""}`}
                </Button>
            </div>
        </form>
    );

    return (
        <div className="container max-w-md mx-auto py-16 px-4">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Welcome back</CardTitle>
                    <CardDescription>
                        Sign in to your account to continue
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={role} onValueChange={(value) => setRole(value as UserRole | "admin")}>
                        <TabsList className="grid grid-cols-4 mb-6">
                            <TabsTrigger value="customer">Customer</TabsTrigger>
                            <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
                            <TabsTrigger value="delivery">Delivery</TabsTrigger>
                            <TabsTrigger value="admin">Admin</TabsTrigger>
                        </TabsList>

                        <TabsContent value="customer">
                            {renderForm("Customer", "customer")}
                        </TabsContent>
                        <TabsContent value="restaurant">
                            {renderForm("Restaurant", "restaurant")}
                        </TabsContent>
                        <TabsContent value="delivery">
                            {renderForm("Delivery", "delivery")}
                        </TabsContent>
                        <TabsContent value="admin">
                            {renderForm("Admin", "admin")}
                            <div className="mt-4 text-xs text-muted-foreground text-center">
                                <div>
                                    <span className="font-semibold">Username:</span> {ADMIN_USERNAME}
                                </div>
                                <div>
                                    <span className="font-semibold">Password:</span> {ADMIN_PASSWORD}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <div className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link
                            to={`/register${role && role !== "admin" ? `?role=${role}` : ""}`}
                            className="text-primary underline-offset-4 hover:underline font-medium"
                        >
                            Sign up
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoginPage;
