import { getNotification, getUnReadNotification } from "../../config/notificationConfig/notification.config";

export const getNotificationAction = async (token) => {
  const response = await getNotification(token);
  return response;
};





export const getUnReadNotificationAction = async (token) => {
  const response = await getUnReadNotification(token);
  return response;
};