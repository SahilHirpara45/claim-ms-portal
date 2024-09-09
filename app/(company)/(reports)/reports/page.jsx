"use client";
import {
  Graph,
} from "@/components/svg";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const ReportCard = ({ title, description, route, color }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(route);
  };

  return (
    <div
    onClick={handleClick}
    className={`cursor-pointer p-6 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${color} flex flex-col items-center justify-center text-center`}
  >
<Graph className="w-16 h-16 mb-4" />
    <h2 className="text-xl font-bold mb-2">{title}</h2>
    {/* <p className="text-gray-600">{description}</p> */}
  </div>
  );
};

const Reports = () => {
  const reportData = [
    {
      id: 1,
      title: "Repair Status",
      description: "Daily, weekly, and monthly reports on repair status",
      route: "/reports/repair-report",
      color: "bg-blue-50"
    },
    {
      id: 2,
      title: "Financial Report",
      description: "Detailed financial reports (costs, revenues, pending payments)",
      route: "/reports/financial-report",
      color: "bg-green-50"
    },
    {
      id: 3,
      title: "Technician Performance",
      description: "Technician performance reports",
      route: "/reports/technician-performance-report",
      color: "bg-yellow-50"
    }
  ];

  return (
    <>
      <div className="flex justify-between">
        <Breadcrumbs>
          <BreadcrumbItem>Menus</BreadcrumbItem>
          <BreadcrumbItem>Reports</BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="mt-4 space-y-5">
        <Card className="mt-6">
          <CardHeader className="flex-row items-center border-none mb-0">
            <CardTitle className="flex-1 text-xl font-medium text-default-900">Reports</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportData.map((report) => (
                <ReportCard
                  key={report.id}
                  title={report.title}
                  description={report.description}
                  route={report.route}
                  color={report.color}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Reports;
