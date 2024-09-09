"use client";
import { getUserMeAction } from "@/action/auth-action";
import { getCSREmployeeAction } from "@/action/companyAction/employee-action";
import { updateJobCardAction } from "@/action/employeeAction/jobcard-action";
import FileUploaderMultiple from "@/components/common/file-multi-uploader/file-uploader-multiple";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Select from "react-select";

const JobDetails = ({ jobcardData, jobCardId, refetch }) => {
  const { data: session } = useSession();
  const [selectedRole, setSelectedRole] = useState(null);
  const [initialStatus, setInitialStatus] = useState(null);
  const [initialAssignedDesignation, setInitialAssignedDesignation] =
    useState(null);
  const [initialAssigned, setInitialAssigned] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [resetTrigger, setResetTrigger] = useState(false);

  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useQuery({
    queryKey: ["userMe"],
    queryFn: () => getUserMeAction(session.jwt),
    enabled: !!session?.jwt, // Only run the query if the token is available
  });

  const role = userData?.data?.userId?.role;
  const designation = userData?.data?.userId?.designation;
  const QuotationApproved = jobcardData?.isQuotationApproved;
  const isJobAssignPermission = userData?.data?.userId?.permissionId?.jobCard?.reAssign

  const isSelectEnabled =
    QuotationApproved &&
    (role === "company" ||
      (role === "employee" &&
        ((designation === "Technician" &&
          (initialStatus === "In Progress" ||
            initialStatus === "Re-Assigned")) ||
          (designation === "Surveyor" && initialStatus === "Completed"))));
  const isStatusEditable = [
    "In Progress",
    "Approved",
    "Completed",
    "Re-Assigned",
  ].includes(initialStatus);

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const day = ("0" + date.getUTCDate()).slice(-2);
    const month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  };

  const { data: getEmployeeList } = useQuery({
    queryKey: ["getCSREmployeeAction", initialAssignedDesignation],
    queryFn: () => {
      return getCSREmployeeAction({
        all: true,
        designation: initialAssignedDesignation,
      });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async (formData) => {
      return await updateJobCardAction(jobCardId, formData);
    },
    onSuccess: (response) => {
      toast.success(`Status Updated to ${response?.data?.status}`);
      setSelectedEmployee(null);
      refetch();
    },
    onError: (error) => {
      console.error("Error in mutation:", error);
      toast.error(error?.message || "An error occurred. Please try again.");
    },
  });
  const updateAssignMutation = useMutation({
    mutationFn: async (formData) => {
      return await updateJobCardAction(jobCardId, formData);
    },
    onSuccess: (response) => {
      // toast.success(`Job Card Assigned to  ${initialAssignedDesignation}`);
      toast.success(`Job Card Assigned to ${response?.data?.currentAssignedTo?.employeeId?.firstName}  ${response?.data?.currentAssignedTo?.employeeId?.lastName}`);
      setSelectedEmployee(null);
      refetch();
    },
    onError: (error) => {
      console.error("Error in mutation:", error);
      toast.error(error?.message || "An error occurred. Please try again.");
    },
  });

  const EmployeeList = getEmployeeList?.data?.map((csr) => ({
    value: csr._id,
    label: `${csr.firstName} ${csr.lastName}`,
  }));

  const {
    control,
    setValue,
    watch,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      role: jobcardData?.currentAssignedTo?.employeeId?.designation,
    },
  });

  const currentStatus = watch("status");
  const currentAssigned = watch("assignedEmployeeId");
  const afterPhotos = watch("afterPhotos");

  const handleAssign = () => {
    if (
      currentStatus === "Done" &&
      (!afterPhotos || afterPhotos.length === 0)
    ) {
      setError("afterPhotos", {
        type: "manual",
        message: "After photos required when status is Done",
      });
      return;
    }

    const formData = new FormData();
    formData.append("status", currentStatus);
    if (afterPhotos) {
      afterPhotos.forEach((photo, index) => {
        formData.append(`afterPhotos`, photo);
      });
    }
    updatePostMutation.mutate(formData);
  };
  const handleEmployeeAssign = () => {
    const formData = new FormData();
    formData.append("assignedEmployeeId", currentAssigned);
    updateAssignMutation.mutate(formData);
  };

  useEffect(() => {
    if (jobcardData) {
      const { currentAssignedTo } = jobcardData;
      setSelectedRole(currentAssignedTo?.employeeId?.designation);
      setValue("role", currentAssignedTo?.employeeId?.designation);
      setValue("assignedEmployeeId", currentAssignedTo?.employeeId?._id);
      setValue("status", jobcardData?.status);
      setInitialStatus(jobcardData?.status);
      setInitialAssigned(currentAssignedTo?.employeeId?._id);
      setInitialAssignedDesignation(currentAssignedTo?.employeeId?.designation);
      setSelectedEmployee(currentAssignedTo?.employeeId?._id);
    }
  }, [jobcardData, setValue]);

  const CompanyStatusList = [
    { value: "Completed", label: "Completed" },
    { value: "Done", label: "Done" },
    { value: "Re-Assigned", label: "Re-Assigned" },
  ];
  const inspectionStaffStatusList = [
    { value: "Done", label: "Done" },
    { value: "Re-Assigned", label: "Re-Assigned" },
  ];
  const TechnicianStatusList = [{ value: "Completed", label: "Completed" }];

  const getStatusList = () => {
    if (role === "company") {
      return CompanyStatusList;
    } else if (role === "employee" && designation === "Technician") {
      return TechnicianStatusList;
    } else if (role === "employee" && designation === "Surveyor") {
      return inspectionStaffStatusList;
    } else {
      return [];
    }
  };
  const StatusList = [
    {
      value: "Pending",
      label: "Pending",
    },
    {
      value: "In Progress",
      label: "In Progress",
    },
    {
      value: "Total Loss",
      label: "Total Loss",
    },
    {
      value: "Unpaid",
      label: "Unpaid",
    },
    { value: "Paid", label: "Paid" },
    {
      value: "Draft",
      label: "Draft",
    },
    { value: "Approved", label: "Approved" },
    { value: "Completed", label: "Completed" },
    { value: "Done", label: "Done" },
    { value: "Re-Assigned", label: "Re-Assigned" },
  ];

  const isAssignedEnabled =
    role === "company" || (role === "employee" && designation === "CSR" && isJobAssignPermission);
    
  const hasStatusChanged =
    initialStatus !== null && initialStatus !== currentStatus;
  const hasInitialAssignedChanged =
    initialAssigned !== null && initialAssigned !== currentAssigned;

  return (
    <>
      <form onSubmit={handleSubmit(handleAssign)}>
        <div className="w-full flex flex-wrap justify-between gap-4">
          <div className="w-full lg:w-full space-y-4">
            <Card className="border">
              <CardHeader className="flex flex-row items-center gap-3 font-bold">
                <div className="flex items-center w-full justify-between">
                  <div>Job Card Details</div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4 justify-between w-full">
                <div className="w-full flex flex-wrap justify-between gap-4">
                  <div className="w-full lg:w-[48%] md:w-[48%] space-y-4">
                    <div className="">
                      <Label htmlFor="details" className="font-bold">
                        Notes
                      </Label>
                      <div className="flex gap-2 w-full mt-1 ml-1">
                        <label>{jobcardData?.details}</label>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="startDate" className="font-bold">
                        Start Date
                      </Label>
                      <div className="flex gap-2 w-full mt-1 ml-1">
                        <label>{formatDate(jobcardData?.startDate)}</label>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-[48%] lg:w-[48%]  space-y-4  gap-4">
                    <div className="flex flex-wrap gap-4">
                      <div className="w-full md:w-[48%] lg:w-[48%]">
                        <Label htmlFor="status" className="font-bold">
                          Status
                        </Label>
                        <Controller
                          name="status"
                          control={control}
                          defaultValue="Draft"
                          render={({ field: { onChange, value } }) => (
                            <Select
                              className="react-select"
                              classNamePrefix="select"
                              id="status"
                              options={getStatusList()}
                              onChange={(selectedOption) =>
                                onChange(selectedOption.value)
                              }
                              value={StatusList.find(
                                (option) => option.value === value
                              )}
                              isDisabled={!isSelectEnabled || !isStatusEditable}
                            />
                          )}
                        />
                      </div>
                      <div className="w-full md:w-[48%] lg:w-[48%] mt-4">
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

                    <div className="w-full space-y-4">
                      {hasStatusChanged &&
                        initialStatus !== "Done" &&
                        currentStatus === "Done" && (
                          <div>
                            <div className="flex w-full flex-col">
                              <div className="w-full">
                                <Label>Add After Photos</Label>
                                <Controller
                                  name="afterPhotos"
                                  control={control}
                                  render={({ field: { value, onChange } }) => (
                                    <FileUploaderMultiple
                                      value={value}
                                      onChange={(files) => {
                                        onChange(files);
                                      }}
                                      name="afterPhotos"
                                      textname="After Photos"
                                      errors={errors}
                                      width={150}
                                      height={150}
                                      resetTrigger={resetTrigger}
                                    />
                                  )}
                                />
                                {errors.afterPhotos && (
                                  <p className="text-red-500">
                                    {errors.afterPhotos.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <div className="w-full md:w-[48%] lg:w-[48%]">
                        <Label htmlFor="assignedEmployeeId" className="font-bold  disabled">
                          Assigned To
                        </Label>
                        <Controller
                          name="assignedEmployeeId"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <Select
                              className="react-select w-full"
                              classNamePrefix="select"
                              id="assignedEmployeeId"
                              options={EmployeeList}
                              onChange={(selectedOption) => {
                                onChange(selectedOption?.value);
                                setSelectedEmployee(selectedOption?.value);
                              }}
                              value={EmployeeList?.find(
                                (option) => option.value === value
                              )}
                              // isDisabled={!isAssignedEnabled}
                              styles={{
                                control: (provided) => ({
                                  ...provided,
                                  opacity: isAssignedEnabled ? 1 : 0.5,
                                }),
                              }}
                            />
                          )}
                        />
                      </div>
                      <div className="w-full md:w-[48%] lg:w-[48%] mt-4">
                        {hasInitialAssignedChanged && (
                          <Button
                            className="ml-auto"
                            type="button"
                            onClick={handleEmployeeAssign}
                            variant="primary"
                          >
                            Assign
                          </Button>
                        )}
                      </div>
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

export default JobDetails;
