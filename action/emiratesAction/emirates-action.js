
import { CustomerDetails } from "../../config/extractEmiratesConfig/emirates.config";

export const addEmiratesData = async (data) => {
    const response = await CustomerDetails(data);
    return response;
};