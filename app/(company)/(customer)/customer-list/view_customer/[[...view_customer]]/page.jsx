"use client";
import { getSinglecustomerAction } from "@/action/employeeAction/customer-action";
import FileUploaderMultiple from "@/components/common/file-multi-uploader/file-uploader-multiple";
import { Badge } from "@/components/ui/badge";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import BasicDataTable from "@/components/common/data-table/basic-table";
import Link from "next/link";

const toTitleCase = (str) => {
  return str.toLowerCase().replace(/\b\w/g, (match) => match.toUpperCase());
};

const carSchema = z.object({
  value: z.string(),
  label: z.string(),
  // Add other fields if necessary
});
const schema = z.object({
  firstName: z.string().nonempty({ message: "First Name is required." }),
  lastName: z.string().nonempty({ message: "Last Name is required." }),
  address: z.string().nonempty({ message: "Address is required." }),
  city: z.string().nonempty({ message: "City is required." }),
  country: z.string().nonempty({ message: "Country is required." }),
  mobileNumber: z.string().nonempty({ message: "Country is required." }),
  email: z.string().email({ message: "Your email is invalid." }),
  listOfCars: z
    .array(carSchema)
    .nonempty({ message: "Car selection is required." })
    .min(1, { message: "You must select at least one car." }),
  driverId: z.array(z.any()).nonempty({ message: "Driver Id is required" }),
  drivingLicense: z
    .array(z.any())
    .nonempty({ message: "Driving License is required" }),
});

