import AxiosCreator from "../axios.config";

export const addCustomerintoCompany = async (data) => {
    console.log("comapny Create");
    try {
        const response = await AxiosCreator.post("/api/customer/add", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error in customerCreate:", error);
        return error.response ? error.response.data : { message: "Network Error" };
    }
};