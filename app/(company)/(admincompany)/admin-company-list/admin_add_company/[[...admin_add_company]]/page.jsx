"use client";
import {
  addCompany,
  getSingleCompanieAction,
  updateCompanyAction,
} from "@/action/admin-action";
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
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  companyName: z.string().nonempty({ message: "Company Name is required." }),
  email: z.string().email({ message: "Your email is invalid." }),
  avatar: z.any().optional(),
  address: z.string().nonempty({ message: "Address is required." }),
  city: z.string().nonempty({ message: "City is required." }),
  country: z.string().nonempty({ message: "Country is required." }),
  mobileNumber: z.string().nonempty({ message: "Mobile Number is required." }),
});

///
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const companySchemaCreate = z
  .object({
    companyName: z.string().nonempty({ message: "Company Name is required." }),
    email: z.string().email({ message: "Your email is invalid." }),
    avatar: z.any().optional(),
    address: z.string().nonempty({ message: "Address is required." }),
    city: z.string().nonempty({ message: "City is required." }),
    country: z.string().nonempty({ message: "Country is required." }),
    mobileNumber: z
      .string()
      .nonempty({ message: "Mobile Number is required." }),
    password: z.string().min(8, { message: "Password should contain atleast 8 characters." }),
    // .regex(strongPasswordRegex, {
    //   message:
    //     "Password must be strong. At least 8 characters long, including one uppercase letter, one lowercase letter, one number, and one special character.",
    // }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password should contain atleast 8 characters." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"], // Specify which field to add the error to
  });

//

