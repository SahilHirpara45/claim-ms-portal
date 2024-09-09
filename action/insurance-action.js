import {
  getInsuranceCarList,
  getInsuranceCustomerList,
  getInsuranceJobCardList,
} from "@/config/companyConfig/insurancecompany.config";
import {
  addInsuranceCompanyUser,
  editInsuranceCompanyUser,
  getInsuranceCompanyUsers,
} from "../config/company.config";

export const addInsuranceCompany = async (data) => {
  // console.log(data, config, "data");
  const response = await addInsuranceCompanyUser(data);
  return response;
};

export const getInsuranceCompanies = async () => {
  const response = await getInsuranceCompanyUsers();
  return response;
};

export const editInsuranceCompany = async (data) => {
  const response = await editInsuranceCompanyUser(data);
  return response;
};

export const getInsuranceCustomerListAction = async (
  id,
  { page = 1, size = 10, all = false, search = "" }
) => {
  const response = await getInsuranceCustomerList(id, {
    page,
    size,
    all,
    search,
  });
  return response;
};

export const getInsuranceCarListAction = async (
  id,
  { page = 1, size = 10, all = false, search = "" }
) => {
  const response = await getInsuranceCarList(id, { page, size, all, search });
  return response;
};

export const getInsuranceJobCardListAction = async (
  id,
  {
    page = 1,
    size = 10,
    all = false,
    search = "",
    status = "",
    startDate = "",
    endDate = "",
  }
) => {
  const response = await getInsuranceJobCardList(id, {
    page,
    size,
    all,
    search,
    status,
    startDate,
    endDate,
  });
  return response;
};
