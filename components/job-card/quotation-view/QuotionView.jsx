"use client";
import { Fragment, useEffect, useState } from "react";

import { getUserMeAction } from "@/action/auth-action";
import {
  deleteQuotation,
  getAllQuotation,
  updateQuotation,
} from "@/action/quotationAction/quotation-action";
import BasicDataTable from "@/components/common/data-table/basic-table";
import DialogPlacement from "@/components/common/dialog/dialog-placement";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icon } from "@iconify/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaNotesMedical } from "react-icons/fa";
import { getSingleJobCardAction } from "@/action/employeeAction/jobcard-action";

const QuotationView = () => {
  const params = useParams();
  const jobCardIEd = params?.view_jobcard;

  const { data: session } = useSession();
  const statusOptions = ["Approved", "Pending", "Declined", "Draft"];
  //
  const router = useRouter();
  const queryClient = useQueryClient();
  const [quIDk, setquIDk] = useState("");
  const [searchString, setSearchString] = useState("");
  const [tableLoading, setTableLoading] = useState(false);
  const [componentLoading, setComponentLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJobCard, setSelectedJobCard] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data, error, refetch } = useQuery({
    queryKey: ["GetQuotation", pageIndex, pageSize, searchString],
    queryFn: () => {
      setTableLoading(true);
      return getAllQuotation({
        page: pageIndex + 1,
        size: pageSize,
        all: false,
        search: searchString,
        jobCardId: jobCardIEd,
      }).finally(() => {
        setTableLoading(false);
        setComponentLoading(false);
      });
    },
  });

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

  const handleDeleteClick = (jobCardId) => {
    setSelectedJobCard(jobCardId);
    setModalOpen(true);
  };
  const handleDeleteConfirm = () => {
    if (selectedJobCard) {
      deleteMutation.mutate(selectedJobCard);
    }
  };

  ///

  const updateQuotationMutation = useMutation({
    mutationKey: ["updateQuotationMutation"],
    mutationFn: async (data) => {
      try {
        const formData = new FormData();
        formData.append("quotatioDetails", JSON.stringify(data));
        const quotaionsId = quIDk;
        const response = await updateQuotation(quotaionsId, formData);
        return response;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || "Failed to update quotation"
        );
      }
    },
    onSuccess: (res) => {
      toast.success("Status updated successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error?.message || "An error occurred. Please try again.");
    },
  });

  const handleStatusUpdate = (quotionId, newStatus) => {
    setquIDk(quotionId);
    const payload = {
      status: newStatus,
    };
    updateQuotationMutation.mutate(payload);
  };

  const handleReCreate = (quotationID) => {
    router.push(`/quotations/recreate/${quotationID}`);
  };

  const handleResupplement = (jobCardId) => {
    router.push(`/quotations/supplement/${jobCardId}`);
  };
  //

  //ay

  const {
    isLoading,
    isError,
    data: jobcardDatad,
    refetch: uu,
  } = useQuery({
    queryKey: ["jobcardData", jobCardIEd],
    queryFn: () => getSingleJobCardAction(jobCardIEd),
    enabled: !!jobCardIEd,
    retry: false,
  });
  //

  const columns = [
    {
      accessorKey: "quotationID",
      header: "Internal Quotation ID",
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
      header: "Internal Claim Number",
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
    // {
    //   accessorKey: "isEmailSeen",
    //   header: () => <div className="text-center">Email Status</div>,
    //   cell: ({ row }) => (
    //     <div className="text-center">
    //       <Badge
    //         variant="soft"
    //         color={row?.original?.isEmailSeen ? "success" : "destructive"}
    //         className="capitalize"
    //       >
    //         {row?.original?.isEmailSeen ? "Seen" : "Not Seen"}
    //       </Badge>
    //     </div>
    //   ),
    //   filterFn: (row, id, value) => {
    //     return value?.includes(row.getValue(id));
    //   },
    // },
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
        const isTotalLoss = row?.original?.totalLoss
        return (
          <div className="flex gap-3 items-center justify-center">
            {designation === "CSR" ? (
              <></>
            ) : (
              <>
                {statusBtn === "Declined" &&
                  isLatestQuotation &&
                  !isSupplmenteryQuotation && !isTotalLoss && (
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
        const isEditable =
          userData.data.userId.designation == "Surveyor" ||
          userData.data.userId.role == "company";
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
                {statusBtn !== "Declined" &&
                  statusBtn !== "Submitted" &&
                  isEditable && (
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
  const role = session?.role;

  const isEmployee = role === "employee" || role === "company";

  const canCreateQutation =
    role === "company" || (isEmployee && designation === "Surveyor");

  return (
    <Fragment>
      <div className="mt-4 space-y-5">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Quotations List</CardTitle>
              {/* <Button asChild>
                  <Link href={`/additional-quotation/create/${jobCardIEd}`}>
                    <Plus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                    Create Additional Quotation
                  </Link>
                </Button> */}
              {!quotations.length > 0 && canCreateQutation && jobcardDatad?.status !== "Total Loss" && (
                <Button asChild>
                  <Link href={`/quotations/create/${jobCardIEd}`}>
                    <Plus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                    Create Quotation
                  </Link>
                </Button>
              )}
            </div>
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
              pageCount={data?.pagination?.totalPages || 0}
              setPageSize={setPageSize}
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

export default QuotationView;
