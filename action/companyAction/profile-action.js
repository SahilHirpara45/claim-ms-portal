import { updateCompanySettings } from "../../config/companyConfig/profile-config";

export const updateCompanySettingsAction = async ( updatedFields) => {
    const response = await updateCompanySettings( updatedFields);
  
    return response;
  };