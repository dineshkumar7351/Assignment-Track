/**
 * Resolves a file URL to a fully accessible download / view URL.
 * Handles absolute Cloudinary/HTTP URLs, custom VITE_API_URL endpoints, and relative /uploads paths.
 */
export const getFileDownloadUrl = (url) => {
  if (!url) return '#';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
    return url;
  }

  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl && apiUrl.startsWith('http')) {
    const origin = apiUrl.replace(/\/api\/?$/, '');
    return `${origin}${url.startsWith('/') ? url : `/${url}`}`;
  }

  return url;
};
