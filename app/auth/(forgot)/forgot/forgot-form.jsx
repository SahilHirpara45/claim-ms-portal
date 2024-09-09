"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { SiteLogo } from "@/components/svg";
import { useMutation } from "@tanstack/react-query";
import { forgotUser } from "@/action/auth-action";
const schema = z.object({
  email: z.string().email({ message: "Your email is invalid." }),
});
const ForgotForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
  });
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const mutation = useMutation({
    mutationKey: ["forgotUser"],
    mutationFn: async (data) => await forgotUser(data),
    onSuccess: (response) => {
      // toast.success("Success fully");
      toast.success(response?.message);
      // console.log(response?.link, "res");
      // router.push(`${response?.link}`);
      // router.push("/auth/reset-password");
      reset();
    },
    onError: (error) => {
      toast.error(error?.message);
    },
    // onSuccess: (response) => {
    //   const { email, link } = response;

    //   sendResetPasswordEmail(email, link)
    //     .then(() => {
    //       toast.success("Reset password email sent successfully");
    //       reset();
    //     })
    //     .catch((error) => {
    //       toast.error("Failed to send reset password email");
    //       console.error(error);
    //     });
    // },
    // onError: (error) => {
    //   toast.error(error?.response?.data?.message);
    // },
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    mutation.mutateAsync(data).catch(() => {});
  };
  return (
    <div className="w-full">
      <Link href="/dashboard" className="inline-block">
        <SiteLogo className="h-10 w-10 2xl:w-14 2xl:h-14 text-primary" />
      </Link>
      <div className="2xl:mt-8 mt-6 2xl:text-3xl text-2xl font-bold text-default-900">
        Forget Your Password?
      </div>
      <div className="2xl:text-lg text-base text-default-600 mt-2 leading-6">
        Enter your email & instructions will be sent to you!
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 xl:mt-7">
        <div>
          <Label htmlFor="email" className="mb-2 font-medium text-default-600">
            Email{" "}
          </Label>
          <Input
            disabled={isPending}
            {...register("email")}
            type="email"
            id="email"
            className={cn("", {
              "border-destructive": errors.email,
            })}
            size={!isDesktop2xl ? "xl" : "lg"}
          />
          {errors.email && (
            <div className=" text-destructive mt-2">{errors.email.message}</div>
          )}
        </div>

        <Button
          className="w-full mt-6"
          size={!isDesktop2xl ? "lg" : "md"}
          type="submit"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "sending..." : "Send Recovery Email"}
        </Button>
      </form>
      <div className="mt-5 2xl:mt-8 text-center text-base text-default-600">
        Forget it. Send me back to{" "}
        <Link href="/" className="text-primary">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default ForgotForm;
