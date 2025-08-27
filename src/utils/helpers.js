export const formatTimestamp = (
  timestamp,
  format = {
    hour: "2-digit",
    minute: "2-digit",
  }
) => {
  return new Date(timestamp).toLocaleTimeString("fa-IR", format);
};
