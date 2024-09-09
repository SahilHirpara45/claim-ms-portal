"use client";
import { getInsuranceCustomerListAction } from "@/action/insurance-action";
import BasicDataTable from "@/components/common/data-table/basic-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CustomerListPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchString, setSearchString] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tableLoading, setTableLoading] = useState(false);
  const [componentLoading, setComponentLoading] = useState(true);
  const params = useParams();
  const insuranceId = params?.view_insurance;

  const columns = [
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
              className={`h-9 w-9 rounded bg-default-100 dark:bg-default-200 text-default-500 hover:text-primary-foreground`}
              onClick={() => handleCustomerView(customerId)}
            >
              <Icon icon="heroicons:eye" className="w-5 h-5" />
            </Button>
          </div>
        );
      },
    },
  ];

  const handleCustomerView = (id) => {
    router.push(`/customer-list/view_customer/${id}`);
  };

  const {
    data: InsuranceCompanyData,
    error,
    refetch,
  } = useQuery({
    queryKey: ["InsuranceCompanyData", pageIndex, pageSize],
    queryFn: () => {
      setTableLoading(true); // Set table loading state to true before fetching
      return getInsuranceCustomerListAction(insuranceId, {
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

  // if (componentLoading) {
  //   return <div>Loading...</div>;
  // }
  return (
    <>
      <div className="mt-4 space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Customers</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <BasicDataTable
              data={InsuranceCompanyData?.data?.listOfCustomers || []}
              filterPlaceHolder="Customer Email"
              searchString={searchString}
              setSearchString={setSearchString}
              columns={columns}
              pageIndex={pageIndex}
              pagination={InsuranceCompanyData?.pagination}
              pageSize={pageSize}
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
              pageCount={InsuranceCompanyData?.pagination?.totalPages || 0}
              tableLoading={tableLoading}
              handleViewClick={handleCustomerView}
              rowClickable
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CustomerListPage;
