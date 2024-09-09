import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { quotaionFormSchema } from "../schema";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import {
  addQuotation,
  addsupplementQuotation,
  getSingleQuotation,
  updateQuotation,
} from "../../../action/quotationAction/quotation-action";
import { getSingleJobCardAction } from "../../../action/employeeAction/jobcard-action";
import { updateSpQuotationeById } from "@/config/quotationConfig/quotation.config";

export const useCreateQuotaion = ({ CsrList }) => {
  const [loading, setLoading] = useState(false);
  const [lpoStep, setlpoStep] = useState({});
  const params = useParams();
  const router = useRouter();
  const jobCardId = params?.jobcardId;
  const [snewtatus, setSnewtatus] = useState("");
  const quotaionsId = params?.quotaionsId;
  const viewQuotationId = params?.viewQuotationId;
  const reCreateID = params?.reCreateID;

  const supplementId = params?.supplementId;

  const customerCareRepresentative = CsrList[0]?.value || "";



  const {
    isLoading: isLoadingJobCardData,
    isError: isErrorJobCardData,
    data: jobcardData,
    error: jobCardDataError,
  } = useQuery({
    queryKey: ["jobcardData", jobCardId],
    queryFn: () => getSingleJobCardAction(jobCardId),
    enabled: !!jobCardId,
    retry: false,
    onSuccess: (data) => { },
  });

  const {
    isLoading: isLoadingQuotation,
    isError: isErrorQuotation,
    data: quotationData,
    error: QuotationError,
  } = useQuery({
    queryKey: ["quotationData", quotaionsId],
    queryFn: () =>
      getSingleQuotation(
        quotaionsId || viewQuotationId || reCreateID || supplementId
      ),
    enabled:
      !!quotaionsId || !!viewQuotationId || !!reCreateID || !!supplementId,
    retry: false,
    onSuccess: (data) => { },
  });

  const addQuotationMutation = useMutation({
    mutationKey: ["addQuotationMutation"],
    mutationFn: async (data) => {
      return await addQuotation(data);
    },
    onSuccess: (response) => {
      toast.success(response?.message);

      router.push("/quotations-list");
    },
    onError: (error) => {
      toast.error(error?.data?.message);
    },
  });

  //update mutaion
  console.log("CsrList", jobcardData)
 // console.log("quotationData?.sendMailToInsuance", quotationData?.sendMailToInsuance);

  const updateQuotationMutation = useMutation({
    mutationKey: ["updateQuotationMutation"],
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append("quotatioDetails", JSON.stringify(data));
      if (lpoStep) {

        formData.append("lpo", lpoStep[0]);
      }
      const quotaionsId = params?.quotaionsId;
      const viewQuotationId = params?.viewQuotationId;

      return await updateQuotation(quotaionsId || viewQuotationId, formData);
    },
    onSuccess: (response) => {
      toast.success(response?.message);
      router.push("/quotations-list");
    },
    onError: (error) => {
      toast.error(error?.data?.message);
    },
  });
  //


  ///


  const updateSpQuotationMutation = useMutation({
    mutationKey: ["updateSpQuotationMutation"],
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append("quotatioDetails", JSON.stringify(data));
      if (lpoStep) {

        formData.append("lpo", lpoStep[0]);
      }
      const quotaionsId = params?.quotaionsId;
      const viewQuotationId = params?.viewQuotationId;

      return await updateSpQuotationeById(quotaionsId || viewQuotationId, formData);
    },
    onSuccess: (response) => {
      toast.success(response?.message);
      router.push("/quotations-list");
    },
    onError: (error) => {
      toast.error(error?.data?.message);
    },
  });

  ///

  //spec

  const addSupQuotationMutation = useMutation({
    mutationKey: ["addSupQuotationMutation"],
    mutationFn: async (data) => {
      return await addsupplementQuotation(data);
    },
    onSuccess: (response) => {
      toast.success(response?.message);

      router.push("/quotations-list");
    },
    onError: (error) => {
      toast.error(error?.data?.message);
    },
  });

  //
  const LpoQuotationMutation = useMutation({
    mutationKey: ["updateQuotationMutation"],
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append("lpo", data.lpo);
      const quotaionsId = params?.quotaionsId;
      const viewQuotationId = params?.viewQuotationId;

      return await updateQuotation(quotaionsId || viewQuotationId, formData);
    },
    onSuccess: (res) => {
      toast.success(response?.message);
    },
    onError: (error) => {
      toast.error(error?.data?.message);
    },
  });





  // console.log("quotationData?.totalPartsCost", quotationData);
  //console.log("quotationData?.laborCharge", quotationData?.laborCharge);

  const handleQuotationForm = async (values) => {

    //console.log(values, "values");

    setLoading(true);
    const dateTime = new Date(values?.quDateAndTime);

    const timeZone = "America/New_York";
    const options = {
      timeZone,
      hour12: false,
      hour: "numeric",
      minute: "numeric",
    };
    const timeFormatted = dateTime.toLocaleString("en-US", options);

    const {
      quCustomer,
      quCar,
      quInsuranceCom,
      quJobCard,
      qudaystocomplete,
      itemList,
      quCustomerCareRepresentative,
      quStatus,
      quoLpo,
      sectionItems,
      totalLaborParts,
      totalSectionParts,
      quoNotes,
      totalGrandParts,
      carPlateNumber,
      isMailSent
    } = values;

    const payLoad = {
      date: dateTime.toISOString().split("T")[0],
      time: timeFormatted,
      customer: quCustomer,
      car: quCar,
      insuranceCompany: quInsuranceCom,
      daysToQuote: qudaystocomplete,
      listOfItems: itemList,
      CCRId: quCustomerCareRepresentative,
      jobCardId: quJobCard,
      status: snewtatus || quStatus,
      sectionItemList: sectionItems,
      totalPartsCost: totalSectionParts,
      laborCharge: totalLaborParts,
      notes: quoNotes,
      plateNumber: carPlateNumber,
      totalCost: totalGrandParts,
      sendMailToInsuance: isMailSent
    };

    if (quoLpo && typeof quoLpo === "object") {
      setlpoStep(quoLpo);
    }

    try {
      if (quotaionsId && quotationData?.status === "Draft" && quotationData?.isSupplmenteryQuotation) {
        const payLoadUpdate = {
          date: dateTime.toISOString().split("T")[0],
          time: timeFormatted,
          customer: quCustomer,
          car: quCar,
          insuranceCompany: quInsuranceCom,
          daysToQuote: qudaystocomplete,
          listOfItems: itemList,
          CCRId: quCustomerCareRepresentative,
          jobCardId: quJobCard,
          status: snewtatus || quStatus,
          sectionItemList: sectionItems,
          totalPartsCost: totalSectionParts,
          laborCharge: totalLaborParts,
          notes: quoNotes,
          totalCost: totalGrandParts,
          plateNumber: carPlateNumber,
          sendMailToInsuance: isMailSent
        };

        await updateSpQuotationMutation.mutateAsync(payLoadUpdate);
      } else if ((quotaionsId && quotationData?.status !== "Draft") || viewQuotationId) {
        const payLoadUpdate = {
          date: dateTime.toISOString().split("T")[0],
          time: timeFormatted,
          customer: quCustomer,
          car: quCar,
          insuranceCompany: quInsuranceCom,
          daysToQuote: qudaystocomplete,
          listOfItems: itemList,
          CCRId: quCustomerCareRepresentative,
          jobCardId: quJobCard,
          status: quStatus,
          sectionItemList: sectionItems,
          totalPartsCost: totalSectionParts,
          laborCharge: totalLaborParts,
          notes: quoNotes,
          totalCost: totalGrandParts,
          plateNumber: carPlateNumber,
          sendMailToInsuance: isMailSent
        };
        if (quotationData?.isSupplmenteryQuotation) {
          await updateSpQuotationMutation.mutateAsync(payLoadUpdate);
        } else {
          await updateQuotationMutation.mutateAsync(payLoadUpdate);
        }

      }
      else if (quotaionsId && quotationData?.status === "Draft") {
        await updateQuotationMutation.mutateAsync(payLoad);
      } else if ((quotaionsId && quotationData?.status !== "Draft") || viewQuotationId) {
        const payLoadUpdate = {
          date: dateTime.toISOString().split("T")[0],
          time: timeFormatted,
          customer: quCustomer,
          car: quCar,
          insuranceCompany: quInsuranceCom,
          daysToQuote: qudaystocomplete,
          listOfItems: itemList,
          CCRId: quCustomerCareRepresentative,
          jobCardId: quJobCard,
          status: quStatus,
          sectionItemList: sectionItems,
          totalPartsCost: totalSectionParts,
          laborCharge: totalLaborParts,
          notes: quoNotes,
          totalCost: totalGrandParts,
          plateNumber: carPlateNumber,
          sendMailToInsuance: isMailSent
        };

        await updateQuotationMutation.mutateAsync(payLoadUpdate);
      } else if (supplementId) {
        await addSupQuotationMutation.mutateAsync(payLoad);
      } else {
        await addQuotationMutation.mutateAsync(payLoad);
      }
    } catch (error) {
      console.error("Mutation Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toISOString().split("T")[0] : "";

  const initialValues = useMemo(() => {
    if (quotaionsId && quotationData?.status === 'Draft') {
      return {
        quDateAndTime: formatDate(quotationData?.date) || "",
        quCustomer: quotationData?.customer?._id || "",
        quCar: quotationData?.car?._id || "",
        carPlateNumber: quotationData?.car?.plateNumber || "",
        quInsuranceCom: quotationData?.insuranceCompany?._id || "",
        quJobCard: quotationData?.jobCardId?._id || "",
        qudaystocomplete: quotationData?.daysToQuote || "",
        quCustomerCareRepresentative: quotationData?.CCRId || "",
        isMailSent: quotationData?.sendMailToInsuance,
        itemList: quotationData?.listOfItems?.length > 0 ? quotationData?.listOfItems : [
          { itemName: "", itemPrice: "" },
        ],
        quStatus: quotationData?.status || "Draft",
        quoLpo: quotationData?.lpo || [],
        quoNotes: quotationData?.notes || "",
        // totalSectionParts: String(quotationData?.totalPartsCost) || "",
        totalSectionParts: (quotationData?.totalPartsCost && quotationData.totalPartsCost !== 0)
          ? String(quotationData.totalPartsCost)
          : "",
        totalLaborParts: (quotationData?.laborCharge && quotationData.laborCharge !== 0)
          ? String(quotationData.laborCharge)
          : "",
        totalGrandParts: String(quotationData?.totalCost) || "",
        sectionItems: quotationData?.sectionItemList?.length > 0 ?
          quotationData.sectionItemList :
          [{
            sectionName: "Change parts",
            itemsList: [{ itemName: "" }],
          },
          {
            sectionName: "Repair Parts",
            itemsList: [{ itemName: "" }],
          },
          {
            sectionName: "Labor & Materials",
            itemsList: [{ itemName: "" }],
          },]
      };
    }
    else if (quotaionsId && quotationData) {
      return {
        quDateAndTime: formatDate(quotationData?.date) || "",
        quCustomer: quotationData?.customer?._id || "",
        quCar: quotationData?.car?._id || "",
        carPlateNumber: quotationData?.car?.plateNumber || "",
        quInsuranceCom: quotationData?.insuranceCompany?._id || "",
        quJobCard: quotationData?.jobCardId?._id || "",
        isMailSent: quotationData?.sendMailToInsuance || true,
        // quJobCard: quotationData?.jobCardId?.jobCardNumber,
        qudaystocomplete: quotationData?.daysToQuote || "",
        quCustomerCareRepresentative: quotationData?.CCRId || "",
        itemList: quotationData?.listOfItems?.length > 0 ? quotationData?.listOfItems : [
          { itemName: "", itemPrice: "" },
        ],
        quStatus: quotationData?.status || "Draft",
        quoLpo: quotationData?.lpo || [],
        quoNotes: quotationData?.notes || "",
        totalSectionParts: (quotationData?.totalPartsCost && quotationData.totalPartsCost !== 0)
          ? String(quotationData.totalPartsCost)
          : "",
        totalLaborParts: (quotationData?.laborCharge && quotationData.laborCharge !== 0)
          ? String(quotationData.laborCharge)
          : "",
        totalGrandParts: String(quotationData?.totalCost) || "",
        sectionItems: quotationData?.sectionItemList?.length > 0 ?
          quotationData.sectionItemList :
          [{
            sectionName: "Change parts",
            itemsList: [{ itemName: "" }],
          },
          {
            sectionName: "Repair Parts",
            itemsList: [{ itemName: "" }],
          },
          {
            sectionName: "Labor & Materials",
            itemsList: [{ itemName: "" }],
          },]
      };
    } else if (supplementId && quotationData) {
      return {
        quDateAndTime: formatDate(quotationData?.date) || "",
        quCustomer: quotationData?.customer?._id || "",
        quCar: quotationData?.car?._id || "",
        carPlateNumber: quotationData?.car?.plateNumber || "",
        quInsuranceCom: quotationData?.insuranceCompany?._id || "",
        quoNotes: quotationData?.notes || "",
        isMailSent: quotationData?.sendMailToInsuance || true,
        totalSectionParts: (quotationData?.totalPartsCost && quotationData.totalPartsCost !== 0)
          ? String(quotationData.totalPartsCost)
          : "",
        totalLaborParts: (quotationData?.laborCharge && quotationData.laborCharge !== 0)
          ? String(quotationData.laborCharge)
          : "",
        totalGrandParts: String(quotationData?.totalCost) || "",
        quJobCard: quotationData?.jobCardId?._id || "",
        qudaystocomplete: quotationData?.daysToQuote || "",
        quCustomerCareRepresentative: quotationData?.CCRId || "",
        itemList: [{ itemName: "", itemPrice: "" }],
        sectionItems: [
          {
            sectionName: "Change parts",
            itemsList: [{ itemName: "" }],
          },
          {
            sectionName: "Repair Parts",
            itemsList: [{ itemName: "" }],
          },
          {
            sectionName: "Labor & Materials",
            itemsList: [{ itemName: "" }],
          }
        ],
        quStatus: quotationData?.status || "Draft",
        quoLpo: quotationData?.lpo || [],
      };
    } else if (reCreateID && quotationData) {
      return {
        quDateAndTime: formatDate(quotationData?.date) || "",
        quCustomer: quotationData?.customer?._id || "",
        quCar: quotationData?.car?._id || "",
        isMailSent: quotationData?.sendMailToInsuance,
        carPlateNumber: quotationData?.car?.plateNumber || "",
        quInsuranceCom: quotationData?.insuranceCompany?._id || "",
        quJobCard: quotationData?.jobCardId?._id || "",
        qudaystocomplete: quotationData?.daysToQuote || "",
        quCustomerCareRepresentative: quotationData?.CCRId || "",

        itemList: quotationData?.listOfItems?.length > 0 ? quotationData?.listOfItems : [
          { itemName: "", itemPrice: "" },
        ],
        quStatus: "Pending",
        quoLpo: quotationData?.lpo || [],
        quoNotes: quotationData?.notes || "",
        totalSectionParts: (quotationData?.totalPartsCost && quotationData.totalPartsCost !== 0)
          ? String(quotationData.totalPartsCost)
          : "",
        totalLaborParts: (quotationData?.laborCharge && quotationData.laborCharge !== 0)
          ? String(quotationData.laborCharge)
          : "",
        totalGrandParts: String(quotationData?.totalCost) || "",
        sectionItems: quotationData?.sectionItemList?.length > 0 ?
          quotationData.sectionItemList :
          [{
            sectionName: "Change parts",
            itemsList: [{ itemName: "" }],
          },
          {
            sectionName: "Repair Parts",
            itemsList: [{ itemName: "" }],
          },
          {
            sectionName: "Labor & Materials",
            itemsList: [{ itemName: "" }],
          },]
      };
    } else if (viewQuotationId && quotationData) {
      return {
        quDateAndTime: formatDate(quotationData?.date) || "",
        quCustomer: quotationData?.customer?._id || "",
        quCar: quotationData?.car?._id || "",
        isMailSent: quotationData?.sendMailToInsuance,
        carPlateNumber: quotationData?.car?.plateNumber || "",
        quInsuranceCom: quotationData?.insuranceCompany?._id || "",
        quJobCard: quotationData?.jobCardId?._id || "",
        qudaystocomplete: quotationData?.daysToQuote || "",
        quCustomerCareRepresentative: quotationData?.CCRId || "",

        quoNotes: quotationData?.notes || "",
        totalSectionParts: (quotationData?.totalPartsCost && quotationData.totalPartsCost !== 0)
          ? String(quotationData.totalPartsCost)
          : "",
        totalLaborParts: (quotationData?.laborCharge && quotationData.laborCharge !== 0)
          ? String(quotationData.laborCharge)
          : "",
        totalGrandParts: String(quotationData?.totalCost) || "",
        itemList: quotationData?.listOfItems?.length > 0 ? quotationData?.listOfItems : [
          { itemName: "", itemPrice: "" },
        ],

        sectionItems: quotationData?.sectionItemList?.length > 0 ?
          quotationData.sectionItemList :
          [{
            sectionName: "Change parts",
            itemsList: [{ itemName: "" }],
          },
          {
            sectionName: "Repair Parts",
            itemsList: [{ itemName: "" }],
          },
          {
            sectionName: "Labor & Materials",
            itemsList: [{ itemName: "" }],
          }],
        quStatus: quotationData?.status || "Draft",
        quoLpo: quotationData?.lpo || [],
      };
    } else if (jobCardId && jobcardData) {
      return {
        quDateAndTime: formatDate(new Date()),
        isMailSent: true,
        carPlateNumber: jobcardData?.carId?.plateNumber || "",
        quCustomer: jobcardData.customerId?._id || "",
        quCar: jobcardData.carId?._id || "",
        quInsuranceCom: jobcardData?.isFault
          ? jobcardData?.insuranceCompany?._id || ""
          : jobcardData?.newInsuranceCompany?._id || "",
        quJobCard: jobcardData?._id || "",
        qudaystocomplete: "",
        carPlateNumber: jobcardData?.carId?.plateNumber || "",
        quCustomerCareRepresentative: jobcardData?.currentCSRId?.employeeId || customerCareRepresentative,
        itemList: [{ itemName: "", itemPrice: "" }],
        quoNotes: "",
        totalSectionParts: "",
        totalLaborParts: "",
        totalGrandParts: "",
        sectionItems: [
          {
            sectionName: "Change parts",
            itemsList: [{ itemName: "" }],

          },
          {
            sectionName: "Repair Parts",
            itemsList: [{ itemName: "" }],

          },
          {
            sectionName: "Labor & Materials",
            itemsList: [{ itemName: "" }],
          },
        ],
      };
    } else {
      return {
        quDateAndTime: formatDate(new Date()),
        quCustomer: "",
        quCar: "",
        quInsuranceCom: "",
        isMailSent: true,
        quJobCard: "",
        qudaystocomplete: "",
        carPlateNumber: jobcardData?.carId?.plateNumber || "",
        quCustomerCareRepresentative: jobcardData?.currentCSRId?.employeeId || customerCareRepresentative,
        itemList: [{ itemName: "", itemPrice: "" }],
        quoNotes: "",
        totalSectionParts: "",
        totalLaborParts: "",
        sectionItems: [
          {
            sectionName: "Change parts",
            itemsList: [{ itemName: "" }],
          },
          {
            sectionName: "Repair Parts",
            itemsList: [{ itemName: "" }],
          },
          {
            sectionName: "Labor & Materials",
            itemsList: [{ itemName: "" }],
          },
        ],
      };
    }
  }, [quotationData, jobcardData]);

  return {
    initialValues: initialValues,
    loading,
    schema: quotaionFormSchema,
    submit: handleQuotationForm,
    LpoQuotationMutation: LpoQuotationMutation,
    setSnewtatus,
    quotationData,
  };
};
