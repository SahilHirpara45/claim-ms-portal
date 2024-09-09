"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import Flatpickr from "react-flatpickr";
import { Label } from "@/components/ui/label";
import { Euro, Plus, Trash2, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useFieldArray } from "react-hook-form";

import { useInvoices } from "../hook";
import { useEffect, useRef, useState } from "react";
import CustomSelect from "react-select";

const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

export const statusOptionsTech = [
  { label: "Service Invoice", value: "Pending" },
];

const CreateInvoice = () => {
  //

  const { initialValues, loading, schema, submit } = useInvoices();

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
    resolver: zodResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "itemList",
  });

  const hasAppended = useRef(false);

  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    if (!hasAppended.current && fields.length === 0) {
      append({ itemName: "", itemPrice: "", itemQty: "" });
      hasAppended.current = true;
    }
  }, [fields, append]);

  const yyy = watch();

  useEffect(() => {
    let total = 0;
    fields.forEach((item, index) => {
      const qty = parseFloat(watch(`itemList[${index}].itemQty`) || 0);
      const price = parseFloat(watch(`itemList[${index}].itemPrice`) || 0);
      total += qty * price;
    });
    setSubtotal(total);
  }, [yyy, fields, watch]);
  //
  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className="w-full">
        <Breadcrumbs>
          <BreadcrumbItem>Create Invoice</BreadcrumbItem>
        </Breadcrumbs>
        <div className="invoice-wrapper mt-6 w-full">
          <div className="grid grid-cols-12 gap-6 w-full">
            <Card className="col-span-12  w-full">
              <CardHeader className="sm:flex-row sm:items-center gap-3">
                <div className="flex-1 text-xl font-medium text-default-700 whitespace-nowrap">
                  Create Invoice
                </div>
                <div className="flex-none flex items-center gap-4">
                  {/* <Button>
                    Save As PDF
                    <Icon
                      icon="heroicons:document-text"
                      className="w-5 h-5 ltr:ml-2 rtl:mr-2"
                    />
                  </Button> */}
                  <Button
                    className="border-default-300 group"
                    size="icon"
                    variant="outline"
                  >
                    <Icon
                      icon="heroicons:printer"
                      className="w-5 h-5 text-default-300 group-hover:text-default-50 dark:group-hover:text-primary-foreground"
                    />
                  </Button>
                  <Button
                    className="border-default-300 group"
                    size="icon"
                    variant="outline"
                  >
                    <Icon
                      icon="heroicons:arrow-path"
                      className="w-5 h-5 text-default-300 group-hover:text-default-50 dark:group-hover:text-primary-foreground"
                    />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[250px]">
                    <div className="w-full md:w-[248px] space-y-2">
                      <div className="flex flex-col gap-2 w-full">
                        <Controller
                          name="invocieType"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <CustomSelect
                              className="react-select w-full"
                              classNamePrefix="select...."
                              id="invocieType"
                              styles={styles}
                              options={statusOptionsTech}
                              onChange={(selectedOption) => {
                                onChange(selectedOption.value);
                              }}
                              value={statusOptionsTech?.find(
                                (option) => option.value === value
                              )}
                              placeholder="Invoice for"
                            />
                          )}
                        />
                        {errors.invocieType && (
                          <span className="text-red-700">
                            {errors.invocieType.message}
                          </span>
                        )}
                      </div>

                      {/* <div className="flex flex-col gap-2 w-full">
                        <Controller
                          control={control}
                          name="invocieId"
                          render={({ field }) => (
                            <Input
                              type="text"
                              placeholder="Invoice ID"
                              size="lg"
                              id="invocieId"
                              {...field}
                            />
                          )}
                        />
                        {errors.invocieId && (
                          <span className="text-red-700">
                            {errors.invocieId.message}
                          </span>
                        )}
                      </div> */}

                      <div className="flex flex-col gap-2 w-full">
                        <Controller
                          control={control}
                          name="invocieDate"
                          render={({ field }) => (
                            <Input
                              type="date"
                              placeholder="Invoice Date"
                              size="lg"
                              id="invocieDate"
                              {...field}
                            />
                          )}
                        />
                        {errors.invocieDate && (
                          <span className="text-red-700">
                            {errors.invocieDate.message}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 w-full">
                        <Controller
                          control={control}
                          name="invocieDueDate"
                          render={({ field }) => (
                            <Input
                              type="date"
                              placeholder="due date"
                              size="lg"
                              id="invocieDueDate"
                              {...field}
                            />
                          )}
                        />
                        {errors.invocieDueDate && (
                          <span className="text-red-700">
                            {errors.invocieDueDate.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-between flex-wrap gap-4">
                  <div className="w-full 2xl:max-w-[400px] space-y-2">
                    <div className="text-base font-semibold text-default-800 pb-1">
                      Billing From:
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <Controller
                        control={control}
                        name="billFCn"
                        render={({ field }) => (
                          <Input
                            type="text"
                            placeholder="Company Name"
                            size="lg"
                            id="billFCn"
                            {...field}
                            readOnly
                          />
                        )}
                      />
                      {errors.billFCn && (
                        <span className="text-red-700">
                          {errors.billFCn.message}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <Controller
                        control={control}
                        name="billFCnEmail"
                        render={({ field }) => (
                          <Input
                            type="text"
                            placeholder="Company Email"
                            size="lg"
                            id="billFCnEmail"
                            {...field}
                            readOnly
                          />
                        )}
                      />
                      {errors.billFCnEmail && (
                        <span className="text-red-700">
                          {errors.billFCnEmail.message}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <Controller
                        control={control}
                        name="billFCnPhone"
                        render={({ field }) => (
                          <Input
                            type="text"
                            placeholder="Company Phone No"
                            size="lg"
                            id="billFCnPhone"
                            {...field}
                            readOnly
                          />
                        )}
                      />
                      {errors.billFCnPhone && (
                        <span className="text-red-700">
                          {errors.billFCnPhone.message}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <Controller
                        control={control}
                        name="billFCnAdd"
                        render={({ field }) => (
                          <Textarea
                            placeholder="Comapny Address"
                            id="billFCnAdd"
                            {...field}
                            readOnly
                          />
                        )}
                      />
                      {errors.billFCnAdd && (
                        <span className="text-red-700">
                          {errors.billFCnAdd.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full 2xl:max-w-[400px] space-y-2">
                    <div className="text-base font-semibold text-default-800 pb-1">
                      Billing To:
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <Controller
                        control={control}
                        name="billToCn"
                        render={({ field }) => (
                          <Input
                            type="text"
                            placeholder="Company Name"
                            size="lg"
                            id="billToCn"
                            {...field}
                          />
                        )}
                      />
                      {errors.billToCn && (
                        <span className="text-red-700">
                          {errors.billToCn.message}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <Controller
                        control={control}
                        name="billToCnEmail"
                        render={({ field }) => (
                          <Input
                            type="text"
                            placeholder="Company Email"
                            size="lg"
                            id="billToCnEmail"
                            {...field}
                          />
                        )}
                      />
                      {errors.billToCnEmail && (
                        <span className="text-red-700">
                          {errors.billToCnEmail.message}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <Controller
                        control={control}
                        name="billToCnPhone"
                        render={({ field }) => (
                          <Input
                            type="text"
                            placeholder="Company Phone No"
                            size="lg"
                            id="billToCnPhone"
                            {...field}
                          />
                        )}
                      />
                      {errors.billToCnPhone && (
                        <span className="text-red-700">
                          {errors.billToCnPhone.message}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <Controller
                        control={control}
                        name="billToCnAdd"
                        render={({ field }) => (
                          <Textarea
                            placeholder="Comapny Address"
                            id="billToCnAdd"
                            {...field}
                          />
                        )}
                      />
                      {errors.billToCnAdd && (
                        <span className="text-red-700">
                          {errors.billToCnAdd.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="border border-default-300 rounded-md mt-9">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-default-600 uppercase">
                            Item
                          </TableHead>
                          <TableHead className="text-default-600 uppercase">
                            Quantity
                          </TableHead>
                          <TableHead className="text-default-600 uppercase">
                            Rate
                          </TableHead>
                          <TableHead className="text-default-600 uppercase text-end pr-7">
                            Total
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="[&_tr:last-child]:border-1">
                        {fields.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell className="min-w-[220px] w-full max-w-[432px]">
                              <Controller
                                control={control}
                                name={`itemList[${index}].itemName`}
                                render={({ field }) => (
                                  <Input
                                    type="text"
                                    placeholder=" item name "
                                    {...field}
                                    className={`text-default-800 rounded ${
                                      errors.itemList?.[index]?.itemName
                                        ? "border-red-700"
                                        : ""
                                    }`}
                                  />
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="max-w-[130px] flex">
                                <Controller
                                  control={control}
                                  name={`itemList[${index}].itemQty`}
                                  render={({ field }) => (
                                    <Input
                                      type="text"
                                      placeholder=""
                                      {...field}
                                      className={`w-[70px] appearance-none accent-transparent rounded ltr:rounded-r-none ltr:border-r-0 rtl:rounded-l-none rtl:border-l-0 border-default-300 ${
                                        errors.itemList?.[index]?.itemQty
                                          ? "border-red-700"
                                          : ""
                                      }`}
                                    />
                                  )}
                                />

                                <Select className="ltr:rounded-l-none ltr:border-l-[0px] rtl:rounded-r-none rtl:border-r-[0px] text-xs">
                                  <SelectTrigger className="rounded ltr:rounded-l-none rtl:rounded-r-none h-9  pr-1 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:mt-1 ">
                                    <SelectValue placeholder="pcs" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pcs">pcs</SelectItem>
                                    {/* <SelectItem value="kg">kg</SelectItem> */}
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-[130px] flex">
                                <Controller
                                  control={control}
                                  name={`itemList[${index}].itemPrice`}
                                  render={({ field }) => (
                                    <Input
                                      type="text"
                                      {...field}
                                      className={`w-[70px] appearance-none accent-transparent rounded ltr:rounded-r-none ltr:border-r-0 rtl:rounded-l-none rtl:border-l-0 border-default-300 ${
                                        errors.itemList?.[index]?.itemPrice
                                          ? "border-red-700"
                                          : ""
                                      }`}
                                    />
                                  )}
                                />

                                <Select
                                  className={`ltr:rounded-l-none ltr:border-l-[0px] rtl:rounded-r-none rtl:border-r-[0px] text-xs border ${
                                    errors.itemList?.[index]?.itemPrice
                                      ? "border-red-700"
                                      : "border-default-300"
                                  }`}
                                >
                                  <SelectTrigger className="rounded ltr:rounded-l-none rtl:rounded-r-none h-9  pr-1 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:mt-1 ">
                                    <SelectValue placeholder="AED" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="AED">AED</SelectItem>
                                    {/* <SelectItem value="eur">eur</SelectItem>
                                    <SelectItem value="jpy">jpy</SelectItem> */}
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 ">
                                <Input
                                  value={(
                                    parseFloat(
                                      watch(`itemList[${index}].itemQty`) || 0
                                    ) *
                                    parseFloat(
                                      watch(`itemList[${index}].itemPrice`) || 0
                                    )
                                  ).toFixed(2)}
                                  className="text-end font-medium  text-default-900 rounded min-w-[140px]"
                                  readOnly
                                />
                                {fields.length != 1 && (
                                  <Trash2
                                    className="w-4 h-4 text-warning cursor-pointer"
                                    onClick={() => remove(index)}
                                  />
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 py-5 px-6">
                    <div className="flex-1">
                      <Button
                        type="button"
                        className="text-xs whitespace-nowrap"
                        onClick={() =>
                          append({
                            itemName: "",
                            itemPrice: "",
                            itemQty: "",
                          })
                        }
                      >
                        <Plus className="w-5 h-5 ltr:mr-2 rtl:ml-2" /> Add
                        Invoice Item
                      </Button>
                    </div>
                    {/* invoice info */}
                    <div className="flex-none flex flex-col sm:items-end gap-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                        <div className="text-sm font-medium text-default-600">
                          Sub Total:
                        </div>
                        <Input
                          value={subtotal.toFixed(2)}
                          className="text-xs font-medium  text-default-900 rounded w-full sm:w-[148px]"
                          readOnly
                        />
                      </div>
                      {/* <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                        <div className="text-sm font-medium text-default-600">
                          Coupon Discount:
                        </div>
                        <div className="w-full sm:w-[148px] flex">
                          <Input
                            className=" text-xs font-medium  text-default-900 appearance-none accent-transparent rounded ltr:rounded-r-none rtl:rounded-l-none rtl:border-l-0  ltr:border-r-0"
                            type="number"
                            defaultValue="34.36"
                          />
                          <Select className=" flex-none ltr:rounded-l-none rtl:rounded-r-none rtl:rounded-l-md rtl:border-r-0  ltr:border-l-0 text-xs">
                            <SelectTrigger className="w-14 rounded ltr:rounded-l-none rtl:rounded-r-none h-9 pr-1 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:mt-1">
                              <SelectValue placeholder="$" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="$">$</SelectItem>
                              <SelectItem value="eur">
                                <Euro className="w-3 h-3" />
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div> */}
                      {/* <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                        <div className="text-sm font-medium text-default-600">
                          Tax:
                        </div>
                        <div className="w-full sm:w-[148px] flex">
                          <Input
                            className=" text-xs font-medium  text-default-900 appearance-none accent-transparent rounded ltr:rounded-r-none rtl:rounded-l-none rtl:border-l-0  ltr:border-r-0"
                            type="number"
                            defaultValue="0.82"
                          />
                          <Select className="rounded-l-none border-l-[0px] text-xs">
                            <SelectTrigger className="w-14 rounded ltr:rounded-l-none rtl:rounded-r-none h-9 pr-1 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:mt-1">
                              <SelectValue placeholder="%" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="%">%</SelectItem>
                              <SelectItem value="flat">$</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div> */}
                      {/* <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                        <div className="text-sm font-medium text-default-600">
                          Shipping:
                        </div>
                        <Input
                          defaultValue="$14.12"
                          className="text-xs font-medium  text-default-900 rounded w-full sm:w-[148px]"
                        />
                      </div> */}
                      {/* <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                        <div className="text-sm font-medium text-default-600">
                          Due Till Date:
                        </div>
                        <Input
                          defaultValue="$0.00"
                          className="text-xs font-medium  text-default-900 rounded w-full sm:w-[148px]"
                        />
                      </div> */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                        <div className="text-sm font-medium text-default-600">
                          Total:
                        </div>
                        <Input
                          value={subtotal.toFixed(2)}
                          className="text-xs font-medium  text-default-900 rounded w-full sm:w-[148px]"
                          readOnly
                        />
                      </div>
                      {/* <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                        <div className="text-sm font-medium text-default-600">
                          Amount Paid:
                        </div>
                        <Input
                          defaultValue="$1000.00"
                          className="text-xs font-medium  text-default-900 rounded w-full sm:w-[148px]"
                        />
                      </div> */}
                      {/* <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                        <div className="text-sm font-medium text-default-600">
                          Balance Due:
                        </div>
                        <Input
                          defaultValue="$243.00"
                          className="text-xs font-medium  text-default-900 rounded w-full sm:w-[148px]"
                        />
                      </div> */}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-6 mt-6">
                  <div>
                    <Label
                      htmlFor="note"
                      className="text-sm font-medium text-default-600 mb-1"
                    >
                      Note:
                    </Label>

                    <div className="flex flex-col gap-2 w-full">
                      <Controller
                        control={control}
                        name="invocieNote"
                        render={({ field }) => (
                          <Textarea
                            type="text"
                            id="invocieNote"
                            className="rounded h-10"
                            placeholder="type note..."
                            {...field}
                          />
                        )}
                      />
                      {errors?.invocieNote && (
                        <span className="text-red-700">
                          {errors?.invocieNote.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label
                      htmlFor="terms"
                      className="text-sm font-medium text-default-600 mb-1"
                    >
                      Terms & Conditions:
                    </Label>

                    <div className="flex flex-col gap-2 w-full">
                      <Controller
                        control={control}
                        name="invocieTc"
                        render={({ field }) => (
                          <Textarea
                            type="text"
                            id="invocieTc"
                            className="rounded h-10"
                            placeholder="type terms..."
                            {...field}
                          />
                        )}
                      />
                      {errors?.invocieTc && (
                        <span className="text-red-700">
                          {errors?.invocieTc.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-wrap justify-end gap-4">
                <Button
                  type="submit"
                  className="bg-default-200 text-xs font-semibold text-default-600 group hover:text-primary-foreground whitespace-nowrap"
                >
                  <Icon
                    icon="heroicons:eye"
                    className="w-5 h-5 text-default-500 ltr:mr-2 rtl:ml-2 group-hover:text-primary-foreground"
                  />
                  Preview
                </Button>

                <Button
                  type="submit"
                  className="group hover:bg-default-200 hover:text-default-900 text-xs font-semibold whitespace-nowrap"
                >
                  Send Invoice
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateInvoice;
