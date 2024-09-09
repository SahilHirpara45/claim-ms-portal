import { useEffect, useMemo, useState } from "react";

import { invoiceSchema } from "../schema";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";


export const useInvoices = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toISOString().split("T")[0] : "";

  const initialValues = {
    invocieType: "",
    invocieDate: formatDate(new Date()),
    invocieDueDate: formatDate(new Date()),
    billFCn: "Hiren",
    billFCnEmail: "hiren@gmail.com",
    billFCnPhone: "8956231452",
    billFCnAdd: "Shelby Company Limited Small Heath B10 0HF, UK",
    billToCn: "Prantik Chakraborty",
    billToCnEmail: "p@gmail.com",
    billToCnPhone: "8956231455",
    billToCnAdd: "Shelby Company Limited Small Heath B10 0HF, UK",
    itemList: [{ itemName: "Mouse", itemPrice: "100", itemQty: "02" }],
    invocieNote: "It was great doing business with you.",
    invocieTc:
      "Please pay within 15 days from the date of invoice, overdue interest @ 14% will be charged on delayed payments & Please quote invoice number when remitting funds.",
  };

  const handleInvoiceFrom = (values) => {
    console.log("i am invoice form :-", values);
    queryClient.setQueryData("invoiceData", values);

    router.push("/invoice/invoice-preview")
  };

  return {
    initialValues: initialValues,
    loading,
    schema: invoiceSchema,
    submit: handleInvoiceFrom,
  };
};
