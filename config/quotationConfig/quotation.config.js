import AxiosCreator, { api } from "@/config/axios.config";

export const createQuotation = async (data) => {
  try {
    const response = await AxiosCreator.post("api/quotation/add", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getQuotation = async ({
  page = 1,
  size = 10,
  all = false,
  search = "",
  jobCardId = "",
}) => {
  try {
    const response = await AxiosCreator.get(
      `/api/quotation?page=${page}&size=${size}&all=${all}&search=${search}&jobCardId=${jobCardId}`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteQuotatione = async (id) => {
  try {
    const response = await AxiosCreator.delete(`/api/quotation/delete/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// get single quotaion

export const getQuotationeById = async (id) => {
  try {
    const response = await AxiosCreator.get(`/api/quotation/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
//update by id

export const updateQuotationeById = async (id, updatedFields) => {
  try {
    const response = await AxiosCreator.put(
      `/api/quotation/edit/${id}`,
      updatedFields
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//

export const genratePdfOfQuotation = async (id) => {
  try {
    const response = await AxiosCreator.get(
      `/api/quotation/generate-pdf/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//
export const supplementQuotation = async (data) => {
  try {
    const response = await AxiosCreator.post(
      "/api/quotation/addSupplmentery",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
//up sp


export const updateSpQuotationeById = async (id, updatedFields) => {
  try {
    const response = await AxiosCreator.put(
      `/api/quotation/editSupplmentery/${id}`,
      updatedFields
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};


///ad qu

export const createAdQuotation = async (data) => {
  try {
    const response = await AxiosCreator.post("api/additional-quote/add", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getAdQuotationeById = async (id) => {
  try {
    const response = await AxiosCreator.get(`/api/additional-quote/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getAdQuotationAll = async ({
  page = 1,
  size = 10,
  all = false,
  search = "",
  jobCardId = "",
}) => {
  try {
    const response = await AxiosCreator.get(
      `/api/additional-quote?page=${page}&size=${size}&all=${all}&search=${search}&jobCardId=${jobCardId}`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};


//update quo
//

export const updateAdQuotationeById = async (id, updatedFields) => {
  try {
    const response = await AxiosCreator.put(
      `/api/additional-quote/edit/${id}`,
      updatedFields
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//my task



export const getQuotationMyTask = async ({
  page = 1,
  size = 10,
  all = false,
  search = "",
  jobCardId = "",
}) => {
  try {
    const response = await AxiosCreator.get(
      `/api/my-task/quotation?page=${page}&size=${size}&all=${all}&search=${search}&jobCardId=${jobCardId}`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

//get task list



export const getMyTaskListConfig = async ({
  page = 1,
  size = 10,
  all = false,
  search = "",
  jobCardId = "",
}) => {
  try {
    const response = await AxiosCreator.get(
      `/api/my-tasks`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};