"use client";
import { getUserMeAction } from "@/action/auth-action";
import {
  deleteCustomerAction,
  getCustomerListAction,
} from "@/action/employeeAction/customer-action";
import BasicDataTable from "@/components/common/data-table/basic-table";
import DialogPlacement from "@/components/common/dialog/dialog-placement";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CustomerListPage = () => {
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchString, setSearchString] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tableLoading, setTableLoading] = useState(false);
  const [componentLoading, setComponentLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  const role = session?.role;

  const isEmployee = role === "employee";
  const isCompany = role === "company";

  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useQuery({
    queryKey: ["userMe"],
    queryFn: () => getUserMeAction(session.jwt),
    enabled: !!session?.jwt, // Only run the query if the token is available
  });

  const PERMISSION_VIEW_CUSTOMER =
    userData?.data?.userId?.permissionId?.customers?.view;
  const PERMISSION_CREATE_CUSTOMER =
    userData?.data?.userId?.permissionId?.customers?.create;
  const PERMISSION_DELETE_CUSTOMER =
    userData?.data?.userId?.permissionId?.customers?.delete;
  const PERMISSION_UPDATE_CUSTOMER =
    userData?.data?.userId?.permissionId?.customers?.update;

  console.log("PERMISSION_CREATE_CUSTOMER", PERMISSION_CREATE_CUSTOMER);
  const canViewCustomer = isCompany || (PERMISSION_VIEW_CUSTOMER && isEmployee);
  const canCreateCustomer =
    isCompany || (PERMISSION_CREATE_CUSTOMER && isEmployee);
  const canUpdateCustomer =
    isCompany || (PERMISSION_UPDATE_CUSTOMER && isEmployee);
  const canDeleteCustomer =
    isCompany || (PERMISSION_DELETE_CUSTOMER && isEmployee);

  const columns = [
    // {
    //   accessorKey: "firstName",
    //   header: "Customer",
    //   cell: ({ row }) => {
    //     const { firstName, lastName, email } = row?.original;
    //     const avatarInitials = `${firstName?.charAt(0)?.toUpperCase()}${lastName
    //       ?.charAt(0)
    //       ?.toUpperCase()}`;
    //     const formattedFirstName =
    //       firstName?.charAt(0)?.toUpperCase() +
    //       firstName?.slice(1)?.toLowerCase();
    //     const formattedLastName =
    //       lastName?.charAt(0)?.toUpperCase() +
    //       lastName?.slice(1)?.toLowerCase();

    //     return (
    //       <div className="flex gap-2 items-center">
    //         <Avatar className="rounded-full">
    //           <AvatarFallback>{avatarInitials}</AvatarFallback>
    //         </Avatar>
    //         <div className="flex flex-col">
    //           <span className="text-sm font-medium text-default-600 whitespace-nowrap">
    //             {formattedFirstName} {formattedLastName}
    //           </span>
    //           <span className="text-xs text-default-500 whitespace-nowrap">
    //             {email}
    //           </span>
    //         </div>
    //       </div>
    //     );
    //   },
    // },

    {
      accessorKey: "fullName",
      header: "Customer name",
      cell: ({ row }) => (
        <span className=" whitespace-nowrap">
          {row?.original?.fullName || "-"}
        </span>
      ),
    },
    {
      accessorKey: "email",
      header: "email",
      cell: ({ row }) => (
        <span className=" whitespace-nowrap">
          {row?.original?.email || "-"}
        </span>
      ),
    },

    {
      accessorKey: "mobileNumber",
      header: "Mobile Number",
      cell: ({ row }) => (
        <span className=" whitespace-nowrap">
          {row?.original?.mobileNumber || "-"}
        </span>
      ),
    },

    // {
    //   accessorKey: "country",
    //   header: "Country",
    //   cell: ({ row }) => (
    //     <span className=" whitespace-nowrap">
    //       {row?.original?.country || "-"}
    //     </span>
    //   ),
    // },
    // {
    //   accessorKey: "city",
    //   header: "City",
    //   cell: ({ row }) => (
    //     <span className="whitespace-nowrap">{row?.original?.city || "-"}</span>
    //   ),
    // },
    {
      header: "Actions",
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const customerId = row?.original?._id;

        return (
          <div className="flex gap-3 items-center justify-end">
            <Button
              size="icon"
              className={`h-9 w-9 rounded bg-default-100 dark:bg-default-200 ${
                canViewCustomer
                  ? "text-default-500 hover:text-primary-foreground"
                  : "text-default-300 cursor-not-allowed"
              }`}
              onClick={() => handleCustomerView(customerId)}
            >
              <Icon icon="heroicons:eye" className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              className={`h-9 w-9 rounded bg-default-100 dark:bg-default-200 ${
                canUpdateCustomer
                  ? "text-default-500 hover:text-primary-foreground"
                  : "text-default-300 cursor-not-allowed"
              }`}
              disabled={!canUpdateCustomer}
              onClick={(e) => {
                e.stopPropagation();
                handleCompanyEdit(customerId);
              }}
            >
              <Icon icon="heroicons:pencil-square" className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              className={`h-9 w-9 rounded bg-default-100 dark:bg-default-200 ${
                canDeleteCustomer
                  ? "text-default-500 hover:text-primary-foreground"
                  : "text-default-300 cursor-not-allowed"
              }`}
              disabled={!canDeleteCustomer}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick([customerId]);
              }}
            >
              <Icon icon="heroicons:trash" className="w-5 h-5" />
            </Button>
          </div>
        );
      },
    },
  ];

  const handleCustomerView = (id) => {
    if (canViewCustomer) {
      router.push(`/customer-list/view_customer/${id}`);
    }
  };
  const handleCompanyEdit = (id) => {
    if (canUpdateCustomer) {
      router.push(`/customer-list/create_customer/${id}`);
    }
  };
  const handleDeleteClick = (customerId) => {
    if (canDeleteCustomer) {
      setCustomerId(customerId);
      setModalOpen(true);
    }
  };

  const deleteMutation = useMutation({
    mutationKey: ["deleteCustomerAction"],
    mutationFn: async (data) => {
      const ids = {
        ids: data,
      };

      return await deleteCustomerAction(ids);
      // return await addEmiratesData(formData);
    },
    onSuccess: (res) => {
      toast.success(res.data.message);
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["getCustomerListAction"] });
      setSelectedRows([]);
    },
    onError: (error) => {
      console.error("Error deleting employee:", error);
    },
  });

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(customerId);
    setModalOpen(false);
  };
  const handleDeleteSelected = (selectedRowIds) => {
        const allIds = data.data.customers.map((customer) => customer._id);
    console.log(allIds,"allIds");
    const selectedIds = selectedRowIds.map((index) => allIds[index]);
    
    console.log(selectedIds,"selectedIds");

    handleDeleteClick(selectedIds);

    // queryClient.setQueryData(["GetJobCardsList"], newData);
    refetch();
  };

  const {
    data,
    // isLoading: queryLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["getCustomerListAction", pageIndex, pageSize],
    // queryFn: () =>
    //   getCustomerListAction({
    //     page: pageIndex + 1,
    //     size: pageSize,
    //     all: false,
    //     search: searchString,
    //   }),
    queryFn: () => {
      setTableLoading(true); // Set table loading state to true before fetching
      return getCustomerListAction({
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

  // if (queryLoading && !tableLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  // if (!data?.data) return null;

  if (componentLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex justify-between">
        <Breadcrumbs>
          <BreadcrumbItem>Menus</BreadcrumbItem>
          <BreadcrumbItem>Customers</BreadcrumbItem>
        </Breadcrumbs>
        <Button
          asChild
          className={`${canCreateCustomer ? "" : "disable cursor-not-allowed"}`}
        >
          {canCreateCustomer ? (
            <Link href="/customer-list/create_customer">
              <Plus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
              Create Customer
            </Link>
          ) : (
            <div>
              <Plus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
              Create Customer
            </div>
          )}
        </Button>
      </div>
      <div className="mt-4 space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Customers</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* <BasicDataTable
              data={data?.data?.customers}
              columns={columns}
              filterPlaceHolder="Customer Email"
              /> */}
            <BasicDataTable
              data={data?.data?.customers || []}
              filterPlaceHolder="Customer Email"
              searchString={searchString}
              setSearchString={setSearchString}
              columns={columns}
              pageIndex={pageIndex}
              pagination={data?.pagination}
              pageSize={pageSize}
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
              pageCount={data?.pagination?.totalPages || 0}
              tableLoading={tableLoading}
              handleViewClick={handleCustomerView}
              rowClickable
              handleDeleteSelected={handleDeleteSelected}
              showCheckbox={data?.data?.customers.length > 0 ? true : false}
              setSelectedRows={setSelectedRows}
              selectedRows={selectedRows}
            />
          </CardContent>
        </Card>
      </div>
      <DialogPlacement
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onDelete={handleDeleteConfirm}
        customerId={customerId}
        message="Are you sure you want to delete this Customer?"
      />
    </>
  );
};

export default CustomerListPage;
