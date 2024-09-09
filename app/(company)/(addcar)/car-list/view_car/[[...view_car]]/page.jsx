"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import FileUploaderMultiple from "@/components/common/file-multi-uploader/file-uploader-multiple";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import BasicDataTable from "@/components/common/data-table/basic-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { addCar, getSingleCarAction } from "@/action/employeeAction/car-action";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const ViewCarPage = () => {
  const router = useRouter();
  const { view_car } = useParams();
  const viewCarId = view_car && view_car[0];

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

        const handleButtonClick = (e) => {
          e.preventDefault();
          handleJobCardView(jobCardId);
        };

        return (
          <div className="flex gap-3 items-center justify-end">
            <Button
              size="icon"
              className="h-9 w-9 rounded bg-default-100 dark:bg-default-200 text-default-500 hover:text-primary-foreground"
              onClick={handleButtonClick}
            >
              <Icon icon="heroicons:eye" className="w-5 h-5" />
            </Button>
          </div>
        );
      },
    },
  ];

  const handleJobCardView = (jobCardId) => {
    console.log("jobCardId", jobCardId);
    // router.push(`/view_jobcard`);
    router.push(`/jobcard-list/view_jobcard/${jobCardId}`);
  };

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    // resolver: zodResolver(carSchema),
    mode: "all",
  });

  const {
    isLoading,
    isError,
    data: carData,
    error,
  } = useQuery({
    queryKey: ["carData", viewCarId],
    queryFn: () => getSingleCarAction(viewCarId),
    enabled: !!viewCarId,
    retry: false,
  });

  useEffect(() => {
    if (carData && viewCarId) {
      const { plateNumber, plateCode, chassisNo, model, make, trim, year } =
        carData;
      const { registrationCard } = carData?.documents;
      setValue("make", make);
      setValue("model", model);
      setValue("trim", trim);
      setValue("year", year);
      setValue("plateNumber", plateNumber);
      setValue("plateCode", plateCode);
      setValue("chassisNo", chassisNo);
      setValue("registrationCard", registrationCard ? [registrationCard] : []);
    }
  }, [carData]);


  const mutation = useMutation({
    mutationKey: ["addCar"],
    mutationFn: async (data) => {
      const response = await addCar(data);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message);
      reset();
      router.push("/car-list");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const onSubmit = async (data) => {
    router.push("/car-list");
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 2xl:mt-7">
        <Breadcrumbs>
          <BreadcrumbItem>Menus</BreadcrumbItem>
          <BreadcrumbItem>
            {view_car ? "View Car" : "Create Car"}
          </BreadcrumbItem>
        </Breadcrumbs>
        <div className="invoice-wrapper mt-6">
          <div className="grid grid-cols-12 gap-6">
            <Card className="col-span-12">
              <CardHeader className="sm:flex-row sm:items-center gap-3">
                <div className="flex-1 text-xl font-medium text-default-700 whitespace-nowrap">
                  {view_car ? "View Car" : "Create Car"}
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
                                  Car Registration Card
                                </Label>
                                <Controller
                                  name="registrationCard"
                                  control={control}
                                  readOnly
                                  rules={{
                                    required: "Registration Card is required",
                                  }}
                                  render={({ field: { onChange, value } }) => (
                                    <FileUploaderMultiple
                                      value={value}
                                      onChange={(files) => {
                                        onChange(files);
                                        // handleCarRcIdData(files);
                                      }}
                                      name="registrationCard"
                                      textname="Car RC"
                                      errors={errors}
                                      readOnly
                                      width={150}
                                      height={150}
                                      // resetTrigger={resetTrigger}
                                    />
                                  )}
                                />
                              </div>
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
                            <div> Car Details</div>
                          </div>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-4 justify-between w-full">
                          <div className="w-full flex flex-wrap justify-between gap-4">
                            <div className="w-full lg:w-[48%] space-y-4">
                              <div>
                                <Label htmlFor="year" className="block">
                                  Year
                                </Label>
                                <Input
                                  {...register("year")}
                                  readOnly
                                  placeholder="Enter Car Year"
                                />
                              </div>
                              <div>
                                <Label htmlFor="make" className="block ">
                                  Make
                                </Label>
                                <Input
                                  {...register("make")}
                                  placeholder="Enter Car Make"
                                  readOnly
                                />
                              </div>
                              <div>
                                <Label htmlFor="model" className="block ">
                                  Model
                                </Label>
                                <Input
                                  {...register("model")}
                                  placeholder="Enter Car Model"
                                  readOnly
                                />
                              </div>
                              <div>
                                <Label htmlFor="trim" className="block">
                                  Trim
                                </Label>
                                <Input
                                  {...register("trim")}
                                  placeholder="Enter Car Trim"
                                  readOnly
                                />
                              </div>
                            </div>

                            <div className="w-full lg:w-[48%] space-y-4">
                              <div>
                                <Label htmlFor="chassisNo" className="block">
                                  Chassis Number
                                </Label>
                                <Input
                                  {...register("chassisNo")}
                                  readOnly
                                  placeholder="Enter Car Chassis Number"
                                />
                              </div>
                              <div>
                                <Label htmlFor="plateNumber" className="block">
                                  Plate Number
                                </Label>
                                <Input
                                  {...register("plateNumber")}
                                  readOnly
                                  placeholder="Enter Car Plate Number"
                                />
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
                  {carData?.listOfJobCards?.length > 0 && (
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
                              <BasicDataTable
                                columns={columns}
                                data={carData?.listOfJobCards}
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
                  <Link href="/car-list"> back</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ViewCarPage;
