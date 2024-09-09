import {
  companyCreate,
  deleteCompany,
  getCompanyById,
  getCompanyList,
  updateCompanyById
} from "../config/adminConfig/admin.config";

// Comapany
export const addCompany = async (data) => {
  const response = await companyCreate(data);
  return response;
};

export const getCompanies = async ({ page = 1, size = 10, all = false, search = "" }) => {
  const response = await getCompanyList({ page, size, all, search });
  return response;
};

export const deleteCompanyAction = async (id) => {
  const response = await deleteCompany(id);
  return response;
};

export const getSingleCompanieAction = async (id) => {
  const response = await getCompanyById(id);
  return response.data;
};

// Update Company
export const updateCompanyAction = async (id, updatedFields) => {
  const response = await updateCompanyById(id, updatedFields);

  return response;
};