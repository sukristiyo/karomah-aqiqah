"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getTestimonials() {
  return await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function createTestimonial(data: {
  type: string;
  name: string;
  role?: string;
  content?: string;
  rating?: number;
  avatar?: string;
  imageUrl?: string;
}) {
  try {
    const testimonial = await prisma.testimonial.create({
      data: {
        type: data.type || "text",
        name: data.name,
        role: data.role || null,
        content: data.content || null,
        rating: data.rating || 5,
        avatar: data.avatar || null,
        imageUrl: data.imageUrl || null,
      },
    });
    
    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true, data: testimonial };
  } catch (error) {
    console.error("Failed to create testimonial:", error);
    return { success: false, error: "Gagal menambahkan testimoni" };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await prisma.testimonial.delete({
      where: { id },
    });
    
    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete testimonial:", error);
    return { success: false, error: "Gagal menghapus testimoni" };
  }
}
