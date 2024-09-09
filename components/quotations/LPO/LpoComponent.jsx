"use client";
import {
  updateQuotation
} from "@/action/quotationAction/quotation-action";
import FileUploaderMultiple from "@/components/common/file-multi-uploader/file-uploader-multiple";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const LpoComponent = ({ isOpen, onClose }) => {
  const params = useParams();
  console.log("params LPO ", params);

  const viewQuotationId = params?.viewQuotationId;

  const {
    register,
    reset,
    handleSubmit,
    control,
    setValue,
  } = useForm({
    mode: "onChange",
  });

  const [resetTrigger, setResetTrigger] = useState(false);

  // Effect to reset resetTrigger after form reset
  useEffect(() => {
    if (resetTrigger) {
      setResetTrigger(false);
    }
  }, [resetTrigger]);


  const updateQuotMutation = useMutation({
    mutationFn: async (data) => updateQuotation(data),
    onSuccess: (response) => {
      toast.success(response?.message);
      reset();
      // router.push("/car-list");
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });

  const internalOnSubmit = (data) => {
    const formData = new FormData();
    formData.append("viewQuotationId", viewQuotationId);
    if (data.lpo && data.lpo.length > 0) {
      data.lpo.forEach((file, index) => {
        formData.append(`lpo[${index}]`, file);
      });
    }

    updateQuotMutation.mutateAsync(formData)
      .then(() => {
        console.log("Submitted data:", data);
        setResetTrigger(true);
        reset();
        onClose();
      })
      .catch((error) => {
        console.error("Submission error:", error);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <form onSubmit={handleSubmit(internalOnSubmit)}>
        <DialogContent size="xl">
          <DialogHeader>
            <DialogTitle className="text-base font-medium text-default-700">
              Add LPO
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm text-default-500 space-y-4">
            <Controller
              name="lpo"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FileUploaderMultiple
                  value={value}
                  onChange={(files) => onChange(files)}
                  name="lpo"
                  width={150}
                  height={150}
                  resetTrigger={resetTrigger}
                />
              )}
            />
          </div>
          <DialogFooter className="mt-8">
            <DialogClose asChild>
              <Button variant="outline" color="warning" onClick={onClose}>
                Close
              </Button>
            </DialogClose>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default LpoComponent;
