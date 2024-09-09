import {
  carCreate,
  deleteCar,
  getCarById,
  getCarList,
  updateCarById
} from "../../config/companyConfig/car.config";

// Comapany
export const addCar = async (data) => {
  const response = await carCreate(data);
  return response;
};

export const getCars = async ({ page = 1, size = 10, all = false, search = "" }) => {
  const response = await getCarList({ page, size, all, search });
  return response;
};

export const deleteCarAction = async (id) => {
  const response = await deleteCar(id);
  return response;
};

export const getSingleCarAction = async (id) => {
  const response = await getCarById(id);
  return response.data;
};

// Update Car
export const updateCarAction = async (id, updatedFields) => {
  console.log("i update of company data:-", id);
  await updateCarById(id, updatedFields);
};


//
