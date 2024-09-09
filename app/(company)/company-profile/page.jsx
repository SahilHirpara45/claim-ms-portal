"use client"
import { useQuery } from "@tanstack/react-query";
import About from "./overview/about";
import ProfileProgress from "./overview/profile-progress";
import UserInfo from "./overview/user-info";
import { getUserMeAction } from "@/action/auth-action";
import { useSession } from "next-auth/react";
const Overview = () => {
  const { data: session } = useSession();
  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useQuery({
    queryKey: ["userMe"],
    queryFn: () => getUserMeAction(session.jwt),
    enabled: !!session?.jwt, // Only run the query if the token is available
  });

  return (
    <div className="pt-6 grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-12 space-y-6">
        {/* <ProfileProgress /> */}
        <UserInfo userData={userData} />
      </div>
    </div>
  );
};

export default Overview;
