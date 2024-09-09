import AxiosCreator, { api } from "@/config/axios.config";

export const addInsuranceCompanyUser = async (data) => {
    try {
        const response = await AxiosCreator.post("/api/insurance-company/add", data);

        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const getInsuranceCompanyUsers = async () => {
    try {
        const response = await AxiosCreator.get("/api/insurance-company");
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const editInsuranceCompanyUser = async (data) => {
    try {
        const response = await AxiosCreator.patch("/api/insurance-company/edit", data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}