const CompanyPage = () => {
  const router = useRouter();
  const [resetTrigger, setResetTrigger] = useState(false);
  const { admin_add_company } = useParams();
  const [showPassword, setShowPassword] = useState(false);

  const adminCompanyId = admin_add_company && admin_add_company[0];
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm({
    resolver: zodResolver(adminCompanyId ? schema : companySchemaCreate),
    mode: "all",
    // defaultValues: {
    //   companyName: "",
    //   address: "",
    //   city: "",
    //   country: "",
    //   mobileNumber: "",
    //   email: "",
    //   avtar: "",
    // },
  });

  const {
    isLoading,
    isError,
    data: companyData,
    error,
  } = useQuery({
    queryKey: ["companyData", adminCompanyId],
    queryFn: () => getSingleCompanieAction(adminCompanyId),
    enabled: !!adminCompanyId, // Only enable query if adminCompanyId is truthy
    retry: false,
  });

  console.log(companyData, "companyData");

  useEffect(() => {
    if (companyData) {
      const {
        companyName,
        address,
        city,
        country,
        mobileNumber,
        email,
        avatar,
      } = companyData;
      setValue("companyName", companyName ? companyName : "");
      setValue("address", address ? address : "");
      setValue("city", city ? city : "");
      setValue("country", country ? country : "");
      setValue("mobileNumber", mobileNumber ? mobileNumber : "");
      setValue("email", email ? email : "");
      if (avatar) {
        setValue("avatar", [avatar]);
      }
    }
  }, [companyData]);

  const mutation = useMutation({
    mutationKey: ["addCompany"],
    mutationFn: async (data) => {
      const formData = new FormData();
      for (const key in data) {
        if (dirtyFields[key]) {
          if (key === "avatar" && data[key] && data[key][0] instanceof File) {
            formData.append(key, data[key][0]);
          } else {
            formData.append(key, data[key]);
          }
        }
      }
      return await addCompany(formData);
    },
    onSuccess: (response) => {
      toast.success(response?.message);
      reset();
      setResetTrigger(!resetTrigger);
      router.push("/admin-company-list");
    },
    onError: (error) => {
      console.log(error, "erro into craeting");
      toast.error(error?.message);
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();

      console.log("i am data update :-", data);
      for (const key in data) {
        if (dirtyFields[key]) {
          if (key === "avatar" && data[key] && data[key][0] instanceof File) {
            formData.append(key, data[key][0]);
          } else {
            formData.append(key, data[key]);
          }
        }
      }
      return await updateCompanyAction(adminCompanyId, formData);
    },
    onSuccess: (res) => {
      toast.success(res?.message);
      reset();
      router.push("/admin-company-list");
    },
    onError: (error) => {
      console.log(error, "error");
      toast.error(error?.message);
    },
  });

  const onSubmit = (data) => {
    console.log("data ui:-", data);
    if (adminCompanyId) {
      updatePostMutation.mutateAsync(data);
    } else {
      if (data.hasOwnProperty("confirmPassword")) {
        delete data.confirmPassword;
      }
      mutation.mutateAsync(data).catch((err) => {
        console.log(err, "err >>>");
      });
    }
  };

  const handleReset = () => {
    reset();
    setResetTrigger(!resetTrigger);
  };

  return (
    <div>
      <Breadcrumbs>
        <BreadcrumbItem>Menus</BreadcrumbItem>
        <BreadcrumbItem>
          <Link href="/admin-company-list">Companies / Garages</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          {admin_add_company ? "Update Company" : "Create Company"}
        </BreadcrumbItem>
      </Breadcrumbs>
      <div className="invoice-wrapper mt-6">
        <div className="grid grid-cols-12 gap-6">
          <Card className="col-span-12">
            <CardHeader className="sm:flex-row sm:items-center gap-3">
              <div className="flex-1 text-xl font-medium text-default-700 whitespace-nowrap">
                {admin_add_company ? "Update Company" : "Create Company"}
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
                <div className="w-full flex flex-wrap justify-between gap-4">
                  <div className="w-full lg:w-[48%] space-y-2">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>

                      <div className="flex flex-col gap-2 mt-2 w-full">
                        <Input
                          type="text"
                          placeholder="Company Name"
                          {...register("companyName")}
                          size="lg"
                          id="companyName"
                          className={cn("w-full", {
                            "border-destructive": errors.companyName,
                          })}
                        />

                        {errors.companyName && (
                          <div className="text-destructive mt-0">
                            {errors.companyName.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="mobileNumber">Mobile Number</Label>
                      <div className="flex gap-2 mt-2 w-full">
                        <Input
                          type="text"
                          placeholder="Mobile Number"
                          {...register("mobileNumber")}
                          size="lg"
                          id="mobileNumber"
                          className={cn("w-full", {
                            "border-destructive": errors.mobileNumber,
                          })}
                        />
                      </div>
                      {errors.mobileNumber && (
                        <div className="text-destructive mt-2">
                          {errors.mobileNumber.message}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <div className="flex flex-col gap-2 mt-2 w-full">
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
                          <div className="text-destructive mt-0">
                            {errors.email.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-[48%] space-y-2">
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <div className="flex flex-col gap-2 mt-2 w-full">
                        <Input
                          type="text"
                          placeholder="Address"
                          {...register("address")}
                          size="lg"
                          id="address"
                          className={cn("w-full", {
                            "border-destructive": errors.address,
                          })}
                        />
                        {errors.address && (
                          <div className="text-destructive">
                            {errors.address.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="city">City</Label>
                      <div className="flex flex-col gap-2 mt-2 w-full">
                        <Input
                          type="text"
                          placeholder="City"
                          {...register("city")}
                          size="lg"
                          id="city"
                          className={cn("w-full", {
                            "border-destructive": errors.city,
                          })}
                        />
                        {errors.city && (
                          <div className="text-destructive">
                            {errors.city.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="country">Country</Label>
                      <div className="flex flex-col gap-2 mt-2 w-full">
                        <Input
                          type="text"
                          placeholder="Country"
                          {...register("country")}
                          size="lg"
                          id="country"
                          className={cn("w-full", {
                            "border-destructive": errors.country,
                          })}
                        />
                        {errors.country && (
                          <div className="text-destructive mt-2">
                            {errors.country.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {!adminCompanyId && (
                  <div className="flex w-full justify-between flex-wrap gap-2">
                    <div className="w-full lg:w-[48%] space-y-2">
                      <Label htmlFor="password">Create Password</Label>
                      {/* <Input
                        type="text"
                        placeholder="Create Password"
                        {...register("password")}
                        size="lg"
                        id="password"
                        className={cn("w-full", {
                          "border-destructive": errors.password,
                        })}
                      /> */}
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create Password"
                          {...register("password")}
                          id="password"
                          size="lg"
                          // onChange={(e) => handleInputChange(e, "password")}
                          className={cn("w-full", {
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
                      {errors.password && (
                        <div className="text-destructive mt-2">
                          {errors?.password?.message}
                        </div>
                      )}
                    </div>


                    <div className="w-full lg:w-[48%]  space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      {/* <Input
                        type="text"
                        placeholder="Confirm Password"
                        {...register("confirmPassword")}
                        size="lg"
                        id="confirmPassword"
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
                          // onChange={(e) =>
                          //   handleInputChange(e, "confirmPassword")
                          // }
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


                  </div>
                )}

                <div className="w-full flex flex-wrap justify-between gap-4">
                  <div className="w-full lg:w-[48%] mt-4">
                    <Label htmlFor="avatar" className="block mb-3">
                      Avatar
                    </Label>
                    <Controller
                      name="avatar"
                      control={control}
                      // rules={{
                      //   required: "Avatar is required",
                      // }}
                      render={({ field: { onChange, value } }) => (
                        <FileUploaderSingle
                          value={value}
                          onChange={onChange}
                          height={150}
                          width={150}
                          name="avatar"
                          errors={errors}
                          resetTrigger={resetTrigger}
                        />
                      )}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-4 flex-wrap">
                {/* <Button>
                  <Link href="/admin-company-list">Back</Link>
                </Button> */}
                <Button type="submit">
                  {admin_add_company ? "Update" : "Create"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
