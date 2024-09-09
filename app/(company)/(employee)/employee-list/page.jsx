"use client";
// import { getCustomerList } from "@/action/customer-action";
import BasicDataTable from "@/components/common/data-table/basic-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Fragment, useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Plus } from "lucide-react";
import {
  deleteEmployee,
  getAllEmployee,
} from "@/action/companyAction/employee-action";
import { useRouter } from "next/navigation";
import DialogPlacement from "../../../../components/common/dialog/dialog-placement";
import toast from "react-hot-toast";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const EmployeeListPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const queryClient = useQueryClient();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchString, setSearchString] = useState("");
  const [tableLoading, setTableLoading] = useState(false);
  const [componentLoading, setComponentLoading] = useState(true);

  const router = useRouter();

  const columns = [
    {
      accessorKey: "firstName",
      header: "Full Name",
      cell: ({ row }) => {
        const { firstName, lastName, email } = row.original;
        const avatarInitials = `${firstName.charAt(0).toUpperCase()}${lastName
          .charAt(0)
          .toUpperCase()}`;
        const formattedFirstName =
          firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
        const formattedLastName =
          lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();

        return (
          <div className="flex gap-2 items-center">
            <span className="flex items-center space-x-2 whitespace-nowrap overflow-hidden">
              {row?.original?.avatar ? (
                <Image
                  src={row?.original?.avatar}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <Avatar className="rounded-full">
                  <AvatarFallback>{avatarInitials}</AvatarFallback>
                </Avatar>
              )}
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-default-600 whitespace-nowrap">
                {formattedFirstName} {formattedLastName}
              </span>
              <span className="text-xs text-default-500 whitespace-nowrap">
                {email}
              </span>
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "designation",
      header: "designation",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          color={
            (row.original.designation === "CSR" && "default") ||
            (row.original.designation === "Technician" && "success")
          }
          className="capitalize "
        >
          {row?.original?.designation || "-"}
        </Badge>
      ),
    },

    {
      header: "Actions",
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const employee = row.original._id;
        return (
          <div className="flex gap-3 items-center justify-end">
            <Button
              size="icon"
              className="h-9 w-9 rounded bg-default-100 dark:bg-default-200 text-default-500 hover:text-primary-foreground"
              onClick={() => handleEmployeeView(employee)}
            >
              <Icon icon="heroicons:eye" className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              className="h-9 w-9 rounded bg-default-100 dark:bg-default-200 text-default-500 hover:text-primary-foreground"
              onClick={(e) => {
                e.stopPropagation();
                handleCompanyEdit(employee);
              }}
            >
              <Icon icon="heroicons:pencil-square" className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              className="h-9 w-9 rounded bg-default-100 dark:bg-default-200 text-default-500 hover:text-primary-foreground"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(employee);
              }}
            >
              <Icon icon="heroicons:trash" className="w-5 h-5" />
            </Button>
          </div>
        );
      },
    },
  ];

  const handleCompanyEdit = (id) => {
    router.push(`/employee-list/create_employee/${id}`);
  };

  const handleEmployeeView = (id) => {
    router.push(`/employee-list/view_employee/${id}`);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    mutationKey: ["deleteEmployee"],
    onSuccess: (res) => {
      toast.success(res.message);
      setModalOpen(false);
      setSelectedEmployee(null);
      queryClient.invalidateQueries(["getEmployeeList"]);
    },
    onError: (error) => {
      console.error("Error deleting employee:", error);
    },
  });

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(selectedEmployee);
  };

  const { data, error, refetch } = useQuery({
    queryKey: ["getEmployeeList", pageIndex, pageSize, searchString],
    queryFn: () => {
      setTableLoading(true);
      return getAllEmployee({
        page: pageIndex + 1,
        size: pageSize,
        all: false,
        search: searchString,
      }).finally(() => {
        setTableLoading(false);
        setComponentLoading(false);
      });
      // keepPreviousData: true,
    },
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

  // if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  // if (!data || !data.data) return null;

  // Extract employees data from response
  const employees = data?.data?.employes || [];

  if (componentLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <div className="flex justify-between">
        <Breadcrumbs>
          <BreadcrumbItem>Menu</BreadcrumbItem>
          <BreadcrumbItem>Employees</BreadcrumbItem>
        </Breadcrumbs>
        <Button asChild>
          <Link href="/employee-list/create_employee">
            <Plus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
            Create Employee
          </Link>
        </Button>
      </div>
      <div className="mt-4 space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Employees</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <BasicDataTable
              data={employees}
              filterPlaceHolder="email"
              setSearchString={setSearchString}
              searchString={searchString}
              columns={columns}
              pageIndex={pageIndex}
              pagination={data?.pagination}
              pageSize={pageSize}
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
              pageCount={data?.pagination?.totalPages || 0}
              tableLoading={tableLoading}
              handleViewClick={handleEmployeeView}
              rowClickable
            />
          </CardContent>
        </Card>
      </div>
      <DialogPlacement
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onDelete={handleDeleteConfirm}
        employee={selectedEmployee}
        message="Are you sure you want to delete this Employee?"
      />
    </Fragment>
  );
};

export default EmployeeListPage;
