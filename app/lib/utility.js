const getFormatedData = (timestamp) => {
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(timestamp * 1000));

  return formattedDate;
};

export { getFormatedData };
