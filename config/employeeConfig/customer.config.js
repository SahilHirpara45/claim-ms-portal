import AxiosCreator from "../axios.config";

export const CustomerCreate = async (data) => {
  console.log("comapny Create");
  try {
    const response = await AxiosCreator.post("/api/customer/add", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in customerCreate:", error);
    throw error.data;
  }
};

export const getCustomerList = async ({ page = 1, size = 10, all = false, search = "" }) => {
  try {
    // const response = await AxiosCreator.get("/api/admin/company-list");
    const response = await AxiosCreator.get(`/api/customer?page=${page}&size=${size}&all=${all}&search=${search}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const deleteCustomer = async (ids) => {
  try {
    // const response = await AxiosCreator.get("/api/admin/company-list");
    const response = await AxiosCreator.post(`/api/customer/delete`,ids);

    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const getCustomerById = async (id) => {
  try {
    const response = await AxiosCreator.get(`/api/customer/${id}`);
    return response.data; // Return the data directly from the response
  } catch (error) {
    console.error("Fetch error:", error);
    return null; // Return null or a default value in case of an error
  }
};

//
export const updateCustomerById = async (id, updatedFields) => {
  try {
    const response = await AxiosCreator.put(
      `/api/customer/edit/${id}`,
      updatedFields
    );
    return response.data;
  } catch (error) {
    throw error?.data;
  }
};
