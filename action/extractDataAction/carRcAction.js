import { extractCar } from "../../config/extractConfig/extractCar.config";

export const extractCarAction = async (data) => {
  const response = await extractCar(data);
  return response;
};
