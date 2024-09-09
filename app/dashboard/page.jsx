"use client";

import {
  getAdminListData,
  getTrendDataAction,
} from "@/action/dashboardAction/dashboard-action";
import DashboardSelect from "@/components/dasboard-select";
import DashDashDatePickerWithRange from "@/components/dash-date-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import BasicLineChart from "./components/line-chart.jsx";
import ReportsCard from "./components/reports";
import TopBrowserChart from "./components/top-browser-chart.jsx";
import WelcomeBlock from "./components/welcome-block";
import { getUserMeAction } from "@/action/auth-action.js";
import { Plus } from "lucide-react";
import Link from "next/link";

const ProjectPageView = ({ trans }) => {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("today");
  const [dateRange, setDateRange] = useState({ fromDate: null, toDate: null });
  const [resetDate, setResetDate] = useState(false);
  const [selectedTab, setSelectedTab] = useState("monthly");

  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useQuery({
    queryKey: ["userMe"],
    queryFn: () => getUserMeAction(session.jwt),
    enabled: !!session?.jwt,
  });

  useEffect(() => {
    if (status === "authenticated" && session) {
      setTitle(
        session.role === "superAdmin"
          ? "(Super Admin)"
          : session.role === "employee"
          ?  userData?.data?.userId?.designation
          : session.role === "company"
          ? "(Company)"
          : ""
      );
    }
  }, [status, session, userData]);

  const role = session?.role;
  const isEmployee = role === "employee";
  const isCompany = role === "company";

  const PERMISSION_CREATE_JOBCARD =
    userData?.data?.userId?.permissionId?.jobCard?.create;

  const CREATED_USER_ROLE = userData?.data?.userId?.designation;

  const {
    data: dashboardData,
    error,
    refetch: dashdataRefetch,
  } = useQuery({
    queryKey: ["getAdminData", filter, dateRange],
    queryFn: () => {
      const payload = {
        startDate: dateRange.fromDate,
        endDate: dateRange.toDate,
      };

      if (filter !== "") {
        payload.range = filter;
      }

      return getAdminListData(payload);
    },
  });

  const {
    data: trendData,
    refetch: trendRefetch,
  } = useQuery({
    queryKey: ["getTrendDataAction"],
    queryFn: () => getTrendDataAction({}),
  });

  const handleDateChange = (dates) => {
    setDateRange(dates);
    setFilter("");
    setResetDate(false);
    dashdataRefetch();
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setDateRange({ fromDate: null, toDate: null });
    setResetDate(true);
    dashdataRefetch();
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const getButtonClassName = (buttonFilter) =>
    filter === buttonFilter ? "bg-primary text-white" : "shadow-md";

  const generateXAxisLabels = (tab) => {
    if (tab === "monthly") {
      return [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
    } else if (tab === "weekly") {
      return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    }
    return [];
  };

  const transformData = (data, labels) => {
    if (!data) return [];
    return labels.map((label) => data[label] || 0);
  };

  // const canCreateJobCard =
  //   PERMISSION_CREATE_JOBCARD && isEmployee && CREATED_USER_ROLE === "CSR"; canCreateJobCard

  const canCreateJobCard = 
    PERMISSION_CREATE_JOBCARD && 
    isEmployee && 
    (CREATED_USER_ROLE === "CSR" || CREATED_USER_ROLE === "Surveyor");

    // console.log(CREATED_USER_ROLE,PERMISSION_CREATE_JOBCARD,isEmployee,"canCreateJobCard")

  const xAxisLabels = generateXAxisLabels(selectedTab);
  const chartData =
    selectedTab === "monthly"
      ? transformData(trendData?.data?.monthWiseCount, xAxisLabels)
      : transformData(trendData?.data?.weekWiseCount, xAxisLabels);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center flex-wrap justify-between gap-4">
        <div className="text-2xl font-medium text-default-800">
          Dashboard {title}
        </div>
        <div className="flex justify-center items-center gap-4 flex-wrap">
          <Button
            asChild
            className={`${canCreateJobCard ? "" : "disable cursor-not-allowed"}`}
          >
            {canCreateJobCard ? (
              <Link href="/job-card/create">
                <Plus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                Open Job Card
              </Link>
            ) : (
              <> </>
            )}
          </Button>
          <Button
            className={getButtonClassName("today")}
            variant="outline"
            onClick={() => handleFilterChange("today")}
          >
            Today
          </Button>
          <Button
            className={getButtonClassName("yesterday")}
            variant="outline"
            onClick={() => handleFilterChange("yesterday")}
          >
            Yesterday
          </Button>
          <Button
            className={getButtonClassName("thisMonth")}
            variant="outline"
            onClick={() => handleFilterChange("thisMonth")}
          >
            This Month
          </Button>
          <Button
            className={getButtonClassName("lastMonth")}
            variant="outline"
            onClick={() => handleFilterChange("lastMonth")}
          >
            Last Month
          </Button>
          <DashDashDatePickerWithRange
            onDateChange={handleDateChange}
            isActive={filter === ""}
            resetDate={resetDate}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-12 lg:col-span-5">
          <WelcomeBlock data={dashboardData} session={session} />
        </div>
        <div className="col-span-12 md:col-span-12 lg:col-span-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4">
            <ReportsCard data={dashboardData} session={session} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <Card>
            <CardHeader className="border-none pb-0 mb-0">
              <div className="flex flex-wrap items-center gap-3">
                <CardTitle className="flex-1 whitespace-nowrap">
                  Average Trend
                </CardTitle>
                <div className="flex-none">
                  <DashboardSelect onTabChange={handleTabChange} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              <BasicLineChart
                data={chartData}
                xAxisLabels={xAxisLabels}
                selectedTab={selectedTab}
              />
            </CardContent>
          </Card>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <Card className="py-2.5">
            <CardHeader className="flex-row items-center justify-between gap-4 border-none">
              <CardTitle>Repair</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-8">
              <TopBrowserChart dashboardData={dashboardData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectPageView;
