"use client";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Icon } from "@iconify/react";
import { deleteCompanyAction, getCompanies } from "@/action/admin-action";
import DialogPlacement from "@/components/common/dialog/dialog-placement";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BasicDataTable from "../../../../components/common/data-table/basic-table";
import { menusConfig } from "@/config/menus";
import toast from "react-hot-toast";
import AvtarImg1 from "@/public/images/avatar/avatar-2.jpg";

import SingleMenuItem from "@/components/partials/sidebar/popover/single-menu-item"; // Import the SingleMenuItem component

const DataTablePage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const [searchString, setSearchString] = useState("");
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const queryClient = useQueryClient();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [componentLoading, setComponentLoading] = useState(true);

  const columns = [
    // {
    //   accessorKey: "avatar",
    //   header: "Company Avatar",
    //   cell: ({ row }) => (
    //     <div className="font-medium text-card-foreground/80">
    //       <div className="flex space-x-3 rtl:space-x-reverse items-center">
    //         <span className="whitespace-nowrap">
    //           <div className="flex gap-3 items-center">
    //             {row?.original?.avatar && (
    //               <Image
    //                 src={row.original.avatar}
    //                 alt="avatar"
    //                 width={40}
    //                 height={40}
    //               />
    //             )}
    //           </div>
    //         </span>
    //       </div>
    //     </div>
    //   ),
    // },

    {
      accessorKey: "companyName",
      header: "Company Name",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
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
              <Image
                src={AvtarImg1}
                alt="avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
          </span>
          <span className="overflow-hidden text-ellipsis">
            {row?.original?.companyName}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "mobileNumber",
      header: "Company Mobile No.",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {row?.original?.mobileNumber || "-"}
        </span>
      ),
    },

    {
      accessorKey: "email",
      header: "Company Email",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {row?.original?.email}
        </span>
      ),
    },
    {
      header: "Actions",
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const companyId = row?.original?._id;

        return (
          <div className="flex gap-3 items-center justify-end">
            <Button
              size="icon"
              className="h-9 w-9 rounded bg-default-100 dark:bg-default-200 text-default-500 hover:text-primary-foreground"
              onClick={() => handleCompanyEdit(companyId)}
            >
              <Icon icon="heroicons:pencil-square" className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              className="h-9 w-9 rounded bg-default-100 dark:bg-default-200 text-default-500 hover:text-primary-foreground"
              onClick={() => handleDeleteClick(companyId)}
            >
              <Icon icon="heroicons:trash" className="w-5 h-5" />
            </Button>
            {/* <Button
              size="icon"
              className="h-9 w-9 rounded bg-default-100 dark:bg-default-200 text-default-500 hover:text-primary-foreground"
               onClick={() =>handleTableRowClick(companyId)
              //onClick={() =>showCompanyData(companyId)
              
              }
            >
              <Icon icon="maki:arrow" width="1.2em" height="1.2em" />
            </Button> */}
          </div>
        );
      },
    },
  ];

  const handleCompanyEdit = (id) => {
    router.push(`/admin-company-list/admin_add_company/${id}`);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteCompanyAction,
    mutationKey: ["deleteCompanyAction"],
    onSuccess: (res) => {
      console.log(res, "res");
      toast.success(res?.message);
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["getCompanies"] });
    },
    onError: (error) => {
      console.error("Error deleting company:", error);
    },
  });

  const handleDeleteClick = (companyId) => {
    setCompanyId(companyId);
    setModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(companyId);
    setModalOpen(false);
    refetch();
  };

  const { data, error, refetch } = useQuery({
    queryKey: ["getCompanies", pageIndex, pageSize],
    queryFn: () => {
      setTableLoading(true);
      return getCompanies({
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

  const showCompanyData = (companyId) => {
    const company = data?.data.find((comp) => comp._id === companyId);
    setSelectedCompany(company);
    if (company) {
      const companyRole = company.role;
      const filtered = menusConfig.sidebarNav.classic.filter(
        (menu) => menu.role && menu.role.includes(companyRole)
      );
      queryClient.setQueryData(["selectedRecord"], filtered);
      setFilteredMenus(filtered);
    }
  };

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

  const handleTableRowClick = (recordId) => {
    queryClient.setQueryData(["selectedRecord"], recordId);
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
          <BreadcrumbItem>Companies / Garages</BreadcrumbItem>
        </Breadcrumbs>
        <Button asChild>
          <Link href="/admin-company-list/admin_add_company">
            <Plus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
            Create Company
          </Link>
        </Button>
      </div>
      <div className="mt-4 space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Companies / Garages</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <BasicDataTable
              data={data?.data?.companies || []}
              filterPlaceHolder="Company Email"
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
            />
          </CardContent>
        </Card>
      </div>
      {/* {selectedCompany && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Menu for {selectedCompany.companyName}</h2>
          <ul>
            {filteredMenus.map((menu) => (
              <li key={menu.title} className="mt-2">
                <SingleMenuItem item={menu} collapsed={false} trans={false} />
              </li>
            ))}
          </ul>
        </div>
      )} */}
      <DialogPlacement
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onDelete={handleDeleteConfirm}
        companyId={companyId}
        message="Are you sure you want to delete this Company?"
      />
    </>
  );
};

export default DataTablePage;
