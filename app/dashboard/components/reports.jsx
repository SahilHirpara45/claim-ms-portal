"use client";

import { Cars } from "@/components/svg";
import { Card } from "@/components/ui/card";
import { Fragment } from "react";
import Counter from "./counter";

const ReportsCard = ({ data, session }) => {
  const reports = [
    {
      id: 1,
      name: "Total Car Received",
      count: data?.data?.numberOfCarsRecived || 0,
      rate: "8.2",
      icon: <Cars className="w-6 h-6 text-primary" />,
      color: "primary",
      role: ["superAdmin", "employee", "company"],
    },
    {
      id: 2,
      name: "Total Car Completed",
      count: data?.data?.numberOfCarsCompleted || 0,
      rate: "8.2",
      icon: <Cars className="w-6 h-6 text-success" />,
      color: "success",
      role: ["superAdmin", "employee", "company"],
    },
    {
      id: 3,
      name: "Total Car Awaiting Approval",
      count: data?.data?.numberOfCarsAwaitingApproval || 0,
      rate: "8.2",
      icon: <Cars className="w-6 h-6 text-destructive" />,
      color: "destructive",
      role: ["superAdmin", "employee", "company"],
    },
    {
      id: 4,
      name: "Total Car Delay",
      count: data?.data?.numberOfCarsDelay || 0,
      rate: "8.2",
      icon: <Cars className="w-6 h-6 text-warning" />,
      color: "warning",
      role: ["superAdmin", "employee", "company"],
    },
    {
      id: 5,
      name: "Total Car in Repair",
      count: data?.data?.numberOfCarsInRepairResult || 0,
      rate: "8.2",
      icon: <Cars className="w-6 h-6 text-info" />,
      color: "info",
      role: ["superAdmin", "employee", "company"],
    },
  ];

  const filteredReports = reports?.filter((report) =>
    report.role.includes(session?.role)
  );

  return (
    <Fragment>
      {filteredReports?.map((item) => (
        <Card
          key={item.id}
          className="rounded-lg p-4 xl:p-2 xl:py-6 2xl:p-6 flex flex-col items-center"
          // Adjust styles based on your design needs
          style={{
            background: `linear-gradient(to right, #${item.color} 0%, #${item.color}80 100%)`,
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div>
            <span
              className={`h-12 w-12 rounded-full flex justify-center items-center bg-${item.color}/10`}
            >
              {item.icon}
            </span>
          </div>
          <div className="mt-4 text-center">
            <div className="text-base font-medium text-gray-700">
              {item.name}
            </div>
            <div className={`text-3xl font-semibold text-${item.color} mt-1`}>
              <Counter from={0} to={item.count} />
            </div>
          </div>
        </Card>
      ))}
    </Fragment>
  );
};

export default ReportsCard;
