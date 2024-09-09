import AxiosCreator from "../axios.config";

export const CustomerDetails = async (data) => {
    console.log("data", data);
    try {
        const response = await AxiosCreator.post("/api/extract/emiratesid", data, {
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