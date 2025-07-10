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
    .replace(/&/g, '-and-') // Replace & with -and-
    .replace(/[^a-z0-9\s-]/g, '') // Remove all non-alphanumeric chars except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-'); // Replace multiple - with single -
}

const getFormatedDuration = (duration) => {
  const minutes = Math.floor(duration / 60);
  const seconds = (duration % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const shortenText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

function toISTIso8601(timestampInSeconds) {
  if (typeof timestampInSeconds !== 'number' || isNaN(timestampInSeconds)) {
    return null;
  }

  const date = new Date(timestampInSeconds * 1000); // Convert seconds to ms

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date generated from timestamp');
  }

  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value;

  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get(
    'second'
  )}+05:30`;
}

function cleanVideoDescription(rawDescription) {
  if (!rawDescription || typeof rawDescription !== 'string') return '';

  return rawDescription
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/#[\w-]+/g, '')
    .replace(/[►]+/g, '')
    .replace(/Android Google Play:.*/i, '') // Remove app download line
    .replace(/Like Us On Facebook.*/i, '') // Remove Facebook line
    .replace(/Follow Us on\s+Twitter.*/i, '')
    .replace(/Subscribe.*?Lokmat/i, '')
    .replace(/आमचा video.*?विसरू नका!/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, 400);
}

export {
  getFormatedData,
  deslugify,
  getFormatedDuration,
  slugify,
  shortenText,
  toISTIso8601,
  cleanVideoDescription,
};
