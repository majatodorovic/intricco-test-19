/**
 * Converts an array of File objects into Base64-encoded strings.
 *
 * @param {File[]} params.files - An array of File objects to be converted.
 * @returns {Promise<string[]>} - A promise that resolves to an array of Base64-encoded strings.
 */

export const convertFileToBase64 = async (files) => {
  const promises = files.map((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  });
  return await Promise.all(promises);
};
