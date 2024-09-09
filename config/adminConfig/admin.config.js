import AxiosCreator from "../axios.config";

export const companyCreate = async (data) => {
  console.log("comapny Create");
  try {
    const response = await AxiosCreator.post("/api/admin/add-company", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error in customerCreate:", error);
    throw error.data;
  }
};

export const getCompanyList = async ({ page = 1, size = 10, all = false, search = "" }) => {
  try {
    const response = await AxiosCreator.get(`/api/admin/company-list?page=${page}&size=${size}&all=${all}&search=${search}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const deleteCompany = async (id) => {
  try {
    const response = await AxiosCreator.delete(
      `/api/admin/delete-company/${id}`
    );
    console.log("Deleted company:-", response.data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getCompanyById = async (id) => {
  try {
    const response = await AxiosCreator.get(`/api/admin/company/${id}`);
    return response.data; // Return the data directly from the response
  } catch (error) {
    console.error("Fetch error:", error);
    return null; // Return null or a default value in case of an error
  }
};

export const updateCompanyById = async (id, updatedFields) => {
  try {
    const response = await AxiosCreator.put(
      `/api/admin/edit-company/${id}`,
      updatedFields
    );
    console.log("Updated company:-", response?.data);
    return response.data;
  } catch (error) {
    // console.log(error, "error into config")
    throw error.data;
  }
};
