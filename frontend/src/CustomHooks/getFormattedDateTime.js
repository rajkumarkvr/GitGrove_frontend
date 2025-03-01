function getFormattedDateTime(timestamp) {
  timestamp = timestamp.replaceAll("Z", "");

  const date = new Date(timestamp + "Z");
  date.setHours(date.getHours() - 5);
  date.setMinutes(date.getMinutes() - 30);

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export default getFormattedDateTime;
