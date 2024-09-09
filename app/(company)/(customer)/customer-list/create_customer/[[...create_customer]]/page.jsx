"use client";
import { addEmiratesData } from "@/action/emiratesAction/emirates-action";
import {
  addCustomer,
  getSinglecustomerAction,
  updateCustomerAction,
} from "@/action/employeeAction/customer-action";
import { addLicenceData } from "@/action/licenceAction/licence-action";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { toTitleCase } from "../../../../../../components/common/utitlity/helper";

import { getCars } from "@/action/companyAction/car-action";
import FileUploaderMultiple from "@/components/common/file-multi-uploader/file-uploader-multiple";
import LayoutLoader from "@/components/layout-loader";
import Link from "next/link";
import { useRef } from "react";

import { ratio } from "fuzzball";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";

const carSchema = z.object({
  value: z.string(),
  label: z.string(),
  // Add other fields if necessary
});
const schema = z.object({
  // email: z.string().email({ message: "Invalid email address" }),
  email: z.any().optional(),
  mobileNumber: z
    .string()
    .refine((value) => {
      return value !== undefined && value.trim() !== "";
    }, "Mobile number is required")
    .refine((value) => {
      return /^[0-9]{10}$/.test(value);
    }, "Invalid mobile number format"),
  fullName: z.string().refine((value) => value.trim() !== "", {
    message: "Customer Name required",
  }),
  customerEmiratesId: z.string().refine((value) => value.trim() !== "", {
    message: "Customer Emirates ID is required",
  }),
  licenceNo: z.string().refine((value) => {
    return value !== undefined && value.trim() !== "";
  }, "Licence number is required"),
  licenceIssueDate: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Issue date required",
    })
    .transform((str) => new Date(str)),
  licenceExpiryDate: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Expiry date required",
    })
    .refine((value, ctx) => {
      return value > (ctx?.licenceIssueDate || "");
    }, "Expiry date must be after issue date")
    .transform((str) => new Date(str)),
  tcNo: z.string().refine((value) => value.trim() !== "", {
    message: "TC number is required",
  }),
}).superRefine((data, ctx) => {
  if (data.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
    ctx.addIssue({
      path: ["email"],
      message: "Invalid email format",
    });
  }
});

