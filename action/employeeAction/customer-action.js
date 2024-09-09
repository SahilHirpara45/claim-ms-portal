import {
  CustomerCreate,
  getCustomerList,
  updateCustomerById,
  deleteCustomer,
  getCustomerById,
} from "@/config/employeeConfig/customer.config";

export const addCustomer = async (data) => {
  const response = await CustomerCreate(data);
  return response;
};

export const getCustomerListAction = async ({ page = 1, size = 10, all = false, search = "" }) => {
  const response = await getCustomerList({ page, size, all, search });
  return response;
};

export const deleteCustomerAction = async (ids) => {
  const response = await deleteCustomer(ids);
  return response;
};

export const getSinglecustomerAction = async (id) => {
  const response = await getCustomerById(id);
  return response.data;
};

// Update Company
export const updateCustomerAction = async (id, updatedFields) => {
  const response = await updateCustomerById(id, updatedFields);
  return response;
};
