import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define the strong password regex
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Define the validation schema
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password should contain atleast 8 characters." })
      .refine((value) => value.trim() !== "", {
        message: "password is required.",
      }),
    // .regex(strongPasswordRegex, {
    //   message:
    //     "Password must be strong. At least 8 characters long, including one uppercase letter, one lowercase letter, one number, and one special character.",
    // }),
    confirmPassword: z.string().refine((value) => value.trim() !== "", {
      message: "confirm password is required.",
    }),
    // .min(1, { message: "Confirm password is required." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

const PasswordChangeModal = ({ onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-4">
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <form onSubmit={handleSubmit(handlePasswordSubmit)}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    {...register("password")}
                    id="password"
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
                {errors.password && (
                  <div className="text-destructive mt-2">
                    {errors.password.message}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    {...register("confirmPassword")}
                    id="confirmPassword"
                    className={cn("w-full pr-10", {
                      "border-destructive": errors.confirmPassword,
                    })}
                  />
                  <span
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Icon
                      icon={showConfirmPassword ? "mdi:eye-off" : "mdi:eye"}
                      className="w-5 h-5 text-gray-500"
                    />
                  </span>
                </div>
                {errors.confirmPassword && (
                  <div className="text-destructive mt-2">
                    {errors.confirmPassword.message}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <Button type="submit" variant="primary">
                Update Password
              </Button>
            </div>
          </form>
          {/* <DialogFooter className="sm:justify-center">
            <DialogClose asChild>
              <Button variant="soft" color="destructive">
                Close
              </Button>
            </DialogClose>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PasswordChangeModal;
