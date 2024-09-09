"use client";
import { Button } from "@/components/ui/button";
import darkImage from "@/public/images/error/dark-404.png";
import lightImage from "@/public/images/error/light-404.png";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
const ErrorBlock = () => {
  const { theme } = useTheme();
  const { data: session, status } = useSession();

  const getRedirectPath = () => {
    if (status === "authenticated" && session) {
      // switch (session.role) {
      //   case "superAdmin":
      //     return "/dashboard";
      //   case "company":
      //     return "/company-dashboard";
      //   case "employee":
      //     return "/employee-dashboard";
      //   default:
      //     return "/";
      // }
      return "/dashboard";
    }
    return "/";
  };

  const redirectPath = getRedirectPath();

  return (
    <div className="min-h-screen  overflow-y-auto flex justify-center items-center p-10">
      <div className="w-full flex flex-col items-center">
        <div className="max-w-[740px]">
          <Image
            src={theme === "dark" ? darkImage : lightImage}
            alt="error image"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mt-16 text-center">
          <div className="text-2xl md:text-4xl lg:text-5xl font-semibold text-default-900">
            Ops! Page Not Found
          </div>
          <div className="mt-3 text-default-600 text-sm md:text-base">
            The page you are looking for might have been removed had <br /> its
            name changed or is temporarily unavailable.
          </div>
          <Button asChild className="mt-9  md:min-w-[300px]" size="lg">
            <Link href={redirectPath}>Go to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBlock;
