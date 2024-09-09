import { useParams, useRouter } from "next/navigation";
import { editInsuranceCompanySchema } from "../schema/editInsuranceCompanySchema"
import { useSession } from "next-auth/react";
import { getGarageInsuranceCompany, updateGarrageInsurance } from "@/action/companyAction/insurance-action";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

export const useEditInsurance = () => {

    const params = useParams();
    const router = useRouter();

    const { data: session } = useSession();
    const [lpoStep, setlpoStep] = useState({});
    const edit_insurance = params?.edit_insurance;

    const {
        isLoading,
        isError,
        data: InsuranceCompanyData,
        error,
    } = useQuery({
        queryKey: ["InsuranceCompanyData", edit_insurance],
        queryFn: () => {

            return getGarageInsuranceCompany(edit_insurance);


        },
        enabled: !!edit_insurance,
    });



    // console.log("InsuranceCompanyData :-", InsuranceCompanyData);

    //update mutaion

    const updateGarrageInsuranceMutaion = useMutation({
        mutationKey: ["updateGarrageInsuranceMutaion"],
        mutationFn: async (data) => {
            const formData = new FormData();
            formData.append("garageInsuranceDetails", JSON.stringify(data));

            const edit_insurance = params?.edit_insurance;

            if (lpoStep) {

                formData.append("logo", lpoStep[0]);
            }
            return await updateGarrageInsurance(edit_insurance, formData);
        },
        onSuccess: (response) => {
            toast.success(response?.message);
            router.push("/insurance-list")
        },
        onError: (error) => {
           // console.log(error,"errorerrorerror");
            toast.error(error?.message);
        },
    });

    //


    const handleEditCompanyForm = async (values) => {
        console.log("i am values yyyy:-", values);
        const { companyName,
            description,
            companyEmail,
            contactEmail,
            companyWebsite,
            contactNo,
            claimsEmails,
            logo
        } = values;

        if (logo && typeof logo === "object") {
            setlpoStep(logo);
        }
        const payload = {
            companyName,
            description,
            companyEmail,
            contactEmail,
            companyWebsite,
            contactNo, claimsEmails,
        }

        await updateGarrageInsuranceMutaion.mutateAsync(payload);
    };


    const initialValues = useMemo(() => ({
        companyName: InsuranceCompanyData?.companyName,
        description: InsuranceCompanyData?.description,
        companyEmail: InsuranceCompanyData?.companyEmail,
        contactEmail: InsuranceCompanyData?.contactEmail,
        companyWebsite: InsuranceCompanyData?.companyWebsite,
        contactNo: InsuranceCompanyData?.contactNo,
        claimsEmails: InsuranceCompanyData?.claimsEmails || [{ emailName: "", isPrimary: false }],
        logo: [InsuranceCompanyData?.logo],
    }), [InsuranceCompanyData, edit_insurance]);



    return {
        initialValues: initialValues,
        schema: editInsuranceCompanySchema,
        submit: handleEditCompanyForm,

    };
};
