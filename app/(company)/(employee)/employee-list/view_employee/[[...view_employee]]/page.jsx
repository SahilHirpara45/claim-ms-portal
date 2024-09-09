"use client";
import FileUploaderSingle from "@/components/common/file-uploader/file-uploader-single";
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
import { Icon } from "@iconify/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { getSingleEmployeeAction } from "@/action/companyAction/employee-action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import SelectR from "react-select";

import {
  getInsuranceCompanies,
  getGarrageInsuranceCompanies,
} from "@/action/companyAction/insurance-action";
const employeeSchema = z.object({
  firstName: z.string().min(1, { message: "First Name is required." }),
  lastName: z.string().min(1, { message: "Last Name is required." }),
  email: z.string().email({ message: "Your email is invalid." }),
});

const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const viewEmployee = () => {
  const [avatar, setAvatar] = useState([]);
  const [resetTrigger, setResetTrigger] = useState(false);
  const router = useRouter();
  const { view_employee } = useParams();

  const employeeId = view_employee && view_employee[0];

  const {
    isLoading,
    isError,
    data: employeeData,
    error,
  } = useQuery({
    queryKey: ["employeeData", employeeId],
    queryFn: () => getSingleEmployeeAction(employeeId),
    enabled: !!employeeId,
    retry: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(employeeSchema),
    mode: "all",
    defaultValues: {
      avatar: null,
    },
  });
  const [permission, setPermission] = useState({
    jobCard: { create: false, view: false, update: false, delete: false },
    // insuranceCompany: { create: false, view: false, update: false, delete: false },
    cars: { create: false, view: false, update: false, delete: false },
    customers: { create: false, view: false, update: false, delete: false },
    // employee: { create: false, view: false, update: false, delete: false },
  });

  useEffect(() => {
    if (employeeData) {
      const {
        firstName,
        lastName,
        city,
        country,
        mobileNumber,
        email,
        address,
        avatar,
        permissionId,
        designation,
        assignInsuranceCompanys,
      } = employeeData;
      setValue("firstName", firstName);
      setValue("lastName", lastName);
      setValue("city", city);
      setValue("country", country);
      setValue("address", address);
      setValue("mobileNumber", mobileNumber);
      setValue("email", email);
      setValue("designation", designation);
      setValue("assignInsuranceCompanys", assignInsuranceCompanys);
      if (avatar) {
        setValue("avatar", [avatar]);
      }
      if (permissionId) {
        setPermission(permissionId);
      }
    }
  }, [employeeData, setValue]);

  const onSubmit = (data) => {
    router.push("/employee-list");
  };

  const handleReset = () => {
    reset();
    setResetTrigger(!resetTrigger);
  };

  const designation = watch("designation");

  const { data: InsuranceCompaniesData } = useQuery({
    queryKey: ["getInsuranceCompanies"],
    queryFn: () =>
      getGarrageInsuranceCompanies({
        all: true,
      }),
  });

  const InsuranseCompanyList =
    InsuranceCompaniesData?.data?.garageInsurance?.map((insuranse_compnay) => ({
      value: insuranse_compnay._id,
      label: insuranse_compnay.companyName,
    }));

  return (
    <div>
      <Breadcrumbs>
        <BreadcrumbItem>Menu</BreadcrumbItem>
        <BreadcrumbItem>
          {view_employee ? "View Employee" : "Create Employee"}
        </BreadcrumbItem>
      </Breadcrumbs>
      <div className="invoice-wrapper mt-6">
        <div className="grid grid-cols-12 gap-6">
          <Card className="col-span-12">
            <CardHeader className="sm:flex-row sm:items-center gap-3">
              <div className="flex-1 text-xl font-medium text-default-700 whitespace-nowrap">
                {view_employee ? "View Employee" : "Create Employee"}
              </div>
              <div className="flex-none flex items-center gap-4">
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
              </div>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 2xl:mt-7">
              <CardContent className="flex flex-wrap gap-4">
                <div className="w-full flex flex-wrap gap-4">
                  <div className="w-full lg:w-[48%] space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      type="text"
                      placeholder="First Name"
                      {...register("firstName")}
                      size="lg"
                      id="firstName"
                      className={cn("w-full", {
                        "border-destructive": errors.firstName,
                      })}
                      readOnly
                    />
                    {errors.firstName && (
                      <div className="text-destructive mt-2">
                        {errors.firstName.message}
                      </div>
                    )}

                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      type="text"
                      placeholder="Last Name"
                      {...register("lastName")}
                      size="lg"
                      id="lastName"
                      className={cn("w-full", {
                        "border-destructive": errors.lastName,
                      })}
                      readOnly
                    />
                    {errors.lastName && (
                      <div className="text-destructive mt-2">
                        {errors.lastName.message}
                      </div>
                    )}
                  </div>

                  <div className="w-full lg:w-[48%] space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      placeholder="Email"
                      {...register("email")}
                      size="lg"
                      id="email"
                      className={cn("w-full", {
                        "border-destructive": errors.email,
                      })}
                      readOnly
                    />
                    {errors.email && (
                      <div className="text-destructive mt-2">
                        {errors.email.message}
                      </div>
                    )}

                    <Label htmlFor="designation">Designation</Label>
                    <Input
                      type="text"
                      placeholder="designation"
                      {...register("designation")}
                      size="lg"
                      id="designation"
                      className={cn("w-full", {
                        "border-destructive": errors.designation,
                      })}
                      readOnly
                    />
                  </div>
                </div>
                {employeeData?.assignInsuranceCompanys &&
                  employeeData.assignInsuranceCompanys.length > 0 && (
                    <div className="w-full lg:w-[48%] space-y-2">
                      <Label htmlFor="assignInsuranceCompanys">
                        {" "}
                        Insurance Company
                      </Label>
                      <Controller
                        name="assignInsuranceCompanys"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <SelectR
                            className="react-select w-full"
                            isMulti
                            classNamePrefix="select"
                            id="assignInsuranceCompanys"
                            styles={styles}
                            options={InsuranseCompanyList}
                            onChange={(selectedOptions) => {
                              onChange(
                                selectedOptions
                                  ? selectedOptions.map(
                                      (option) => option.value
                                    )
                                  : []
                              );
                            }}
                            value={InsuranseCompanyList?.filter((option) =>
                              value?.includes(option.value)
                            )}
                            isDisabled
                          />
                        )}
                      />
                      {errors.assignInsuranceCompanys && (
                        <div className="text-red-500 mt-2">
                          {errors.assignInsuranceCompanys.message}
                        </div>
                      )}
                    </div>
                  )}

                <div className="w-full flex flex-col lg:flex-row gap-4">
                  <div className="w-full lg:w-[48%] space-y-2">
                    <Label htmlFor="avatar">Upload Avatar</Label>
                    <Controller
                      name="avatar"
                      control={control}
                      render={({ field }) => (
                        <FileUploaderSingle
                          value={field.value}
                          onChange={(files) => {
                            field.onChange(files);
                            setAvatar(files);
                          }}
                          height={200}
                          width={200}
                          name="avatar"
                          errors={errors}
                          resetTrigger={resetTrigger}
                          closeXmark={false}
                          readOnly
                        />
                      )}
                    />
                    {errors.avatar && (
                      <div className="text-destructive mt-2">
                        {errors.avatar.message}
                      </div>
                    )}
                  </div>

                  <div className="w-full lg:w-[52%] space-y-2">
                    <div className="invoice-wrapper">
                      <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12">
                          <div className="sm:flex-row sm:items-center gap-3">
                            <Label>Permissions</Label>
                          </div>
                          <div className="flex flex-col gap-4 p-6">
                            {Object.keys(permission).map((category) => {
                              if (
                                [
                                  "createdAt",
                                  "updatedAt",
                                  "_id",
                                  "userId",
                                  "employee",
                                  "insuranceCompany",
                                ].includes(category)
                              ) {
                                return null;
                              }

                              return (
                                <div
                                  key={category}
                                  className="flex flex-wrap gap-4"
                                >
                                  <div className="w-full lg:w-1/4 space-y-2">
                                    <Label className="capitalize">
                                      {category}
                                    </Label>
                                  </div>
                                  {["create", "view", "update", "delete"].map(
                                    (type) => (
                                      <div
                                        key={type}
                                        className="flex items-center gap-2"
                                      >
                                        <Label className="capitalize">
                                          {type}
                                        </Label>
                                        <Switch
                                          disabled
                                          checked={permission[category][type]}
                                          onCheckedChange={() =>
                                            handleSwitchChange(category, type)
                                          }
                                        />
                                      </div>
                                    )
                                  )}
                                  {category === "jobCard" && (
                                    <div className="flex items-center gap-2">
                                      <Label className="capitalize">
                                        Reassign
                                      </Label>
                                      <Switch
                                        disabled
                                        checked={permission[category].reAssign}
                                        onCheckedChange={() =>
                                          handleSwitchChange(
                                            category,
                                            "reAssign"
                                          )
                                        }
                                      />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-4 flex-wrap">
                <Link href="/employee-list">
                  <Button type="submit">Back</Button>
                </Link>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default viewEmployee;
