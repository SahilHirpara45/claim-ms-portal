import AxiosCreator from "../axios.config";

export const LicenceCustomerDetails = async (data) => {
    console.log("data", data);
    try {
        const response = await AxiosCreator.post("/api/extract/drivinglicence", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error in CustomerDetails:", error);
        return error.response ? error.response.data : { message: "Network Error" };
    }
}