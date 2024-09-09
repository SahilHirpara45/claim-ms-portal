import AxiosCreator, { api } from "@/config/axios.config";

export const CreateEmployee = async (data) => {
    try {
        const response = await AxiosCreator.post("/api/company/add-employee", data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const GetEmployees = async ({ page = 1, size = 10, all = false, search = "" }) => {
    try {
        const response = await AxiosCreator.get(`/api/company/employee-list?page=${page}&size=${size}&all=${all}&search=${search}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const DeleteEmployee = async (id) => {
    console.log(id, "delete Employee")
    try {
        const response = await AxiosCreator.delete(`/api/company/delete-employee/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
export const getEmployeeById = async (id) => {
    try {
        const response = await AxiosCreator.get(`/api/company/employee/${id}`);
        return response.data;  // Return the data directly from the response
    } catch (error) {
        console.error('Fetch error:', error);
        return null;  // Return null or a default value in case of an error
    }
};

export const updateEmployeeById = async (id, updatedFields) => {
    console.log("Update of employee data:=", updatedFields, id);
    try {
        const response = await AxiosCreator.put(
            `/api/company/edit-employee/${id}`,
            updatedFields
        );
        console.log("Updated employee:-", response?.data);
        return response.data;
    } catch (error) {
        throw error;
    }
};




export const GetCSREmployees = async ({all = false, designation = "" }) => {
    try {
        const response = await AxiosCreator.get(`/api/employee?all=${all}&designation=${designation}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}