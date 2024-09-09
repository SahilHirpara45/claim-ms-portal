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
import { updateEmployeeSettingsAction } from "@/action/employeeAction/profile-action";
import FileUploaderSingle from "@/components/common/file-uploader/file-uploader-single";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const companySchema = z.object({
  firstName: z.string().nonempty({ message: "First Name is required." }),
  lastName: z.string().nonempty({ message: "Last Name is invalid." }),
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
      return await updateEmployeeSettingsAction(formData);
    },
    onSuccess: (res) => {
      // Update the session data with new email and avatar
      toast.success(res?.message);
      router.push("/employee-profile");
    },
    onError: (error) => {
      console.error("Update failed", error);
      toast.error(error?.message);
    },
  });

  useEffect(() => {
    if (companyData) {
      const { userId } = companyData?.data;
      setValue("firstName", userId.firstName || "");
      setValue("lastName", userId.lastName || "");
      if (userId.avatar) {
        setValue("avatar", [userId.avatar]);
      }
    }
  }, [companyData, setValue]);

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <Card className="mt-6">
      <CardHeader className="border-none mb-0">
        <CardTitle className="text-lg font-medium text-default-800">Edit Personal Details</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col items-center">
            <Label htmlFor="avatar" className="block mb-3 text-center">Logo</Label>
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
            <Label htmlFor="firstName" className="block text-sm font-medium text-default-800">First Name</Label>
            <Input type="text" id="firstName" {...register("firstName")} className="mt-1" />
            {errors.firstName && <p className="text-red-600">{errors.firstName.message}</p>}
          </div>
          <div>
            <Label htmlFor="lastName" className="block text-sm font-medium text-default-800">Last Name</Label>
            <Input type="text" id="lastName" {...register("lastName")} className="mt-1" />
            {errors.lastName && <p className="text-red-600">{errors.lastName.message}</p>}
          </div>
          <Button type="submit" className="mt-4 w-full">Save Changes</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PersonalDetails;
