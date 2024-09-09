"use client";
import DashDashDatePickerWithRange from "@/components/dash-date-picker";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import Select from "react-select";

const RepairReports = () => {
  const [dateRange, setDateRange] = useState({ fromDate: null, toDate: null });
  const [resetDate, setResetDate] = useState(false);
  const [filter, setFilter] = useState("");

  const handleDateChange = (dates) => {
    setDateRange(dates);
    setResetDate(true);
  };

  return (
    <>
      <div className="flex justify-between mb-6">
        <Breadcrumbs>
          <BreadcrumbItem>Menus</BreadcrumbItem>
          <BreadcrumbItem>
            <Link href="/reports">Reports</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>Repair Report</BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div>
        <Card className="col-span-12">
          <CardHeader className="sm:flex-row sm:items-center gap-3">
            <div className="flex-1 text-xl font-medium text-default-700 whitespace-nowrap">
              Repair Report
            </div>
            <div className="flex-none flex items-center gap-4"></div>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col md:flex-row items-center gap-4 justify-between w-full">
              <DashDashDatePickerWithRange
                onDateChange={handleDateChange}
                isActive={filter === ""}
                resetDate={resetDate}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default RepairReports;
