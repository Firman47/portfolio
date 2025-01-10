"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FaGoogle, FaGithub } from "react-icons/fa";
import {
  getSession,
  signIn,
  getProviders,
  ClientSafeProvider,
} from "next-auth/react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Loading from "@/components/ui/loading";

interface SignInType {
  username_or_email: string;
  password: string;
}

export default function SignInPage() {
  const [passHide, setPassHide] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [googleProvider, setGoogleProvider] =
    useState<ClientSafeProvider | null>(null);
  const [gitHubProvider, setGitHubProvider] =
    useState<ClientSafeProvider | null>(null);

  const [formData, setFormData] = useState<SignInType>({
    username_or_email: "",
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
      const res = await signIn("credentials", {
        redirect: false,
        username_or_email: formData.username_or_email,
        password: formData.password,
      });

      const session = await getSession();

      if (res?.error) {
        setMessage({
          status: false,
          message: res.error,
        });
      } else {
        if (session?.user.role === "admin") {
          router.push("/admin/project");
        } else {
          router.push("/home");
        }
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

        <Tabs defaultValue="signin" className="w-[350px] mx-auto">
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
            <CardTitle className="text-center">Sign In</CardTitle>
          </CardHeader>

          <form onSubmit={LoginForm}>
            <div className="p-4 space-y-4">
              <CardContent className="space-y-4 p-0">
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Username or Email</Label>
                    <Input
                      id="username_or_email"
                      name="username_or_email"
                      value={formData.username_or_email}
                      onChange={handleChange}
                      placeholder="Enter your username or email"
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
                  {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
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
