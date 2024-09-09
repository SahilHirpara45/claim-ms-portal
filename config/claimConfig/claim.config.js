import AxiosCreator, { api } from "@/config/axios.config";

export const GetClaims = async ({ page = 1, size = 10, all = false, search = "" }) => {
    try {
        const response = await AxiosCreator.get(`/api/claim?page=${page}&size=${size}&all=${all}&search=${search}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}


export const updateClaimById = async (id, updatedFields) => {
    console.log("Update of updateClaimById data:=", updatedFields, id);
    try {
        const response = await AxiosCreator.put(
            `/api/claim/edit/${id}`,
            updatedFields
        );
        return response.data;
    } catch (error) {
        throw error;
    }
  };

//my task

export const GetMyTaskClaimsCon = async ({ page = 1, size = 10, all = false, search = "" }) => {
    try {
        const response = await AxiosCreator.get(`/api/my-task/claim?page=${page}&size=${size}&all=${all}&search=${search}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}