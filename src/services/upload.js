const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

export function uploadImage(file, type, token, onProgress) {
  return new Promise((resolve, reject) => {
    try {
      // Validate
      const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowed.includes(file.type)) {
        return reject(new Error('Only JPG, JPEG, PNG are allowed'));
      }
      const max = 5 * 1024 * 1024; // 5MB
      if (file.size > max) {
        return reject(new Error('Max size 5MB'));
      }

      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE}/api/upload/${type}`);
      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.upload.onprogress = (evt) => {
        if (onProgress && evt.lengthComputable) {
          const percent = Math.round((evt.loaded * 100) / evt.total);
          onProgress(percent);
        }
      };

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText || '{}');
              if (data?.success && data?.url) {
                resolve(data.url);
              } else {
                reject(new Error('Upload failed'));
              }
            } catch (e) {
              reject(new Error('Invalid server response'));
            }
          } else {
            reject(new Error(`Upload failed (${xhr.status})`));
          }
        }
      };

      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.send(formData);
    } catch (err) {
      reject(err);
    }
  });
}

const uploadService = { uploadImage };
export default uploadService;
