const getFormatedData = (timestamp) => {
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(timestamp * 1000));

  return formattedDate;
};

const deslugify = (slug) => {
  return decodeURIComponent(slug) // Decode %26, %20, etc.
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize each word
    .replace(/(\d+)/g, ' $1') // Add space before numbers (optional)
    .replace(/\s+/g, ' ') // Clean up extra spaces
    .trim();
};

function slugify(str) {
  return str
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing whitespace
    .replace(/[^a-z0-9\s-]/g, '') // Remove all non-alphanumeric chars except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-'); // Replace multiple - with single -
}

const getFormatedDuration = (duration) => {
  const minutes = Math.floor(duration / 60);
  const seconds = (duration % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};
//       Math.floor(item?.duration / 60)}:
//                 {(item?.duration % 60).toString().padStart(2, '0')
// }

export { getFormatedData, deslugify, getFormatedDuration, slugify };
