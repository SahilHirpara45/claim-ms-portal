import { getMasterCardata } from "../../config/companyConfig/masterCar";


export const getMasterCarDataAction = async (params) => {
    // console.log("params in action",params);
    const response = await getMasterCardata(params);
    return response;
};
