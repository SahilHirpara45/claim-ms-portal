"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import { getSingleJobCardAction } from "@/action/employeeAction/jobcard-action";
import { useQuery } from "@tanstack/react-query";
import JobDetails from "../job-details/JobDetails";
import CarView from "../car-view/CarView";

const CustomerView = () => {
  const params = useParams();
  const jobCardId = params?.view_jobcard;

  const {
    isLoading,
    isError,
    data: jobcardData,
    refetch
  } = useQuery({
    queryKey: ["jobcardData", jobCardId],
    queryFn: () => getSingleJobCardAction(jobCardId),
    enabled: !!jobCardId,
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
      <JobDetails jobcardData={jobcardData} jobCardId={jobCardId} refetch={refetch}/>
      <div className="w-full flex flex-wrap justify-between gap-4 mt-4">
        <div className="w-full lg:w-full space-y-4">
          <Card className="border">
            <CardHeader className="flex flex-row items-center  gap-3 font-bold">
              <div className="flex flex-wrap items-center w-full justify-between">
                <div> Customer Details</div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4 justify-between w-full">
              <div className="w-full flex flex-wrap justify-between gap-4">
                <div className="w-full md:w-[48%] lg:w-[48%] space-y-4">
                  <div className="">
                    <Label htmlFor="fullName" className="font-bold">
                      Customer Name
                    </Label>
                    <div className="flex gap-2 w-full mt-1 ml-1">
                      <label>{jobcardData?.customerId?.fullName}</label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="font-bold">
                      Email
                    </Label>
                    <div className="flex gap-2 w-full  mt-1 ml-1">
                      <label>{jobcardData?.customerId?.email}</label>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <Label className="font-bold">Mobile no</Label>
                    <label className="mt-2 ml-1">
                      {jobcardData?.customerId?.mobileNumber}
                    </label>
                  </div>

                  <div className="flex flex-col">
                    <Label className="font-bold">Emirate ID</Label>
                    <label className="mt-2 ml-1">
                      {jobcardData?.customerId?.customerEmiratesId}
                    </label>
                  </div>
                </div>

                <div className="w-full md:w-[48%] lg:w-[48%] space-y-4">
                  <div>
                    <Label htmlFor="licenceNo" className="font-bold">
                      Driving License Number
                    </Label>
                    <div className="flex gap-2 w-full">
                      <label className="mt-1 ml-1">
                        {jobcardData?.customerId?.documentsDetails?.licenceNo}
                      </label>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="licenceIssueDate" className="font-bold">
                      Driving License Issue
                    </Label>
                    <div className="flex gap-2 w-full">
                      <label className="mt-1 ml-1">
                        {formatDate(
                          jobcardData?.customerId?.documentsDetails
                            ?.licenceIssueDate
                        )}
                      </label>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="licenceExpiryDate" className="font-bold">
                      Driving License Expiry
                    </Label>
                    <div className="flex gap-2 w-full">
                      <label className="mt-1 ml-1">
                        {formatDate(
                          jobcardData?.customerId?.documentsDetails
                            ?.licenceExpiryDate
                        )}
                      </label>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="tcNo" className="font-bold">
                      TC Number
                    </Label>
                    <div className="flex gap-2 w-full">
                      <label className="mt-1 ml-1">
                        {jobcardData?.customerId?.documentsDetails?.tcNo}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <CarView jobcardData={jobcardData} />
    </>
  );
};

export default CustomerView;
