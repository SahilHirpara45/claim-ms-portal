"use client";
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
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { Plus, Upload } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addCompanySchema } from "./schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addInsuranceCompany,
  getSingleInsurance,
  updateInsurance,
} from "@/action/companyAction/insurance-action";
import FileUploaderSingle from "@/components/common/file-uploader/file-uploader-single";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const AddCompanies = () => {
  const [resetTrigger, setResetTrigger] = useState(false);
  const { add_insurance } = useParams();
  const insuranceId = add_insurance && add_insurance[0];

  const {
    isLoading,
    isError,
    data: InsuranceCompanyData,
    error,
  } = useQuery({
    queryKey: ["InsuranceCompanyData", insuranceId],
    queryFn: () => getSingleInsurance(insuranceId),
    enabled: !!insuranceId,
    retry: false,
  });

  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(addCompanySchema),
    mode: "all",
  });

  useEffect(() => {
    if (InsuranceCompanyData) {
      const {
        companyName,
        companyEmail,
        companyWebsite,
        claimsEmail,
        contactEmail,
        // companyPortal,
        contactNo,
        description,
        logo,
      } = InsuranceCompanyData;
      setValue("companyName", companyName);
      setValue("companyEmail", companyEmail);
      setValue("claimsEmail", claimsEmail);
      setValue("contactEmail", contactEmail);
      setValue("companyWebsite", companyWebsite);
      // setValue("companyPortal", companyPortal);
      setValue("contactNo", contactNo);
      setValue("description", description);
      if (logo) {
        setValue("logo", logo ? [logo] : []);
      }
    }
  }, [InsuranceCompanyData, setValue]);

  const handleFileUpload = (file, fieldName) => {
    setValue(fieldName, file, { shouldValidate: true });
  };

  const mutation = useMutation({
    mutationKey: ["addInsuranceCompany"],
    mutationFn: async (data) => {
      return await addInsuranceCompany(data);
    },
    onSuccess: (response) => {
      toast.success(response?.message);
      reset();
      setResetTrigger(!resetTrigger);
      router.push("/insurance-list");
    },
    onError: (error) => {
      toast.error(error?.data?.message);
    },
  });

  const updatePostMutation = useMutation({
    mutationKey: ["updateInsurance"],
    mutationFn: async (data) => {
      return await updateInsurance(insuranceId, data);
    },
    onSuccess: (response) => {
      toast.success(response?.message);
      router.push("/insurance-list");
      reset();
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });

  const handleReset = () => {
    reset();
  };

  const onSubmit = async (data) => {
    const updatedData = Object.keys(dirtyFields).reduce((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {});

    // Create FormData instance
    const formData = new FormData();
    for (const key in updatedData) {
      if (key === "logo") {
        if (updatedData[key] && updatedData[key][0]) {
          formData.append(key, updatedData[key][0]);
        }
      } else {
        formData.append(key, updatedData[key]);
      }
    }

    if (insuranceId) {
      updatePostMutation.mutateAsync(formData).catch((err) => {
        console.log(err);
      });
    } else {
      mutation.mutateAsync(formData).catch((err) => {
        console.log(err);
      });
    }
  };

  return (
    <div>
      <Breadcrumbs>
        <BreadcrumbItem>Menu</BreadcrumbItem>
        <BreadcrumbItem>
          <Link href="/insurance-list">Insurance Companies</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          {add_insurance ? "Update Insurance Company" : "Create a company"}
        </BreadcrumbItem>
      </Breadcrumbs>
      <div className="invoice-wrapper mt-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-6">
            <Card className="col-span-12">
              <CardHeader className="sm:flex-row sm:items-center gap-3">
                <div className="flex-1 text-xl font-medium text-default-700 whitespace-nowrap">
                  {add_insurance
                    ? "Update Insurance Company"
                    : "Create a company"}
                </div>
                <div className="flex-none flex items-center gap-4">
                  <Button
                    className="border-default-300 group"
                    size="icon"
                    variant="outline"
                    onClick={handleReset}
                  >
                    <Icon
                      icon="heroicons:arrow-path"
                      className="w-5 h-5 text-default-300 group-hover:text-default-50 dark:group-hover:text-primary-foreground"
                    />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <Label>Company Name</Label>
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
                        <div className="text-destructive mt-2">
                          {errors.companyName.message}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label>Account Email</Label>
                      <Input
                        type="email"
                        placeholder="Account Email"
                        {...register("companyEmail")}
                        size="lg"
                        id="companyEmail"
                        className={cn("w-full", {
                          "border-destructive": errors.companyEmail,
                        })}
                      />
                      {errors.companyEmail && (
                        <div className="text-destructive mt-2">
                          {errors.companyEmail.message}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label>Claims Email</Label>
                      <Input
                        type="email"
                        placeholder="Claims Email"
                        {...register("claimsEmail")}
                        size="lg"
                        id="claimsEmail"
                        className={cn("w-full", {
                          "border-destructive": errors.claimsEmail,
                        })}
                      />
                      {errors.claimsEmail && (
                        <div className="text-destructive mt-2">
                          {errors.claimsEmail.message}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Contact Email</Label>
                      <Input
                        type="email"
                        placeholder="Contact Email"
                        {...register("contactEmail")}
                        size="lg"
                        id="contactEmail"
                        className={cn("w-full", {
                          "border-destructive": errors.contactEmail,
                        })}
                      />
                      {errors.contactEmail && (
                        <div className="text-destructive mt-2">
                          {errors.contactEmail.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <Label>Contact No</Label>
                      <Input
                        type="text"
                        placeholder="Contact No"
                        {...register("contactNo")}
                        size="lg"
                        id="contactNo"
                        className={cn("w-full", {
                          "border-destructive": errors.contactNo,
                        })}
                      />
                      {errors.contactNo && (
                        <div className="text-destructive mt-2">
                          {errors.contactNo.message}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        type="text"
                        placeholder="Description"
                        {...register("description")}
                        size="lg"
                        id="description"
                        className={cn("w-full", {
                          "border-destructive": errors.description,
                        })}
                      />
                      {errors.description && (
                        <div className="text-destructive mt-2">
                          {errors.description.message}
                        </div>
                      )}
                    </div>
                    {/* <div>
                      <Label>Company Portal</Label>
                      <Input
                        type="text"
                        placeholder="Company Portal"
                        {...register("companyPortal")}
                        size="lg"
                        id="companyPortal"
                        className={cn("w-full", {
                          "border-destructive": errors.companyPortal,
                        })}
                      />
                      {errors.companyPortal && (
                        <div className="text-destructive mt-2">
                          {errors.companyPortal.message}
                        </div>
                      )}
                    </div> */}
                    <div>
                      <Label>Company Website</Label>
                      <Input
                        type="text"
                        placeholder="Company Website"
                        {...register("companyWebsite")}
                        size="lg"
                        id="companyWebsite"
                        className={cn("w-full", {
                          "border-destructive": errors.companyWebsite,
                        })}
                      />
                      {errors.companyWebsite && (
                        <div className="text-destructive mt-2">
                          {errors.companyWebsite.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-6 mt-6">
                  <div>
                    <Label htmlFor="logo" className="block mb-3">
                      Logo
                    </Label>
                    <Controller
                      name="logo"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <FileUploaderSingle
                          value={value}
                          onChange={onChange}
                          height={150}
                          width={150}
                          name={"logo"}
                          errors={errors}
                          resetTrigger={resetTrigger}
                        />
                      )}
                    />
                  </div>
{/* 
                  <div>
                    <Label htmlFor="bannerImage" className="block mb-3">
                      Banner Image
                    </Label>
                    <Controller
                      name="banner"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <FileUploaderSingle
                          value={value}
                          onChange={onChange}
                          height={150}
                          width={150}
                          name={"banner"}
                          errors={errors}
                          resetTrigger={resetTrigger}
                        />
                      )}
                    />
                  </div> */}
                </div>
              </CardContent>

              <CardFooter className="flex justify-between gap-4 flex-wrap">
                <Button>
                  <Link href="/insurance-list">Back</Link>
                </Button>
                <Button
                  type="submit"
                  className="group hover:bg-default-200 hover:text-default-900 text-xs font-semibold whitespace-nowrap"
                >
                  {add_insurance ? "Update Company" : "Create Company"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCompanies;
