import {
  createQuotation,
  getQuotation,
  deleteQuotatione,
  getQuotationeById,
  updateQuotationeById,
  genratePdfOfQuotation,
  supplementQuotation,
  createAdQuotation,
  getAdQuotationeById,
  getAdQuotationAll,
  updateAdQuotationeById,
  updateSpQuotationeById,
  getQuotationMyTask,
  getMyTaskListConfig,
} from "../../config/quotationConfig/quotation.config";

export const addQuotation = async (data) => {
  const response = await createQuotation(data);
  return response;
};

export const getAllQuotation = async ({
  page = 1,
  size = 10,
  all = false,
  search = "",
  jobCardId = "",
}) => {
  const response = await getQuotation({ page, size, all, search, jobCardId });
  return response;
};

export const deleteQuotation = async (id) => {
  const response = await deleteQuotatione(id);
  return response;
};

//

export const getSingleQuotation = async (id) => {
  const response = await getQuotationeById(id);
  return response.data;
};

//update

export const updateQuotation = async (id, updatedFields) => {
  const response = await updateQuotationeById(id, updatedFields);
  return response;
};



// genrate pdf

export const getPDFGenrate = async (id) => {
  const response = await genratePdfOfQuotation(id);
  return response;
};

//sup



export const addsupplementQuotation = async (data) => {
  const response = await supplementQuotation(data);
  return response;
};


//ad qu


export const addAdQuotation = async (data) => {
  const response = await createAdQuotation(data);
  return response;
};


export const getAdSingleQuotation = async (id) => {
  const response = await getAdQuotationeById(id);
  return response.data;
};


export const getAllAdQuotation = async ({
  page = 1,
  size = 10,
  all = false,
  search = "",
  jobCardId = "",
}) => {
  const response = await getAdQuotationAll({ page, size, all, search, jobCardId });
  return response;
};

///update ad qu

export const updateAdQuotation = async (id, updatedFields) => {
  const response = await updateAdQuotationeById(id, updatedFields);
  return response;
};

///
export const updateSpQuotation = async (id, updatedFields) => {
  const response = await updateSpQuotationeById(id, updatedFields);
  return response;
};


//my task

export const getAllQuotationMyTask = async ({
  page = 1,
  size = 10,
  all = false,
  search = "",
  jobCardId = "",
}) => {
  const response = await getQuotationMyTask({ page, size, all, search, jobCardId });
  return response;
};

//get task list getMyTaskListConfig

export const getMyTaskListAction = async ({
  page = 1,
  size = 10,
  all = false,
  search = "",
  jobCardId = "",
}) => {
  const response = await getMyTaskListConfig({ page, size, all, search, jobCardId });
  return response;
};