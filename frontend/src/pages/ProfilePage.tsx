import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleProfileUpdate = () => {
    // In a real app, this would make an API call
    toast({
      description: "Address updated successfully",
    });
    setIsEditingProfile(false);
  };

  const handlePasswordUpdate = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    
    // In a real app, this would make an API call
    toast.success("Password updated successfully!");
    setIsEditingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const getRoleLabel = () => {
    switch(user.role) {
      case "customer":
        return "Customer";
      case "restaurant":
        return "Restaurant Owner";
      case "delivery":
        return "Delivery Driver";
      default:
        return "User";
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      <div className="space-y-8">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Manage your account details</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditingProfile ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setName(user.name);
                      setEmail(user.email);
                      setIsEditingProfile(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleProfileUpdate}>Save Changes</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Name</p>
                    <p>{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                    <p>{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Role</p>
                    <p>{getRoleLabel()}</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => setIsEditingProfile(true)}>Edit Profile</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Password Section */}
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Update your password</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditingPassword ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                      setIsEditingPassword(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handlePasswordUpdate}>Update Password</Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <Button onClick={() => setIsEditingPassword(true)}>Change Password</Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <Button
                variant="outline"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={logout}
              >
                Logout
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  toast({
                    title: "Delete Account",
                    description: "This feature is not implemented in the demo.",
                  });
                }}
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
