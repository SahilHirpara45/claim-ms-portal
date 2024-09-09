import AxiosCreator from "../axios.config";

// export const carCreate = async (data) => {
//   console.log("car Create" ,data);
//   try {
//     const response = await AxiosCreator.post("/api/cars/add", {data});
//     return response.data;
//   } catch (error) {
//     console.error("Error in CarCreate:", error);
//     return error.response ? error.response.data : { message: "Network Error" };
//   }
// };

export const carCreate = async (data) => {
  try {
    const response = await AxiosCreator.post("/api/cars/add", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("response.data", response.data.message);
    return response?.data;
  } catch (error) {
    console.error("Error in CarCreate:", error.data.message);
    return error?.data ;
  }
};

export const getCarList = async ({
  page = 1,
  size = 10,
  all = false,
  search = "",
}) => {
  try {
    const response = await AxiosCreator.get(
      `/api/cars?page=${page}&size=${size}&all=${all}&search=${search}`
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const deleteCar = async (id) => {
  try {
    const res = await AxiosCreator.delete(`/api/cars/delete/${id}`);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getCarById = async (id) => {
  try {
    const response = await AxiosCreator.get(`/api/cars/${id}`);
    console.log("response.data", response.data);
    return response.data; // Return the data directly from the response
  } catch (error) {
    console.error("Fetch error:", error);
    return null; // Return null or a default value in case of an error
  }
};

export const updateCarById = async (id, updatedFields) => {
  console.log("i am updatedFields:=", updatedFields);
  try {
    const response = await AxiosCreator.put(
      `/api/cars/edit/${id}`,
      updatedFields
    );
    return response.data;
  } catch (error) {
    console.log(error,"Error");
    throw error?.data;
  }
};
