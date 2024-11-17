"use client";

import { FormEvent, useEffect, useState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { object } from "yup";

console.log(process.env.NODE_ENV); // Output: "development" atau sesuai dengan nilai di .env.local

export default function Login() {
  const [passHide, setPassHide] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({
    status: true,
    message: "",
  });

  const router = useRouter();

  const togglePassHide = () => {
    setPassHide(!passHide);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    setIsLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${url}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      setMessage(result);
      if (result.status) {
        router.push("/admin/project");
        localStorage.setItem("data", JSON.stringify(result.data));
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="w-full flex  flex-col justify-center items-center  h-screen gap-4">
        {!message.status ? (
          <Alert variant="destructive" className="w-[350px] mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{message.message}</AlertDescription>
          </Alert>
        ) : (
          ""
        )}

        <Card className="w-[350px] mx-auto">
          <CardHeader className="flex items-center justify-center p-4 border-b w-full ">
            <CardTitle className="text-center">Login</CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <div className="p-4 space-y-4">
              <CardContent className="space-y-4 p-0">
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Email</Label>
                    <Input
                      id="name"
                      name="email"
                      placeholder="Name of your project"
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        type={passHide ? "password" : "text"}
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        className="pr-10"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        type="button"
                        onClick={togglePassHide}
                      >
                        {passHide ? <FaEyeSlash /> : <FaEye />}
                        <span className="sr-only">
                          Toggle password visibility
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-0">
                <Button className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
                </Button>
              </CardFooter>
            </div>
          </form>
        </Card>
      </section>
    </>
  );
}
