"use client";
import BasicDataTable from "@/components/common/data-table/basic-table";
import DialogPlacement from "@/components/common/dialog/dialog-placement";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    deleteQuotation,
    getAllQuotation,
    updateQuotation,
    getAllQuotationMyTask
} from "@/action/quotationAction/quotation-action";
import { getUserMeAction } from "@/action/auth-action";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaNotesMedical } from "react-icons/fa";

const QuotationsListMyTask = () => {
    const statusOptions = ["Approved", "Pending", "Declined", "Draft"];

    const statusOptions2 = ["Approved", "Pending", "Declined"];

    const { data: session } = useSession();
    const router = useRouter();
    const queryClient = useQueryClient();
    const role = session?.role;
    const isEmployee = role === "employee";
    const isCompany = role === "company";

    const [searchString, setSearchString] = useState("");
    const [tableLoading, setTableLoading] = useState(false);
    const [componentLoading, setComponentLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedJobCard, setSelectedJobCard] = useState(null);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const [quIDk, setquIDk] = useState("");

    const {
        data: userData,
        error: userError,
        isLoading: userLoading,
    } = useQuery({
        queryKey: ["userMe"],
        queryFn: () => getUserMeAction(session.jwt),
        enabled: !!session?.jwt, // Only run the query if the token is available
    });

    const designation = userData?.data?.userId?.designation;

    const disableRecreate = designation == "CSR";

    const { data, error, refetch } = useQuery({
        queryKey: ["GetQuotationMtTask", pageIndex, pageSize, searchString],
        queryFn: () => {
            setTableLoading(true);
            return getAllQuotationMyTask({
                page: pageIndex + 1,
                size: pageSize,
                all: false,
                search: searchString,
            }).finally(() => {
                setTableLoading(false);
                setComponentLoading(false);
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteQuotation,
        onSuccess: () => {
            toast.success("Quotation deleted successfully");
            setModalOpen(false);
            setSelectedJobCard(null);
            queryClient.invalidateQueries({ queryKey: ["GetQuotation"] });
        },
        onError: (error) => {
            console.error("Error deleting quotation:", error);
            toast.error("Error deleting quotation");
        },
    });

    useEffect(() => {
        if (searchString.length > 2 || searchString.length === 0) {
            refetch();
        }
    }, [pageIndex, pageSize, searchString, refetch]);

    const handleEditClick = (jobCardId) => {
        router.push(`/quotations/update/${jobCardId}`);
    };

    const handleViewClick = (jobCardId) => {
        router.push(`/quotations/view/${jobCardId}`);
    };

    //

    const handleResupplement = (jobCardId) => {
        router.push(`/quotations/supplement/${jobCardId}`);
    };

    //
    const handleDeleteClick = (jobCardId) => {
        setSelectedJobCard(jobCardId);
        setModalOpen(true);
    };
    const handleDeleteConfirm = () => {
        if (selectedJobCard) {
            deleteMutation.mutate(selectedJobCard);
        }
    };

    const handleReCreate = (quotationID) => {
        router.push(`/quotations/recreate/${quotationID}`);
    };

    //update staus
    const updateQuotationMutation = useMutation({
        mutationKey: ["updateQuotationMutation"],
        mutationFn: async (data) => {
            const formData = new FormData();
            formData.append("quotatioDetails", JSON.stringify(data));
            const quotaionsId = quIDk;
            return await updateQuotation(quotaionsId, formData);
        },
        onSuccess: (response) => {
            toast.success(response?.message);
            refetch();
        },
        onError: (error) => {
            toast.error(error?.data?.message);
        },
    });

    const handleStatusUpdate = (quotionId, newStatus) => {
        setquIDk(quotionId);
        const payload = {
            status: newStatus,
        };

        updateQuotationMutation.mutate(payload);
    };

    //
    const columns = [
        {
            accessorKey: "quotationID",
            header: "Quotation ID",
            cell: ({ row }) => (
                <div className="font-medium text-card-foreground/80">
                    <div className="flex space-x-3 items-center">
                        <span className="whitespace-nowrap">
                            {row?.original?.quotationID || "-"}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "daysToComplete",
            header: () => <div className="text-center">Days To Complete</div>,
            cell: ({ row }) => (
                <div className="font-medium text-card-foreground/80 text-center">
                    <div className="flex space-x-3 items-center justify-center">
                        <span className="whitespace-nowrap">
                            {row?.original?.daysToComplete || "-"}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "jobCardNumber",
            header: "Job Card Number",
            cell: ({ row }) => (
                <div className="font-medium text-card-foreground/80">
                    <div className="flex space-x-3 items-center">
                        <span className="whitespace-nowrap">
                            {row?.original?.jobCardId?.jobCardNumber || "-"}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "claimNumber",
            header: "Claim Number",
            cell: ({ row }) => (
                <div className="font-medium text-card-foreground/80">
                    <div className="flex space-x-3 items-center">
                        <span className="whitespace-nowrap">
                            {row?.original?.claimId?.claimNumber || "-"}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: () => <div className="text-center">Status</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <Badge
                        variant="outline"
                        color={
                            (row?.original?.status === "Draft" && "default") ||
                            (row?.original?.status === "Approved" && "success") ||
                            (row?.original?.status === "Declined" && "warning") ||
                            (row?.original?.status === "Pending" && "default")
                        }
                        className="capitalize"
                    >
                        {row?.original?.status || "-"}
                    </Badge>
                </div>
            ),
            filterFn: (row, id, value) => {
                return value?.includes(row.getValue(id));
            },
        },
        {
            accessorKey: "isEmailSeen",
            header: () => <div className="text-center">Email Status</div>,
            cell: ({ row }) => {
              const { isEmailSent, isEmailSeen } = row.original;
          
              let statusText = "Not Sent";
              let badgeColor = "neutral"; // Assuming "neutral" is an available color variant
          
              if (isEmailSent) {
                statusText = isEmailSeen ? "Seen" : "Not Seen";
                badgeColor = isEmailSeen ? "success" : "destructive";
              }
          
              return (
                <div className="text-center">
                  <Badge variant="soft" color={badgeColor} className="capitalize">
                    {statusText}
                  </Badge>
                </div>
              );
            },
            filterFn: (row, id, value) => {
              return value?.includes(row.getValue(id));
            },
          },
          
        {
            header: "‎",
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const jobCardId = row?.original?._id;
                const statusBtn = row?.original?.status;
                const isLatestQuotation = row?.original?.isLatestQuotation;
                const designation = userData?.data?.userId?.designation;
                const isEditable = userData?.data?.userId?.designation == "Surveyor" || userData?.data?.userId?.role == "company"
                const isSupplmenteryQuotation = row?.original?.isSupplmenteryQuotation;
                return (
                    <div className="flex gap-3 items-center justify-center">
                        {designation === "CSR" ? (
                            <></>
                        ) : (
                            <>

                                {statusBtn === "Declined" && isLatestQuotation && !isSupplmenteryQuotation && (
                                    <>
                                        <Button
                                            size="icon"
                                            className="h-9 w-full rounded bg-default-100 dark:bg-default-200 text-default-500 hover:text-primary-foreground"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleReCreate(jobCardId);
                                            }}
                                        >
                                            Re-Create
                                        </Button>
                                    </>
                                )}
                            </>
                        )}
                        {statusBtn === "Approved" && isEditable && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            className="h-9 w-9 rounded bg-default-100 dark:bg-default-200 text-default-500 hover:text-primary-foreground"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleResupplement(jobCardId);
                                            }}
                                        >
                                            <FaNotesMedical />

                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Supplementary Quotation</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                );
            },
        },

        {
            header: "Actions",
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const jobCardId = row?.original?._id;
                const statusBtn = row?.original?.status;
                const isEditable = userData.data.userId.designation == "Surveyor" || userData.data.userId.role == "company"
                return (
                    <div className="flex gap-3 items-center justify-end">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon"
                                        className="h-9 w-9 rounded bg-default-100 dark:bg-default-200 text-default-500 hover:text-primary-foreground"
                                        onClick={() => handleViewClick(jobCardId)}
                                    >
                                        <Icon icon="heroicons:eye" className="w-5 h-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>View Quotation</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>



                        {statusBtn !== "Approved" && (
                            <>
                                {statusBtn !== "Declined" && statusBtn !== "Submitted" && isEditable && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    size="icon"
                                                    className="h-9 w-9 rounded bg-default-100 dark:bg-default-200 text-default-500 hover:text-primary-foreground"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditClick(jobCardId);
                                                    }}
                                                >
                                                    <Icon
                                                        icon="heroicons:pencil-square"
                                                        className="w-5 h-5"
                                                    />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Edit Quotation</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                                {/* <Button
                  size="icon"
                  className="h-9 w-9 rounded bg-default-100 dark:bg-default-200 text-default-500 hover:text-primary-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(jobCardId);
                  }}
                >
                  <Icon icon="heroicons:trash" className="w-5 h-5" />
                </Button>{" "} */}
                            </>
                        )}
                    </div>
                );
            },
        },
    ];

    if (componentLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading data</div>;
    }

    const quotations = data?.data?.allQuotations || [];

    return (
        <Fragment>
            <div className="flex justify-between">
                <Breadcrumbs>
                    <BreadcrumbItem>Menus</BreadcrumbItem>
                    <BreadcrumbItem>My Task</BreadcrumbItem>
                    <BreadcrumbItem>Quotations Cards</BreadcrumbItem>
                </Breadcrumbs>
            </div>
            <div className="mt-4 space-y-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Quotations Lists</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <BasicDataTable
                            data={quotations}
                            columns={columns}
                            filterPlaceHolder="Quotation Id"
                            setSearchString={setSearchString}
                            searchString={searchString}
                            pageIndex={pageIndex}
                            pagination={data?.pagination}
                            pageSize={pageSize}
                            setPageIndex={setPageIndex}
                            setPageSize={setPageSize}
                            pageCount={data?.pagination?.totalPages || 0}
                            tableLoading={tableLoading}
                            refetch={refetch}
                            handleViewClick={handleViewClick}
                            rowClickable
                        />
                    </CardContent>
                </Card>
            </div>
            <DialogPlacement
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onDelete={handleDeleteConfirm}
                message="Are you sure you want to delete this Quotation?"
            />
        </Fragment>
    );
};

export default QuotationsListMyTask;
