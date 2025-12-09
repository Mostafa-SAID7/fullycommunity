/**
 * File utility functions
 */

/**
 * Format file size to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

/**
 * Get filename without extension
 */
export function getFileNameWithoutExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '');
}

/**
 * Check if file is image
 */
export function isImageFile(file: File | string): boolean {
  if (typeof file === 'string') {
    const ext = getFileExtension(file).toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext);
  }
  return file.type.startsWith('image/');
}

/**
 * Check if file is video
 */
export function isVideoFile(file: File | string): boolean {
  if (typeof file === 'string') {
    const ext = getFileExtension(file).toLowerCase();
    return ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(ext);
  }
  return file.type.startsWith('video/');
}

/**
 * Check if file is audio
 */
export function isAudioFile(file: File | string): boolean {
  if (typeof file === 'string') {
    const ext = getFileExtension(file).toLowerCase();
    return ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'].includes(ext);
  }
  return file.type.startsWith('audio/');
}

/**
 * Check if file is document
 */
export function isDocumentFile(file: File | string): boolean {
  if (typeof file === 'string') {
    const ext = getFileExtension(file).toLowerCase();
    return ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(ext);
  }
  return ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'].includes(file.type);
}

/**
 * Convert File to Base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * Convert Base64 string to Blob
 */
export function base64ToBlob(base64: string, contentType = ''): Blob {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

/**
 * Download file from URL
 */
export function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Download data as file
 */
export function downloadData(data: string, filename: string, type = 'text/plain'): void {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  downloadFile(url, filename);
  URL.revokeObjectURL(url);
}

/**
 * Read file as text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * Compress image file
 */
export function compressImage(file: File, maxWidth = 1920, maxHeight = 1080, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to compress image'));
        }, file.type, quality);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}
