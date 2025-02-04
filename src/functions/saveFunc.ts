import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";

export async function saveImage(
  photoUri?: string
): Promise<string | undefined> {
  if (!photoUri) return;
  const base64Data = await convertToBase64(photoUri);
  const fileName = `photo_${Date.now()}.jpeg`;
  if (Capacitor.isNativePlatform()) {
    //Native saving
    try {
      const result = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Data,
      });

      const filePath = result.uri;
      return filePath;
    } catch (e) {
      console.error("Error saving file:", e);
    }
  } else {
    //Web Saving
    try {
      localStorage.setItem(fileName, base64Data);
      const filePath = fileName;
      return filePath;
    } catch (error) {
      console.error("Error saving file (web):", error);
    }
  }
}

const convertToBase64 = async (uri: string): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
