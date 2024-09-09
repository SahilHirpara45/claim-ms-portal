"use client";
import Image from "next/image";
import { Icon } from "@iconify/react";
import background from "@/public/images/auth/line.png";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import LogInForm from "@/components/auth/login-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import LayoutLoader from "@/components/layout-loader";

const LoginPage = () => {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  if (typeof window !== "undefined") {
    // console.log("login:-");
  }
  // useEffect(() => {
  //   if (status === "authenticated" && session.role==="superAdmin") {
  //     router.push("/dashboard");
  //   } else {
  //     router.push("/dashboard44");
  //   }
  // }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated") {
      // console.log("autheniticated page in login");
      // const redirectPath =
      //   session.role === "superAdmin"
      //     ? "/dashboard"
      //     : session.role === "employee"
      //     ? "/dashboard"
      //     : session.role === "company"
      //     ? "/dashboard"
      //     : "/";
      router.push("/dashboard");

      // router.push(redirectPath);
    }
    // else if (status === "unauthenticated") {
    //   router.push("/");
    // }
  }, [status, session, router]);

  return (
    <>
      {status === "loading" && (
        <div>
          <LayoutLoader />
        </div>
      )}
      {status === "unauthenticated" && (
        <div className="min-h-screen bg-background  flex items-center  overflow-hidden w-full">
          <div className="min-h-screen basis-full flex flex-wrap w-full  justify-center overflow-y-auto">
            <div
              className="basis-1/2 bg-primary w-full  relative hidden xl:flex justify-center items-center bg-gradient-to-br
          from-primary-600 via-primary-400 to-primary-600
         "
            >
              <Image
                src={background}
                alt="image"
                className="absolute top-0 left-0 w-full h-full "
              />
              <div className="relative z-10 backdrop-blur bg-primary-foreground/40 py-14 px-16 2xl:py-[84px] 2xl:pl-[50px] 2xl:pr-[50px] rounded max-w-[640px]">
                <div>
                  <div className=" flex justify-center">
                    <Image
                      src={"/lgm.png"}
                      alt="logo info"
                      width={250}
                      height={150}
                    />
                  </div>
                  <div className="text-4xl leading-[50px] 2xl:text-6xl 2xl:leading-[72px] font-semibold mt-2.5">
                    {/* <span className="text-default-600 dark:text-default-300  ">
                      ClaimMS
                    </span> */}
                    {/* <span className="text-default-900 dark:text-default-50">
                      Performance
                    </span> */}
                  </div>
                  <div className="mt-5 2xl:mt-8 text-default-900 dark:text-default-200  text-2xl font-medium">
                    Claim Management System
                  </div>
                </div>
              </div>
            </div>

            <div className=" min-h-screen basis-full md:basis-1/2 w-full px-4 py-5 flex justify-center items-center">
              <div className="lg:w-[480px] ">
                <LogInForm />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;
