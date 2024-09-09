"use client";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getUserMeAction } from "@/action/auth-action";
import { updateCompanySettingsAction } from "@/action/companyAction/profile-action";
import FileUploaderSingle from "@/components/common/file-uploader/file-uploader-single";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const companySchema = z.object({
  companyName: z.string().nonempty({ message: "Company Name is required." }),
  // email: z.string().email({ message: "Your email is invalid." }),
  address: z.string().nonempty({ message: "Address is required." }),
  city: z.string().nonempty({ message: "City is required." }),
  country: z.string().nonempty({ message: "Country is required." }),
  mobileNumber: z.string().nonempty({ message: "Mobile Number is required." }),
  avatar: z.any().optional(),
});

const PersonalDetails = () => {
  const router = useRouter();
  const { register, handleSubmit, setValue, control, formState: { errors, dirtyFields } } = useForm({
    resolver: zodResolver(companySchema),
    mode: "all",
  });

  const { data: session } = useSession();
  const { data: companyData } = useQuery({
    queryKey: ["userMe"],
    queryFn: () => getUserMeAction(session.jwt),
    enabled: !!session?.jwt,
  });

  const mutation = useMutation({
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
      return await updateCompanySettingsAction(formData);
    },
    onSuccess: (res) => {
      toast.success(res?.message);
      router.push("/company-profile");
    },
    onError: (error) => {
      console.error("Update failed", error);
      toast.error(error?.message);
    },
  });

  useEffect(() => {
    if (companyData) {
      const { userId } = companyData?.data;
      setValue("companyName", userId?.companyName || "");
      setValue("address", userId?.address || "");
      setValue("city", userId?.city || "");
      setValue("country", userId?.country || "");
      setValue("mobileNumber", userId?.mobileNumber || "");
      // setValue("email", userId?.email || "");
      if (userId?.avatar) {
        setValue("avatar", [userId?.avatar]);
      }
    }
  }, [companyData, setValue]);

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <Card className="mt-6">
      <CardHeader className="border-none mb-0">
        <CardTitle className="text-lg font-medium text-default-800">Edit Company Details</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col items-center">
            <Label htmlFor="avatar" className="block mb-3 text-center">Company Logo</Label>
            <Controller
              name="avatar"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FileUploaderSingle
                  value={value}
                  onChange={onChange}
                  height={100}
                  width={100}
                  name="avatar"
                  errors={errors}
                />
              )}
            />
          </div>
          <div>
            <Label htmlFor="companyName" className="block text-sm font-medium text-default-800">Company Name</Label>
            <Input type="text" id="companyName" {...register("companyName")} className="mt-1" />
            {errors.companyName && <p className="text-red-600">{errors.companyName.message}</p>}
          </div>
          {/* <div>
            <Label htmlFor="email" className="block text-sm font-medium text-default-800">Email</Label>
            <Input type="email" id="email" {...register("email")} className="mt-1" />
            {errors.email && <p className="text-red-600">{errors.email.message}</p>}
          </div> */}
          <div>
            <Label htmlFor="mobileNumber" className="block text-sm font-medium text-default-800">Mobile</Label>
            <Input type="text" id="mobileNumber" {...register("mobileNumber")} className="mt-1" />
            {errors.mobileNumber && <p className="text-red-600">{errors.mobileNumber.message}</p>}
          </div>
          <div>
            <Label htmlFor="address" className="block text-sm font-medium text-default-800">Address</Label>
            <Input type="text" id="address" {...register("address")} className="mt-1" />
            {errors.address && <p className="text-red-600">{errors.address.message}</p>}
          </div>
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <Label htmlFor="city" className="block text-sm font-medium text-default-800">City</Label>
              <Input type="text" id="city" {...register("city")} className="mt-1" />
              {errors.city && <p className="text-red-600">{errors.city.message}</p>}
            </div>
            <div className="flex-1">
              <Label htmlFor="country" className="block text-sm font-medium text-default-800">Country</Label>
              <Input type="text" id="country" {...register("country")} className="mt-1" />
              {errors.country && <p className="text-red-600">{errors.country.message}</p>}
            </div>
          </div>
          <Button type="submit" className="mt-4 w-full">Save Changes</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PersonalDetails;
