import AxiosCreator from "../axios.config";

export const extractCar = async (data) => {
    try {
        const response = await AxiosCreator.post("/api/extract/carregcard", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};
