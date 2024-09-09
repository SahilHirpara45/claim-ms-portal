"use client";
import { getGarageInsuranceCompany, getSingleInsurance } from "@/action/companyAction/insurance-action";
import {
  Card,
  CardContent,
  CardHeader
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";



const CompanyView = () => {
  const { data: session } = useSession();
  const params = useParams();
  const insuranceId = params?.view_insurance;
  const role = session?.role;
  const {
    isLoading,
    isError,
    data: InsuranceCompanyData,
    error,
  } = useQuery({
    queryKey: ["InsuranceCompanyData", insuranceId],
    queryFn: () => {
      if (role === "company") {
        return getGarageInsuranceCompany(insuranceId);
      } else if (role === "superAdmin") {
        return getSingleInsurance(insuranceId);
      }
      return Promise.reject(new Error("Invalid role"));
    },
    enabled: !!insuranceId && (role === "company" || role === "superAdmin"),
    retry: false,
  });

  const formatDate = (isoDate) => {
    if (!isoDate) return ""; // Handle case where date is not available
    const date = new Date(isoDate);
    const day = ("0" + date.getUTCDate()).slice(-2);
    const month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  };
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error fetching data...</p>;
  }
  return (
    <>
      
      <div className="w-full flex flex-wrap justify-between gap-4 mt-4">
        <div className="w-full lg:w-full space-y-4">
          <Card className="border">
            <CardHeader className="flex flex-row items-center  gap-3 font-bold">
              <div className="flex flex-wrap items-center w-full justify-between">
                <div> Insurance Company Details</div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4 justify-between w-full">
              <div className="w-full flex flex-wrap justify-between gap-4">
                <div className="w-full lg:w-[48%] space-y-4">
                  <div className="">
                    <Label htmlFor="fullName" className="font-bold">
                      Company Name
                    </Label>
                    <div className="flex gap-2 w-full mt-1 ml-1">
                      <label>{InsuranceCompanyData?.companyName}</label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="font-bold">
                     Account Email
                    </Label>
                    <div className="flex gap-2 w-full  mt-1 ml-1">
                      <label>{InsuranceCompanyData?.companyEmail}</label>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <Label className="font-bold">Claims Email</Label>
                    <label className="mt-2 ml-1">
                      {InsuranceCompanyData?.claimsEmail}
                    </label>
                  </div>

                  <div className="flex flex-col">
                    <Label className="font-bold">Contact Email</Label>
                    <label className="mt-2 ml-1">
                      {InsuranceCompanyData?.contactEmail}
                    </label>
                  </div>
                </div>

                <div className="w-full lg:w-[48%] space-y-4">
                  <div>
                    <Label htmlFor="contactNo" className="font-bold">
                    Contact No.
                    </Label>
                    <div className="flex gap-2 w-full">
                      <label className="mt-1 ml-1">
                        {InsuranceCompanyData?.contactNo}
                      </label>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="Description" className="font-bold">
                    Description
                    </Label>
                    <div className="flex gap-2 w-full">
                      <label className="mt-1 ml-1">
                      {InsuranceCompanyData?.description}
                      </label>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="CompanyWebsite" className="font-bold">
                    Company Website
                    </Label>
                    <div className="flex gap-2 w-full">
                      <label className="mt-1 ml-1">
                        {InsuranceCompanyData?.companyWebsite}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  
    </>
  );
};

export default CompanyView;
