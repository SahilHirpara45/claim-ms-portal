import AxiosCreator from "../axios.config";

export const updateEmployeeSettings = async (updatedFields) => {
  try {
    const response = await AxiosCreator.put(
      `/api/profile/edit-employee`,
      updatedFields
    );
    console.log("Updated company:-", response?.data);
    return response.data;
  } catch (error) {
    // console.log(error, "error into config")
    throw error.data;
  }
};
