import AxiosCreator, { api } from "@/config/axios.config";

export const addInsuranceCompanyUser = async (data) => {
    try {
        const response = await AxiosCreator.post("/api/insurance-company/add", data);

        return response.data;
    } catch (error) {
        console.log(error, "erros into create")
        throw error;
    }
};

export const getInsuranceCompanyUsers = async ({ page = 1, size = 10, all = false, search = "" }) => {
    try {
        const response = await AxiosCreator.get(`/api/insurance-company?page=${page}&size=${size}&all=${all}&search=${search}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const deleteInsuranceCompany = async (id) => {
    console.log(id, "delete Employee")
    try {
        const response = await AxiosCreator.delete(`/api/insurance-company/delete/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getInsuranceCompanyById = async (id) => {
    try {
        const response = await AxiosCreator.get(`/api/insurance-company/${id}`);
        return response.data;  // Return the data directly from the response
    } catch (error) {
        console.error('Fetch error:', error);
        return null;  // Return null or a default value in case of an error
    }
};

export const updateInsuranceCompanyById = async (id, updatedFields) => {
    try {
        const response = await AxiosCreator.put(
            `/api/insurance-company/edit/${id}`,
            updatedFields
        );
        return response.data;
    } catch (error) {
        throw error?.data;
    }
}




/////    Tab Listing api for get insurance company associated dats

export const getInsuranceCustomerList = async (id,{ page = 1, size = 10, all = false, search = "" }) => {
    try {
      const response = await AxiosCreator.get(`/api/insurance-company/getAllCustomers/${id}?page=${page}&size=${size}&all=${all}&search=${search}`);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };
export const getInsuranceCarList = async (id,{ page = 1, size = 10, all = false, search = "" }) => {
    try {
      const response = await AxiosCreator.get(`/api/insurance-company/getAllCars/${id}?page=${page}&size=${size}&all=${all}&search=${search}`);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };
  
export const getInsuranceJobCardList = async (id,{ page = 1, size = 10, all = false, search = "",status = "", startDate = "", endDate = "" }) => {
    try {
      const response = await AxiosCreator.get(`/api/insurance-company/getAllJobCards/${id}?page=${page}&size=${size}&all=${all}&search=${search}&status=${status}&startDate=${startDate}&endDate=${endDate}`);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };
  