// import { AxiosCreator } from "@/config/axios.config";
import AxiosCreator from"./axios.config"
export const customerCreate = async (data) => {
  console.log("customerCreate");
  try {
    const response = await AxiosCreator.post("/api/customer/add", data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error in customerCreate:", error);
    return error.response ? error.response.data : { message: "Network Error" };
  }
};

export const getCustomers = async () => {
  try {
      const response = await AxiosCreator.get("/api/customers");
      return response.data;
  } catch (error) {
      return error.response.data;
  }
}

export const editCustomerData = async (data) => {
  try {
      const response = await AxiosCreator.patch("/api/customer/edit", data);
      return response.data;
  } catch (error) {
      return error.response.data;
  }
}