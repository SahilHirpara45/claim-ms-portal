import { addInsuranceCompanyUser, deleteInsuranceCompany, editInsuranceCompanyUser, getInsuranceCompanyById, getInsuranceCompanyUsers, updateInsuranceCompanyById } from "../../config/companyConfig/insurancecompany.config";
import { getGarageInsuranceCompanyById, getGarrageInsuranceCompanyList, updateGarageInsuranceCompanyById,getGarrageInsuranceCompanyListJobCard } from "../../config/companyConfig/garrageinsurance.config";


// For SuperAdmin
export const addInsuranceCompany = async (data) => {
    // console.log(data, config, "data");
    const response = await addInsuranceCompanyUser(data);
    return response;
};

export const getInsuranceCompanies = async ({ page = 1, size = 10, all = false, search = "" }) => {
    const response = await getInsuranceCompanyUsers({ page, size, all, search });
    return response;
}

export const deleteInsurance = async (data) => {
    const response = await deleteInsuranceCompany(data);
    return response;
}

export const getSingleInsurance = async (id) => {
    const response = await getInsuranceCompanyById(id);
    return response.data;
};

export const updateInsurance = async (id, updatedFields) => {
    return await updateInsuranceCompanyById(id, updatedFields);
};


//  For company Garage
export const getGarrageInsuranceCompanies = async ({ page = 1, size = 10, all = false, search = "",isActive=false }) => {
    const response = await getGarrageInsuranceCompanyList({ page, size, all, search,isActive });
    return response;
  }

  ///new  10 dhfhd

  export const getGarrageInsuranceCompaniesJobcard = async ({ page = 1, size = 10, all = false, search = "",isActive=false }) => {
    const response = await getGarrageInsuranceCompanyListJobCard({ page, size, all, search,isActive });
    return response;
  }


  //
  
  export const getGarageInsuranceCompany = async (id) => {
    const response = await getGarageInsuranceCompanyById(id);
    return response.data;
  };

  export const updateGarrageInsurance = async (id, updatedFields) => {
    return await updateGarageInsuranceCompanyById(id, updatedFields);
};