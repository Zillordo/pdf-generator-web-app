import { type Record } from "@prisma/client/runtime/library";
import fs from "fs";

export const createDirectory = (directoryPath: string) => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
    console.log(`Directory '${directoryPath}' created successfully.`);
  } else {
    console.log(`Directory '${directoryPath}' already exists.`);
  }
};

export const getFileFormat = (base64: string) => {
  const decodedBuffer = Buffer.from(base64, "base64");
  const decodedData = decodedBuffer.toString("binary");

  const signatures: Record<string, string> = {
    jpeg: "\xFF\xD8\xFF",
    png: "\x89\x50\x4E\x47\x0D\x0A\x1A\x0A",
    gif: "GIF",
  };

  for (const format in signatures) {
    const sig = signatures[format];
    if (sig && decodedData.startsWith(sig)) {
      return format;
    }
  }

  return "unknown";
};
