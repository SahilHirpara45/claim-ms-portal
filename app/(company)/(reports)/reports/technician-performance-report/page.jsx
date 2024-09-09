"use client";
import DashDashDatePickerWithRange from "@/components/dash-date-picker";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import Select from "react-select";
import ReportsDataTable from "@/components/common/data-table/report-table";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const technicians = [
  { id: 1, name: "Technician A" },
  { id: 2, name: "Technician B" },
  { id: 3, name: "Technician C" },
  { id: 5, name: "Technician D" },
  { id: 6, name: "Technician E" },
  { id: 7, name: "Technician F" },
  { id: 8, name: "Technician G" },
  { id: 9, name: "Technician H" },
  { id: 10, name: "Technician I" },
  { id: 11, name: "Technician J" },
  { id: 12, name: "Technician K" },
  { id: 13, name: "Technician L" },
];

const performanceData = {
  1: { jobsCompleted: 10, jobsPending: 2, rating: 4.5 },
  2: { jobsCompleted: 8, jobsPending: 5, rating: 4.0 },
  3: { jobsCompleted: 15, jobsPending: 1, rating: 5.0 },
  4: { jobsCompleted: 10, jobsPending: 2, rating: 4.5 },
  5: { jobsCompleted: 8, jobsPending: 5, rating: 4.0 },
  6: { jobsCompleted: 15, jobsPending: 1, rating: 5.0 },
  7: { jobsCompleted: 10, jobsPending: 2, rating: 4.5 },
  8: { jobsCompleted: 8, jobsPending: 5, rating: 4.0 },
  9: { jobsCompleted: 15, jobsPending: 1, rating: 5.0 },
  10: { jobsCompleted: 10, jobsPending: 2, rating: 4.5 },
  11: { jobsCompleted: 8, jobsPending: 5, rating: 4.0 },
  12: { jobsCompleted: 15, jobsPending: 1, rating: 5.0 },
  13: { jobsCompleted: 15, jobsPending: 1, rating: 5.0 },
};

const columns = [
  {
    accessorKey: "name",
    header: "Technician",
  },
  {
    accessorKey: "jobsCompleted",
    header: () => <div className="text-center">Jobs Completed</div>,
    cell: ({ row }) => (
      <div className="text-center">
          {row?.original?.jobsCompleted || "-"}
      </div>
    ),
  },
  {
    accessorKey: "jobsPending",
    header: () => <div className="text-center">Jobs Pending</div>,
    cell: ({ row }) => (
      <div className="text-center">
          {row?.original?.jobsPending || "-"}
      </div>
    ),
  },
  {
    accessorKey: "rating",
    header: () => <div className="text-center">Rating</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <Badge
          variant="soft"
          className="capitalize"
          color={
            (row?.original?.rating >= "4.5" && "success") ||
            (row?.original?.rating >= "3.5" && "info") ||
            (row?.original?.rating <= "3.5" && "destructive")
          }
        >
          {row?.original?.rating || "-"}
          <Star className=" ml-1 h-3 w-3" />
        </Badge>
      </div>
    ),
  },
];
const TechnicianData = [
  {
    name: "John Doe",
    jobsCompleted: 15,
    jobsPending: 3,
    rating: 4.5,
  },
  {
    name: "Jane Smith",
    jobsCompleted: 20,
    jobsPending: 1,
    rating: 4.8,
  },
  {
    name: "Mike Johnson",
    jobsCompleted: 10,
    jobsPending: 5,
    rating: 4.2,
  },
  {
    name: "Emily Davis",
    jobsCompleted: 18,
    jobsPending: 2,
    rating: 4.7,
  },
  {
    name: "Chris Brown",
    jobsCompleted: 12,
    jobsPending: 4,
    rating: 4.3,
  },
  {
    name: "Anna White",
    jobsCompleted: 22,
    jobsPending: 0,
    rating: 3,
  },
  {
    name: "David Wilson",
    jobsCompleted: 8,
    jobsPending: 6,
    rating: 3.5,
  },
  {
    name: "Sophia Martinez",
    jobsCompleted: 17,
    jobsPending: 3,
    rating: 4.6,
  },
  {
    name: "James Taylor",
    jobsCompleted: 14,
    jobsPending: 2,
    rating: 4.4,
  },
  {
    name: "Olivia Harris",
    jobsCompleted: 19,
    jobsPending: 1,
    rating: 2.7,
  },
];
const pagination = [
  {
    totalItems: 12,
    totalPages: 2,
    currentPage: 2,
    pageSize: 10,
    hasNextPage: false,
    hasPreviousPage: true,
  },
];

