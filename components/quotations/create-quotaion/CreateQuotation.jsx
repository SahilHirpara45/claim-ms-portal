"use client";

import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Download } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import Select from "react-select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import FileUploaderSingle from "@/components/common/file-uploader/file-uploader-single";
import { getCSREmployeeAction } from "@/action/companyAction/employee-action";
import {
  getInsuranceCompanies,
  getGarrageInsuranceCompanies,
} from "@/action/companyAction/insurance-action";
import { getCustomerListAction } from "@/action/employeeAction/customer-action";
import { getCars } from "@/action/companyAction/car-action";
import { useCreateQuotaion } from "./../hook";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getJobCardListAction } from "@/action/employeeAction/jobcard-action";
import { useParams } from "next/navigation";
import {
  getPDFGenrate,
  getSingleQuotation,
  updateQuotation,
} from "@/action/quotationAction/quotation-action";
import QuotationLossModel from "../quotation-total-loss-model/QuotationLossModel";
import BasicDataTable from "@/components/common/data-table/basic-table";
import {
  statusOptionsCSR,
  statusOptionsCompany,
  statusOptionsTech,
} from "../constants/quotations";
import { getUserMeAction } from "@/action/auth-action";
import { useSession } from "next-auth/react";
import { data } from "autoprefixer";

import SectionAddItem from "./SectionAddItem";
import { quotationFormSchemaSection } from "../schema/quotaionFormSchema";
import { updateSpQuotationeById } from "@/config/quotationConfig/quotation.config";
import { Checkbox } from "@/components/ui/checkbox";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";

