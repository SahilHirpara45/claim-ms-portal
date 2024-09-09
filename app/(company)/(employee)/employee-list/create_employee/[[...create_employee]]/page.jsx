"use client";
import {
  addEmployee,
  getSingleEmployeeAction,
  updateEmployee,
} from "@/action/companyAction/employee-action";
import FileUploaderSingle from "@/components/common/file-uploader/file-uploader-single";
import { toTitleCase } from "@/components/common/utitlity/helper";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import PasswordChangeModel from "./PasswordChangeModel";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { getInsuranceCompanies, getGarrageInsuranceCompanies } from "@/action/companyAction/insurance-action";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Select from "react-select";
import { z } from "zod";


const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};


const commonSchema = z.object({
  value: z.string().nonempty({ message: "Value is required." }),
  label: z.string().nonempty({ message: "Label is required." }),
});
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const employeeSchema = z
  .object({
    firstName: z.string().min(1, { message: "First Name is required." }),
    lastName: z.string().min(1, { message: "Last Name is required." }),
    email: z.string().email({ message: "Your email is invalid." }),
    assignInsuranceCompanys: z.array(z.any()).optional(),
    password: z
      .string()
      .min(8, { message: "Password should contain atleast 8 characters." }),
    // .regex(strongPasswordRegex, {
    //   message:
    //     "Password must be strong. At least 8 characters long, including one uppercase letter, one lowercase letter, one number, and one special character.",
    // }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required." }),
    designation: commonSchema,
    avatar: z.any().optional(),
    // avatar: z.array(z.any()).nonempty({ message: "Avatar is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"], // Specify which field to add the error to
  }).superRefine((data, ctx) => {
    if (data.designation?.value === "Surveyor" && (!data.assignInsuranceCompanys || data.assignInsuranceCompanys.length === 0)) {
      ctx.addIssue({
        path: ["assignInsuranceCompanys"],
        message: "Insurance company required!",
      });
    }
  });


///

const employeeSchemaUpdate = z.object({
  firstName: z.string().min(1, { message: "First Name is required." }),
  lastName: z.string().min(1, { message: "Last Name is required." }),
  email: z.string().email({ message: "Your email is invalid." }),
  designation: commonSchema,
  assignInsuranceCompanys: z.array(z.any()).optional(),
  avatar: z.any().optional(),
  // avatar: z.array(z.any()).nonempty({ message: "Avatar is required" }),
}).superRefine((data, ctx) => {
  if (data.designation?.value === "Surveyor" && (!data.assignInsuranceCompanys || data.assignInsuranceCompanys.length === 0)) {
    ctx.addIssue({
      path: ["assignInsuranceCompanys"],
      message: "Insurance company required!",
    });
  }
});
//

