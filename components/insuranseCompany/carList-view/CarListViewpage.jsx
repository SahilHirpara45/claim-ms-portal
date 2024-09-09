"use client";
// import { deleteCarAction, getCars } from "@/action/admin-action";
import { getInsuranceCarListAction } from "@/action/insurance-action";
import BasicDataTable from "@/components/common/data-table/basic-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CarListViewPage = () => {
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
      accessorKey: "model",
      header: "Model",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row?.original?.model || "-"}</span>
      ),
    },

    {
      accessorKey: "make",
      header: "make",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row?.original?.make || "-"}</span>
      ),
    },

    {
      accessorKey: "chassisNo",
      header: "chassisNo",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {row?.original?.chassisNo || "-"}
        </span>
      ),
    },

    {
      accessorKey: "plateNumber",
      header: "Plate Number",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {row?.original?.plateNumber || "-"}
        </span>
      ),
    },

    {
      header: "Actions",
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const carId = row?.original?._id;

        return (
          <div className="flex gap-3 items-center justify-end">
            <Button
              size="icon"
              className={`h-9 w-9 rounded bg-default-100 dark:bg-default-200 text-default-500 hover:text-primary-foreground`}
              onClick={() => handleCarView(carId)}
            >
              <Icon icon="heroicons:eye" className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const handleCarView = (carId) => {
    console.log(carId, "carId");
    router.push(`/car-list/view_car/${carId}`);
  };

  const {
    data: InsuranceCompanyCarData,
    error,
    refetch,
  } = useQuery({
    queryKey: ["InsuranceCompanyCarData", pageIndex, pageSize],
    queryFn: () => {
      setTableLoading(true); // Set table loading state to true before fetching
      return getInsuranceCarListAction(insuranceId, {
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

  return (
    <>
      <div className="mt-4 space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Cars</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <BasicDataTable
              data={InsuranceCompanyCarData?.data?.listOfCars || []}
              filterPlaceHolder="Model"
              setSearchString={setSearchString}
              searchString={searchString}
              columns={columns}
              pageIndex={pageIndex}
              pagination={InsuranceCompanyCarData?.pagination}
              pageSize={pageSize}
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
              pageCount={InsuranceCompanyCarData?.pagination?.totalPages || 0}
              tableLoading={tableLoading}
              handleViewClick={handleCarView}
              rowClickable
              refetch={refetch}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CarListViewPage;
