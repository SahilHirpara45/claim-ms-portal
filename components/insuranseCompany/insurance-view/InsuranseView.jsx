"use client";

import { getSingleInsurance } from "@/action/companyAction/insurance-action";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import CarListViewpage from "../carList-view/CarListViewpage";
import CompanyView from "../company-view/CopmpanyView";
import CustomerListView from "../customerList-view/CustomerListView";
import JobCardListPage from "../jobcardlist-view/jobCardList";

const InsuranceView = () => {
  const [activeTab, setActiveTab] = useState("CompanyDetail");
  const { data: session } = useSession();

  const renderTabContent = () => {
    switch (activeTab) {
      case "CompanyDetail":
        return <CompanyView />;
      case "JobCardView":
        return <JobCardListPage />;
      case "Customer":
        return <CustomerListView />;
      case "CarListView":
        return <CarListViewpage />;
      default:
        return null;
    }
  };

  const params = useParams();
  const insuranceId = params?.view_insurance;
  const role = session?.role;

  console.log(role, "role");

  const { data: InsuranceCompanyData, error } = useQuery({
    queryKey: ["InsuranceCompanyData", insuranceId],
    queryFn: () => getSingleInsurance(insuranceId),
    enabled: !!insuranceId,
    retry: false,
  });

  return (
    <div className="flex flex-col justify-start items-start gap-6">
      {/* {activeTab === "CompanyDetail" && InsuranceCompanyData?.banner && (
        <div
          className="w-full h-60 bg-contain bg-center bg-no-repeat rounded-lg mb-4"
          style={{ backgroundImage: `url(${InsuranceCompanyData.banner})` }}
        >
          <div className="w-full h-full bg-black bg-opacity-10 flex rounded-lg">
          </div>
        </div>
      )} */}
      <div className="flex justify-start items-center gap-4">
        <Avatar>
          <AvatarImage
            src={InsuranceCompanyData?.logo}
            className="rounded-full h-20 w-auto "
          />
          <AvatarFallback>{InsuranceCompanyData?.companyName}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-center items-start gap-3">
          {/* <div className="flex justify-center items-center gap-2">
            <span className="font-medium text-xl">Portal :</span>
            <span className="text-base">
              {InsuranceCompanyData?.companyPortal}
            </span>
          </div> */}
          <div className="flex justify-center items-center gap-2">
            <span className="text-base font-medium">Company Email :</span>
            <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
              {InsuranceCompanyData?.companyEmail || "mail"}
            </span>
          </div>
        </div>
      </div>
      <div className="flex space-x-4 bg-muted p-2 rounded-lg w-auto bg-[#6478B]">
        <button
          className={`px-4 py-2 rounded-lg hover:bg-muted/80 ${
            activeTab === "CompanyDetail"
              ? "bg-card text-card-foreground font-bold"
              : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("CompanyDetail")}
        >
          Company Details
        </button>
        {role !== "superAdmin" && (
          <>
            <button
              className={`px-4 py-2 rounded-lg hover:bg-muted/80 ${
                activeTab === "JobCardView"
                  ? "bg-card text-card-foreground font-bold"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("JobCardView")}
            >
              Job Cards
            </button>
            <button
              className={`px-4 py-2 rounded-lg hover:bg-muted/80 ${
                activeTab === "Customer"
                  ? "bg-card text-card-foreground font-bold"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("Customer")}
            >
              Customers
            </button>
            <button
              className={`px-4 py-2 rounded-lg hover:bg-muted/80 ${
                activeTab === "CarListView"
                  ? "bg-card text-card-foreground font-bold"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("CarListView")}
            >
              Cars
            </button>
          </>
        )}
      </div>
      <div className="mt-0 w-full">{renderTabContent()}</div>
    </div>
  );
};

export default InsuranceView;
