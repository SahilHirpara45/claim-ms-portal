import AxiosCreator from "../axios.config";

export const getMasterCardata = async (params) => {
  try {
    console.log("params",params);
    const response = await AxiosCreator.get("/api/master-cars/step-wise", {
        ...params
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
