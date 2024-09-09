"use client"
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { additionalQuotationSchema } from "../schema/additionalQuotationSchema";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { getSingleJobCardAction } from "../../../../action/employeeAction/jobcard-action";
import { addAdQuotation, getAdSingleQuotation, updateAdQuotation } from "@/action/quotationAction/quotation-action";

export const useAdditionalQuotation = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [snewtatus, setSnewtatus] = useState("");
    const params = useParams();
    const jobCardId = params?.jobcardId;
    const viewAdQuId = params?.viewAdQuId;
    const quotaionsId = params?.quotaionsId;
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

    const formatDate = (dateString) =>
        dateString ? new Date(dateString).toISOString().split("T")[0] : "";




    const {
        isLoading,
        isError,
        data: quotationData,
        error,
    } = useQuery({
        queryKey: ["QutationData", viewAdQuId],
        queryFn: () => getAdSingleQuotation(viewAdQuId || quotaionsId),
        enabled: !!viewAdQuId || !!quotaionsId,
        retry: false,
    });




    const addADQuotationMutation = useMutation({
        mutationKey: ["addADQuotationMutation"],
        mutationFn: async (data) => {
            return await addAdQuotation(data);
        },
        onSuccess: (response) => {
            toast.success(response?.message);
            router.back();

        },
        onError: (error) => {
            toast.error(error?.data?.message);
        },
    });



    const updateAdQuotationMutation = useMutation({
        mutationKey: ["updateAdQuotationMutation"],
        mutationFn: async (data) => {

            const quotaionsId = params?.quotaionsId;
            return await updateAdQuotation(quotaionsId, data);
        },
        onSuccess: (response) => {
            toast.success(response?.message);
            router.back();
        },
        onError: (error) => {
            toast.error(error?.data?.message);
        },
    });



    //addAdQuotation
    const handleQuotationForm = async (values) => {
        console.log("i am values yyyy:-", values);

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
            quJobCard,
            qudaystocomplete,
            itemList,
            quStatus,
            sectionItems,
            totalLaborParts,
            totalSectionParts,
            quoNotes,
            totalGrandParts,
            carPlateNumber
        } = values;


        const payLoad = {
            date: dateTime.toISOString().split("T")[0],
            time: timeFormatted,
            customer: quCustomer,
            car: quCar,

            daysToQuote: qudaystocomplete,
            listOfItems: itemList,

            jobCardId: quJobCard,
            status: snewtatus || quStatus,
            sectionItemList: sectionItems,
            totalPartsCost: totalSectionParts,
            laborCharge: totalLaborParts,
            notes: quoNotes,
            plateNumber: carPlateNumber,
            totalCost: totalGrandParts
        };


        if (quotaionsId && quotationData?.status === "Draft") {
            await updateAdQuotationMutation.mutateAsync(payLoad);
        } else {
            await addADQuotationMutation.mutateAsync(payLoad);
        }


    };



    const initialValues = useMemo(() => {
        if (viewAdQuId && quotationData) {
            return {
                quDateAndTime: formatDate(quotationData?.date) || "",
                quCustomer: quotationData?.customer?._id || "",
                quCar: quotationData?.car?._id || "",
                carPlateNumber: quotationData?.car?.plateNumber || "",
                quJobCard: quotationData?.jobCardId?._id || "",
                qudaystocomplete: quotationData?.daysToQuote || "",

                itemList: quotationData?.listOfItems?.length > 0
                    ? quotationData.listOfItems
                    : [{ itemName: "", itemPrice: "" }],
                sectionItems: quotationData?.sectionItemList?.length > 0
                    ? quotationData.sectionItemList
                    : [{ sectionName: "", itemsList: [{ itemName: "" }], price: "" }],
                quStatus: quotationData?.status || "Draft",
                quoNotes: quotationData?.notes || "",
                totalSectionParts: (quotationData?.totalPartsCost && quotationData.totalPartsCost !== 0)
                    ? String(quotationData.totalPartsCost)
                    : "",
                totalLaborParts: (quotationData?.laborCharge && quotationData.laborCharge !== 0)
                    ? String(quotationData.laborCharge)
                    : "",
                totalGrandParts: String(quotationData?.totalCost) || "",

            };
        } else if (quotaionsId && quotationData?.status === 'Draft') {
            return {
                quDateAndTime: formatDate(quotationData?.date) || "",
                quCustomer: quotationData?.customer?._id || "",
                quCar: quotationData?.car?._id || "",
                carPlateNumber: quotationData?.car?.plateNumber || "",
                quJobCard: quotationData?.jobCardId?._id || "",
                qudaystocomplete: quotationData?.daysToQuote || "",

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
                quStatus: quotationData?.status || "Draft",

                sectionItems: quotationData?.sectionItemList?.length > 0 ?
                    quotationData.sectionItemList :
                    [{
                        sectionName: "",
                        itemslist: [{ itemName: "" }], price: ""
                    }]
            };
        } else {
            return {
                quDateAndTime: formatDate(new Date()),
                quCustomer: jobcardData?.customerId?._id || "",
                carPlateNumber: jobcardData?.carId?.plateNumber || "",
                quCar: jobcardData?.carId?._id || "",
                quJobCard: jobcardData?._id || "",
                qudaystocomplete: "",
                itemList: [{ itemName: "", itemPrice: "" }],
                quoNotes: "",
                totalSectionParts: "",
                totalLaborParts: "",
                totalGrandParts: "",
                // sectionItems: [{ sectionName: "", itemsList: [{ itemName: "" }], price: "" }],
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
    }, [viewAdQuId, quotationData, jobcardData]);
    return {
        initialValues: initialValues,
        schema: additionalQuotationSchema,
        submit: handleQuotationForm,
        setSnewtatus,
        quotationData,
        loading,
    };
};