const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const CreateQuotation = () => {
  const [resetTrigger, setResetTrigger] = useState(false);
  const params = useParams();
  const [subtotal, setSubtotal] = useState(0);
  const { data: session } = useSession();
  const quotaionsId = params?.quotaionsId;
  const viewQuotationId = params?.viewQuotationId;
  const reCreateID = params?.reCreateID;

  const supplementId = params?.supplementId;

  const [isFocused, setIsFocused] = useState(false);
  const jobCardI1d = params?.jobcardId;
  const [initialStatus, setInitialStatus] = useState(null);
  const [isSectionView, setIsSectionView] = useState(true);
  //
  const { data: getCSREmployeeData } = useQuery({
    queryKey: ["getCSREmployeeAction"],
    queryFn: () => {
      return getCSREmployeeAction({
        all: true,
        designation: "CSR",
      });
    },
  });

  //me api

  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useQuery({
    queryKey: ["userMe"],
    queryFn: () => getUserMeAction(session.jwt),
    enabled: !!session?.jwt, // Only run the query if the token is available
  });

  const CsrList =
    getCSREmployeeData?.data?.map((csr) => ({
      value: csr._id,
      label: `${csr?.firstName} ${csr?.lastName}`,
    })) ?? [];
  //

  const {
    initialValues,
    loading,
    schema,
    submit,
    LpoQuotationMutation,
    setSnewtatus,
    quotationData,
  } = useCreateQuotaion({ CsrList });

  useEffect(() => {
    if (quotationData) {
      setInitialStatus(quotationData?.status);
    }
  }, [quotationData]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: initialValues,
    resolver: zodResolver(isSectionView ? quotationFormSchemaSection : schema),
  });
  const quStatus = watch("quStatus");

  const yyy = watch();

  const totalLaborParts = watch("totalLaborParts");
  const totalSectionParts = watch("totalSectionParts");

  useEffect(() => {
    let total = 0;
    const parseValue = (value) => {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    };

    const qty = parseValue(watch(`totalLaborParts`));
    const price = parseValue(watch(`totalSectionParts`));

    total = Math.floor(qty + price);
    if (totalLaborParts || totalSectionParts) {
      const laborParts = parseValue(totalLaborParts);
      const sectionParts = parseValue(totalSectionParts);

      const total = laborParts + sectionParts;

      // Set the grand total only if both values are provided
      setValue("totalGrandParts", total.toFixed(2));
    }

    // setSubtotal(total);
    // setValue("totalGrandParts", total.toFixed(2));
  }, [totalLaborParts, totalSectionParts, setValue]);

  useEffect(() => {
    reset(initialValues);
    if (!hasAppended.current && fields.length === 0) {
      append({ itemName: "", itemPrice: "" });
      hasAppended.current = true;
    }
  }, [initialValues]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "itemList",
  });

  const handleReset = () => {
    reset();
    setResetTrigger(!resetTrigger);
  };

  const hasAppended = useRef(false);

  useEffect(() => {
    if (!hasAppended.current && fields.length === 0) {
      append({ itemName: "", itemPrice: "" });
      hasAppended.current = true;
    }
  }, [fields, append]);

  const { data: InsuranceCompaniesData } = useQuery({
    queryKey: ["getInsuranceCompanies"],
    queryFn: () =>
      getGarrageInsuranceCompanies({
        all: true,
      }),
  });

  const InsuranseCompanyList =
    InsuranceCompaniesData?.data?.garageInsurance?.map((insuranse_compnay) => ({
      value: insuranse_compnay._id,
      label: insuranse_compnay.companyName,
    }));

  const fetchPDF = async () => {
    if (viewQuotationId) {
      try {
        const response = await getPDFGenrate(viewQuotationId);

        if (response.success && response.link) {
          // Notify the user of success
          toast.success(response.message);

          // Open the PDF in a new tab
          window.open(response.link, "_blank");

          // Fetch the PDF file as a Blob for downloading
          const pdfResponse = await fetch(response.link);
          const pdfBlob = await pdfResponse.blob();

          // Create a URL for the Blob
          const url = window.URL.createObjectURL(pdfBlob);
          const a = document.createElement("a");

          // Set the download attributes
          a.href = url;
          //  a.download = response.filename || "quotation.pdf";
          a.download = "quotation.pdf";
          document.body.appendChild(a);

          // Trigger the download
          a.click();

          // Clean up
          a.remove();
          window.URL.revokeObjectURL(url);
        } else {
          toast.error("Failed to generate the PDF link.");
        }

        return response;
      } catch (error) {
        toast.error(error?.response?.message || "Failed to fetch the PDF.");
        throw error;
      }
    }
  };


  const {
    isLoading: isLoadingPDFQuotation,
    isError: isErrorPDFQuotation,
    data: quotationPDFData,
    error: QuotationPDFError,
    refetch,
  } = useQuery({
    queryKey: ["quotationData", viewQuotationId],
    queryFn: fetchPDF,
    enabled: false,
    retry: false,
  });

  const handleDownloadClick = () => {
    if (viewQuotationId) {
      refetch();
    }
  };

  //
  const {
    data: customersData,
    isLoading: isCustomerLoading,
    error: customerError,
  } = useQuery({
    queryKey: ["getCustomerListAction"],
    queryFn: () =>
      getCustomerListAction({
        all: true,
      }),
  });

  const CustomerList = customersData?.data?.map((customer) => ({
    value: customer._id,
    label: customer.fullName,
  }));

  const { data: carData } = useQuery({
    queryKey: ["getCars"],
    queryFn: () => {
      return getCars({
        all: true,
      });
    },
  });

  const CarList = carData?.data?.map((car) => ({
    value: car._id,
    label: car.make,
  }));

  const { data: JobData } = useQuery({
    queryKey: ["GetJobCardsList"],
    queryFn: async () => {
      return getJobCardListAction({
        all: "true",
      });
    },
  });
  const JobList = JobData?.data?.map((job) => ({
    value: job._id,
    label: job.jobCardNumber,
  }));

  const jobCardId = params?.jobcardId;
  ///
  const updateQuotationMutation = useMutation({
    mutationKey: ["updateQuotationMutation"],
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append("quotatioDetails", JSON.stringify(data));
      const quotaionswId = viewQuotationId || quotaionsId;
      return await updateQuotation(quotaionswId, formData);
    },
    onSuccess: (response) => {
      toast.success(response?.message);
      // refetch();
    },
    onError: (error) => {
      toast.error(error?.data?.message);
    },
  });

  const updateSpQuotationMutation = useMutation({
    mutationKey: ["updateSpQuotationMutation"],
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append("quotatioDetails", JSON.stringify(data));

      const quotaionsId = params?.quotaionsId;
      const viewQuotationId = params?.viewQuotationId;

      return await updateSpQuotationeById(
        quotaionsId || viewQuotationId,
        formData
      );
    },
    onSuccess: (response) => {
      toast.success(response?.message);
      // router.push("/quotations-list");
    },
    onError: (error) => {
      toast.error(error?.data?.message);
    },
  });
  const [isTotalLossExModalOpen, setIsTotalLossExModalOpen] = useState(false);

  const handleStatusUpdate = (newStatus) => {
    const payload = {
      status: newStatus,
    };
    if (newStatus !== "Approved") {
      if (!jobCardId) {
        if (quotationData?.isSupplmenteryQuotation) {
          updateSpQuotationMutation.mutate(payload);
        }
        if (newStatus !== "Declined") {
          updateQuotationMutation.mutate(payload);
        }
      }
    }
  };
  const handleCommentModalOpen = () => setIsTotalLossExModalOpen(true);
  const handleCommentModalClose = () => setIsTotalLossExModalOpen(false);

  useEffect(() => {
    if (quStatus === "Declined" && !quotationData?.isSupplmenteryQuotation && quotationData?.status !== "Declined") {
      handleCommentModalOpen();
    }

  }, [quStatus]);

  //trash
  const {
    isLoading,
    isError,
    data: QutationData,
    error,
  } = useQuery({
    queryKey: ["QutationData", viewQuotationId],
    queryFn: () => getSingleQuotation(viewQuotationId),
    enabled: !!viewQuotationId,
    retry: false,
  });

  const columns = [
    {
      accessorKey: "rowNumber",
      header: "Sr No",
      cell: ({ row, rowIndex = 0 }) => {
        // Calculate the row number
        const rowNumber = rowIndex + 1;

        return <span className="whitespace-nowrap">{rowNumber}</span>;
      },
    },

    {
      accessorKey: "lpo",
      header: "File name",
      cell: ({ row }) => {
        const lpo = row?.original;
        const fileName = lpo.split("/").pop();

        return (
          <span className="whitespace-nowrap">
            <a href={fileName} download={fileName}>
              {fileName || "-"}{" "}
            </a>
          </span>
        );
      },
    },

    {
      header: "Actions",
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const lpo = row?.original;
        const fileName = lpo.split("/").pop();
        return (
          <div className="flex gap-3 items-center justify-end">
            <a
              href={fileName}
              download={fileName}
              className=" rounded bg-default-100 dark:bg-default-200 text-default-500 p-2 hover:text-white hover:bg-primary"
            >
              <Icon
                icon="material-symbols:download"
                width="1.2em"
                height="1.2em"
              />
            </a>
          </div>
        );
      },
    },
  ];
  let initialStatusOptions = [];

  // Extract role and designation from userData
  const role = userData?.data?.userId?.role;
  const designation = userData?.data?.userId?.designation;

  if (userData && role) {
    if (role === "employee" && designation === "CSR") {
      initialStatusOptions = statusOptionsCSR;
    } else if (role === "employee" && designation === "Technician") {
      initialStatusOptions = statusOptionsCompany;
    } else if (role === "company") {
      initialStatusOptions = statusOptionsCompany;
    }
  }
  const modifiedStatusOptionsCSR = statusOptionsCSR.filter(
    (option) => option.value !== "Pending"
  );
  const modifiedStatusOptionsCompany = statusOptionsCompany.filter(
    (option) => option.value !== "Draft"
  );
  const statusOptions = initialStatusOptions;
  const AllOptions = [
    { label: "Approved", value: "Approved" },
    // { label: "Pending", value: "Pending" },
    { label: "Declined", value: "Declined" },
    { label: "Draft", value: "Draft" },
    { label: "Submitted", value: "Submitted" },
  ];
  const CompanyStatusList = [
    { label: "Approved", value: "Approved" },
    // { label: "Pending", value: "Pending" },
    { label: "Declined", value: "Declined" },
    { label: "Submitted", value: "Submitted" },
  ];
  const CsrStatusList = [
    { label: "Approved", value: "Approved" },
    { label: "Declined", value: "Declined" },
    { label: "Submitted", value: "Submitted" },
  ];
  const SurveyorStatusList = [
    // { label: "Draft", value: "Draft" },
    { label: "Submitted", value: "Submitted" },
    { label: "Approved", value: "Approved" },
    { label: "Declined", value: "Declined" },
  ];
  const getStatusList = () => {
    if (role === "company") {
      return CompanyStatusList;
    } else if (role === "employee" && designation === "Surveyor") {
      return SurveyorStatusList;
    } else if (role === "employee" && designation === "CSR") {
      return CsrStatusList;
    } else {
      return [];
    }
  };

  const isSelectEnabled =
    role === "company" ||
    (role === "employee" &&
      designation === "Surveyor") || (role === "employee" &&
        designation === "CSR");
  //  && initialStatus === "Submitted" && initialStatus === "Draft"
  const isStatusEditable = ["Draft", "Submitted"].includes(initialStatus);

  ///
  useEffect(() => {
    if (quotationData) {
      if (
        quotationData?.listOfItems.length > 0 &&
        quotationData?.sectionItemList?.length === 0
      ) {
        setIsSectionView(false);
      } else if (quotationData?.sectionItemList?.length > 0) {
        setIsSectionView(true);
      } else {
        setIsSectionView(false);
      }
    }
  }, [quotationData]);

  const toggleView = () => {
    setIsSectionView(!isSectionView);
  };

  const {
    fields: sectionlitsFields,
    append: SectionApped,
    remove: SectionRemove,
  } = useFieldArray({
    control,
    name: "sectionItems",
  });

  const handleAddSection = () => {
    SectionApped({
      itemsList: [{ itemName: "" }],
      price: "",
    });
  };

  const handleRemoveSection = (index) => {
    SectionRemove(index);
  };

  //

  const hasAppendedd = useRef(false);

  useEffect(() => {
    if (!hasAppendedd.current && sectionlitsFields.length === 0) {
      handleAddSection();

      hasAppendedd.current = true;
    }
  }, [sectionlitsFields, SectionApped]);



  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
        <div>
          <Breadcrumbs>
            <BreadcrumbItem>Menu</BreadcrumbItem>
            <BreadcrumbItem>
              <Link href="/quotations-list">Quotation</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              {supplementId
                ? "Supplementary Quotation"
                : quotaionsId
                  ? "Update Quotation"
                  : viewQuotationId
                    ? "View Quotation"
                    : reCreateID
                      ? "Re-create"
                      : "Create"}
            </BreadcrumbItem>
          </Breadcrumbs>
          <div className="invoice-wrapper mt-6">
            <div className="grid grid-cols-12 gap-6">
              <Card className="col-span-12">
                <CardHeader className="sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 text-xl font-medium text-default-700 whitespace-nowrap">
                    {supplementId
                      ? "Supplementary Quotation"
                      : quotaionsId
                        ? "Update Quotation"
                        : viewQuotationId
                          ? "View Quotation"
                          : reCreateID
                            ? "Re-create Quotation"
                            : "Create Quotation"}
                  </div>
                  {viewQuotationId ? (
                    <>
                      <Button
                        asChild
                        variant=""
                        className="text-xs font-semibold text-primary-500"
                        onClick={handleDownloadClick}
                        disabled={isLoadingPDFQuotation}
                      >
                        <Link href="#">
                          {isLoadingPDFQuotation ? (
                            <span className="text-white">Loading...</span>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5 ltr:mr-1.5 rtl:ml-1.5 text-white" />
                              <span className="text-white">Quotation PDF</span>
                            </>
                          )}
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between sm:w-auto gap-2">
                        <Button
                          className="border-default-300 group"
                          size="icon"
                          variant="outline"
                          type="button"
                          title="Reset"
                          onClick={handleReset}
                        >
                          <Icon
                            icon="heroicons:arrow-path"
                            className="w-5 h-5 text-default-300 group-hover:text-default-50 dark:group-hover:text-primary-foreground"
                          />
                        </Button>
                      </div>
                    </>
                  )}
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="w-full flex flex-wrap gap-4">
                    <div className="w-full flex justify-between gap-4">
                      <div className="w-full">
                        <Label htmlFor="quDateAndTime">Date</Label>
                        <div className="flex flex-col gap-2 w-full">
                          {/* <Controller
                            control={control}
                            name="quDateAndTime"
                            defaultValue=""
                            render={({ field }) => (
                              <Input
                                type="date"
                                placeholder="Date and Time"
                                size="lg"
                                id="quDateAndTime"
                                {...field}
                                readOnly={
                                  quotaionsId &&
                                    quotationData?.status === "Draft"
                                    ? false
                                    : quotaionsId &&
                                      quotationData?.status !== "Draft"
                                      ? true
                                      : viewQuotationId
                                        ? true
                                        : false
                                }
                              />
                            )}
                          /> */}
                          <Controller
                            control={control}
                            name="quDateAndTime"
                            render={({ field }) => (
                              <DatePicker
                                id="quDateAndTime"
                                dayPlaceholder="dd"
                                monthPlaceholder="mm"
                                yearPlaceholder="yyy"
                                clearIcon={null}
                                value={
                                  field.value
                                    ? new Date(field.value)
                                    : null
                                }
                                onChange={(date) =>
                                  field.onChange(
                                    date
                                      ? format(date, "yyyy-MM-dd")
                                      : ""
                                  )
                                }
                                format="dd-MM-yyyy"
                                className="w-full"
                                disabled={
                                  quotaionsId &&
                                    quotationData?.status === "Draft"
                                    ? false
                                    : quotaionsId &&
                                      quotationData?.status !== "Draft"
                                      ? true
                                      : viewQuotationId
                                        ? true
                                        : false
                                }
                              />
                            )}
                          />
                          {errors.quDateAndTime && (
                            <span className="text-red-700">
                              {errors.quDateAndTime.message}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-full">
                        <Label htmlFor="carPlateNumber">Car Plate Number</Label>
                        <div className="flex gap-2 w-full">
                          <Controller
                            control={control}
                            name="carPlateNumber"
                            defaultValue=""
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder="car plate number"
                                size="lg"
                                id="carPlateNumber"
                                {...field}
                                readOnly
                              />
                            )}
                          />
                        </div>
                        {/* {errors.quCustomer && (
                          <div className="text-red-500 mt-2">
                            {errors.quCustomer.message}
                          </div>
                        )} */}
                      </div>
                    </div>
                    <div className="w-full flex justify-between gap-4">
                      <div className="w-full">
                        <Label htmlFor="quInsuranceCom">
                          Insurance Company
                        </Label>
                        <div className="flex gap-2 w-full">
                          <Controller
                            name="quInsuranceCom"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <Select
                                className="react-select w-full"
                                classNamePrefix="select"
                                id="quInsuranceCom"
                                styles={styles}
                                options={InsuranseCompanyList}
                                onChange={(selectedOption) => {
                                  onChange(selectedOption.value);
                                }}
                                value={InsuranseCompanyList?.find(
                                  (option) => option.value === value
                                )}
                                isDisabled
                              />
                            )}
                          />
                        </div>
                        {/* {errors.quInsuranceCom && (
                          <div className="text-red-500 mt-2">
                            {errors.quInsuranceCom.message}
                          </div>
                        )} */}
                      </div>

                      <div className="w-full">
                        <Label htmlFor="quCar">Car</Label>
                        <div className="flex gap-2 w-full">
                          <Controller
                            name="quCar"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <Select
                                className="react-select w-full"
                                classNamePrefix="select"
                                id="quCar"
                                styles={styles}
                                options={CarList}
                                onChange={(selectedOption) => {
                                  onChange(selectedOption.value);
                                }}
                                value={CarList?.find(
                                  (option) => option.value === value
                                )}
                                isDisabled
                              />
                            )}
                          />
                        </div>
                        {/* {errors.quCar && (
                          <div className="text-red-500 mt-2">
                            {errors.quCar.message}
                          </div>
                        )} */}
                      </div>
                    </div>
                    <div className="w-full flex justify-between gap-4">
                      <div className="w-full">
                        <Label htmlFor="quCustomerCareRepresentative">
                          Customer Care Representative
                        </Label>
                        <div className="flex gap-2 w-full">
                          <Controller
                            name="quCustomerCareRepresentative"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <Select
                                className="react-select w-full"
                                classNamePrefix="select"
                                id="quCustomerCareRepresentative"
                                styles={styles}
                                options={CsrList}
                                onChange={(selectedOption) => {
                                  onChange(selectedOption.value);
                                }}
                                value={CsrList?.find(
                                  (option) => option.value === value
                                )}
                                // isDisabled={
                                //   (quotaionsId && quotationData?.status === 'Draft') ? false :
                                //     (quotaionsId && quotationData?.status !== 'Draft') ? true :
                                //       (viewQuotationId) ? true :
                                //         false
                                // }
                                isDisabled
                              />
                            )}
                          />
                        </div>
                        {errors.quCustomerCareRepresentative && (
                          <div className="text-red-500 mt-2">
                            {errors.quCustomerCareRepresentative.message}
                          </div>
                        )}
                      </div>
                      <div className="w-full">
                        <Label htmlFor="qudaystocomplete">
                          Days to complete
                        </Label>
                        <div className="flex flex-col gap-2 w-full">
                          <Controller
                            control={control}
                            name="qudaystocomplete"
                            defaultValue=""
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder="days to complete"
                                size="lg"
                                id="qudaystocomplete"
                                {...field}
                                readOnly={
                                  quotaionsId &&
                                    quotationData?.status === "Draft"
                                    ? false
                                    : quotaionsId &&
                                      quotationData?.status !== "Draft"
                                      ? true
                                      : viewQuotationId
                                        ? true
                                        : false
                                }
                              />
                            )}
                          />
                          {errors.qudaystocomplete && (
                            <span className="text-red-700">
                              {errors.qudaystocomplete.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex justify-between gap-4">
                      <div className="w-1/2">
                        <Label htmlFor="quJobCard">Job Card</Label>
                        <div className="flex gap-2 w-full">
                          {/* <Controller
                            control={control}
                            name="quJobCard"
                            defaultValue=""
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder="Job Card Number"
                                size="lg"
                                id="quJobCard"
                                {...field}
                                readOnly
                              />
                            )}
                          /> */}
                          <Controller
                            name="quJobCard"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <Select
                                className="react-select w-full"
                                classNamePrefix="select"
                                id="quJobCard"
                                styles={styles}
                                options={JobList}
                                onChange={(selectedOption) => {
                                  onChange(selectedOption.value);
                                }}
                                value={JobList?.find(
                                  (option) => option.value === value
                                )}
                                isDisabled
                              />
                            )}
                          />
                        </div>
                        {errors.quJobCard && (
                          <div className="text-red-500 mt-2">
                            {errors.quJobCard.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* {//new add} */}

                    {/* <div className="w-full flex justify-between gap-4">
                      <div className="w-full flex justify-between items-center">
                        <Label htmlFor="toggleView" className="text-xl">
                          {isSectionView ? "Sections" : "Items"}
                        </Label>
                        <Button
                          className="ml-auto"
                          type="button"
                          variant="outline"
                          onClick={toggleView}
                        >
                          {isSectionView
                            ? "Switch to Items"
                            : "Switch to Sections"}
                        </Button>
                      </div>
                    </div> */}

                    <div className="w-full flex justify-between gap-4">
                      <div className="w-full flex justify-start items-center gap-2">
                        <Label htmlFor="toggleView" className="text-xl">
                          {isSectionView ? "Sections" : "Items"}
                        </Label>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isSectionView}
                            onClick={() => {
                              if (!viewQuotationId) {
                                if (
                                  (quotaionsId &&
                                    quotationData?.status === "Draft") ||
                                  supplementId ||
                                  jobCardI1d ||
                                  reCreateID
                                ) {
                                  toggleView();
                                }
                              }
                            }}
                            readOnly={
                              quotaionsId && quotationData?.status === "Draft"
                                ? false
                                : quotaionsId &&
                                  quotationData?.status !== "Draft"
                                  ? true
                                  : viewQuotationId
                                    ? true
                                    : false
                            }
                          />
                          <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary/80"></div>
                        </label>
                      </div>
                    </div>
                    {isSectionView && (
                      <div className="w-full flex justify-between gap-4">
                        <div className="w-full">
                          <Label htmlFor="add List" className="text-xl">
                            Add Section
                          </Label>
                          <div className="flex flex-wrap gap-2 justify-start items-start w-full p-1">
                            {sectionlitsFields.map((section, index) => (
                              <div
                                key={section.id}
                                className="flex flex-col gap-2 w-full"
                              >
                                <SectionAddItem
                                  control={control}
                                  errors={errors}
                                  index={index}
                                  handleAddSection={handleAddSection}
                                  handleRemoveSection={handleRemoveSection}
                                  sectionlitsFields={sectionlitsFields}
                                  quotationData={quotationData}
                                />
                              </div>
                            ))}
                            {/* <SectionAddItem
                                
                                control={control}
                                errors={errors}
                              /> */}
                          </div>
                        </div>
                      </div>
                    )}

                    {isSectionView && (
                      <div className="flex flex-col gap-4">
                        <div className="w-full flex items-center">
                          <Label htmlFor="totalSectionParts" className="w-1/2">
                            Parts Total :
                          </Label>
                          <div className="flex flex-col gap-2 w-full">
                            <Controller
                              control={control}
                              name="totalSectionParts"
                              defaultValue=""
                              render={({ field }) => (
                                <Input
                                  type="text"
                                  placeholder="Total Parts"
                                  size="lg"
                                  id="totalSectionParts"
                                  {...field}
                                  readOnly={
                                    quotaionsId &&
                                      quotationData?.status === "Draft"
                                      ? false
                                      : quotaionsId &&
                                        quotationData?.status !== "Draft"
                                        ? true
                                        : viewQuotationId
                                          ? true
                                          : false
                                  }
                                />
                              )}
                            />
                            {errors.totalSectionParts && (
                              <span className="text-red-700">
                                {errors.totalSectionParts.message}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="w-full flex items-center">
                          <Label htmlFor="totalSectionParts" className="w-1/2">
                            Labor Total :
                          </Label>
                          <div className="flex flex-col gap-2 w-full">
                            <Controller
                              control={control}
                              name="totalLaborParts"
                              defaultValue=""
                              render={({ field }) => (
                                <Input
                                  type="text"
                                  placeholder="Total Labor"
                                  size="lg"
                                  id="totalLaborParts"
                                  {...field}
                                  readOnly={
                                    quotaionsId &&
                                      quotationData?.status === "Draft"
                                      ? false
                                      : quotaionsId &&
                                        quotationData?.status !== "Draft"
                                        ? true
                                        : viewQuotationId
                                          ? true
                                          : false
                                  }
                                />
                              )}
                            />
                            {errors.totalLaborParts && (
                              <span className="text-red-700">
                                {errors.totalLaborParts.message}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="w-full flex items-center">
                          <Label htmlFor="totalGrandParts" className="w-1/2">
                            Ground Total :
                          </Label>
                          <div className="flex flex-col gap-2 w-full">
                            <Controller
                              control={control}
                              name="totalGrandParts"
                              defaultValue=""
                              render={({ field }) => (
                                <Input
                                  type="text"
                                  placeholder="Grand Total"
                                  size="lg"
                                  id="totalGrandParts"
                                  {...field}
                                  readOnly={
                                    quotaionsId &&
                                      quotationData?.status === "Draft"
                                      ? false
                                      : quotaionsId &&
                                        quotationData?.status !== "Draft"
                                        ? true
                                        : viewQuotationId
                                          ? true
                                          : false
                                  }
                                />
                              )}
                            />
                            {errors.totalGrandParts && (
                              <span className="text-red-700">
                                {errors.totalGrandParts.message}
                              </span>
                            )}

                            {/* <Input
                              type="text"
                              value={subtotal.toFixed(2)}
                              placeholder="Grand Total"
                              size="lg"
                              id="totalGrandParts"
                              readOnly
                              className="cursor-not-allowed"
                            /> */}
                          </div>
                        </div>
                      </div>
                    )}

                    {!isSectionView && (
                      <div className="w-full flex justify-between gap-4">
                        <div className="w-1/2">
                          <Label htmlFor="add List" className="text-xl">
                            Add List
                          </Label>
                          <div className="flex flex-col gap-2 justify-start items-center w-full">
                            {fields.map((item, index) => (
                              <div
                                key={item.id}
                                className="w-full flex flex-col justify-between gap-4"
                              >
                                <div className="w-full flex justify-between gap-4">
                                  <div className="w-1/2">
                                    <Label
                                      htmlFor={`itemList[${index}].itemName`}
                                    >
                                      Item Name
                                    </Label>
                                    <div className="flex flex-col gap-2 w-full">
                                      <Controller
                                        control={control}
                                        name={`itemList[${index}].itemName`}
                                        render={({ field }) => (
                                          <Input
                                            type="text"
                                            placeholder="Item name"
                                            size="lg"
                                            {...field}
                                            readOnly={
                                              quotaionsId &&
                                                quotationData?.status === "Draft"
                                                ? false
                                                : quotaionsId &&
                                                  quotationData?.status !==
                                                  "Draft"
                                                  ? true
                                                  : viewQuotationId
                                                    ? true
                                                    : false
                                            }
                                          />
                                        )}
                                      />
                                      {errors.itemList?.[index]?.itemName && (
                                        <span className="text-red-700">
                                          {
                                            errors.itemList[index].itemName
                                              .message
                                          }
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="w-1/2">
                                    <Label
                                      htmlFor={`itemList[${index}].itemPrice`}
                                    >
                                      Item Price
                                    </Label>
                                    <div className="flex flex-col gap-2 w-full">
                                      <Controller
                                        control={control}
                                        name={`itemList[${index}].itemPrice`}
                                        render={({ field }) => (
                                          <Input
                                            type="text"
                                            placeholder="Item price"
                                            size="lg"
                                            {...field}
                                            readOnly={
                                              quotaionsId &&
                                                quotationData?.status === "Draft"
                                                ? false
                                                : quotaionsId &&
                                                  quotationData?.status !==
                                                  "Draft"
                                                  ? true
                                                  : viewQuotationId
                                                    ? true
                                                    : false
                                            }
                                          />
                                        )}
                                      />
                                      {errors.itemList?.[index]?.itemPrice && (
                                        <span className="text-red-700">
                                          {
                                            errors.itemList[index].itemPrice
                                              .message
                                          }
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {viewQuotationId ? (
                                    <></>
                                  ) : quotaionsId &&
                                    quotationData?.status !== "Draft" ? (
                                    <></>
                                  ) : (
                                    <>
                                      {index === fields.length - 1 ? (
                                        <>
                                          {index != 0 && (
                                            <Button
                                              className="border-default-300 mt-5"
                                              size="icon"
                                              variant="outline"
                                              type="button"
                                              title="Remove"
                                              onClick={() => remove(index)}
                                            >
                                              <Icon
                                                icon="heroicons:trash"
                                                className="w-5 h-5 text-default-300"
                                              />
                                            </Button>
                                          )}
                                          <Button
                                            className="border-default-300 mt-5"
                                            size="icon"
                                            variant="outline"
                                            type="button"
                                            title="Add Item"
                                            onClick={() =>
                                              append({
                                                itemName: "",
                                                itemPrice: "",
                                              })
                                            }
                                          >
                                            <FiPlus className="w-5 h-5 text-default-300" />
                                          </Button>
                                        </>
                                      ) : (
                                        <Button
                                          className="border-default-300 mt-5"
                                          size="icon"
                                          variant="outline"
                                          type="button"
                                          title="Remove"
                                          onClick={() => remove(index)}
                                        >
                                          <Icon
                                            icon="heroicons:trash"
                                            className="w-5 h-5 text-default-300"
                                          />
                                        </Button>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {quotaionsId && quotationData?.status === "Draft" ? (
                      <></> // Render nothing if quotaionsId exists and quotationData.status is 'Draft'
                    ) : (
                      // Render the status section if jobCardI1d, reCreateID, and supplementId are all falsy
                      !jobCardI1d &&
                      !reCreateID &&
                      !supplementId && (
                        <div className="w-full flex justify-between gap-4">
                          <div className="w-[20rem]">
                            <Label htmlFor="startDate" className="font-bold">
                              Status
                            </Label>
                            <div className="flex gap-2 w-full">
                              <Controller
                                name="quStatus"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                  <Select
                                    className="react-select w-full"
                                    classNamePrefix="select"
                                    id="quStatus"
                                    options={getStatusList()}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    onChange={(selectedOption) => {
                                      onChange(selectedOption.value);
                                      handleStatusUpdate(selectedOption.value);
                                    }}
                                    value={AllOptions?.find(
                                      (option) => option.value === value
                                    )}
                                    isDisabled={
                                      !isSelectEnabled || !isStatusEditable
                                    }
                                  />
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    )}

                    {quStatus === "Approved" && (
                      <>
                        {quotationData?.status === "Approved" ? (
                          <></>
                        ) : (
                          <>
                            <div className="flex w-full flex-col">
                              <div className="w-1/2">
                                <Label>Add LPO</Label>
                                <Controller
                                  name="quoLpo"
                                  control={control}
                                  render={({ field: { value, onChange } }) => (
                                    <FileUploaderSingle
                                      value={value}
                                      onChange={onChange}
                                      height={150}
                                      width={150}
                                      name="quoLpo"
                                      errors={errors}
                                      resetTrigger={resetTrigger}
                                      readOnly={"ture"}
                                      pdf={true}
                                    />
                                  )}
                                />
                              </div>
                            </div>
                            <div className="w-full">
                              <Label htmlFor="qudaystocomplete">
                                Days to complete
                              </Label>
                              <div className="flex flex-col gap-2 w-1/2">
                                <Controller
                                  control={control}
                                  name="qudaystocomplete"
                                  defaultValue=""
                                  render={({ field }) => (
                                    <Input
                                      type="text"
                                      placeholder="days to complete"
                                      size="lg"
                                      id="qudaystocomplete"
                                      {...field}
                                    // readOnly={
                                    //   (quotaionsId && quotationData?.status === 'Draft') ? false :
                                    //     (quotaionsId && quotationData?.status !== 'Draft') ? true :
                                    //       (viewQuotationId) ? true :
                                    //         false
                                    // }
                                    />
                                  )}
                                />
                                {errors.qudaystocomplete && (
                                  <span className="text-red-700">
                                    {errors.qudaystocomplete.message}
                                  </span>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                  {/* <div className="flex items-center h-5 mt-4">

                    <Controller
                      name="noClaimNumber"
                      control={control}
                      render={({ field }) => (

                        <Checkbox
                          id="isMailSent"
                          {...field}
                          checked={field.value}
                         // onCheckedChange={(checked) => field.onChange(checked)}
                          disabled={
                            (quotaionsId && quotationData?.status === 'Draft') ? false :
                              (quotaionsId && quotationData?.status !== 'Draft') ? true :
                                (viewQuotationId) ? true :
                                  false
                          }
                        />

                      )}
                    />
                    <label htmlFor="isMailSent" className="ml-2">
                      Do you want to send an email to the insurance company?
                    </label>
                  </div> */}

                  <div className="flex items-center h-5 mt-4">
                    <Controller
                      name="isMailSent"
                      control={control}
                      render={({ field }) => (
                        <input
                          id="isMailSent"
                          type="checkbox"
                          className="border-gray-200 h-6 w-6 disabled:checked:bg-[#30D5C7] accent-[#30D5C7] checked:bg-[#30D5C7] rounded-sm text-white mr-2"
                          {...field}
                          checked={field.value}
                          disabled={
                            quotaionsId && quotationData?.status === "Draft"
                              ? false
                              : quotaionsId && quotationData?.status !== "Draft"
                                ? true
                                : viewQuotationId
                                  ? true
                                  : false
                          }
                        />
                      )}
                    />
                    <label htmlFor="isMailSent">
                      Do you want to send an email to the insurance company?
                    </label>
                  </div>
                  <div>
                    <Label
                      htmlFor="quoNotes"
                      className="text-sm font-medium text-default-600 mb-1"
                    >
                      Note:
                    </Label>

                    <div className="flex flex-col gap-2 w-full">
                      <Controller
                        control={control}
                        name="quoNotes"
                        render={({ field }) => (
                          <Textarea
                            type="text"
                            id="quoNotes"
                            className="rounded h-10"
                            placeholder="type note..."
                            {...field}
                            readOnly={
                              quotaionsId && quotationData?.status === "Draft"
                                ? false
                                : quotaionsId &&
                                  quotationData?.status !== "Draft"
                                  ? true
                                  : viewQuotationId
                                    ? true
                                    : false
                            }
                          />
                        )}
                      />
                      {errors?.quoNotes && (
                        <span className="text-red-700">
                          {errors?.quoNotes.message}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>

                {QutationData?.lpo?.length > 0 && (
                  <div className="mx-6 my-4 flex flex-wrap justify-between gap-4">
                    <div className="w-full lg:w-full space-y-4">
                      <Card className="border">
                        <CardHeader className="flex flex-row items-center  gap-3 font-bold">
                          <div className="flex flex-wrap items-center w-full justify-between">
                            <div>LPO</div>
                          </div>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-4 justify-between w-full">
                          <div className="w-full lg:w-full space-y-4">
                            <BasicDataTable
                              columns={columns}
                              data={QutationData?.lpo}
                              hiddenOnly={true}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                <CardFooter className="flex justify-between gap-4 flex-wrap">
                  {viewQuotationId ? (
                    <>
                      <div className="flex justify-center items-center gap-10">
                        <Button
                          type="button"
                          className="group hover:bg-default-200 hover:text-default-900 text-xs font-semibold whitespace-nowrap"
                        >
                          <Link href="/quotations-list">Back</Link>
                        </Button>

                        {viewQuotationId &&
                          quotationData?.status !== "Approved" &&
                          quStatus === "Approved" && (
                            <Button
                              className="ml-auto"
                              type="submit"
                              variant="primary"
                              disabled={loading}
                            >
                              {loading ? "Loading..." : "Update"}
                            </Button>
                          )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-end gap-3">
                        <Button
                          className="ml-auto"
                          type="submit"
                          variant="primary"
                          disabled={loading}
                          onClick={() => {
                            setSnewtatus("Draft");
                          }}
                        >
                          {loading ? "Loading..." : "Save Draft"}
                        </Button>
                        <Button
                          className="ml-auto"
                          type="submit"
                          variant="primary"
                          disabled={loading}
                          onClick={() => {
                            setSnewtatus("Submitted");
                          }}
                        >
                          {loading
                            ? "Loading..."
                            : quotaionsId
                              ? quotationData?.status === "Draft"
                                ? "Submit"
                                : "Update"
                              : reCreateID
                                ? "Re-create"
                                : "Create"}
                        </Button>
                      </div>
                    </>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </form>

      {isTotalLossExModalOpen && (
        <QuotationLossModel
          onClose={handleCommentModalClose}
          updateQuotationMutation={updateQuotationMutation}
        // handleAddCoomitSubmit={handleAddCoomitSubmit}
        />
      )}
    </>
  );
};

export default CreateQuotation;
