"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import { getSingleJobCardAction } from "@/action/employeeAction/jobcard-action";
import { useQuery, useMutation } from "@tanstack/react-query";
import { updateClaimAction } from "@/action/claimAction/claim-action";
import toast from "react-hot-toast";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { getUserMeAction } from "@/action/auth-action";
import { Checkbox } from "@/components/ui/checkbox";

const ClaimView = () => {
  const { data: session } = useSession();
  const [selectJobCard, setselectJobCard] = useState(null);
  const [initialStatus, setInitialStatus] = useState(null);
  const [noClaimNumber, setNoClaimNumber] = useState(false);
  const params = useParams();
  const router = useRouter();
  const jobCardId = params?.view_jobcard;
  const role = session?.role;

  const {
    control,
    setValue,
    watch,
    handleSubmit,
    setError,
    formState: { errors },
    clearErrors
  } = useForm({
    mode: "onChange",
  });

  const statusOptions = [
    { value: "Under Approval", label: "Under Approval" },
    { value: "Approved", label: "Approved" },
    { value: "Re-Submitted", label: "Re-Submitted" },
    { value: "Reject", label: "Reject" },
  ];

  const {
    isLoading,
    isError,
    data: jobcardData,
    refetch,
  } = useQuery({
    queryKey: ["jobcardData", jobCardId],
    queryFn: () => getSingleJobCardAction(jobCardId),
    enabled: !!jobCardId,
    retry: false,
  });

  const updateClaimMutation = useMutation({
    mutationKey: ["updateClaimMutation"],
    mutationFn: async ({ id, status, insuranceClaimNumber, noClaimNumber }) => {
      return await updateClaimAction(id, { status, insuranceClaimNumber, noClaimNumber });
    },
    onSuccess: (response) => {
      toast.success("Claim status updated successfully");
      const status = response?.data?.status;
      const jobCardId = response?.data?.jobCardId;
      if (status === "Approved" && role === "company") {
        handleAddQuotation(jobCardId);
      }
      refetch();
    },
    onError: (error) => {
      toast.error(error?.data?.message);
    },
  });

  const currentStatus = watch("status");
  const insuranceClaimNumberWatch = watch("insuranceClaimNumber");
  //console.log("insuranceClaimNumberWatch", insuranceClaimNumberWatch);

  const hasStatusChanged =
    initialStatus !== null && initialStatus !== currentStatus;

  const handleAssign = (data) => {
    const { status, insuranceClaimNumber, noClaimNumber } = data;

    // Check if the status is "Approved" and the claim number is not provided, unless "No Claim Number" is checked
    if (
      currentStatus === "Approved" &&
      !noClaimNumber &&
      (!insuranceClaimNumberWatch || insuranceClaimNumberWatch.length === 0)
    ) {
      setError("insuranceClaimNumber", {
        type: "manual",
        message: "Insurance Claim Number required when status is Approved",
      });
      return;
    }

    const claimId = jobcardData?.claimId?._id;
    if (claimId) {
      const updateData = { status, noClaimNumber }; // Include noClaimNumber in the payload
      if (insuranceClaimNumber && !noClaimNumber) {
        updateData.insuranceClaimNumber = insuranceClaimNumber;
      }

      updateClaimMutation.mutate({ id: claimId, ...updateData });
    }
  };


  useEffect(() => {
    if (jobcardData) {
      setValue("status", jobcardData?.claimId?.status);
      setValue(
        "insuranceClaimNumber",
        jobcardData?.claimId?.insuranceClaimNumber || ""
      );
      setValue("noClaimNumber", jobcardData?.claimId?.noClaimNumber || false);
      setNoClaimNumber(jobcardData?.claimId?.noClaimNumber || false);
      setInitialStatus(jobcardData?.claimId?.status);
    }
  }, [jobcardData, setValue]);

  const handleAddQuotation = (jobCardId) => {
    router.push(`/quotations/create/${jobCardId}`);
    setselectJobCard(jobCardId);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error fetching data...</p>;
  }

  if (!jobcardData?.claimId) {
    return (
      <div className="w-full flex flex-wrap justify-between gap-4">
        <div className="w-full lg:w-full space-y-4">
          <Card className="border">
            <CardHeader className="flex flex-row items-center gap-3 font-bold">
              <div className="flex items-center w-full justify-between">
                <div>Claim Details</div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4 justify-between w-full">
              <div className="w-full flex flex-wrap justify-between gap-4">
                <p>No Claim available.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useQuery({
    queryKey: ["userMe"],
    queryFn: () => getUserMeAction(session.jwt),
    enabled: !!session?.jwt, // Only run the query if the token is available
  });

  const USER_ROLE = userData?.data?.userId?.designation;

  const isStatusEditable = [
    "Under Approval",
    "Re-Submitted",
    "Reject",
    // "Approved"
  ].includes(initialStatus) && (USER_ROLE === "Surveyor" || userData?.data?.userId?.role == "company" || USER_ROLE === "CSR") && (jobcardData?.status !== "Total Loss");
  return (
    <>
      <form onSubmit={handleSubmit(handleAssign)}>
        <div className="w-full flex flex-wrap justify-between gap-4">
          <div className="w-full lg:w-full space-y-4">
            <Card className="border">
              <CardHeader className="flex flex-row items-center gap-3 font-bold">
                <div className="flex flex-wrap items-center w-full justify-between">
                  <div>Claim Details</div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4 justify-between w-full">
                <div className="w-full flex flex-wrap justify-between gap-4">
                  <div className="w-full lg:w-[48%] space-y-4">
                    <div className="">
                      <Label htmlFor="details" className="font-bold">
                        Internal Claim Number
                      </Label>
                      <div className="flex gap-2 w-full mt-1 ml-1">
                        <label>{jobcardData?.claimId?.claimNumber}</label>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="status" className="font-bold">
                        Status
                      </Label>
                      <div className="flex gap-2 w-full mt-1 ml-1">
                        <div className="flex gap-4">
                          <div className="w-[20rem]">
                            <Controller
                              name="status"
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                <Select
                                  className="react-select"
                                  classNamePrefix="select"
                                  id="status"
                                  options={statusOptions}
                                  onChange={(selectedOption) =>
                                    onChange(selectedOption.value)
                                  }
                                  value={statusOptions.find(
                                    (option) => option.value === value
                                  )}
                                  isDisabled={!isStatusEditable}
                                />
                              )}
                            />
                          </div>
                          <div className="w-[20rem]">
                            {hasStatusChanged && (
                              <Button
                                className="ml-auto"
                                type="submit"
                                variant="primary"
                              >
                                Update Status
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      {hasStatusChanged &&
                        initialStatus !== "Approved" &&
                        currentStatus === "Approved" && (
                          <>
                            <div className="flex gap-2 w-full mt-1 ml-1">
                              <div className="w-[20rem]">
                                <Label>Insurance Claim Number</Label>
                                <Controller
                                  name="insuranceClaimNumber"
                                  control={control}
                                  render={({ field: { value, onChange } }) => (
                                    <Input
                                      type="text"
                                      name="insuranceClaimNumber"
                                      placeholder="Insurance Claim Number"
                                      size="lg"
                                      id="insuranceClaimNumber"
                                      value={value}
                                      onChange={onChange}
                                      disabled={noClaimNumber} // Disable the input if "No Claim Number" is checked
                                    />
                                  )}
                                />
                                {errors.insuranceClaimNumber &&
                                  !noClaimNumber && (
                                    <p className="text-red-500">
                                      {errors.insuranceClaimNumber.message}
                                    </p>
                                  )}
                              </div>
                              {noClaimNumber === false && !hasStatusChanged && insuranceClaimNumber == "" && (
                                <div className="w-[20rem]">
                                  {
                                    <Button
                                      className="ml-auto"
                                      type="submit"
                                      variant="primary"
                                    >
                                      Add Claim Number
                                    </Button>
                                  }
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 w-full mt-1 ml-1">
                              <div className="w-[20rem]">
                                <Controller
                                  name="noClaimNumber"
                                  control={control}
                                  render={({ field: { value, onChange } }) => (
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id="noClaimNumber"
                                        checked={value}
                                        onCheckedChange={(checked) => {
                                          onChange(checked);
                                          if (checked) {
                                            clearErrors("insuranceClaimNumber");
                                            // Clear error if checkbox is checked
                                          }
                                          setNoClaimNumber(checked);
                                        }}
                                      />
                                      <Label htmlFor="noClaimNumber">
                                        No Claim Number
                                      </Label>
                                    </div>
                                  )}
                                />
                              </div>
                            </div>
                          </>
                        )}

                      {initialStatus === "Approved" && (
                        <>
                          <div className="flex gap-2 w-full mt-1 ml-1">
                            <div className="w-[20rem]">
                              <Label>Insurance Claim Number</Label>
                              <Controller
                                name="insuranceClaimNumber"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <Input
                                    type="text"
                                    name="insuranceClaimNumber"
                                    placeholder="Insurance Claim Number"
                                    size="lg"
                                    id="insuranceClaimNumber"
                                    value={value}
                                    onChange={onChange}
                                    disabled={noClaimNumber || jobcardData?.claimId?.insuranceClaimNumber && (USER_ROLE !== "Surveyor" || userData?.data?.userId?.role !== "company")} // Disable the input if "No Claim Number" is checked
                                  />
                                )}
                              />
                              {errors.insuranceClaimNumber &&
                                !noClaimNumber && (
                                  <p className="text-red-500">
                                    {errors.insuranceClaimNumber.message}
                                  </p>
                                )}
                            </div>
                          </div>
                          <div className="flex gap-2 w-full mt-3 ml-1">
                            <div className="w-[20rem]">
                              <Controller
                                name="noClaimNumber"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="noClaimNumber"
                                      checked={value}
                                      disabled={jobcardData?.claimId?.insuranceClaimNumber && (USER_ROLE !== "Surveyor" || userData?.data?.userId?.role !== "company")}
                                      onCheckedChange={(checked) => {
                                        onChange(checked);
                                        if (checked) {
                                          clearErrors("insuranceClaimNumber");
                                          // Clear error if checkbox is checked
                                        }
                                        setNoClaimNumber(checked);
                                      }}
                                    />
                                    <Label htmlFor="noClaimNumber">
                                      No Claim Number
                                    </Label>
                                  </div>
                                )}
                              />
                            </div>
                          </div>
                          {noClaimNumber === false && !hasStatusChanged && !jobcardData?.claimId?.insuranceClaimNumber && (USER_ROLE === "Surveyor" || userData?.data?.userId?.role === "company") && (
                            <div className="w-[20rem] mt-3">
                              {
                                <Button
                                  className="ml-auto"
                                  type="submit"
                                  variant="primary"
                                >
                                  Add Claim Number
                                </Button>
                              }
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </>
  );
};

export default ClaimView;
