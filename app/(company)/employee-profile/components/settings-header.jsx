"use client";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Home } from "lucide-react";
import coverImage from "@/public/images/all-img/user-cover.png";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import Link from "next/link";

const SettingsHeader = () => {
  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem>
        <Link href="/dashboard" className="hover:underline">
          <Home className="h-4 w-4" />
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link href="/employee-profile" className="hover:underline">
            User Profile
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>Settings</BreadcrumbItem>
      </Breadcrumbs>
      {/* <Card className="mt-6 rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div
           className="relative h-[240px] lg:h-[240px] rounded-t-2xl w-full bg-no-repeat bg-cover"
            style={{ backgroundImage: `url(${coverImage.src})` }}
          >
            <Button
              className="absolute bottom-5 right-6 rounded px-5 bg-primary text-white hover:bg-primary-dark"
              size="sm"
            >
              <Icon className="w-4 h-4 mr-1" icon="heroicons:pencil-square" />
              Change Cover
            </Button>
          </div>
        </CardContent>
      </Card> */}
    </>
  );
};

export default SettingsHeader;
