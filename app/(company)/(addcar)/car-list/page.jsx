"use client";
import { getUserMeAction } from "@/action/auth-action";
import {
  deleteCarAction,
  getCars
} from "@/action/companyAction/car-action";
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
import BasicDataTable from "../../../../components/common/data-table/basic-table";

const CarListPage = () => {
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchString, setSearchString] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tableLoading, setTableLoading] = useState(false);
  const [componentLoading, setComponentLoading] = useState(true);

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

  const PERMISSION_VIEW_CAR = userData?.data?.userId?.permissionId?.cars?.view;
  const PERMISSION_CREATE_CAR =
    userData?.data?.userId?.permissionId?.cars?.create;
  const PERMISSION_DELETE_CAR =
    userData?.data?.userId?.permissionId?.cars?.delete;
  const PERMISSION_UPDATE_CAR =
    userData?.data?.userId?.permissionId?.cars?.update;

  const canViewCar = isCompany || (PERMISSION_VIEW_CAR && isEmployee);
  const canCreateCar = isCompany || (PERMISSION_CREATE_CAR && isEmployee);
  const canUpdateCar = isCompany || (PERMISSION_UPDATE_CAR && isEmployee);
  const canDeleteCar = isCompany || (PERMISSION_DELETE_CAR && isEmployee);

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
              className={`h-9 w-9 rounded bg-default-100 dark:bg-default-200 ${
                canViewCar
                  ? "text-default-500 hover:text-primary-foreground"
                  : "text-default-300 cursor-not-allowed"
              }`}
              disabled={!canViewCar}
              onClick={() => handleCarView(carId)}
            >
              <Icon icon="heroicons:eye" className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              className={`h-9 w-9 rounded bg-default-100 dark:bg-default-200 ${
                canUpdateCar
                  ? "text-default-500 hover:text-primary-foreground"
                  : "text-default-300 cursor-not-allowed"
              }`}
              disabled={!canUpdateCar}
              onClick={(e) => {
                e.stopPropagation();
                handleCompanyEdit(carId);
              }}
            >
              <Icon icon="heroicons:pencil-square" className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              className={`h-9 w-9 rounded bg-default-100 dark:bg-default-200 ${
                canDeleteCar
                  ? "text-default-500 hover:text-primary-foreground"
                  : "text-default-300 cursor-not-allowed"
              }`}
              disabled={!canDeleteCar}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(carId);
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
    if (canUpdateCar) {
      console.log(id, "companyEditId");
      router.push(`/car-list/create_car/${id}`);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: deleteCarAction,
    mutationKey: ["deleteCarAction"],
    onSuccess: (res) => {
      toast.success(res?.message);
      console.log(res, "res");
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["getCars"] });
    },
    onError: (error) => {
      console.error("Error deleting employee:", error);
    },
  });

  const handleCarView = (carId) => {
    if (canViewCar) {
      console.log(carId, "carId");
      router.push(`/car-list/view_car/${carId}`);
    }
  };

  const handleDeleteClick = (companyId) => {
    if (canDeleteCar) {
      setCompanyId(companyId);
      setModalOpen(true);
    }
  };

  const { data, error, refetch } = useQuery({
    queryKey: ["getCars", pageIndex, pageSize],
    queryFn: () => {
      setTableLoading(true);
      return getCars({
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
  // console.log(data, "data into table");

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
  const handleDeleteConfirm = () => {
    deleteMutation.mutate(companyId);
    setModalOpen(false);
    refetch();
  };

  // if (isLoading) return <div>Loading...</div>;
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
          <BreadcrumbItem>Cars</BreadcrumbItem>
        </Breadcrumbs>
        <Button
          asChild
          className={`${canCreateCar ? "" : "disable cursor-not-allowed"}`}
        >
          {canCreateCar ? (
            <Link href="/car-list/create_car">
              <Plus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
              Create Car
            </Link>
          ) : (
            <div>
              <Plus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
              Create Car
            </div>
          )}
        </Button>
      </div>
      <div className="mt-4 space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Cars</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* <BasicDataTable
              data={data?.data?.cars}
              columns={columns}
              filterColumn="carModel"
              filterPlaceHolder="Model"
            /> */}
            <BasicDataTable
              data={data?.data?.cars || []}
              filterPlaceHolder="Model"
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
              handleViewClick={handleCarView}
              rowClickable
            />
          </CardContent>
        </Card>
      </div>
      <DialogPlacement
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onDelete={handleDeleteConfirm}
        companyId={companyId}
        message="Are you sure you want to delete this car?"
      />
    </>
  );
};

export default CarListPage;
