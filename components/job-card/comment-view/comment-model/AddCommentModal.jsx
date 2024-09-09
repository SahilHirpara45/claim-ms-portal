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
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
// Define the validation schema
const commentSchema = z.object({
    commentNote: z.string().refine((value) => value.trim() !== "", {
        message: "comment is required",
    }),
});

const AddCommentModal = ({ onClose, handleAddCoomitSubmit }) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(commentSchema),
    });


    return (
        <div className="flex flex-wrap gap-x-5 gap-y-4">
            <Dialog open={true} onOpenChange={onClose}>
                <DialogContent>
                    <form onSubmit={handleSubmit(handleAddCoomitSubmit)}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="commentNote">Add Comment</Label>
                                <div className="flex flex-col gap-2 w-full">
                                    <Controller
                                        control={control}
                                        name="commentNote"
                                        render={({ field }) => (
                                            <Textarea
                                                type="text"
                                                id="commentNote"
                                                className="rounded h-10"
                                                placeholder="type comment..."
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors?.commentNote && (
                                        <span className="text-red-700">
                                            {errors?.commentNote.message}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-center">
                            <Button type="submit" variant="primary">
                                Add Comment
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddCommentModal;
