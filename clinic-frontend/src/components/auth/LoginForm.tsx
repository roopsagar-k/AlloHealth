"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState("");
  const router = useRouter();

  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      setEmailError(
        validateEmail(value) ? "" : "Please enter a valid email address"
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axiosInstance.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.token) {
        toast({
          title: "Login Successful",
          description: "You have successfully logged in",
          variant: "default",
        });
        router.push("/dashboard");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast({
          title: "Login Failed",
          description:
            error.response.data.message || "An error occurred during login",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login Failed",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="bg-muted/40">
      <CardHeader>
        <CardTitle>Log in to Your Account</CardTitle>
        <CardDescription>
          Enter your credentials below to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email e.g. johndoe@gmail.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
            {emailError && <p className="text-sm text-red-500">{emailError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
