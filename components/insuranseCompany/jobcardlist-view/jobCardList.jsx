"use client";

import BasicDataTable from "@/components/common/data-table/basic-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Fragment, useState } from "react";

import { useSession } from "next-auth/react";

import { getInsuranceJobCardListAction } from "@/action/insurance-action";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";

const statusOptions = [
  "Pending",
  "In Progress",
  "Approved",
  "Unpaid",
  "Paid",
  "Draft",
];
const statusOptions2 = ["Pending", "In Progress", "Approved", "Unpaid", "Paid"];
const JobCardListPage = () => {
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectJobCard, setselectJobCard] = useState(null);
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
  const params = useParams();
  const insuranceId = params?.view_insurance;

  const columns = [
    {
      accessorKey: "jobCardNumber",
      header: "job Card Number",
      cell: ({ row }) => (
        <div className="font-medium text-card-foreground/80">
          <div className="flex space-x-3  rtl:space-x-reverse items-center">
            <span className="whitespace-nowrap">
              {row?.original?.jobCardNumber || "-"}
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
      accessorKey: "email",
      header: "email",
      cell: ({ row }) => (
        <div className="font-medium text-card-foreground/80">
          <div className="flex space-x-3  rtl:space-x-reverse items-center">
            <span className="whitespace-nowrap">
              {row?.original?.customerId?.email || "-"}
            </span>
          </div>
        </div>
      ),
    },

    {
      accessorKey: "plateNumber",
      header: "plate Number",
      cell: ({ row }) => (
        <div className="font-medium text-card-foreground/80">
          <div className="flex space-x-3  rtl:space-x-reverse items-center">
            <span className="whitespace-nowrap">
              {row?.original?.carId?.plateNumber || "-"}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          color={
            (row?.original?.status === "Pending" && "default") ||
            (row?.original?.status === "Approved" && "success") ||
            (row?.original?.status === "Completed" && "info") ||
            (row?.original?.status === "Unpaid" && "warning") ||
            (row?.original?.status === "Paid" && "success")
          }
          className="capitalize"
        >
          {row?.original?.status || "-"}
        </Badge>
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
        const insuranceId = row?.original?._id;
        const jobCardId = row?.original?._id;
        return (
          <div className="flex gap-3 items-center justify-end">
            <>
              <Button
                size="icon"
                className="h-9 w-9 rounded bg-default-100 dark:bg-default-200 text-default-500 hover:text-primary-foreground"
                onClick={(e) => {
                  handleJobcardView(jobCardId);
                }}
              >
                <Icon icon="heroicons:eye" className="w-5 h-5" />
              </Button>
            </>
          </div>
        );
      },
    },
  ];

  const handleJobcardView = (jobCardId) => {
    console.log(jobCardId, "jobCardId");
    router.push(`/jobcard-list/view_jobcard/${jobCardId}`);
  };
  const handleReset = () => {
    setStatus("");
    setStartDate("");
    setEndDate("");
    requestAnimationFrame(() => {
      refetch();
    });
  };
  const {
    data: InsuranceCompanyJobCardData,
    error,
    refetch,
  } = useQuery({
    queryKey: ["InsuranceCompanyJobCardData", pageIndex, pageSize],
    queryFn: async () => {
      setTableLoading(true);
      return getInsuranceJobCardListAction(insuranceId, {
        page: pageIndex + 1,
        size: pageSize,
        all: false,
        search: searchString,
        status: status || "",
        startDate: startDate || "",
        endDate: endDate || "",
      }).finally(() => {
        setTableLoading(false);
        setComponentLoading(false);
      });
    },
    // keepPreviousData: true,
  });

  useEffect(() => {
    if (searchString?.length > 2) {
      // refetch();
      if (pageIndex !== 0) {
        setPageIndex(0);
      } else {
        refetch();
      }
    } else if (searchString?.length === 0) {
      refetch();
    }
  }, [pageIndex, pageSize, refetch, searchString]);

  const listOfJobcard = InsuranceCompanyJobCardData?.data?.listOfJobCards || [];

  const handleStatusChange = (e) => setStatus(e.target.value);
  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);
  return (
    <Fragment>
      <div className="mt-4 space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Job Cards</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <BasicDataTable
              data={listOfJobcard}
              // filterColumn="companyName"
              filterPlaceHolder="by Customer name"
              columns={columns}
              setSearchString={setSearchString}
              searchString={searchString}
              pageIndex={pageIndex}
              pagination={InsuranceCompanyJobCardData?.pagination}
              pageSize={pageSize}
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
              pageCount={
                InsuranceCompanyJobCardData?.pagination?.totalPages || 0
              }
              tableLoading={tableLoading}
              status={status}
              startDate={startDate}
              endDate={endDate}
              handleStatusChange={handleStatusChange}
              handleStartDateChange={(date) => setStartDate(date)}
              handleEndDateChange={(date) => setEndDate(date)}
              handleReset={handleReset}
              refetch={refetch}
              hiddenFilter={true}
              handleViewClick={handleJobcardView}
              rowClickable
            />
          </CardContent>
        </Card>
      </div>
    </Fragment>
  );
};

export default JobCardListPage;
