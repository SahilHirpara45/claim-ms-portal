"use client";
import DashDashDatePickerWithRange from "@/components/dash-date-picker";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import Select from "react-select";

const financialData = {
  costs: [
    { id: 1, description: "Equipment Purchase", amount: 1000, date: "2024-07-01" },
    { id: 2, description: "Office Rent", amount: 2000, date: "2024-07-05" },
  ],
  revenues: [
    { id: 1, description: "Service Charge", amount: 3000, date: "2024-07-02" },
    { id: 2, description: "Consultation Fee", amount: 1500, date: "2024-07-10" },
  ],
  pendingPayments: [
    { id: 1, description: "Client Invoice", amount: 2500, date: "2024-07-15" },
    { id: 2, description: "Subscription Fee", amount: 1200, date: "2024-07-20" },
  ],
};

const FinancialReports = () => {
  const [dateRange, setDateRange] = useState({ fromDate: null, toDate: null });
  const [resetDate, setResetDate] = useState(false);
  const [filter, setFilter] = useState("all");

  const handleDateChange = (dates) => {
    setDateRange(dates);
    setResetDate(true);
  };

  const handleFilterChange = (selectedOption) => {
    setFilter(selectedOption.value);
  };

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "costs", label: "Costs" },
    { value: "revenues", label: "Revenues" },
    { value: "pendingPayments", label: "Pending Payments" },
  ];

  const renderFinancialData = () => {
    let filteredData = [];
    if (filter === "all") {
      filteredData = [
        ...financialData.costs,
        ...financialData.revenues,
        ...financialData.pendingPayments,
      ];
    } else {
      filteredData = financialData[filter];
    }

    return filteredData.map((item) => (
      <div key={item.id} className="p-4 border rounded-lg shadow-md bg-white mb-4">
        <h3 className="text-lg font-bold text-gray-800">{item.description}</h3>
        <p className="text-gray-600">Amount: ${item.amount}</p>
        <p className="text-gray-600">Date: {item.date}</p>
      </div>
    ));
  };

  return (
    <>
      <div className="flex justify-between mb-6">
        <Breadcrumbs>
          <BreadcrumbItem>Menus</BreadcrumbItem>
          <BreadcrumbItem>
            <Link href="/reports">Reports</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>Financial Report</BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div>
        <Card className="col-span-12">
          <CardHeader className="sm:flex-row sm:items-center gap-3">
            <div className="flex-1 text-xl font-medium text-default-700 whitespace-nowrap">
              Financial Report
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col md:flex-row items-center gap-4 justify-between w-full">
              <Select
                className="w-full md:w-1/3 lg:w-1/4"
                classNamePrefix="react-select"
                options={filterOptions}
                onChange={handleFilterChange}
                placeholder="Filter by"
              />
               <DashDashDatePickerWithRange
                onDateChange={handleDateChange}
                isActive={filter === ""}
                resetDate={resetDate}
              />
            </div>
            {renderFinancialData()}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default FinancialReports;
