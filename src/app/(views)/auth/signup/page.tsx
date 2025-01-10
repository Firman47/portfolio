"use client";

import React, { useEffect, useState } from "react";
import { SignUp, SignUpType } from "@/utils/auth";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaEye, FaEyeSlash, FaGithub, FaGoogle } from "react-icons/fa";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ClientSafeProvider, getProviders, signIn } from "next-auth/react";
import Loading from "@/components/ui/loading";

export default function SignUpPage() {
  const [passHide, setPassHide] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [googleProvider, setGoogleProvider] =
    useState<ClientSafeProvider | null>(null);
  const [gitHubProvider, setGitHubProvider] =
    useState<ClientSafeProvider | null>(null);

  const [formData, setFormData] = useState<SignUpType>({
    full_name: "",
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState({
    status: true,
    message: "",
  });

  const router = useRouter();

  const togglePassHide = () => {
    setPassHide(!passHide);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const LoginForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await SignUp(formData);

      if (response.status) {
        router.push(
          `/auth/verification?email=${encodeURIComponent(formData.email)}`
        );
      } else {
        setMessage(response);
      }
    } catch (err) {
      console.error("Login error :", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchProviders = async () => {
      const providers = await getProviders();

      if (providers && providers.google) {
        setGoogleProvider(providers.google);
      }

      if (providers && providers.github) {
        setGitHubProvider(providers.github);
      }
    };

    fetchProviders();
  }, []);

  return (
    <>
      <section className=" h-screen flex  flex-col items-center justify-center gap-2">
        {!message.status ? (
          <Alert variant="destructive" className="w-[350px] mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{message.message}</AlertDescription>
          </Alert>
        ) : (
          ""
        )}

        <Tabs defaultValue="signup" className="w-[350px] mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <Link href="/auth/signin">
              <TabsTrigger value="signin" className="w-full">
                Sign In
              </TabsTrigger>
            </Link>

            <Link href="/auth/signup">
              <TabsTrigger value="signup" className="w-full">
                Sign Up{" "}
              </TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>

        <Card className="w-[350px] mx-auto">
          <CardHeader className="flex items-center justify-center p-4 border-b w-full ">
            <CardTitle className="text-center">Sign Up</CardTitle>
          </CardHeader>

          <form onSubmit={LoginForm}>
            <div className="p-4 space-y-4">
              <CardContent className="space-y-4 p-0">
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="username_or_email">Full Name </Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      type="text"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="username_or_email">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      type="text"
                      placeholder="Enter your username"
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="username_or_email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="Enter your username or email"
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        type={passHide ? "password" : "text"}
                        id="password"
                        name="password"
                        value={formData.password}
                        placeholder="Enter your password"
                        onChange={handleChange}
                        className="pr-10"
                        required
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

              <CardFooter className="p-0 flex flex-col gap-4">
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" /> : "Sign Up"}
                </Button>

                <div className="w-full flex gap-2">
                  {googleProvider && gitHubProvider ? (
                    <>
                      <Button
                        type="button"
                        variant={"outline"}
                        className="w-full"
                        onClick={() => signIn(googleProvider?.id)}
                      >
                        <FaGoogle /> {googleProvider?.name}
                      </Button>

                      <Button
                        type="button"
                        variant={"outline"}
                        className="w-full"
                        onClick={() => signIn(gitHubProvider?.id)}
                      >
                        <FaGithub /> {gitHubProvider?.name}
                      </Button>
                    </>
                  ) : (
                    <Loading open={true} />
                  )}
                </div>
              </CardFooter>
            </div>
          </form>
        </Card>
      </section>
    </>
  );
}
