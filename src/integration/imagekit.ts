import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey:
    process.env.IMAGEKIT_PUBLIC_KEY || "public_viR8S5Os1ENiwnqFN9T6iJUOVa8=",
  privateKey:
    process.env.IMAGEKIT_PRIVATE_KEY || "private_F/vqjqlDPIZh/n3Z1VUZ0kVD7bk=",
  urlEndpoint:
    process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/oworxunojv5",
});

type UploadImageResult = {
  success: boolean;
  data?: any;
  error?: string;
};

export const uploadImage = async (
  file: Buffer,
  fileName: string
): Promise<UploadImageResult> => {
  try {
    const response = await imagekit.upload({
      file, // File buffer
      fileName, // File name
      folder: process.env.IMAGE_KIT_FOLDER || "/apphub_images/",
    });
    return { success: true, data: response };
  } catch (error: any) {
    console.log("[ERROR - ImageKit uploadImage]", error);
    return { success: false, error: error.message || "Unknown error" };
  }
};
