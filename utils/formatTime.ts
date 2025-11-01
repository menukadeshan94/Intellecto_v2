import moment from "moment";

export const formatTime = (date: Date | string | null) => {
  if (!date) return "N/A";
  return moment(date).format("Do MMMM YYYY, HH:mm");
};