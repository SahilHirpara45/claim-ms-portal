import { LicenceCustomerDetails } from "../../config/extractLicenceConfig/licence.config";

export const addLicenceData = async (data) => {
    const response = await LicenceCustomerDetails(data);
    return response;
};