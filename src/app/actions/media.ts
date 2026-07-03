"use server";

import { revalidatePath } from "next/cache";
import { writeFile, readdir, unlink, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");

// Ensure upload directory exists
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function uploadMedia(formData: FormData) {
  try {
    await ensureUploadDir();
    
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, message: "Tidak ada file yang diupload." };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${uniqueSuffix}-${originalName}`;
    const filePath = path.join(UPLOAD_DIR, filename);

    await writeFile(filePath, buffer);

    revalidatePath("/admin/media");
    revalidatePath("/admin/packages");
    return { success: true, url: `/uploads/${filename}` };
  } catch (error: any) {
    console.error("Upload error:", error);
    return { success: false, message: "Gagal mengupload file: " + error.message };
  }
}

export async function getMediaFiles() {
  try {
    await ensureUploadDir();
    const files = await readdir(UPLOAD_DIR);
    
    // Sort files by modified time or just return them as URLs
    // Since readdir doesn't guarantee order, we just return the URLs.
    // They usually have timestamp in the name due to our naming convention.
    return files
      .filter(file => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file))
      .sort((a, b) => b.localeCompare(a)) // Sort descending (newest first based on timestamp)
      .map(file => `/uploads/${file}`);
  } catch (error) {
    console.error("Failed to read media:", error);
    return [];
  }
}

export async function deleteMedia(fileUrl: string) {
  try {
    const filename = fileUrl.replace("/uploads/", "");
    const filePath = path.join(UPLOAD_DIR, filename);
    
    if (existsSync(filePath)) {
      await unlink(filePath);
      revalidatePath("/admin/media");
      revalidatePath("/admin/packages");
      return { success: true };
    }
    return { success: false, message: "File tidak ditemukan." };
  } catch (error: any) {
    return { success: false, message: "Gagal menghapus file: " + error.message };
  }
}
