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
import { Fragment, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  deleteQuotation,
  getAllQuotation,
  updateQuotation,
  getAllQuotationMyTask,
  getMyTaskListAction,
} from "@/action/quotationAction/quotation-action";
import { getUserMeAction } from "@/action/auth-action";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaNotesMedical } from "react-icons/fa";
import { SocketContext } from "../scoket/SocketConnection";

const MyTaskListing = () => {
  const statusOptions = ["Approved", "Pending", "Declined", "Draft"];

  const statusOptions2 = ["Approved", "Pending", "Declined"];
  const { socket } = useContext(SocketContext);
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

  const { data, error, refetch } = useQuery({
    queryKey: ["GetTaskList", pageIndex, pageSize, searchString],
    queryFn: () => {
      setTableLoading(true);
      return getMyTaskListAction({
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

  //

  useEffect(() => {
    const handleTaskUpdate = () => {
      refetch();
    };

    socket.on("task-updated", handleTaskUpdate);

    return () => {
      socket.off("task-updated", handleTaskUpdate);
    };
  }, [socket]);

  //

  useEffect(() => {
    if (searchString.length > 2 || searchString.length === 0) {
      refetch();
    }
  }, [pageIndex, pageSize, searchString, refetch]);

  const handleReadAllNotification = () => {
    socket.emit("notification:read-all", {}, (data) => {
      //console.log("read all noti :-", data)
    });
    refetch();
  };

  // const handleViewClick = (e, jobCardId) => {
  //     e.stopPropagation();
  //     handleReadAllNotification();
  //     router.push(`/jobcard-list/view_jobcard/${jobCardId}`);
  // };

  const handleViewClick = (e, jobCardId, task) => {
    e.stopPropagation();
    handleReadAllNotification();

    let activeTab = "Customer"; // Default tab

    // Ensure task is defined before using includes
    if (task) {
      if (task.includes("claim")) {
        activeTab = "ClaimView";
      } else if (task.includes("quotation")) {
        activeTab = "QuotationView";
      } else if (task.includes("jobCard")) {
        activeTab = "Customer";
      }
    }

    const url = `/jobcard-list/view_jobcard/${jobCardId}?tab=${activeTab}`;
    console.log("Navigating to:", url);
    router.push(url);
  };

  function formatDateTime(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  const columns = [
    {
      accessorKey: "task",
      header: "Task",
      cell: ({ row }) => (
        <div className="font-medium text-card-foreground/80">
          <div className="flex space-x-3 items-center">
            <span className="whitespace-nowrap">
              {row?.original?.task || "-"}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "Task Action",
      cell: ({ row }) => (
        <div className="font-medium text-card-foreground/80">
          <div className="flex space-x-3 items-center">
            <span className="whitespace-nowrap">
              {row?.original?.action || "-"}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <div className="font-medium text-card-foreground/80">
          <div className="flex space-x-3 items-center">
            <span className="whitespace-nowrap">
              {formatDateTime(row?.original?.createdAt || "-")}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Actions",
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const jobCardId = row?.original?.jobCardId;
        const task = row?.original?.tab;

        return (
          <div className="flex gap-3 items-center justify-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className="h-9 w-9 rounded bg-default-100 dark:bg-default-200 text-default-500 hover:text-primary-foreground"
                    onClick={(e) => handleViewClick(e, jobCardId, task)}
                  >
                    <Icon icon="heroicons:eye" className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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

  const taskList = data?.data || [];

  return (
    <Fragment>
      <div className="flex justify-between">
        <Breadcrumbs>
          <BreadcrumbItem>Menus</BreadcrumbItem>
          <BreadcrumbItem>My Task</BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="mt-4 space-y-5">
        <Card>
          <CardHeader className="mb-0">
            <CardTitle className="mb-0">
              You’ve got{" "}
              <span className="text-primary font-bold">
                {taskList.length} task{taskList.length !== 1 && "s"}
              </span>{" "}
              today
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <BasicDataTable
              data={taskList}
              columns={columns}
              filterPlaceHolder=""
              hiddenOnly={true}
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
              jobCardId={true}
            />
          </CardContent>
        </Card>
      </div>
    </Fragment>
  );
};

export default MyTaskListing;
