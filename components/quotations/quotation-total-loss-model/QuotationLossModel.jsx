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
// import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";


const quoDecSchema = z.object({
    reasonNote: z.string().optional(),
    totalLoss: z.boolean().optional(),
}).superRefine((data, ctx) => {
    if (data.totalLoss && data.reasonNote && data.reasonNote.trim() !== "") {
        ctx.addIssue({
            path: ['reasonNote'],
            message: "reasonNote should not be provided when totalLoss is true",
            code: z.ZodIssueCode.custom,
        });
    } else if (!data.totalLoss && (!data.reasonNote || data.reasonNote.trim() === "")) {
        ctx.addIssue({
            path: ['reasonNote'],
            message: "reasonNote is required when totalLoss is not true",
            code: z.ZodIssueCode.custom,
        });
    }
})

const QuotationLossModel = ({ onClose, updateQuotationMutation }) => {

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            totalLoss: false,
        },
        resolver: zodResolver(quoDecSchema),
    });


    const handleReason = (values) => {
        // console.log(values);
        const { totalLoss, reasonNote } = values;
        const payload = {
            status: "Declined",
            totalLoss,
            reason: reasonNote
        };
        updateQuotationMutation.mutate(payload);
        onClose();
    }

    return (
        <div className="flex flex-wrap gap-x-5 gap-y-4">
            <Dialog open={true} onOpenChange={onClose}>
                <DialogContent>
                    <form onSubmit={handleSubmit(handleReason)}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="reasonNote">Reason</Label>
                                <div className="flex flex-col gap-2 w-full">
                                    <Controller
                                        control={control}
                                        name="reasonNote"
                                        render={({ field }) => (
                                            <Textarea
                                                type="text"
                                                id="reasonNote"
                                                className="rounded h-10"
                                                placeholder="Reason..."
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors?.reasonNote && (
                                        <span className="text-red-700">
                                            {errors?.reasonNote.message}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="w-full flex flex-wrap justify-between gap-4">
                                <div className="flex justify-start items-center">
                                    <Controller
                                        name="totalLoss"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                id="totalLoss"
                                                type="checkbox"
                                                className="border-gray-200 h-6 w-6 disabled:opacity-50 accent-[#30D5C7] checked:bg-[#30D5C7] rounded-sm text-white mr-2"
                                                {...field}
                                                checked={field.value || false}
                                                onChange={(e) => {
                                                    //handleCheckboxChange(e);
                                                    field.onChange(e);
                                                }}
                                            />
                                        )}
                                    />
                                    <label htmlFor="totalLoss">
                                        Is it a total loss?
                                    </label>
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <Button
                                    type="submit"
                                // onClick={() => {
                                //     handleAddCoomitSubmit();
                                // }}
                                >
                                    Update
                                </Button>
                                <Button
                                    variant="soft"
                                    color="destructive"
                                    onClick={() => {
                                        onClose();
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default QuotationLossModel;
