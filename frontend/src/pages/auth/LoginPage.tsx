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
    const [role, setRole] = useState<UserRole>(defaultRole);

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

        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password,
                role,
            });

            const userData = response.data.user;

            // Save to localStorage
            localStorage.setItem("foodFusionUser", JSON.stringify(userData));

            // Update global state
            setUser(userData);
            setIsAuthenticated(true);

            toast.success(`Welcome back, ${userData.name}!`);

            // Redirect based on role
            if (role === "customer") {
                navigate("/customer/dashboard");
            } else if (role === "restaurant") {
                navigate("/restaurant/dashboard");
            } else {
                navigate("/delivery/dashboard");
            }
        } catch (error: any) {
            setLoginError(error.response?.data?.message || "Login failed");
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to render the form for each role
    const renderForm = (roleLabel: string, roleValue: UserRole) => (
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
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor={`${roleValue}-password`}>Password</Label>
                        <Link
                            to="/forgot-password"
                            className="text-sm text-primary underline-offset-4 hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <Input
                        id={`${roleValue}-password`}
                        type="password"
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
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
                    <Tabs value={role} onValueChange={(value) => setRole(value as UserRole)}>
                        <TabsList className="grid grid-cols-3 mb-6">
                            <TabsTrigger value="customer">Customer</TabsTrigger>
                            <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
                            <TabsTrigger value="delivery">Delivery</TabsTrigger>
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
                    </Tabs>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <div className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link
                            to={`/register${role ? `?role=${role}` : ""}`}
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