const TechnicianPerformanceReport = () => {
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [dateRange, setDateRange] = useState({ fromDate: null, toDate: null });
  const [resetDate, setResetDate] = useState(false);
  const [filter, setFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchString, setSearchString] = useState("");
  const [tableLoading, setTableLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleTechnicianChange = (selectedOption) => {
    setSelectedTechnician(selectedOption ? selectedOption.value : null);
  };

  const technicianOptions = [
    { value: null, label: "All Technicians" },
    ...technicians.map((technician) => ({
      value: technician.id,
      label: technician.name,
    })),
  ];

  const handleDateChange = (dates) => {
    setDateRange(dates);
    setResetDate(true);
  };

  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);
  const { data, error, refetch } = useQuery({
    // keepPreviousData: true,
  });

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    requestAnimationFrame(() => {
      refetch();
    });
  };

  const lable = "hello"

  return (
    <>
      <div className="flex justify-between mb-6">
        <Breadcrumbs>
          <BreadcrumbItem>Menus</BreadcrumbItem>
          <BreadcrumbItem>
            <Link href="/reports">Reports</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>Technician Performance</BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div>
        <Card className="col-span-12">
          <CardHeader className="sm:flex-row sm:items-center gap-3">
            <div className="flex-1 text-xl font-medium text-default-700 whitespace-nowrap">
              Technician Performance Report
            </div>
            <div className="flex-none flex items-center gap-4"></div>
          </CardHeader>
          <CardContent className="p-0">
            {/* <div className="mb-6 flex flex-col md:flex-row items-center gap-4 justify-between w-full">
              <div className="w-full flex items-center gap-4">
                <label
                  htmlFor="technician-select"
                  className="text-lg font-medium text-gray-700"
                >
                  Select Technician:
                </label>
                <Select
                  className="w-full md:w-auto lg:w-1/4"
                  classNamePrefix="react-select"
                  id="technician-select"
                  options={technicianOptions}
                  onChange={handleTechnicianChange}
                  placeholder="Select a technician"
                />
              </div>
              <DashDashDatePickerWithRange
                onDateChange={handleDateChange}
                isActive={filter === ""}
                resetDate={resetDate}
              />
            </div> */}
            <ReportsDataTable
              data={TechnicianData || []}
              filterPlaceHolder="Employees Name"
              searchString={searchString}
              setSearchString={setSearchString}
              columns={columns}
              pageIndex={pageIndex}
              pagination={pagination}
              pageSize={pageSize}
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
              pageCount={pagination?.totalPages || 0}
              tableLoading={tableLoading}
              startDate={startDate}
              endDate={endDate}
              handleStartDateChange={(date) => setStartDate(date)}
              handleEndDateChange={(date) => setEndDate(date)}
              hiddenFilter={true}
              refetch={refetch}
              handleReset={handleReset}
              lable={lable}
              // handleViewClick={handleCustomerView}
              // rowClickable
              // handleDeleteSelected={handleDeleteSelected}
              // showCheckbox={data?.data?.customers.length > 0 ? true : false}
              // setSelectedRows={setSelectedRows}
              // selectedRows={selectedRows}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default TechnicianPerformanceReport;
