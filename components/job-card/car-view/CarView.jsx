"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const CarView = ({ jobcardData }) => {
  const formatDate = (isoDate) => {
    if (!isoDate) return ""; // Handle case where date is not available
    const date = new Date(isoDate);
    const day = ("0" + date.getUTCDate()).slice(-2);
    const month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  };

  if (!jobcardData?.carId) {
    return (
      <div className="w-full flex flex-wrap justify-between gap-4">
        <div className="w-full lg:w-full space-y-4">
          <Card className="border">
            <CardHeader className="flex flex-row items-center gap-3 font-bold">
              <div className="flex items-center w-full justify-between">
                <div>Car and Insurance</div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4 justify-between w-full">
              <div className="w-full flex flex-wrap justify-between gap-4">
                <p>No Car and Insurance available.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="w-full flex flex-wrap justify-between gap-4 mt-4">
        <div className="w-full lg:w-full space-y-4">
          <Card className="border">
            <CardHeader className="flex flex-row items-center  gap-3 font-bold">
              <div className="flex flex-wrap items-center w-full justify-between">
                <div>Car and Insurance</div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4 justify-between w-full">
              <div className="w-full flex flex-wrap justify-between gap-4">
                <div className="w-full md:w-[48%] lg:w-[48%] space-y-4">
                  <div className="">
                    <Label htmlFor="fullName" className="font-bold">
                      Chassis No
                    </Label>
                    <div className="flex gap-2 w-full mt-1 ml-1">
                      <label>{jobcardData?.carId?.chassisNo}</label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="font-bold">
                      Model
                    </Label>
                    <div className="flex gap-2 w-full  mt-1 ml-1">
                      <label>{jobcardData?.carId?.model}</label>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <Label className="font-bold">Make</Label>
                    <label className="mt-2 ml-1">
                      {jobcardData?.carId?.make}
                    </label>
                  </div>

                  <div className="flex flex-col">
                    <Label className="font-bold">Current Insurer</Label>
                    <label className="mt-2 ml-1">
                      {jobcardData?.insuranceDetails?.currentInsurance}
                    </label>
                  </div>
                  <div>
                    {jobcardData?.isFault == false ? (
                      <>
                        <div>
                          <Label htmlFor="tcNo" className="font-bold">
                            New Insurance Company
                          </Label>
                          <div className="flex gap-2 w-full">
                            <label className="mt-1 ml-1">
                              {jobcardData?.newInsuranceCompany?.companyName}
                            </label>
                          </div>
                        </div>
                        <label className="mt-1 ml-1"></label>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>

                <div className="w-full md:w-[48%] lg:w-[48%] space-y-4">
                  <div>
                    <Label htmlFor="licenceNo" className="font-bold">
                      Plate Number
                    </Label>
                    <div className="flex gap-2 w-full">
                      <label className="mt-1 ml-1">
                        {jobcardData?.carId?.plateNumber}
                      </label>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="licenceIssueDate" className="font-bold">
                      Year
                    </Label>
                    <div className="flex gap-2 w-full">
                      <label className="mt-1 ml-1">
                        {jobcardData?.carId?.year}
                      </label>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="licenceExpiryDate" className="font-bold">
                      Trim
                    </Label>
                    <div className="flex gap-2 w-full">
                      <label className="mt-1 ml-1">
                        {jobcardData?.carId?.trim}
                      </label>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="tcNo" className="font-bold">
                      Insurance Expiry Date
                    </Label>
                    <div className="flex gap-2 w-full">
                      <label className="mt-1 ml-1">
                        {formatDate(
                          jobcardData?.insuranceDetails?.insuranceExpiryDate
                        )}
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

export default CarView;
