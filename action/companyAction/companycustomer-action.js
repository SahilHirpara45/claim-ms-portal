import { addCustomerintoCompany } from "../../config/companyConfig/companycustomer.config";

export const addCustomerCompany = async (data) => {
    const response = await addCustomerintoCompany(data);
    return response;
};
