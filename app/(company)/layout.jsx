"use client";
import DashBoardLayoutProvider from "@/provider/dashboard.layout.provider";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import LayoutLoader from "@/components/layout-loader";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
const layout = ({ children, params: { lang } }) => {
  // const session = await getServerSession(authOptions);
  // console.log(session, "session");

  // if (!session?.user?.email) {
  //   redirect("/");
  // }
  //new

  const { data: session, status, update } = useSession();
  const router = useRouter();
  // useEffect(() => {
  //   if (
  //     (status === "authenticated" && session?.role !== "company") ||
  //     session?.role === "employee"
  //   ) {
  //     router.push("/404");
  //   } else if (status === "unauthenticated") {
  //     router.push("/");
  //   }
  // }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated") {
      if (
        session?.role !== "employee" &&
        session?.role !== "company" &&
        session?.role !== "superAdmin"
      ) {
        router.push("/404");
      }
    } else if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, session, router]);

  // const { data: session, status, update } = useSession();
  if (typeof window !== "undefined") {
    if (session) {
      localStorage.setItem("token", session?.jwt);
    } else {
      localStorage.removeItem("token");
    }
  }

  //
  return (
    <>
      {status === "loading" && (
        <div>
          <LayoutLoader />
        </div>
      )}
      {status === "authenticated" &&
        (session?.role === "company" ||
          session?.role === "employee" ||
          session?.role === "superAdmin") && (
          <DashBoardLayoutProvider>{children}</DashBoardLayoutProvider>
        )}
    </>
  );
};

export default layout;