const CustomerPage = () => {
  const router = useRouter();
  const [resetTrigger, setResetTrigger] = useState(false);
  const { create_customer } = useParams();
  // const customerId = create_customer && create_customer[0];
  const [emiratesData, setEmiratesData] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [loadingoverlay, setLoadingoverlay] = useState(false);
  const [emiratesApi, setEmiratesApi] = useState(false);
  const [drivingData, setDrivingData] = useState([]);
  const [drivingApi, setDrivingApi] = useState(false);
  const [loadingDriving, setLoadingDriving] = useState(false);
  const [isEmiratesIdSet, setIsEmiratesIdSet] = useState(false);

  useEffect(() => {
    if (create_customer && create_customer?.length > 0) {
      //  setJobCardId(create_jobcard[0]);
      //  setParamId(create_jobcard[0]);
      setCustomerId(create_customer[0]);
    }
  }, [create_customer]);

  const {
    isLoading: isLoadingCompanyData,
    isError: isErrorCompanyData,
    data: customerData,
    error: companyDataError,
  } = useQuery({
    queryKey: ["customerData", customerId],
    queryFn: () => getSinglecustomerAction(customerId),
    enabled: !!customerId, // Only enable query if customerId is truthy
    retry: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
  });
  const {
    data: carsData,
    isLoading: isLoadingCars,
    isError: isErrorCars,
    error: carsError,
    refetch: refetchCars,
  } = useQuery({
    queryKey: ["getCars"],
    queryFn: () => getCars({ all: true }),
  });

  const mutation = useMutation({
    mutationKey: ["addCustomer"],
    mutationFn: async (data) => {
      console.log(data, "data into customerDetails");
      const formData = new FormData();
      formData.append(
        "drivingLicenseLink",
        drivingData?.fileUrl?.path ? drivingData?.fileUrl?.path : ""
      );
      formData.append(
        "emirateIdLink",
        emiratesData?.fileUrl?.path ? emiratesData?.fileUrl?.path : ""
      );
      for (const key in data) {
        formData.append(key, data[key]);
      }
      return await addCustomer(formData);
      // return await addEmiratesData(formData);
    },
    onSuccess: (res) => {
      console.log(res, "res");
      toast.success(res?.message);
      router.push("/customer-list");
    },
    onError: (error) => {
      console.log("Error in mutation:", error);
      toast.error(error?.message || "An error occurred. Please try again.");
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async (data) => {
      // consol.log(data, "data into customerDetails");
      const formData = new FormData();
      formData.append(
        "drivingIdLink",
        drivingData?.fileUrl?.path ? drivingData?.fileUrl?.path : ""
      );
      formData.append(
        "emirateIdLink",
        emiratesData?.fileUrl?.path ? emiratesData?.fileUrl?.path : ""
      );
      for (const key in data) {
        formData.append(key, data[key]);
      }

      return await updateCustomerAction(customerId, formData);
    },
    onSuccess: (response) => {
      toast.success(response?.message);
      router.push("/customer-list");
    },
    onError: (error) => {
      console.log(error, "error");
      toast.error(error?.message || "An error occurred. Please try again.");
    },
  });

  const onSubmit = async (data) => {
    if (customerId) {
      updatePostMutation.mutateAsync(data);
    } else {
      console.log(data, "data");
      mutation.mutateAsync(data).catch((err) => {
        console.log(err, "err");
      });
    }
  };
  console.log(errors, "errors");
  const isInitialized = useRef(false);
  console.log(customerData, "customerData");

  useEffect(() => {
    if (customerData) {
      const {
        fullName,
        mobileNumber,
        email,
        documents,
        documentsDetails,
        customerEmiratesId,
      } = customerData;

      const formatDate = (dateString) =>
        dateString ? new Date(dateString).toISOString().split("T")[0] : "";
      const licenceIssueDate = formatDate(
        documentsDetails?.licenceIssueDate || ""
      );
      const licenceExpiryDate = formatDate(
        documentsDetails?.licenceExpiryDate || ""
      );
      setValue("fullName", fullName);
      setValue("mobileNumber", mobileNumber);
      setValue("email", email);
      console.log(documents, "documents");
      if (documents?.emirateId) {
        setValue("emiratesId", [documents?.emirateId]);
      }
      if (documents?.drivingLicense) {
        setValue("drivingId", [documents?.drivingLicense]);
      }
      setValue("customerEmiratesId", customerEmiratesId);
      setValue("licenceNo", documentsDetails?.licenceNo || "");
      setValue("tcNo", documentsDetails?.tcNo || "");
      setValue("licenceIssueDate", licenceIssueDate);
      setValue("licenceExpiryDate", licenceExpiryDate);
    }
  }, [customerData]);

  const handleInputChange = (event, fieldName) => {
    const { value } = event.target;
    setValue(fieldName, toTitleCase(value));
  };

  const extractEmiratesMutation = useMutation({
    mutationKey: ["extractEmirates"],
    mutationFn: async (formData) => {
      setLoadingoverlay(true);
      console.log("extractEmiratesMutation");
      return await addEmiratesData(formData);
    },
    onSuccess: (res) => {
      toast.success("File uploaded successfully.");
      setEmiratesData(res);
      setLoadingoverlay(false);
    },
    onError: (error) => {
      toast.error("File upload failed.");
      setLoadingoverlay(false);
    },
  });

  useEffect(() => {
    if (extractEmiratesMutation.isSuccess && emiratesData) {
      setValue("fullName", emiratesData?.data?.fullName);
      const customerEmiratesId = emiratesData?.data?.emiratesId;
      console.log("emiratesData", emiratesData.data);
      console.log("emiratesData", emiratesData?.data?.emiratesId);
      setValue("fullName", emiratesData?.data?.fullName);
      setValue("customerEmiratesId", customerEmiratesId);
      setIsEmiratesIdSet(!!customerEmiratesId);
    }
  }, [extractEmiratesMutation.isSuccess, emiratesData]);

  const extractDrivingMutation = useMutation({
    mutationKey: ["extractDriving"],
    mutationFn: async (formData) => {
      setLoadingDriving(true);
      return await addLicenceData(formData);
    },
    onSuccess: (res) => {
      toast.success("Driving License file uploaded successfully.");
      setDrivingData(res);
      setLoadingDriving(false);
    },
    onError: (error) => {
      toast.error("Driving License file upload failed.");
      setLoadingDriving(false);
    },
  });

  useEffect(() => {
    if (extractDrivingMutation.isSuccess && drivingData) {
      const formatDate = (dateString) =>
        dateString ? new Date(dateString).toISOString().split("T")[0] : "";

      const licenceIssueDate = formatDate(drivingData?.data?.licenceIssueDate);
      const licenceExpiryDate = formatDate(
        drivingData?.data?.licenceExpiryDate
      );
      const drivingFullName = drivingData?.data?.fullName;
      const emiratesFullName = emiratesData?.data?.fullName;

      const fullName = emiratesFullName || drivingFullName;
      const nameComparisonRatio = emiratesFullName
        ? ratio(drivingFullName, emiratesFullName)
        : 100;

      if (nameComparisonRatio < 80) {
        toast.error(
          "The full name from driving data does not match with Emirates data."
        );
      }

      setValue("fullName", fullName);
      setValue("licenceIssueDate", licenceIssueDate);
      setValue("licenceNo", drivingData?.data?.licenceNo);
      setValue("licenceExpiryDate", licenceExpiryDate);
      setValue("tcNo", drivingData?.data?.dlTcNo);
    }
  }, [extractDrivingMutation.isSuccess, drivingData]);

  const handleEmirateData = (files) => {
    console.log(typeof files[0], files[0], "value inside value");

    if (
      files &&
      files.length > 0 &&
      !emiratesApi &&
      typeof files[0] === "object"
    ) {
      console.log("hello");
      const formData = new FormData();
      formData.append("emiratesId", files[0]);
      extractEmiratesMutation.mutate(formData);
      setEmiratesApi(true);
    } else if (!files || files.length === 0) {
      setEmiratesData(null);
      setEmiratesApi(false);
    }
  };

  const handleDrivingIdData = (files) => {
    console.log(typeof files[0], files[0], "value inside value");

    if (
      files &&
      files.length > 0 &&
      !drivingApi &&
      typeof files[0] === "object"
    ) {
      console.log("hello");
      const formData = new FormData();
      formData.append("drivingLicense", files[0]);
      extractDrivingMutation.mutate(formData);
      setDrivingApi(true);
    } else if (!files || files.length === 0) {
      setDrivingData(null);
      setDrivingApi(false);
    }
  };
  const isDisabled = isEmiratesIdSet || !!create_customer;

  return (
    <div>
      {/* ||  || loadingCarExtract */}
      {(loadingoverlay || loadingDriving) && (
        <div
          id="overlay"
          style={{
            position: "fixed",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 50,
          }}
        >
          <div className="flex items-center justify-center w-screen h-full">
            <LayoutLoader />
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 2xl:mt-7">
        <Breadcrumbs>
          <BreadcrumbItem>Menus</BreadcrumbItem>
          <BreadcrumbItem>
            <Link href="/customer-list">Customers</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            {create_customer ? "Update Customer" : "Create Customer"}
          </BreadcrumbItem>
        </Breadcrumbs>
        <div className="invoice-wrapper mt-6">
          <div className="grid grid-cols-12 gap-6">
            <Card className="col-span-12">
              <CardHeader className="sm:flex-row sm:items-center gap-3">
                <div className="flex-1 text-xl font-medium text-default-700 whitespace-nowrap">
                  {create_customer ? "Update Customer" : "Create Customer"}
                </div>
                <div className="flex-none flex items-center gap-4"></div>
              </CardHeader>

              <CardContent className="flex flex-wrap gap-4">
                <>
                  <div className="w-full flex flex-wrap justify-between gap-4 pb-4">
                    <div className="w-full lg:w-full space-y-4">
                      <Card className="border">
                        <CardHeader className="flex flex-row items-center gap-3 font-bold">
                          Document Details
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-4 justify-between w-full">
                          <div className="flex flex-row flex-wrap gap-4 w-full justify-between">
                            <div className="lg:w-[48%]">
                              <div>
                                <Label
                                  htmlFor="emiratesId"
                                  className="block mb-3 "
                                >
                                  Emirates ID
                                </Label>
                                <Controller
                                  name="emiratesId"
                                  control={control}
                                  rules={{
                                    required: "Emirates ID is required",
                                  }}
                                  render={({ field: { onChange, value } }) => (
                                    <FileUploaderMultiple
                                      value={value}
                                      onChange={(files) => {
                                        onChange(files);
                                        handleEmirateData(files);
                                      }}
                                      name="emiratesId"
                                      textname="ID"
                                      errors={errors}
                                      width={150}
                                      height={150}
                                      resetTrigger={resetTrigger}
                                    />
                                  )}
                                />
                              </div>
                            </div>
                            <div className="lg:w-[48%]">
                              <Label
                                htmlFor="drivingId"
                                className="block mb-3 "
                              >
                                Driving License
                              </Label>
                              <Controller
                                name="drivingId"
                                control={control}
                                rules={{
                                  required: "Driving ID is required",
                                }}
                                render={({ field: { onChange, value } }) => (
                                  <FileUploaderMultiple
                                    value={value}
                                    onChange={(files) => {
                                      onChange(files);
                                      handleDrivingIdData(files);
                                    }}
                                    height={150}
                                    width={150}
                                    textname="License"
                                    name="drivingId"
                                    errors={errors}
                                    resetTrigger={resetTrigger}
                                  />
                                )}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  <div className="w-full flex flex-wrap justify-between gap-4">
                    <div className="w-full lg:w-full space-y-4">
                      <Card className="border">
                        <CardHeader className="flex flex-row items-center gap-3 font-bold">
                          Customer Details
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-4 justify-between w-full">
                          <div className="w-full flex flex-wrap justify-between gap-4">
                            <div className="w-full lg:w-[48%] space-y-4">
                              <div>
                                <Label htmlFor="fullName">Customer Name</Label>
                                <div className="flex gap-2 w-full">
                                  <Input
                                    type="text"
                                    placeholder="Customer name"
                                    {...register("fullName")}
                                    size="lg"
                                    id="fullName"
                                    className={cn("w-full", {
                                      "border-destructive": errors.fullName,
                                    })}
                                  />
                                </div>
                                {errors.fullName && (
                                  <div className="text-destructive mt-2">
                                    {errors.fullName.message}
                                  </div>
                                )}
                              </div>

                              <div>
                                <Label htmlFor="email">Email</Label>
                                <div className="flex gap-2 w-full">
                                  <Input
                                    type="text"
                                    placeholder="Email"
                                    {...register("email")}
                                    size="lg"
                                    id="email"
                                    className={cn("w-full", {
                                      "border-destructive": errors.email,
                                    })}
                                  />
                                  {errors.email && (
                                    <div className="text-destructive mt-2">
                                      {errors.email.message}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <Label>Mobile no</Label>
                                <Input
                                  type="text"
                                  placeholder="Mobile No"
                                  {...register("mobileNumber")}
                                  size="lg"
                                  id="mobileNumber"
                                  className={cn("w-full", {
                                    "border-destructive": errors.mobileNumber,
                                  })}
                                />
                                {errors.mobileNumber && (
                                  <div className="text-destructive mt-2">
                                    {errors.mobileNumber.message}
                                  </div>
                                )}
                              </div>
                              <div>
                                <Label htmlFor="customerEmiratesId">
                                  Emirate ID
                                </Label>
                                <Controller
                                  control={control}
                                  name="customerEmiratesId"
                                  defaultValue=""
                                  render={({ field }) => (
                                    <Input
                                      type="text"
                                      placeholder="Emirate ID"
                                      size="lg"
                                      id="customerEmiratesId"
                                      {...field}
                                      disabled={isDisabled}
                                    />
                                  )}
                                />
                                {/* <Input
                                  type="text"
                                  placeholder="Emirate ID"
                                  {...register("customerEmiratesId")}
                                  size="lg"
                                  id="customerEmiratesId"
                                  className={cn("w-full", {
                                    "border-destructive": errors.customerEmiratesId,
                                  })}
                                /> */}
                                {errors.customerEmiratesId && (
                                  <div className="text-destructive mt-2">
                                    {errors.customerEmiratesId.message}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="w-full lg:w-[48%] space-y-4">
                              <div>
                                <Label htmlFor="licenceNo">
                                  Driving License Number
                                </Label>
                                <div className="flex gap-2 w-full">
                                  <Input
                                    type="text"
                                    placeholder="License Number"
                                    {...register("licenceNo")}
                                    size="lg"
                                    id="licenceNo"
                                    className={cn("w-full", {
                                      "border-destructive": errors.licenceNo,
                                    })}
                                  />
                                </div>
                                {errors.licenceNo && (
                                  <div className="text-destructive mt-2">
                                    {errors.licenceNo.message}
                                  </div>
                                )}
                              </div>
                              <div>
                                <Label htmlFor="licenceIssueDate">
                                  Driving License Issue
                                </Label>
                                <div className="flex gap-2 w-full">
                                  {/* <Input
                                    type="date"
                                    placeholder="Driving License Issue"
                                    {...register("licenceIssueDate")}
                                    size="lg"
                                    id="licenceIssueDate"
                                    className={cn("w-full", {
                                      "border-destructive": errors.licenceIssueDate,
                                    })}
                                  /> */}
                                  <Controller
                                    control={control}
                                    name="licenceIssueDate"
                                    render={({ field }) => (
                                      <DatePicker
                                        id="licenceIssueDate"
                                        dayPlaceholder="dd"
                                        monthPlaceholder="mm"
                                        yearPlaceholder="yyy"
                                        clearIcon={null}
                                        value={
                                          field.value
                                            ? new Date(field.value)
                                            : null
                                        }
                                        onChange={(date) =>
                                          field.onChange(
                                            date
                                              ? format(date, "yyyy-MM-dd")
                                              : ""
                                          )
                                        }
                                        format="dd-MM-yyyy"
                                        className="w-full"
                                      />
                                    )}
                                  />
                                </div>
                                {errors.licenceIssueDate && (
                                  <div className="text-destructive mt-2">
                                    {errors.licenceIssueDate.message}
                                  </div>
                                )}
                              </div>
                              <div>
                                <Label htmlFor="licenceExpiryDate">
                                  Driving License Expiry
                                </Label>
                                <div className="flex gap-2 w-full">
                                  {/* <Input
                                    type="date"
                                    placeholder="Driving License Issue"
                                    {...register("licenceExpiryDate")}
                                    size="lg"
                                    id="licenceExpiryDate"
                                    className={cn("w-full", {
                                      "border-destructive": errors.licenceExpiryDate,
                                    })}
                                  /> */}
                                  <Controller
                                    control={control}
                                    name="licenceExpiryDate"
                                    defaultValue=""
                                    render={({ field }) => (
                                      <DatePicker
                                        id="licenceExpiryDate"
                                        dayPlaceholder="dd"
                                        monthPlaceholder="mm"
                                        yearPlaceholder="yyy"
                                        clearIcon={null}
                                        value={
                                          field.value
                                            ? new Date(field.value)
                                            : null
                                        }
                                        onChange={(date) =>
                                          field.onChange(
                                            date
                                              ? format(date, "yyyy-MM-dd")
                                              : ""
                                          )
                                        }
                                        format="dd-MM-yyyy"
                                        className="w-full"
                                      />
                                    )}
                                  />
                                </div>
                                {errors.licenceExpiryDate && (
                                  <div className="text-destructive mt-2">
                                    {errors.licenceExpiryDate.message}
                                  </div>
                                )}
                              </div>
                              <div>
                                <Label htmlFor="tcNo">TC Number</Label>
                                <div className="flex gap-2 w-full">
                                  <Input
                                    type="text"
                                    placeholder="Driving License Issue"
                                    {...register("tcNo")}
                                    size="lg"
                                    id="tcNo"
                                    className={cn("w-full", {
                                      "border-destructive": errors.tcNo,
                                    })}
                                  />
                                </div>
                                {errors.tcNo && (
                                  <div className="text-destructive mt-2">
                                    {errors.tcNo.message}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* <div className="w-full lg:w-[45%] space-y-4 mt-6"></div> */}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </>
              </CardContent>

              <CardFooter className="flex justify-between gap-4 flex-wrap">
                <Button>
                  <Link href="/customer-list">Back</Link>
                </Button>
                <Button type="submit">
                  {create_customer ? "Update" : "Create"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CustomerPage;
