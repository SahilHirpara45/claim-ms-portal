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
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Select from "react-select";

import { getUserMeAction } from "@/action/auth-action";
import { getCars } from "@/action/companyAction/car-action";
import { getCSREmployeeAction } from "@/action/companyAction/employee-action";
import { getGarrageInsuranceCompanies } from "@/action/companyAction/insurance-action";
import { getCustomerListAction } from "@/action/employeeAction/customer-action";
import { getJobCardListAction } from "@/action/employeeAction/jobcard-action";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { statusOptionsCSR, statusOptionsCompany } from "../../constants";
import { useAdditionalQuotation } from "../hook/useAdditionalQuotation";
import { FiPlus } from "react-icons/fi";
import SectionAddItemAd from "./SectionAddItemAd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { additionalQuotationFormSchemaSection } from "../schema/additionalQuotationSchema";
import { updateAdQuotation } from "../../../../action/quotationAction/quotation-action";
import toast from "react-hot-toast";
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

const AdditionalQuotation = () => {
  const [resetTrigger, setResetTrigger] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [subtotal, setSubtotal] = useState(0);

  const jobCardId = params?.jobcardId;
  const viewAdQuId = params?.viewAdQuId;
  const quotaionsId = params?.quotaionsId;
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

  const AllOptions = [
    { label: "Approved", value: "Approved" },
    { label: "Pending", value: "Pending" },
    { label: "Declined", value: "Declined" },
    { label: "Draft", value: "Draft" },
    { label: "Completed", value: "Completed" },
  ];

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

  const { initialValues, schema, submit, setSnewtatus, quotationData } =
    useAdditionalQuotation();
  const [isFocused, setIsFocused] = useState(false);
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
    resolver: zodResolver(
      isSectionView ? additionalQuotationFormSchemaSection : schema
    ),
  });

  const totalLaborParts = watch("totalLaborParts");
  const totalSectionParts = watch("totalSectionParts");

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

  const yyy = watch();

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

  ///

  //////////////////

  ///

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

  const updateAdQuotationMutation = useMutation({
    mutationKey: ["updateAdQuotationMutation"],
    mutationFn: async (data) => {
      const quotaionsId = params?.quotaionsId;
      const viewAdQuId = params?.viewAdQuId;
      return await updateAdQuotation(viewAdQuId, data);
    },
    onSuccess: (response) => {
      toast.success(response?.message);
    },
    onError: (error) => {
      toast.error(error?.data?.message);
    },
  });

  const handleStatusUpdate = (newStatus) => {
    const payload = {
      status: newStatus,
    };

    if (!jobCardId) {
      updateAdQuotationMutation.mutate(payload);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
        <div>
          <Breadcrumbs>
            <BreadcrumbItem>Menu</BreadcrumbItem>
            <BreadcrumbItem>
              <Link href="/quotations-list">Quotation</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>Additional Quotation</BreadcrumbItem>
          </Breadcrumbs>
          <div className="invoice-wrapper mt-6">
            <div className="grid grid-cols-12 gap-6">
              <Card className="col-span-12">
                <CardHeader className="sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 text-xl font-medium text-default-700 whitespace-nowrap">
                    {quotaionsId
                      ? "Update Additional Quotation"
                      : viewAdQuId
                        ? "View Additional Quotation"
                        : "Create Additional Quotation"}
                  </div>

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
                                readOnly={viewAdQuId}
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
                                disabled={viewAdQuId}
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
                      {/* <div className="w-full">
                        <Label htmlFor="quCustomer">Customer</Label>
                        <div className="flex gap-2 w-full">
                          <Controller
                            name="quCustomer"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <Select
                                className="react-select w-full"
                                classNamePrefix="select"
                                id="quCustomer"
                                styles={styles}
                                options={CustomerList}
                                onChange={(selectedOption) => {
                                  onChange(selectedOption.value);
                                }}
                                value={CustomerList?.find(
                                  (option) => option.value === value
                                )}
                                isDisabled
                              />
                            )}
                          />
                        </div>
                      </div> */}
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
                        <Label htmlFor="quJobCard">Job Card</Label>
                        <div className="flex gap-2 w-full">
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
                      </div>
                    </div>

                    <div className="w-full flex justify-between gap-4">
                      <div className="w-1/2">
                        <Label htmlFor="qudaystocomplete">
                          Days to complete
                        </Label>
                        <div className="flex gap-2 w-full">
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
                                readOnly={viewAdQuId}
                              />
                            )}
                          />
                        </div>
                        {errors.qudaystocomplete && (
                          <span className="text-red-700">
                            {errors.qudaystocomplete.message}
                          </span>
                        )}
                      </div>
                    </div>

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
                              if (!viewAdQuId) {
                                toggleView();
                              }
                            }}
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
                                <SectionAddItemAd
                                  control={control}
                                  errors={errors}
                                  index={index}
                                  handleAddSection={handleAddSection}
                                  handleRemoveSection={handleRemoveSection}
                                  sectionlitsFields={sectionlitsFields}
                                />
                              </div>
                            ))}
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
                                  readOnly={viewAdQuId}
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
                                  readOnly={viewAdQuId}
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
                                  readOnly={viewAdQuId}
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
                                            readOnly={viewAdQuId}
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
                                            readOnly={viewAdQuId}
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

                                  {viewAdQuId ? (
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
                      <></>
                    ) : (
                      <></>
                    )}
                    {viewAdQuId && (
                      <>
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
                                    options={AllOptions}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    onChange={(selectedOption) => {
                                      onChange(selectedOption.value);
                                      handleStatusUpdate(selectedOption.value);
                                    }}
                                    value={AllOptions?.find(
                                      (option) => option.value === value
                                    )}
                                  />
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  {/* <div className="flex items-center h-5 mt-4">
                    <Controller
                      name="isMailSent"
                      control={control}
                      render={({ field }) => (
                        <input
                          id="isMailSent"
                          type="checkbox"
                          className="border-gray-200 h-6 w-6 disabled:opacity-50 accent-[#30D5C7] checked:bg-[#30D5C7] rounded-sm text-white mr-2"
                          {...field}
                          checked={field.value || false}
                          onChange={(e) => {
                            // handleCheckboxChange(e);
                            field.onChange(e);
                          }}
                        />
                      )}
                    />
                    <label htmlFor="isMailSent">
                      Do you want to send an email to the insurance company?
                    </label>
                  </div> */}
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
                            readOnly={viewAdQuId}
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

                <CardFooter className="flex justify-between gap-4 flex-wrap">
                  {viewAdQuId && (
                    <Button
                      type="button"
                      onClick={() => router.back()}
                      className="group hover:bg-default-200 hover:text-default-900 text-xs font-semibold whitespace-nowrap"
                    >
                      Back
                    </Button>
                  )}

                  {!viewAdQuId && (
                    <>
                      <div className="flex items-end gap-3">
                        <Button
                          onClick={() => {
                            setSnewtatus("Draft");
                          }}
                          className="ml-auto"
                          type="submit"
                          variant="primary"
                        >
                          Save Draft
                        </Button>
                        <Button
                          onClick={() => {
                            setSnewtatus("Pending");
                          }}
                          className="ml-auto"
                          type="submit"
                          variant="primary"
                        >
                          Create
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
    </>
  );
};

export default AdditionalQuotation;
