"use client";
import {
  deleteInsurance,
  getGarrageInsuranceCompanies,
  updateGarrageInsurance,
} from "@/action/companyAction/insurance-action";
import BasicDataTable from "@/components/common/data-table/basic-table";
import DialogPlacement from "@/components/common/dialog/dialog-placement";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Icon } from "@iconify/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";

const GarrageInsurance = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState(null);
  const [searchString, setSearchString] = useState("");
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const queryClient = useQueryClient();
  const [tableLoading, setTableLoading] = useState(false);
  const [componentLoading, setComponentLoading] = useState(true);
  const { data: session, status } = useSession();

  const role = session?.role;

  const columns = [
    {
      accessorKey: "companyName",
      header: "Company Name",
      cell: ({ row }) => (
        <div className="font-medium text-card-foreground/80">
          <div className="flex space-x-3 rtl:space-x-reverse items-center">
            <span className="whitespace-nowrap">
              {row?.original?.companyName}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "companyEmail",
      header: "Account Email",
      cell: ({ row }) => (
        <div className="font-medium text-card-foreground/80">
          <div className="flex space-x-3 rtl:space-x-reverse items-center">
            <span className="whitespace-nowrap">
              {row?.original?.companyEmail}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "claimsEmail",
      header: "Claims Email",
      cell: ({ row }) => (
        <div className="font-medium text-card-foreground/80">
          <div className="flex space-x-3 rtl:space-x-reverse items-center">
            <span className="whitespace-nowrap">
              {row?.original?.claimsEmail}
            </span>
          </div>
        </div>
      ),
    },
    // {
    //   accessorKey: "companyPortal",
    //   header: "Company Portal",
    //   cell: ({ row }) => (
    //     <div className="font-medium text-card-foreground/80">
    //       <div className="flex space-x-3 rtl:space-x-reverse items-center">
    //         <span className="whitespace-nowrap">
    //           {row?.original?.companyPortal}
    //         </span>
    //       </div>
    //     </div>
    //   ),
    // },
    {
      accessorKey: "companyWebsite",
      header: "Company Website",
      cell: ({ row }) => (
        <div className="font-medium text-card-foreground/80">
          <div className="flex space-x-3 rtl:space-x-reverse items-center">
            <span className="whitespace-nowrap">
              {row?.original?.companyWebsite}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Active Status",
      cell: ({ row }) => {
        const [activeToggle, setActiveToggle] = useState(
          row?.original?.isActive
        );

        return (
          <div className="flex font-medium text-card-foreground/80 items-center justify-center text-center">
            <Switch
              checked={activeToggle}
              onCheckedChange={(checked) => {
                setActiveToggle(checked);
                handleSwitchChange(row?.original?._id, checked);
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "contactNo",
      header: "Contact No.",
      cell: ({ row }) => (
        <div className="font-medium text-card-foreground/80">
          <div className="flex space-x-3 rtl:space-x-reverse items-center">
            <span className="whitespace-nowrap">
              {row?.original?.contactNo}
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
        const insuranceId = row?.original?._id;

        return (
          <div className="flex gap-3 items-center justify-end">
            <Button
              size="icon"
              className="h-9 w-9 rounded bg-default-100 dark:bg-default-200 text-default-500 hover:text-primary-foreground"
              onClick={() => handleInsuranceView(insuranceId)}
            >
              <Icon icon="heroicons:eye" className="w-5 h-5" />
            </Button>
            {session?.role === "company" && (
              <>
                <Button
                  size="icon"
                  className="h-9 w-9 rounded bg-default-100 dark:bg-default-200 text-default-500 hover:text-primary-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInsuranceEdit(insuranceId);
                  }}
                >
                  <Icon icon="heroicons:pencil-square" className="w-5 h-5" />
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  const handleInsuranceEdit = (insuranceId) => {
    router.push(`/insurance-list/edit_insurance/${insuranceId}`);
  };

  const handleInsuranceView = (insuranceId) => {
    router.push(`/insurance-list/view_insurance/${insuranceId}`);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteInsurance,
    mutationKey: ["deleteInsurance"],
    onSuccess: (res) => {
      toast.success(res?.message);
      setModalOpen(false);
      setSelectedInsurance(null);
      queryClient.invalidateQueries({ queryKey: ["getInsuranceList"] });
    },
    onError: (error) => {
      console.error("Error deleting insurance:", error);
    },
  });

  const handleDeleteClick = (insuranceId) => {
    setSelectedInsurance(insuranceId);
    setModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(selectedInsurance);
    setModalOpen(false);
  };

  const { data, error, refetch } = useQuery({
    queryKey: ["getInsuranceList", pageIndex, pageSize],
    queryFn: () => {
      setTableLoading(true);
      return getGarrageInsuranceCompanies({
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
  const updateGarrageInsuranceMutaion = useMutation({
    mutationKey: ["updateGarrageInsuranceMutaion"],
    mutationFn: async ({ id, isActive }) => {
      const formData = new FormData();
      formData.append(
        "garageInsuranceDetails",
        JSON.stringify({ id, isActive })
      );

      return await updateGarrageInsurance(id, formData); // Pass id to the API call
    },
    onSuccess: (response) => {
      toast.success(response?.message);
      router.push("/insurance-list");
      refetch(); // Call refetch if needed
    },
    onError: (error) => {
      toast.error(error?.data?.message || "Not Working");
    },
  });
  const handleSwitchChange = (id, currentStatus) => {
    const newStatus = !currentStatus ? "false" : "true"; // Convert boolean to string
    console.log(`Switch toggled for id: ${id}, new status value: ${newStatus}`);

    // Perform mutation with id and newStatus
    updateGarrageInsuranceMutaion.mutate({ id, isActive: newStatus });
  };

  useEffect(() => {
    if (searchString?.length > 2) {
      if (pageIndex !== 0) {
        setPageIndex(0);
      } else {
        refetch();
      }
    } else if (searchString?.length === 0) {
      refetch();
    }
  }, [pageIndex, pageSize, refetch, searchString]);

  if (error) return <div>Error loading data</div>;
  if (componentLoading) return <div>Loading...</div>;

  return (
    <Fragment>
      {session.role === "company" && (
        <>
          <div className="flex justify-between">
            <Breadcrumbs>
              <BreadcrumbItem>Menus</BreadcrumbItem>
              <BreadcrumbItem>Insurance Companies</BreadcrumbItem>
            </Breadcrumbs>
            {/* <Button asChild>
              <Link href="/insurance-list/add_insurance">
                <Plus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                Create Company
              </Link>
            </Button> */}
          </div>
          <div className="mt-4 space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Insurance Companies</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <BasicDataTable
                  data={data?.data?.garageInsurance || []}
                  filterPlaceHolder="Company Name"
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
                  handleViewClick={handleInsuranceView}
                  rowClickable
                />
              </CardContent>
            </Card>
          </div>
          <DialogPlacement
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onDelete={handleDeleteConfirm}
            message="Are you sure you want to delete this Company?"
          />
        </>
      )}
    </Fragment>
  );
};

export default GarrageInsurance;
