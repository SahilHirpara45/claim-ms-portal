import AxiosCreator, { api } from "@/config/axios.config";

export const CreateJobCard = async (data) => {
    try {
        const response = await AxiosCreator.post("/api/job-card/add", data);
        return response.data;
    } catch (error) {
        console.log(error, "erros into create")
        // return error?.data;
        throw error?.data;
    }
};

export const getJobCardsList = async ({ page = 1, size = 10, all = false, search = "", status = "", startDate = "", endDate = "", completeStartDate = "", completeEndDate = "" }) => {
    try {
        const response = await AxiosCreator.get(`/api/job-card?page=${page}&size=${size}&all=${all}&search=${search}&status=${status}&startDate=${startDate}&endDate=${endDate}&completeStartDate=${completeStartDate}&completeEndDate=${completeEndDate}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const DeleteJobCard = async (ids) => {
    try {
        const response = await AxiosCreator.post(`/api/job-card/delete`, ids);
        return response.data;
    } catch (error) {
        return error?.response?.data;
    }
}
export const getJobCardById = async (id) => {
    try {
        const response = await AxiosCreator.get(`/api/job-card/${id}`);
        return response.data;  // Return the data directly from the response
    } catch (error) {
        console.error('Fetch error:', error);
        return null;  // Return null or a default value in case of an error
    }
};

export const updateJobCardById = async (id, updatedFields) => {
    console.log("Update of JobCard data:=", updatedFields, id);
    try {
        const response = await AxiosCreator.put(
            `/api/job-card/edit/${id}`,
            updatedFields, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};
//jobcard history
export const getHistoryList = async ({ jobCardId = "" }) => {
    try {
        const response = await AxiosCreator.get(
            `/api/history?jobCardId=${jobCardId}`
        );
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};
///comment

export const getCommentList = async ({ jobCardId = "" }) => {
    try {
        const response = await AxiosCreator.get(
            `/api/comment?jobCardId=${jobCardId}`
        );
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};


///my task new job card

export const getJobCardsMyTaskList = async ({ page = 1, size = 10, all = false, search = "", status = "", startDate = "", endDate = "" }) => {
    try {
        const response = await AxiosCreator.get(`/api/my-task/job-card?page=${page}&size=${size}&all=${all}&search=${search}&status=${status}&startDate=${startDate}&endDate=${endDate}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
//add comment

export const AddComment = async (data) => {
    try {
        const response = await AxiosCreator.post("/api/comment/add", data);
        return response.data;
    } catch (error) {

        // return error?.data;
        throw error?.data;
    }
};

//check insurance company when survary


export const getInsuranceValid = async (insuranceId) => {
    try {
        const response = await AxiosCreator.get(
            `/api/job-card/checkInsurance/${insuranceId}`
        );
        return response;
    } catch (error) {
        throw error;
    }
};


//get car form pdf

export const getCarFormPDFConGenrate = async (id) => {
    try {
        const response = await AxiosCreator.get(
            `/api/job-card/carreceving-pdf/${id}`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const getFormAllDocPDFConGenrate = async (id) => {
    try {
        const response = await AxiosCreator.get(
            `/api/job-card/document-pdf/${id}`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

///uploadDamageImageConfig

export const uploadDamageImageConfig = async (data) => {
    try {
        const response = await AxiosCreator.post("/api/save-image", data);
        return response.data;
    } catch (error) {
        throw error?.data;
    }
};