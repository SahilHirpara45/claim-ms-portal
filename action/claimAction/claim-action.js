import { GetClaims, GetMyTaskClaimsCon, updateClaimById } from "../../config/claimConfig/claim.config";

export const getClaimsAction = async ({
  page = 1,
  size = 10,
  all = false,
  search = "",
}) => {
  const response = await GetClaims({ page, size, all, search });
  return response;
};


//Update
export const updateClaimAction = async (id, updatedFields) => {
  const response =  await updateClaimById(id, updatedFields);
  return response;
};

//get my task claim

export const getClaimsMyTaskAction = async ({
  page = 1,
  size = 10,
  all = false,
  search = "",
}) => {
  const response = await GetMyTaskClaimsCon({ page, size, all, search });
  return response;
};