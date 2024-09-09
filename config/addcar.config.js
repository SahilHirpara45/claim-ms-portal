import AxiosCreator, { api } from "@/config/axios.config";


export const registerCar = async (data) => {
  try {
    const response = await AxiosCreator.post("api/car/add", data);
    console.log(response, "res")

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};