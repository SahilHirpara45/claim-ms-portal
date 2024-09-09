import React, { useState } from "react";
import { getCommentAction, AddCommentAction } from "@/action/employeeAction/jobcard-action";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardHeader } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import AddCommentModal from "./comment-model/AddCommentModal";

const columns = [
    {
        key: "by",
        label: "By",
    },
    {
        key: "date",
        label: "Date",
    },
    {
        key: "comment",
        label: "Comment",
    },

];

const CommentView = () => {
    const params = useParams();
    const jobCardId = params?.view_jobcard[0];


    const {
        data: getCommentActionData,
        isLoading,
        isError,
        refetch
    } = useQuery({
        queryKey: ["getCommentAction", jobCardId],
        queryFn: () => {
            return getCommentAction({
                jobCardId: jobCardId,
            });
        },
    });
    const users = getCommentActionData?.data?.commentList;

    console.log(getCommentActionData?.data, "getCommentActionData");
    function formatDateTime(dateString) {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    }


    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const handleCommentModalOpen = () => setIsCommentModalOpen(true);
    const handleCommentModalClose = () => setIsCommentModalOpen(false);

    const addCommentMutation = useMutation({
        mutationKey: ["addCommentMutation"],
        mutationFn: async (data) => {
            return await AddCommentAction(data);
        },
        onSuccess: (response) => {
            toast.success(response?.message);
            refetch();
            handleCommentModalClose();

        },
        onError: (error) => {
            toast.error(error?.data?.message);
        },
    });

    const handleAddCoomitSubmit = async (data) => {
        const payload = {
            jobCardId: params?.view_jobcard[0],
            comment: data.commentNote
        }

        await addCommentMutation.mutateAsync(payload);
        // onSubmit(commentNote);
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center font-bold w-full">
                    <div className="flex justify-between items-center w-full">
                        <div>Comment Details</div>
                        <Button
                            className="border-default-300 group"
                            type="button"
                            title="Add Comment"
                            onClick={handleCommentModalOpen}
                        >
                            Add Comment
                        </Button>

                    </div>
                </CardHeader>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {/* {columns.map((column) => (
                                <TableHead key={`simple-table-${column.key}`}>
                                    {column.label}
                                </TableHead>
                            ))} */}
                            <TableHead >
                                By
                            </TableHead>
                            <TableHead >
                                date
                            </TableHead>
                            <TableHead >
                                comment
                            </TableHead>
                            <TableHead >

                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    Error fetching data
                                </TableCell>
                            </TableRow>
                        ) : users && users.length > 0 ? (
                            users.map((item) => (
                                <TableRow key={item?.id}>
                                    <TableCell>{item?.userDetails?.name || "-"}</TableCell>
                                    <TableCell>
                                        {formatDateTime(item?.createdAt)}
                                    </TableCell>
                                    <TableCell className="min-w-[7rem]">
                                        {item?.comment || "-"}
                                    </TableCell>

                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    No comment now
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>


            {isCommentModalOpen && (
                <AddCommentModal
                    onClose={handleCommentModalClose}
                    handleAddCoomitSubmit={handleAddCoomitSubmit}
                />
            )}
        </>
    );
};

export default CommentView;
