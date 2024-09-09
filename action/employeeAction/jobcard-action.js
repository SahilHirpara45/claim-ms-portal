import {
  CreateJobCard,
  DeleteJobCard,
  getCommentList,
  getHistoryList,
  getJobCardById,
  getJobCardsList,
  getJobCardsMyTaskList,
  updateJobCardById,
  AddComment,
  getInsuranceValid,
  getCarFormPDFConGenrate,
  getFormAllDocPDFConGenrate,
  uploadDamageImageConfig
} from "../../config/companyConfig/jobcard.config";


export const addJobCard = async (data) => {
  const response = await CreateJobCard(data);
  return response;
};

export const getJobCardListAction = async ({ page = 1, size = 10, all = false, search = "", status = "", startDate = "", endDate = "", completeStartDate = "", completeEndDate = "" }) => {
  const response = await getJobCardsList({ page, size, all, search, status, startDate, endDate, completeStartDate, completeEndDate });
  return response;
};

// export const deleteJobCardAction = async (id) => {
//   const response = await DeleteJobCard(id);
//   return response;
// };

export const deleteJobCardAction = async (id) => {
  try {
    const response = await DeleteJobCard(id);
    return response;
  } catch (error) {
    // Handle error, you can log it or throw a custom error if needed
    console.error('Error deleting job card:', error);
    throw new Error('Failed to delete job card');
  }
};


export const getSingleJobCardAction = async (id) => {
  console.log("getSingleJobCardAction", id);
  const response = await getJobCardById(id);
  console.log(response.data, "response response.data");
  return response.data;
};

// Update
export const updateJobCardAction = async (id, updatedFields) => {
  const response = await updateJobCardById(id, updatedFields);
  return response;
};

// job card history
export const getHistoryAction = async ({ jobCardId = "" }) => {
  const response = await getHistoryList({ jobCardId });
  return response;
}


//my task jobcard new
export const getJobCardMyTaskListAction = async ({ page = 1, size = 10, all = false, search = "", status = "", startDate = "", endDate = "" }) => {
  const response = await getJobCardsMyTaskList({ page, size, all, search, status, startDate, endDate });
  return response;
};

///get cooment
export const getCommentAction = async ({ jobCardId = "" }) => {
  const response = await getCommentList({ jobCardId });
  return response;
}
//add coomet
export const AddCommentAction = async (data) => {
  const response = await AddComment(data);
  return response;
};

//check validation insurance survarye
export const getInsuranceValidAction = async (id) => {
  const response = await getInsuranceValid(id);
  return response;
};


//get car form pdf
export const getCarFormPDFGenrateAction = async (id) => {
  const response = await getCarFormPDFConGenrate(id);
  return response;
};

//get all document 

export const getCarFormAllDocPDFGenrateAction = async (id) => {
  const response = await getFormAllDocPDFConGenrate(id);
  return response;
};


//upload damage Image

export const uploadDamageImageAction = async (data) => {
  
  const response = await uploadDamageImageConfig(data);
  return response;
};