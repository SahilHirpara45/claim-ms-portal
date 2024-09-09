import { updateEmployeeSettings } from "../../config/employeeConfig/profile-config";

export const updateEmployeeSettingsAction = async ( updatedFields) => {
    const response = await updateEmployeeSettings( updatedFields);
  
    return response;
  };