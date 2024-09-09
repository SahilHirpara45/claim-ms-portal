import { registerCar } from "@/config/addcar.config";

export const addCar = async (data) => {
  const response = await registerCar(data);
  return response;
};