const EmployeePage = () => {
  const [resetTrigger, setResetTrigger] = useState(false);
  const [allSelected, setAllSelected] = useState(false); // Add this state
  const router = useRouter();
  const { create_employee } = useParams();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handlePasswordModalOpen = () => setIsPasswordModalOpen(true);
  const handlePasswordModalClose = () => setIsPasswordModalOpen(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordUpdate, setIsPasswordUpdate] = useState(false);

  const employeeId = create_employee && create_employee[0];

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
    watch
  } = useForm({
    resolver: zodResolver(employeeId ? employeeSchemaUpdate : employeeSchema),
    mode: "all",
    defaultValues: {
      avatar: null,
    },
  });

  const [permission, setPermission] = useState({
    jobCard: { create: false, view: false, update: false, delete: false, reAssign: false },
    cars: { create: false, view: false, update: false, delete: false },
    customers: { create: false, view: false, update: false, delete: false },
  });

  const DesignationList = [
    { value: "CSR", label: "CSR" },
    { value: "Technician", label: "Technician" },
    { value: "Surveyor", label: "Surveyor" },
  ];

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

  useEffect(() => {
    if (employeeData) {
      const currentDesignation = DesignationList.find(
        (item) => item.value === employeeData.designation
      );
      setValue("designation", currentDesignation);
    }
  }, [employeeData, setValue]);

  const mutation = useMutation({
    mutationKey: ["addEmployee"],
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append(`assignInsuranceCompanys`, JSON.stringify(data.assignInsuranceCompanys));
      for (const key in data) {

        if (key === "avatar" && data[key] && data[key][0]) {
          formData.append(key, data[key][0]);
        }
        else if (key === "permission") {
          formData.append(key, JSON.stringify(data[key]));
        } else if (key !== "assignInsuranceCompanys") {
          // Avoid re-adding assignInsuranceCompanys
          formData.append(key, data[key]);
        }
      }
      return await addEmployee(formData);
    },
    onSuccess: (response) => {
      toast.success(response?.message);
      setResetTrigger(!resetTrigger);
      router.push("/employee-list");
    },
    onError: (error) => {

      toast.error(
        error?.data?.message || "Account with that email address already exists"
      );
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();

      formData.append(`assignInsuranceCompanys`, JSON.stringify(data.assignInsuranceCompanys));


      for (const key in data) {
        if (key === "avatar" && data[key] && data[key][0]) {
          formData.append(key, data[key][0]);
        } else if (key === "permission") {
          formData.append(key, JSON.stringify(data[key]));
        } else if (key !== "assignInsuranceCompanys") {
          // Avoid re-adding assignInsuranceCompanys
          formData.append(key, data[key]);
        }
      }
      return await updateEmployee(employeeId, formData);
    },
    onSuccess: (response) => {
      console.log(response, "responseresponse");
      toast.success(response?.message || "Employee updated successfully");
      if (isPasswordUpdate) {
        handlePasswordModalClose();
        setIsPasswordUpdate(false);
      } else {
        router.push("/employee-list");
      }
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update employee"
      );
    },
  });


  const handleSwitchChange = (category, type) => {
    setPermission((prev) => {
      const newPermission = {
        ...prev,
        [category]: { ...prev[category], [type]: !prev[category][type] },
      };

      const allSelected = Object.keys(newPermission).every((category) =>
        Object.values(newPermission[category]).every((value) => value)
      );
      setAllSelected(allSelected);

      return newPermission;
    });
  };

  const handleSelectAllChange = () => {
    const categories = ["customers", "cars", "jobCard"];
    const allSelected = categories.every((category) =>
      Object.values(permission[category]).every((value) => value)
    );

    const newPermission = categories.reduce((acc, category) => {
      acc[category] = {
        create: !allSelected,
        view: !allSelected,
        update: !allSelected,
        delete: !allSelected,
        reAssign: !allSelected,
      };
      return acc;
    }, {});

    setPermission((prev) => ({ ...prev, ...newPermission }));
    setAllSelected(!allSelected);
  };

  const onSubmit = (data) => {

    data.designation = data.designation.value;
    data.permission = permission;
    if (employeeId) {
      updatePostMutation.mutate(data);
    } else {
      if (data.hasOwnProperty("confirmPassword")) {
        delete data.confirmPassword;
      }

      mutation.mutate(data);
    }
  };

  const handleReset = () => {
    reset();
    setResetTrigger(!resetTrigger);
  };

  const handleInputChange = (event, fieldName) => {
    const { value } = event.target;
    setValue(fieldName, toTitleCase(value));
  };

  const handlePasswordUpdate = (data) => {
    setIsPasswordUpdate(true);
    // Call your update mutation here
    updatePostMutation.mutate(data, {
      onSuccess: () => {
        handlePasswordModalClose();
      },
      onError: (error) => {
        // Handle error
      },
    });
  };

  //ay

  const designation = watch("designation");



  const { data: InsuranceCompaniesData } = useQuery({
    queryKey: ["getInsuranceCompanies"],
    queryFn: () =>
      getGarrageInsuranceCompanies({
        all: true,
      }),
  });

  const InsuranseCompanyList = InsuranceCompaniesData?.data?.garageInsurance?.map(
    (insuranse_compnay) => ({
      value: insuranse_compnay._id,
      label: insuranse_compnay.companyName,
    })
  );


  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 2xl:mt-7">
        <div>
          <Breadcrumbs>
            <BreadcrumbItem>Menu</BreadcrumbItem>
            <BreadcrumbItem>
              <Link href="/employee-list">Employees</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              {create_employee ? "Update Employee" : "Create Employee"}
            </BreadcrumbItem>
          </Breadcrumbs>
          <div className="invoice-wrapper mt-6">
            <div className="grid grid-cols-12 gap-6">
              <Card className="col-span-12">
                <CardHeader className="sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 text-xl font-medium text-default-700 whitespace-nowrap">
                    {create_employee ? "Update Employee" : "Create Employee"}
                  </div>
                  <div className="flex items-center justify-between sm:w-auto gap-2">
                    {/* <Button
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
                    </Button> */}
                    {create_employee && (
                      <>
                        <Button
                          className="border-default-300 group"
                          type="button"
                          title="Password Change"
                          onClick={handlePasswordModalOpen}
                        >
                          Change Password
                        </Button>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="w-full flex flex-wrap gap-4">
                    <div className="w-full lg:w-[48%] space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        type="text"
                        placeholder="First Name"
                        {...register("firstName")}
                        size="lg"
                        id="firstName"
                        onChange={(e) => handleInputChange(e, "firstName")}
                        className={cn("w-full", {
                          "border-destructive": errors.firstName,
                        })}
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
                        onChange={(e) => handleInputChange(e, "lastName")}
                        className={cn("w-full", {
                          "border-destructive": errors.lastName,
                        })}
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
                      />
                      {errors.email && (
                        <div className="text-destructive mt-2">
                          {errors.email.message}
                        </div>
                      )}
                      <Label htmlFor="designation">Designation</Label>
                      <Controller
                        name="designation"
                        control={control}
                        defaultValue={
                          employeeData
                            ? DesignationList.find(
                              (item) =>
                                item.value === employeeData.designation
                            )
                            : DesignationList[0]
                        }
                        render={({ field: { onChange, value } }) => (
                          <Select
                            className="react-select"
                            classNamePrefix="select"
                            id="designation"
                            options={DesignationList}
                            onChange={(selectedOption) => {
                              onChange(selectedOption);
                            }}
                            value={value}
                          />
                        )}
                      />
                      {errors.designation && (
                        <div className="text-destructive mt-2">
                          {errors.designation.message}
                        </div>
                      )}
                    </div>
                    {!employeeId && (
                      <div className="w-full lg:w-[48%] space-y-2">
                        <Label htmlFor="password">Create Password</Label>


                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create Password"
                            {...register("password")}
                            id="password"
                            size="lg"
                            onChange={(e) => handleInputChange(e, "password")}
                            className={cn("w-full pr-10", {
                              "border-destructive": errors.password,
                            })}
                          />
                          <span
                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon
                              icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                              className="w-5 h-5 text-gray-500"
                            />
                          </span>
                        </div>


                        {/* <Input
                          
                          placeholder="Create Password"
                          {...register("password")}
                          size="lg"
                          id="password"
                          onChange={(e) => handleInputChange(e, "password")}
                          className={cn("w-full", {
                            "border-destructive": errors.password,
                          })}
                        /> */}
                        {errors.password && (
                          <div className="text-destructive mt-2">
                            {errors?.password?.message}
                          </div>
                        )}
                      </div>
                    )}

                    {!employeeId && (
                      <div className="w-full lg:w-[48%] space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirm Password
                        </Label>
                        {/* <Input
                          type="text"
                          placeholder="Confirm Password"
                          {...register("confirmPassword")}
                          size="lg"
                          id="confirmPassword"
                          onChange={(e) =>
                            handleInputChange(e, "confirmPassword")
                          }
                          className={cn("w-full", {
                            "border-destructive": errors.confirmPassword,
                          })}
                        /> */}
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            {...register("confirmPassword")}
                            id="confirmPassword"
                            size="lg"
                            onChange={(e) =>
                              handleInputChange(e, "confirmPassword")
                            }
                            className={cn("w-full", {
                              "border-destructive": errors.confirmPassword,
                            })}
                          />
                          <span
                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon
                              icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                              className="w-5 h-5 text-gray-500"
                            />
                          </span>
                        </div>
                        {errors.confirmPassword && (
                          <div className="text-destructive mt-2">
                            {errors?.confirmPassword?.message}
                          </div>
                        )}
                      </div>
                    )}

                    {designation?.value === "Surveyor" && (
                      <div className="w-full lg:w-[48%] space-y-2">
                        <Label htmlFor="assignInsuranceCompanys"> Insurance Company</Label>
                        <Controller
                          name="assignInsuranceCompanys"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <Select
                              className="react-select w-full"
                              isMulti
                              classNamePrefix="select"
                              id="assignInsuranceCompanys"
                              styles={styles}
                              options={InsuranseCompanyList}
                              onChange={(selectedOptions) => {
                                onChange(selectedOptions ? selectedOptions.map(option => option.value) : []);
                              }}
                              value={InsuranseCompanyList?.filter(
                                (option) => value?.includes(option.value)
                              )}
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
                              onChange={(files) => field.onChange(files)}
                              height={200}
                              width={200}
                              name="avatar"
                              resetTrigger={resetTrigger}
                              closeXmark={true}
                            />
                          )}
                        />
                        {/* {errors.avatar && (
                          <div className="text-destructive mt-2">
                            {errors.avatar.message}
                          </div>
                        )} */}
                      </div>

                      <div className="w-full lg:w-[52%] space-y-2">
                        <div className="invoice-wrapper">
                          <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12">
                              <div className="sm:flex-row sm:items-center gap-3">
                                <Label>Permissions</Label>
                              </div>
                              <div className="flex flex-col gap-4 p-6">
                                <div className="flex flex-wrap gap-4 ">
                                  <Label className="capitalize font-semibold">Select All</Label>
                                  <Switch
                                    checked={allSelected}
                                    onCheckedChange={handleSelectAllChange}
                                  />
                                </div>
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
                                    <div key={category} className="flex flex-wrap gap-4">
                                      <div className="w-full lg:w-1/4 space-y-2">
                                        <Label className="capitalize font-semibold">
                                          {category}
                                        </Label>
                                      </div>

                                      {["create", "view", "update", "delete"].map((type) => (
                                        <div key={type} className="flex items-center gap-2">
                                          <Label className="capitalize">{type}</Label>
                                          <Switch
                                            checked={permission[category][type]}
                                            onCheckedChange={() =>
                                              handleSwitchChange(category, type)
                                            }
                                          />
                                        </div>
                                      ))}

                                      {/* Conditionally render the reAssign toggle for jobCard if designation is CSR */}
                                      {category === "jobCard" && (
                                        <div className="flex items-center gap-2">
                                          <Label className="capitalize">Reassign</Label>
                                          <Switch
                                            checked={permission[category].reAssign}
                                            onCheckedChange={() => handleSwitchChange(category, 'reAssign')}
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
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="ml-auto"
                    type="submit"
                    variant="primary"
                    isLoading={
                      mutation.isLoading || updatePostMutation.isLoading
                    }
                  >
                    {create_employee ? "Update Employee" : "Create Employee"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </form>
      {isPasswordModalOpen && (
        <PasswordChangeModel
          onClose={handlePasswordModalClose}
          onSubmit={handlePasswordUpdate}
        />
      )}
    </>
  );
};

export default EmployeePage;