const ViewCustomer = () => {
  const router = useRouter();
  const [resetTrigger, setResetTrigger] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const { view_customer } = useParams(); // This depends on how you handle routing
  // const customerId = view_customer && view_customer?.view_customer?.[0];
  // const customerId = view_customer && view_customer[0];

  const columns = [
    {
      accessorKey: "jobCardNumber",
      header: "job Card Number",
      cell: ({ row }) => (
        <div className="font-medium text-card-foreground/80">
          <div className="flex space-x-3  rtl:space-x-reverse items-center">
            <span className="whitespace-nowrap">
              {row?.original?.jobCardNumber || "-"}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "fullName",
      header: "Customer Name",
      cell: ({ row }) => (
        <div className="font-medium text-card-foreground/80">
          <div className="flex space-x-3  rtl:space-x-reverse items-center">
            <span className="whitespace-nowrap">
              {row?.original?.customerId?.fullName || "-"}
            </span>
          </div>
        </div>
      ),
    },

    {
      accessorKey: "email",
      header: "email",
      cell: ({ row }) => (
        <div className="font-medium text-card-foreground/80">
          <div className="flex space-x-3  rtl:space-x-reverse items-center">
            <span className="whitespace-nowrap">
              {row?.original?.customerId?.email || "-"}
            </span>
          </div>
        </div>
      ),
    },

    {
      accessorKey: "plateNumber",
      header: "plateNumber",
      cell: ({ row }) => (
        <div className="font-medium text-card-foreground/80">
          <div className="flex space-x-3  rtl:space-x-reverse items-center">
            <span className="whitespace-nowrap">
              {row?.original?.carId?.plateNumber || "-"}
            </span>
          </div>
        </div>
      ),
    },
    // {
    //   accessorKey: "insuranceType",
    //   header: "insuranceType",
    //   cell: ({ row }) => (
    //     <div className="font-medium text-card-foreground/80">
    //       <div className="flex space-x-3  rtl:space-x-reverse items-center">
    //         <span className="whitespace-nowrap">
    //           {row?.original?.insuranceDetails?.insuranceType || "-"}
    //         </span>
    //       </div>
    //     </div>
    //   ),
    // },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        // console.log(row, "row into status"),
        // (
        //   <div className="font-medium text-card-foreground/80">
        //     <div className="flex space-x-3  rtl:space-x-reverse items-center">
        //       <span className="whitespace-nowrap">
        //         {row?.original?.status || "-"}
        //       </span>
        //     </div>
        //   </div>
        // )
        <Badge
          variant="outline"
          color={
            (row?.original?.status === "Pending" && "default") ||
            (row?.original?.status === "Approved" && "success") ||
            (row?.original?.status === "Completed" && "info") ||
            (row?.original?.status === "Unpaid" && "warning") ||
            (row?.original?.status === "Paid" && "success")
          }
          className="capitalize"
        >
          {row?.original?.status || "-"}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        return value?.includes(row.getValue(id));
      },
    },
    {
      header: "Actions",
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const jobCardId = row?.original?._id;

        return (
          <div className="flex gap-3 items-center justify-end">
            <Button
              size="icon"
              className="h-9 w-9 rounded bg-default-100 dark:bg-default-200 text-default-500 hover:text-primary-foreground"
              onClick={() => handleJobCardView(jobCardId)}
            >
              <Icon icon="heroicons:eye" className="w-5 h-5" />
            </Button>
          </div>
        );
      },
    },
  ];

  const carColumns = [
    {
      accessorKey: "make",
      header: "Make",
      cell: ({ row }) => (
        <div className="font-medium text-card-foreground/80">
          <div className="flex space-x-3  rtl:space-x-reverse items-center">
            <span className="whitespace-nowrap">
              {row?.original?.make || "-"}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "model",
      header: "Model",
      cell: ({ row }) => (
        <div className="font-medium text-card-foreground/80">
          <div className="flex space-x-3  rtl:space-x-reverse items-center">
            <span className="whitespace-nowrap">
              {row?.original?.model || "-"}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "plateNumber",
      header: "Plate Number",
      cell: ({ row }) => (
        <div className="font-medium text-card-foreground/80">
          <div className="flex space-x-3  rtl:space-x-reverse items-center">
            <span className="whitespace-nowrap">
              {row?.original?.plateNumber || "-"}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "chassisNo",
      header: "Chassis no",
      cell: ({ row }) => (
        <div className="font-medium text-card-foreground/80">
          <div className="flex space-x-3  rtl:space-x-reverse items-center">
            <span className="whitespace-nowrap">
              {row?.original?.chassisNo || "-"}
            </span>
          </div>
        </div>
      ),
    },

    {
      header: "Actions",
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const CardId = row?.original?._id;

        return (
          <div className="flex gap-3 items-center justify-end">
            <Button
              size="icon"
              className="h-9 w-9 rounded bg-default-100 dark:bg-default-200 text-default-500 hover:text-primary-foreground"
              onClick={() => handleCarView(CardId)}
            >
              <Icon icon="heroicons:eye" className="w-5 h-5" />
            </Button>
          </div>
        );
      },
    },
  ];

  const handleCarView = (CardId) => {
    router.push(`/car-list/view_car/${CardId}`);
  };

  const handleJobCardView = (jobCardId) => {
    router.push(`/jobcard-list/view_jobcard/${jobCardId}`);
  };

  useEffect(() => {
    if (view_customer && view_customer.length > 0) {
      setCustomerId(view_customer[0]);
    }
  }, [view_customer]);

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
        setValue("emiratesId", documents?.emirateId);
      }
      if (documents?.drivingLicense) {
        setValue("drivingId", documents?.drivingLicense);
      }
      setValue("customerEmiratesId", customerEmiratesId);
      setValue("licenceNo", documentsDetails?.licenceNo || "");
      setValue("tcNo", documentsDetails?.tcNo || "");
      setValue("licenceIssueDate", licenceIssueDate);
      setValue("licenceExpiryDate", licenceExpiryDate);

      //   if (listOfCars) {
      //     const carModels = listOfCars.map((car) => ({
      //       label: car.carModel,
      //       value: car._id,
      //     }));
      //     setValue("listOfCars", carModels);
      //   }
      //   if (documents?.drivingLicense) {
      //     setValue("drivingLicense", [documents.drivingLicense]);
      //   }
      //   isInitialized.current = true;

      // setValue("emiratesId", documents?.emiratesId);
      // setValue("drivingId", documents?.drivingLicense);
    }
  }, [customerData]);

  const onSubmit = (data) => {
    // router.push("/customer-list");
  };

  const handleReset = () => {
    reset();
    setResetTrigger(!resetTrigger);
  };

  useEffect(() => {
    if (customerData) {
      const { fullName, mobileNumber, email, documents } = customerData;
      setValue("fullName", fullName);
      setValue("mobileNumber", mobileNumber);
      setValue("email", email);
      if (documents?.emirateId) {
        setValue("emiratesId", [documents?.emirateId]);
      }
      if (documents?.drivingLicense) {
        setValue("drivingId", [documents?.drivingLicense]);
      }
    }
  }, [customerData, handleReset]);

  const jobcards = customerData ? customerData?.jobCards : "";

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 2xl:mt-7">
        <Breadcrumbs>
          <BreadcrumbItem>Menus</BreadcrumbItem>
          <BreadcrumbItem>
            {view_customer ? "View Customer" : "Create Customer"}
          </BreadcrumbItem>
        </Breadcrumbs>
        <div className="invoice-wrapper mt-6">
          <div className="grid grid-cols-12 gap-6">
            <Card className="col-span-12">
              <CardHeader className="sm:flex-row sm:items-center gap-3">
                <div className="flex-1 text-xl font-medium text-default-700 whitespace-nowrap">
                  {view_customer ? "View Customer" : "Create Customer"}
                </div>
                {/* <div className="flex-none flex items-center gap-4">
                  <Button
                    className="border-default-300 group"
                    size="icon"
                    variant="outline"
                    type="button"
                    title="Reset"
                    onClick={handleReset}
                  >
                    <Icon
                      icon="heroicons:arrow-path"
                      className="w-5 h-5 text-default-300 group-hover:text-default-50 dark:group-hover:text-primary-foreground"
                    />
                  </Button>
                </div> */}
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
                                      onChange={onChange}
                                      name="emiratesId"
                                      textname="ID"
                                      errors={errors}
                                      width={150}
                                      height={150}
                                      resetTrigger={resetTrigger}
                                      readOnly
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
                                    onChange={onChange}
                                    height={150}
                                    width={150}
                                    textname="License"
                                    name="drivingId"
                                    errors={errors}
                                    resetTrigger={resetTrigger}
                                    readOnly
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
                        <CardHeader className="flex flex-row items-center  gap-3 font-bold">
                          <div className="flex flex-wrap items-center w-full justify-between">
                            <div> Customer Details</div>
                          </div>
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
                                    readOnly
                                    id="fullName"
                                    // className={cn("w-full", {
                                    //   "border-destructive": errors.customerName,
                                    // })}
                                  />
                                </div>
                                {/* {errors.customerName && (
                                    <div className="text-destructive mt-2">
                                      {errors.customerName.message}
                                    </div>
                                  )} */}
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
                                    readOnly
                                    // className={cn("w-full", {
                                    //   "border-destructive": errors.email,
                                    // })}
                                  />
                                </div>
                                {/* {errors.email && (
                                    <div className="text-destructive mt-2">
                                      {errors.email.message}
                                    </div>
                                  )} */}
                              </div>
                              <div>
                                <Label>Mobile no</Label>
                                <Input
                                  type="text"
                                  placeholder="Mobile No"
                                  {...register("mobileNumber")}
                                  size="lg"
                                  readOnly
                                  id="mobileNumber"
                                />
                              </div>
                              <div>
                                <Label htmlFor="customerEmiratesId">
                                  Emirate ID
                                </Label>
                                <Input
                                  type="text"
                                  placeholder="Emirate ID"
                                  {...register("customerEmiratesId")}
                                  size="lg"
                                  id="customerEmiratesId"
                                  readOnly
                                />
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
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="licenceIssueDate">
                                  Driving License Issue
                                </Label>
                                <div className="flex gap-2 w-full">
                                  <Input
                                    type="date"
                                    placeholder="Driving License Issue"
                                    {...register("licenceIssueDate")}
                                    size="lg"
                                    id="licenceIssueDate"
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="licenceExpiryDate">
                                  Driving License Expiry
                                </Label>
                                <div className="flex gap-2 w-full">
                                  <Input
                                    type="date"
                                    placeholder="Driving License Issue"
                                    {...register("licenceExpiryDate")}
                                    size="lg"
                                    id="licenceExpiryDate"
                                    readOnly
                                  />
                                </div>
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
                                    readOnly
                                  />
                                </div>
                              </div>
                            </div>

                            {/* <div className="w-full lg:w-[45%] space-y-4 mt-6"></div> */}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </>

                <>
                  {customerData?.jobCards?.length > 0 && (
                    <div className="w-full flex flex-wrap justify-between gap-4">
                      <div className="w-full lg:w-full space-y-4">
                        <Card className="border">
                          <CardHeader className="flex flex-row items-center  gap-3 font-bold">
                            <div className="flex flex-wrap items-center w-full justify-between">
                              <div>Associated Jobcard</div>
                            </div>
                          </CardHeader>
                          <CardContent className="flex flex-wrap gap-4 justify-between w-full">
                            <div className="w-full lg:w-full space-y-4">
                              {/* {customerData?.jobCards?.length > 0 && ( */}
                              <BasicDataTable
                                columns={columns}
                                data={customerData?.jobCards}
                                hiddenOnly={true}
                              />
                              {/* )} */}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                </>

                <>
                  {customerData?.listOfCars?.length > 0 && (
                    <div className="w-full flex flex-wrap justify-between gap-4">
                      <div className="w-full lg:w-full space-y-4">
                        <Card className="border">
                          <CardHeader className="flex flex-row items-center  gap-3 font-bold">
                            <div className="flex flex-wrap items-center w-full justify-between">
                              <div>Associated Cars</div>
                            </div>
                          </CardHeader>
                          <CardContent className="flex flex-wrap gap-4 justify-between w-full">
                            <div className="w-full lg:w-full space-y-4">
                              <BasicDataTable
                                columns={carColumns}
                                data={customerData?.listOfCars}
                                hiddenOnly={true}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                </>
              </CardContent>
              <CardFooter className="flex justify-end gap-4 flex-wrap">
                <Button
                  type="submit"
                  className="group hover:bg-default-200 hover:text-default-900 text-xs font-semibold whitespace-nowrap"
                >
                  <Link href="/customer-list"> back</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ViewCustomer;
