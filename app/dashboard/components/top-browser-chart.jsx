"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

import { themes } from "@/config/thems";
import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";

const TopBrowserChart = ({ height = 345, dashboardData = {} }) => {
  const { theme: config, setTheme: setConfig, isRtl } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config) || {};

  const InProgress = dashboardData.data?.totalInprogressJobcards || 0;
  const Completed = dashboardData.data?.totalCompletedJobcards || 0;
  const ReAssigned = dashboardData.data?.totalReAssignJobcards || 0;
  const Paid = dashboardData.data?.totalPaidJobcards || 0;
  const Unpaid = dashboardData.data?.totalUnpaidJobcards || 0;
  const Done = dashboardData.data?.totalDoneJobcards || 0;

  const series = [InProgress, Completed, ReAssigned, Paid, Unpaid, Done];

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    labels: [
      "In Progress",
      "Completed",
      "Re-Assigned",
      "Paid",
      "Unpaid",
      "Done",
    ],
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "14px",
        fontWeight: "500",
      },
    },
    stroke: {
      width: 0,
    },
    colors: [
      `hsl(${theme?.cssVars?.[mode === "dark" ? "dark" : "light"]?.primary})` || "#000000",
      "#3B82F6",
      "#EF4444",
      "#F97400",
      "#FACC15",
      "#F97316",
    ],
    tooltip: {
      theme: mode === "dark" ? "dark" : "light",
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    legend: {
      position: "bottom",
      labels: {
        colors: `hsl(${
          theme?.cssVars?.[mode === "dark" || mode === "system" ? "dark" : "light"]?.chartLabel
        })` || "#000000",
      },
      itemMargin: {
        horizontal: 10,
        vertical: 8,
      },
      markers: {
        width: 10,
        height: 10,
        radius: 10,
        offsetX: isRtl ? 5 : -5,
      },
    },
  };

  return (
    <Chart
      options={options}
      series={series}
      type="donut"
      height={height}
      width={"100%"}
    />
  );
};

export default TopBrowserChart;
