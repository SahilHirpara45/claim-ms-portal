"use client";

import {
  addCar,
  getSingleCarAction,
  updateCarAction,
} from "@/action/employeeAction/car-action";
import { extractCarAction } from "@/action/extractDataAction/carRcAction";
import { getMasterCarDataAction } from "@/action/masterCar/mastercar-action";
import FileUploaderMultiple from "@/components/common/file-multi-uploader/file-uploader-multiple";
import LayoutLoader from "@/components/layout-loader";
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
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import Select from "react-select";
import { z } from "zod";
const carSchema = z.object({
  make: z.string().min(1, { message: "Car Make is required" }),
  model: z.string().min(1, { message: "Car Model is required" }),
  trim: z.string().min(1, { message: "Car Trim is required" }),
  year: z
    .string()
    .min(4, { message: "Car Year is required" })
    .regex(/^\d{4}$/, { message: "Invalid Year format" }),
  // plateCode: z.string().min(1, { message: "Plate Code is required" }),
  plateNumber: z.string().min(1, { message: "Plate Number is required" }),
  chassisNo: z.string().min(1, { message: "Chassis Number is required" }),
});
const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const AddCarPage = () => {
  const router = useRouter();
  const [apiCalled, setApiCalled] = useState(false);
  const [exctractCarData, setExctractCarData] = useState("");
  const [resetTrigger, setResetTrigger] = useState(false);
  const [loadingCarExtract, setLoadingCarExtract] = useState(false);
  const { create_car } = useParams();

  const [carModelLists, setCarModelLists] = useState([]);
  const [carTrimLists, setCarTrimLists] = useState([]);

  const AddCarId = create_car && create_car[0];

  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors },
    // watch,
    setValue,
  } = useForm({
    resolver: zodResolver(carSchema),
    mode: "all",
  });
  const selectedMake = useWatch({
    control,
    name: "make",
  });
  const selectedModel = useWatch({
    control,
    name: "model",
  });

  const {
    isLoading,
    isError,
    data: carData,
    error,
  } = useQuery({
    queryKey: ["carData", AddCarId],
    queryFn: () => getSingleCarAction(AddCarId),
    enabled: !!AddCarId,
    retry: false,
  });

  useEffect(() => {
    if (carData && AddCarId) {
      const { carBrand, plateNumber, chassisNo, model, make, trim, year } =
        carData;
      const { registrationCard } = carData?.documents;
      setValue("make", make);

      handleMakeChange(carData?.make);
      handleModelChange(carData?.model, carData?.make);

      setValue("model", model);
      setValue("trim", trim);
      setValue("year", year);
      setValue("plateNumber", plateNumber);
      setValue("chassisNo", chassisNo);
      setValue("carBrand", carBrand);
      setValue("registrationCard", registrationCard ? [registrationCard] : []);
    }
  }, [carData, AddCarId]);

  const addCarMutation = useMutation({
    mutationKey: ["addCar"],
    mutationFn: async (data) => addCar(data),
    onSuccess: (response) => {
      toast.success(response.message);
      reset();
      router.push("/car-list");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const updateCarMutation = useMutation({
    mutationFn: async (data) => updateCarAction(AddCarId, data),
    onSuccess: (response) => {
      toast.success(response?.message);
      reset();
      router.push("/car-list");
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });

  const onSubmit = async (data) => {
    data.registrationCard = exctractCarData?.fileUrl?.path || "";
    try {
      if (AddCarId) {
        await updateCarMutation.mutateAsync(data);
      } else {
        await addCarMutation.mutateAsync(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const extractCarMutation = useMutation({
    mutationKey: ["extractCar"],
    mutationFn: async (formData) => {
      setLoadingCarExtract(true);
      return await extractCarAction(formData);
    },
    onSuccess: (response) => {
      toast.success("Registration Car File uploaded successfully.");
      setExctractCarData(response);
      setApiCalled(true);
      setLoadingCarExtract(false);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      setLoadingCarExtract(false);
    },
  });

  const handleCarRcIdData = (files) => {
    if (files?.length > 0 && !apiCalled && typeof files[0] === "object") {
      const formData = new FormData();
      formData.append("registrationCard", files[0]);
      extractCarMutation.mutate(formData);
      setApiCalled(true);
    } else if (!files || files.length === 0) {
      setExctractCarData(null);
      setApiCalled(false);
    }
  };

  useEffect(() => {
    if (extractCarMutation.isSuccess && exctractCarData) {
      const { carId, year, trim, brand, chesisNo, plateNumber } =
        exctractCarData.data;
      setValue("carId", carId);
      setValue("year", year);
      setValue("trim", trim);
      setValue("brand", brand);
      setValue("chassisNo", chesisNo);
      setValue("plateNumber", plateNumber);
    }
  }, [extractCarMutation.isSuccess, exctractCarData]);

  const { data: getMasterCarData, isLoading: isLoadinggetMasterCarData } =
    useQuery({
      queryKey: ["getMasterCarDataAction"],
      queryFn: getMasterCarDataAction,
    });

  const formattedCarData = getMasterCarData?.data?.map((make) => ({
    value: make,
    label: make,
  }));

  const handleMakeChange = async (selectedMake) => {
    try {
      const response = await getMasterCarDataAction({
        params: { brand: selectedMake },
      });
      setCarModelLists(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleModelChange = async (selectedModel, prevMake) => {
    try {
      const response = await getMasterCarDataAction({
        params: { brand: selectedMake || prevMake, model: selectedModel },
      });
      setCarTrimLists(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      {loadingCarExtract && (
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
            zIndex: 51,
          }}
        >
          <div className="flex items-center justify-center w-screen h-full">
            <LayoutLoader />
          </div>
        </div>
      )}
      <Breadcrumbs>
        <BreadcrumbItem>Menus</BreadcrumbItem>
        <BreadcrumbItem>
          <Link href="/car-list">Cars</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          {create_car ? "Update Car" : "Create Car"}
        </BreadcrumbItem>
      </Breadcrumbs>

      <div className="invoice-wrapper mt-6">
        <div className="grid grid-cols-12 gap-6">
          <Card className="col-span-12 xl:col-span-12">
            <CardHeader className="sm:flex-row sm:items-center gap-3">
              <div className="flex-1 text-xl font-medium text-default-700 whitespace-nowrap">
                {create_car ? "Update Car" : "Add Car"}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-5 2xl:mt-7">
                <CardContent className="mt-8 flex justify-between flex-wrap gap-4">
                  <div className="flex flex-row flex-wrap gap-4 w-full justify-between">
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
                                    htmlFor="registrationCard"
                                    className="block mb-3 "
                                  >
                                    Car Registration Card
                                  </Label>
                                  <Controller
                                    name="registrationCard"
                                    control={control}
                                    rules={{
                                      required: "Registration Card is required",
                                    }}
                                    render={({
                                      field: { onChange, value },
                                    }) => (
                                      <FileUploaderMultiple
                                        value={value}
                                        onChange={(files) => {
                                          onChange(files);
                                          handleCarRcIdData(files);
                                        }}
                                        name="registrationCard"
                                        textname="Car RC"
                                        errors={errors}
                                        width={150}
                                        height={150}
                                        resetTrigger={resetTrigger}
                                      />
                                    )}
                                  />
                                  {extractCarMutation.isLoading && (
                                    <p>Loading...</p>
                                  )}
                                  {extractCarMutation.isError && (
                                    <p>
                                      Error: {extractCarMutation.error.message}
                                    </p>
                                  )}
                                  {extractCarMutation.isSuccess && (
                                    <p>File uploaded successfully.</p>
                                  )}
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
                          <CardHeader className="flex flex-row items-center gap-3 font-bold">
                            Car Details
                          </CardHeader>
                          <CardContent className="flex flex-wrap gap-4 justify-between w-full">
                            <div className="flex flex-col flex-wrap gap-4 w-full lg:w-[45%] justify-between">
                              {/* year */}
                              <div className="w-full space-y-4">
                                <div className="w-full lg:w-full">
                                  <div>
                                    <Label htmlFor="carYear">Year</Label>
                                    <div className="flex gap-2 w-full">
                                      <Input
                                        type="text"
                                        placeholder="Enter Car Year"
                                        {...register("year")}
                                        size="lg"
                                        id="year"
                                        className={cn("w-full", {
                                          "border-destructive": errors?.year,
                                        })}
                                      />
                                    </div>
                                    {errors?.year && (
                                      <div className="text-red-500 mt-2">
                                        {errors?.year.message}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {/* make */}
                              <div className="w-full space-y-4">
                                <div className="w-full lg:w-full">
                                  <div>
                                    <Label htmlFor="make">Make</Label>
                                    <div className="flex gap-2 w-full">
                                      <Controller
                                        name="make"
                                        control={control}
                                        render={({
                                          field: { onChange, value },
                                        }) => (
                                          <Select
                                            // className="react-select w-full"
                                            classNamePrefix="select"
                                            id="make"
                                            styles={styles}
                                            options={formattedCarData}
                                            onChange={(selectedOption) => {
                                              onChange(selectedOption.value); // Assuming selectedOption is { value, label }
                                              handleMakeChange(
                                                selectedOption.value
                                              );
                                            }}
                                            className={cn("w-full react-select", {
                                              "border-destructive": errors?.make,
                                            })}
                                            value={formattedCarData?.find(
                                              (option) => option.value === value
                                            )}
                                          />
                                        )}
                                      />
                                    </div>
                                    {errors?.make && (
                                      <div className="text-red-500 mt-2">
                                        {errors?.make.message}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {/* model */}
                              <div className="w-full space-y-4">
                                <div className="w-full lg:w-full">
                                  <div>
                                    <Label htmlFor="model">Model</Label>
                                    <div className="flex gap-2 w-full">
                                      <Controller
                                        name="model"
                                        control={control}
                                        render={({
                                          field: { onChange, value },
                                        }) => (
                                          <Select
                                            className="react-select w-full"
                                            classNamePrefix="select"
                                            id="model"
                                            styles={styles}
                                            options={carModelLists?.map(
                                              (model) => ({
                                                value: model,
                                                label: model,
                                              })
                                            )}
                                            onChange={(selectedOption) => {
                                              onChange(selectedOption.value); // Assuming selectedOption is { value, label }
                                              handleModelChange(
                                                selectedOption.value
                                              );
                                            }}
                                            value={{
                                              value: carModelLists?.find(
                                                (option) => option === value
                                              ),
                                              label: carModelLists?.find(
                                                (option) => option === value
                                              ),
                                            }}
                                            isDisabled={!selectedMake}
                                          />
                                        )}
                                      />
                                    </div>
                                    {errors?.model && (
                                      <div className="text-red-500 mt-2">
                                        {errors?.model.message}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* trim */}
                              <div className="w-full space-y-4">
                                <div className="w-full lg:w-full">
                                  <div>
                                    <Label htmlFor="trim">Trim</Label>
                                    <div className="flex gap-2 w-full">
                                      <Controller
                                        name="trim"
                                        control={control}
                                        render={({
                                          field: { onChange, value },
                                        }) => (
                                          <Select
                                            className="react-select w-full"
                                            classNamePrefix="select"
                                            id="trim"
                                            styles={styles}
                                            options={carTrimLists?.map(
                                              (trim) => ({
                                                value: trim,
                                                label: trim,
                                              })
                                            )}
                                            onChange={(selectedOption) => {
                                              onChange(selectedOption.value);
                                            }}
                                            value={{
                                              value: carTrimLists?.find(
                                                (option) => option === value
                                              ),
                                              label: carTrimLists?.find(
                                                (option) => option === value
                                              ),
                                            }}
                                            isDisabled={!selectedModel} // Disable the trim select if no model is selected
                                          />
                                        )}
                                      />
                                    </div>
                                    {errors?.trim && (
                                      <div className="text-red-500 mt-2">
                                        {errors?.trim?.message}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col flex-wrap w-full lg:w-[45%] gap-4">
                              <div className="w-full space-y-4">
                                <div className="w-full lg:w-full">
                                  <div>
                                    <Label htmlFor="chassisNo">
                                      Chassis No
                                    </Label>
                                    <div className="flex gap-2 w-full">
                                      <Input
                                        type="text"
                                        placeholder="Chassis No"
                                        size="lg"
                                        id="chassisNo"
                                        {...register("chassisNo")}
                                        className={cn("w-full", {
                                          "border-red-500": errors?.chassisNo,
                                        })}
                                      />
                                    </div>
                                    {errors?.chassisNo && (
                                      <div className="text-red-500 mt-2">
                                        {errors?.chassisNo?.message}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="w-full space-y-4">
                                <div className="w-full lg:w-full">
                                  <div>
                                    <Label htmlFor="plateNumber">
                                      Plate Number
                                    </Label>
                                    <div className="flex gap-2 w-full">
                                      <Input
                                        type="text"
                                        placeholder="Plate Number"
                                        size="lg"
                                        id="plateNumber"
                                        {...register("plateNumber")}
                                        className={cn("w-full", {
                                          "border-red-500": errors?.plateNumber,
                                        })}
                                      />
                                    </div>
                                    {errors?.plateNumber && (
                                      <div className="text-red-500 mt-2">
                                        {errors?.plateNumber?.message}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between gap-4 flex-wrap">
                  <Button>
                    <Link href="/car-list">Back</Link>
                  </Button>
                  <Button type="submit">
                    {create_car ? "Update" : "Create"}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddCarPage;
