"use client";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { useSession } from "next-auth/react";
import AvtarImg from "@/public/images/avatar/avatar-4.jpg";
import { getUserMeAction } from "@/action/auth-action";
import { useQuery } from "@tanstack/react-query";

const Header = () => {
  const location = usePathname();
  const { data: session } = useSession();

  const menuItems = [
    {
      title: "Overview",
      link: "/company-profile",
    },
    {
      title: "Settings",
      link: "/company-profile/settings",
    },
  ];

  const { data: companyData, error: userError, isLoading: userLoading } = useQuery({
    queryKey: ["userMe"],
    queryFn: () => getUserMeAction(session.jwt),
    enabled: !!session?.jwt, // Only run the query if the token is available
  });

  return (
    <Fragment>
      <Breadcrumbs>
        <BreadcrumbItem>
          <Link href="/dashboard" className="hover:underline">
            <Home className="h-4 w-4" />
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>User Profile</BreadcrumbItem>
      </Breadcrumbs>
      <Card className="mt-6 rounded-t-2xl">
        <CardContent className="p-6 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Image
              src={companyData?.data?.userId?.avatar || AvtarImg}
              alt="User Avatar"
              width={128}
              height={128}
              className="h-20 w-20 lg:w-32 lg:h-32 rounded-full"
            />
            <div>
              <div className="text-xl lg:text-2xl font-semibold mb-1">
                {companyData?.data?.userId?.email || "User Email"}
              </div>
              <div className="text-xs lg:text-sm font-medium text-default-500">
                Role: {session?.role || "User Role"}
              </div>
            </div>
          </div>
          {/* <Button
            asChild
            className="hidden lg:flex rounded px-5"
            size="sm"
          >
            <Link href="/company-profile/settings">
              <Icon className="w-4 h-4 mr-1" icon="heroicons:pencil-square" />
              Edit
            </Link>
          </Button> */}
        </CardContent>
        <div className="flex flex-wrap justify-end gap-4 lg:gap-8  pb-4 px-6">
          {menuItems.map((item, index) => (
            <Link
              key={`user-profile-link-${index}`}
              href={item.link}
              className={cn(
                "text-sm font-semibold text-default-500 hover:text-primary relative lg:before:absolute before:-bottom-4 before:left-0 before:w-full lg:before:h-[1px] before:bg-transparent",
                {
                  "text-primary lg:before:bg-primary": location === item.link,
                }
              )}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </Card>
    </Fragment>
  );
};

export default Header;
