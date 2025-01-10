"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  deleteAccount,
  deleteCockies,
  GetByEmail,
  resendVerification,
  verificationEmail,
} from "@/utils/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/components/ui/loading";
import { Button } from "@/components/ui/button";

interface UserType {
  username: string;
  email: string;
}

export default function VerficationPage() {
  const [data, setData] = useState<UserType>();
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [statusVerifiction, setStatusVerifiction] = useState(false);

  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const code = searchParams.get("code");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const response = await GetByEmail(email as string);
      if (response) {
        setTimer(60);
      }

      setData(response.data);
    };

    fetchData();
  }, [email]);

  useEffect(() => {
    if (email && code) {
      const verificationHandler = async () => {
        try {
          setLoading(true);
          const response = await verificationEmail({
            email: email as string,
            code: code as string,
          });

          if (response) {
            setStatusVerifiction(true);
            setTimer(0);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      verificationHandler();
    }
  }, [email, code]);

  const resendVerificationHandler = async () => {
    try {
      const response = await resendVerification(email as string);

      if (response) {
        setTimer(60);
      }
    } catch (error) {
      console.error("error : " + error);
    } finally {
      setLoading(false);
      setStatusVerifiction(false);
    }
  };

  const deleCockiesHandler = async () => {
    try {
      setLoading(true);
      const response = await deleteCockies();
      if (response) {
        router.push("/auth/signin");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setStatusVerifiction(false);
    }
  };

  const registerAgainHandler = async () => {
    try {
      setLoading(true);
      const response = await deleteCockies();
      await deleteAccount(email as string);
      if (response) {
        setStatusVerifiction(false);

        router.push("/auth/signup");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setStatusVerifiction(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer]);

  return (
    <>
      <section className=" h-screen flex  flex-col items-center justify-center gap-2">
        <Card className="w-[350px] mx-auto">
          <CardHeader className="flex items-center justify-center p-4 border-b w-full">
            <CardTitle className="text-center">Verification</CardTitle>
          </CardHeader>

          <div className="p-4 text-center flex flex-col items-center gap-3">
            {!statusVerifiction ? (
              <>
                <h3 className="text-xl">Please check your email</h3>

                <p className="text-sm text-gray-500">
                  A verification link has been sent to:{" "}
                  <strong>{data?.email}</strong>. Please follow the instructions
                  to verify your account.
                </p>

                <p className="text-sm text-gray-600">
                  If you did not receive the email, check your spam folder or
                  click the button below to resend the verification link.
                </p>

                <p className="text-sm text-gray-600">
                  If the verification email isn&apos;t in your inbox within a
                  few minutes, make sure you entered the correct email address.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl">
                  Your account has been successfully verified
                </h3>

                <p className="text-sm text-gray-500">
                  Your account has been successfully verified. You can now
                  login.
                </p>
                <p className="text-sm text-gray-600">
                  You may continue to the login page by clicking the button
                  below.
                </p>
              </>
            )}

            {!statusVerifiction ? (
              <div className="flex gap-2">
                <Button
                  onClick={resendVerificationHandler}
                  className="w-full"
                  variant={"secondary"}
                  disabled={timer > 0}
                >
                  {timer > 0
                    ? `Wait ${timer}s before retrying`
                    : "Resend Verification Email"}
                </Button>

                <Button
                  onClick={registerAgainHandler}
                  className="w-full"
                  variant={"outline"}
                >
                  Register Again
                </Button>
              </div>
            ) : (
              <Button
                className="w-full"
                onClick={async () => await deleCockiesHandler()}
              >
                Continue to Login
              </Button>
            )}
          </div>
        </Card>

        <Loading open={loading} />
      </section>
    </>
  );
}
