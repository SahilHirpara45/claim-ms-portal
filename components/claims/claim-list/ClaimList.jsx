"use client";

import {
  getClaimsAction,
  updateClaimAction,
} from "@/action/claimAction/claim-action";
import BasicDataTable from "@/components/common/data-table/basic-table";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { getUserMeAction } from "@/action/auth-action";
import { Checkbox } from "@/components/ui/checkbox";

const statusOptions = ["Under Approval", "Approved", "Re-Submitted", "Reject"];

const ClaimList = () => {
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectJobCard, setselectJobCard] = useState(null);
  const [selectedClaimId, setSelectedClaimId] = useState(null);
  const [insuranceClaimNumber, setInsuranceClaimNumber] = useState("");
  const [noClaimNumber, setNoClaimNumber] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchString, setSearchString] = useState("");
  const [tableLoading, setTableLoading] = useState(false);
  const [componentLoading, setComponentLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data, error, refetch } = useQuery({
    queryKey: ["getClaimsList", pageIndex, pageSize, searchString],
    queryFn: async () => {
      setTableLoading(true);
      return getClaimsAction({
        page: pageIndex + 1,
        size: pageSize,
        all: false,
        search: searchString,
      }).finally(() => {
        setTableLoading(false);
        setComponentLoading(false);
      });
    },
    // keepPreviousData: true,
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

  const USER_ROLE = userData?.data?.userId?.designation;
  const updateClaimMutation = useMutation({
    mutationKey: ["updateClaimMutation"],
    mutationFn: async ({ id, status, insuranceClaimNumber, noClaimNumber }) => {
      try {
        return await updateClaimAction(id, { status, insuranceClaimNumber, noClaimNumber }); // Pass checkbox value in payload
      } catch (error) {
        throw new Error(
          error.response?.data?.message || "Failed to update claim status"
        );
      }
    },
    onSuccess: (response) => {
      toast.success("Claim status updated successfully");
      const status = response?.data?.status;
      const jobCardId = response?.data?.jobCardId;
      if (status === "Approved" && USER_ROLE === "company") {
        handleAddQuotation(jobCardId);
      }
      refetch();
    },
    onError: (error) => {
      toast.error(error?.message || "An error occurred. Please try again.");
    },
  });

  const handleAddQuotation = (jobCardId) => {
    router.push(`/quotations/create/${jobCardId}`);
    setselectJobCard(jobCardId);
  };

  const handleStatusUpdate = (claimId, newStatus) => {
    if (newStatus === "Approved") {
      setSelectedClaimId(claimId);
      setModalOpen(true);
    } else {
      updateClaimMutation.mutate({ id: claimId, status: newStatus });
    }
  };

  const handleModalSubmit = () => {
    if (noClaimNumber || insuranceClaimNumber) { // Check if checkbox is selected or claim number is provided
      updateClaimMutation.mutate({
        id: selectedClaimId,
        status: "Approved",
        insuranceClaimNumber: noClaimNumber ? null : insuranceClaimNumber, // If noClaimNumber is true, pass null
        noClaimNumber,
      });
      setModalOpen(false);
      setInsuranceClaimNumber("");
      setNoClaimNumber(false);
    } else {
      toast.error("Insurance Claim Number is required");
    }
  };

  const columns = [
    {
      accessorKey: "claimNumber",
      header: "Internal Claim Num",
      cell: ({ row }) => (
        <div className="font-medium text-card-foreground/80">
          <div className="flex space-x-3  rtl:space-x-reverse items-center">
            <span className="whitespace-nowrap">
              {row?.original?.claimNumber || "-"}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "fullName",
      header: "Customer Name",
      cell: ({ row }) => (
        <div className="font-medium text-card-foreground/80">
          <div className="flex space-x-3  rtl:space-x-reverse items-center">
            <span className="whitespace-nowrap">
              {row?.original?.customerId?.fullName || "-"}
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
          <div className="flex space-x-3  rtl:space-x-reverse items-center">
            <span className="whitespace-nowrap">
              {row?.original?.jobCardId?.jobCardNumber || "-"}
            </span>
          </div>
        </div>
      ),
    },

    // {
    //   accessorKey: "status",
    //   header: "Status",
    //   cell: ({ row }) => (
    //     <Badge
    //       variant="outline"
    //       color={
    //         (row?.original?.jobCardId?.status === "Pending" && "default") ||
    //         (row?.original?.jobCardId?.status === "Approved" && "success") ||
    //         (row?.original?.jobCardId?.status === "Completed" && "info") ||
    //         (row?.original?.jobCardId?.status === "Unpaid" && "warning") ||
    //         (row?.original?.jobCardId?.status === "Paid" && "success")
    //       }
    //       className="capitalize"
    //     >
    //       {row?.original?.jobCardId?.status || "-"}
    //     </Badge>
    //   ),
    //   filterFn: (row, id, value) => {
    //     return value?.includes(row.getValue(id));
    //   },
    // },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => {
        const jobCardId = row?.original?.jobCardId?._id;
        return (
          <div className="flex justify-center text-center align-items-center">
            <Select
              value={row?.original?.status}
              onValueChange={(value) =>
                handleStatusUpdate(row?.original?._id, value)
              }
              disabled={row?.original?.status === "Approved" || USER_ROLE === "Technician"}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value?.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Quotation Stage</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <Badge
            variant="outline"
            color={
              (row?.original?.taskStatus === "Pending Quotation" &&
                "default") ||
              (row?.original?.taskStatus === "Done" && "success") ||
              (row?.original?.taskStatus === "Need Repair" && "warning") ||
              (row?.original?.taskStatus === "Pending Invoiced" && "info")
            }
            className="capitalize"
          >
            {row?.original?.taskStatus || "-"}
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
      cell: ({ row }) => (
        <div className="text-center">
          <Badge
            variant="soft"
            color={row?.original?.isEmailSeen ? "success" : "destructive"}
            className="capitalize"
          >
            {row?.original?.isEmailSeen ? "Seen" : "Not Seen"}
          </Badge>
        </div>
      ),
      filterFn: (row, id, value) => {
        return value?.includes(row.getValue(id));
      },
    },
    {
      header: "Actions",
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const jobCardId = row?.original?.jobCardId?._id;
        const claimId = row?.original?._id;
        const status = row?.original?.status;
        const isQuotationExists = row?.original?.isQuotationExists;
        const handleStopPropagation = (e) => {
          e.stopPropagation();
        };

        const addQuotattionRole = userData?.data?.userId?.designation == "Surveyor" || userData?.data?.userId?.role == "company"
        console.log(addQuotattionRole,"addQuotattionRole");

        return (
          <div className="flex gap-3 items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  color="secondary"
                  className=" h-7 rounded-full bg-transparent w-7 data-[state=open]:bg-primary data-[state=open]:text-primary-foreground"
                >
                  <Icon
                    icon="heroicons:ellipsis-horizontal"
                    className="h-6 w-6"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" avoidCollisions>
                <DropdownMenuLabel>Action Center</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Icon icon="heroicons:eye" className="h-4 w-4 mr-2" />
                  Preview
                </DropdownMenuItem>
                {status === "Approved" && isQuotationExists !== true && addQuotattionRole && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      handleAddQuotation(jobCardId);
                      handleStopPropagation(e);
                    }}
                  >
                    <Icon
                      icon="heroicons:identification"
                      className="h-4 w-4 mr-2"
                    />
                    Add Quotation
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const handleStatusChange = (e) => setStatus(e.target.value);
  const handleReset = () => {
    setStatus("");
    requestAnimationFrame(() => {
      refetch();
    });
  };

  return (
    <Fragment>
      <div className="flex justify-between">
        <Breadcrumbs>
          <BreadcrumbItem>Menus</BreadcrumbItem>
          <BreadcrumbItem>Claim</BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="mt-4 space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Claims</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <BasicDataTable
              data={data?.data?.claims || []}
              filterPlaceHolder="by Claim Number"
              columns={columns}
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
            />
          </CardContent>
        </Card>
      </div>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Insurance Claim Number</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="insuranceClaimNumber">Insurance Claim Number</Label>
            <Input
              id="insuranceClaimNumber"
              type="text"
              value={insuranceClaimNumber}
              onChange={(e) => setInsuranceClaimNumber(e.target.value)}
              disabled={noClaimNumber} // Disable input if checkbox is checked
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="noClaimNumber"
                 variant="filled"
                checked={noClaimNumber}
                onCheckedChange={(checked) => setNoClaimNumber(checked)}
              />
              <Label htmlFor="noClaimNumber">No Claim Number</Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleModalSubmit}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default ClaimList;
