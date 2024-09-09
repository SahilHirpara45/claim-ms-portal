import { changePassword, forgotPassword, getUserMe, registerUser } from "@/config/user.config";

export const addUser = async (data) => {
  const response = await registerUser(data);
  return response;
};

export const forgotUser = async (data) => {
  const response = await forgotPassword(data);
  return response;
};

export const changeNewPassword = async (data) => {
  const response = await changePassword(data);
  return response;
};

export const getUserMeAction = async (token) => {
  const response = await getUserMe(token);
  return response;
};