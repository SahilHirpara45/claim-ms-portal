import AxiosCreator, { api } from "@/config/axios.config";

export const registerUser = async (data) => {
  try {
    const response = await api.post("/auth/signup", data);

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const forgotPassword = async (data) => {
  try {
    const response = await api.post("/auth/forgot-password", data);
    return response.data;
  } catch (error) {
    throw error?.response?.data;
  }
};

export const changePassword = async (data) => {
  console.log(data, "payload data")
  const { id, password } = data
  try {
    const response = await api.post(`/auth/reset-password/${id}`, { password: password });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export const getUserMe = async (token) => {
  try {
    const response = await AxiosCreator.get('/api/user/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Return the data directly from the response
  } catch (error) {
    console.error('Fetch error:', error);
    return null; // Return null or a default value in case of an error
  }
};