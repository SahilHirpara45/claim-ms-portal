"use client";

import { SiteLogo } from "@/components/svg";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

const InvoicePreview = () => {
  const columns = [
    {
      id: 1,
      label: "DESCRIPTION",
    },
    {
      id: 2,
      label: "QUANTITY",
    },
    {
      id: 3,
      label: "Rate",
    },
    {
      id: 4,
      label: "Total",
    },
  ];

  const queryClient = useQueryClient();

  const { data: invoiceDataInfo, error } = useQuery({
    queryKey: ["invoiceData"],
    queryFn: () => {
      const data = queryClient.getQueryData("invoiceData");
      return data !== undefined ? data : {};
    },
  });

  console.log("i am invoice form :-", invoiceDataInfo);
  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toISOString().split("T")[0] : "";

  return (
    <div>
      <Breadcrumbs>
        {/* <BreadcrumbItem>Pages</BreadcrumbItem>
        <BreadcrumbItem>Utility</BreadcrumbItem> */}
        <BreadcrumbItem>Invoice Details</BreadcrumbItem>
      </Breadcrumbs>
      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-12 ">
          <Card>
            <CardContent>
              <div className="flex gap-6 flex-col md:flex-row pt-8">
                <div className="flex-1">
                  <Link href="#">
                    <Image src="/lgm.png" alt="logo" width={150} height={200} />
                  </Link>
                  <div className="mt-5">
                    <div className="text-lg font-semibold text-default-900">
                      Billing To:
                    </div>
                    <div className="text-lg font-medium text-default-800 mt-1">
                      {invoiceDataInfo?.billToCn}
                    </div>
                    <div className="text-base text-default-600 mt-3">
                      4th floor <br />
                      Road 29,
                      <br />
                      House 395
                      <br />
                      Mohakhali DOHS, 1206
                    </div>
                  </div>
                </div>
                <div className="flex-none md:text-end">
                  <div className="text-4xl font-semibold text-default-900">
                    Invoice #
                  </div>
                  <div className="mt-1.5 text-xl font-medium text-default-600">
                    993652
                  </div>
                  <div className="mt-4 text-base text-default-600">
                    Hiren Danecha
                    <br />
                    Shelby Company Limited <br />
                    Small Heath <br />
                    B10 0HF, UK
                  </div>
                  <div className="mt-8">
                    <div className="mb-2.5">
                      <span className="mr-12 text-base font-semibold text-default-900">
                        Invoice Date:
                      </span>
                      <span className="text-base font-medium text-default-600">
                        {formatDate(invoiceDataInfo?.invocieDate)}
                      </span>
                    </div>
                    <div>
                      <span className="mr-12 text-base font-semibold text-default-900">
                        Due Date:
                      </span>
                      <span className="text-base font-medium text-default-600">
                        {formatDate(invoiceDataInfo?.invocieDueDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 border border-default-300 rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((column) => (
                        <TableHead
                          key={`invoice-table-${column.key}`}
                          className="text-default-600 ltr:last:text-right rtl:last:text-left"
                        >
                          {column.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody className="[&_tr:last-child]:border-1">
                    {invoiceDataInfo?.itemList?.map((item, index) => (
                      <TableRow key={`invoice-description-${index}`}>
                        <TableCell className="text-sm font-medium text-default-600 max-w-[200px] truncate">
                          {item.itemName}
                        </TableCell>
                        <TableCell className="text-sm font-medium text-default-600">
                          {item.itemQty ? `${item.itemQty} pcs` : "0 pcs"}
                        </TableCell>
                        <TableCell className="text-sm font-medium text-default-600 whitespace-nowrap">
                          {item.itemPrice ? `${item.itemPrice} AED` : "0 AED"}
                        </TableCell>
                        <TableCell className="ltr:text-right rtl:text-left text-sm font-medium text-default-600">
                          {item.itemQty && item.itemPrice
                            ? `$${(
                                parseInt(item.itemQty) *
                                parseFloat(item.itemPrice)
                              ).toFixed(2)}`
                            : "$0"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-2 flex justify-end  p-6">
                  <div>
                    {[
                      {
                        label: "Sub Total",
                        amount: "2146.00",
                      },
                    ].map((item, index) => (
                      <div
                        key={`invoice-item-${index}`}
                        className="mb-3 text-end flex justify-end"
                      >
                        <span className="text-sm font-medium text-default-600 ">
                          {item.label}:
                        </span>
                        <span className="text-sm font-medium text-default-600  text-end w-[100px] md:w-[160px] block">
                          ${item.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-base font-medium text-default-600 mt-6">
                Note:
              </div>
              <div className="text-sm text-default-800">
                {invoiceDataInfo?.invocieNote}
              </div>
              <div className="mt-3.5 text-base font-medium text-default-600">
                Terms & Conditions:
              </div>
              <div className="text-sm text-default-800 mt-1">
                {invoiceDataInfo?.invocieTc}
              </div>
              <div className="mt-6 text-lg font-semibold text-default-900">
                Thank You!
              </div>
              <div className="mt-1 text-sm text-default-800">
                If you have any questions concerning this invoice, use the
                following contact information:
              </div>
              <div className="text-xs text-default-800 mt-2">
                automend@best.com
              </div>
              <div className="text-xs text-default-800 mt-1">
                +880 624279888
              </div>
              <div className="mt-8 text-xs text-default-800">
                © 2024 Automend
              </div>
            </CardContent>
          </Card>
          <div className="mt-8 flex gap-4 justify-end">
            <Button
              asChild
              variant="outline"
              className="text-xs font-semibold text-primary-500"
            >
              <Link href="#">
                <Download className="w-3.5 h-3.5 ltr:mr-1.5 rtl:ml-1.5" />
                <span>Invoice PDF</span>
              </Link>
            </Button>
            <Button className="text-xs font-semibold ">
              <Icon
                icon="heroicons:printer"
                className="w-5 h-5 ltr:mr-1 rtl:ml-1"
              />{" "}
              Print
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
