"use client";

import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [passHide, setPassHide] = useState(true);

  const togglePassHide = () => {
    setPassHide(!passHide);
  };
  return (
    <section className="w-full flex items-center  h-screen">
      <Card className="w-[350px] mx-auto">
        <CardHeader className="flex items-center justify-center p-4 border-b w-full ">
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>

        <div className="p-4 space-y-4">
          <CardContent className="space-y-4 p-0">
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Username</Label>
                  <Input id="name" placeholder="Name of your project" />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      type={passHide ? "password" : "text"}
                      id="password"
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
            </form>
          </CardContent>

          <CardFooter className="p-0">
            <Button className="w-full">Login</Button>
          </CardFooter>
        </div>
      </Card>
    </section>
  );
}
