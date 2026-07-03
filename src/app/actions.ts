"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// SETTINGS (HERO)
export async function getSettings() {
  const settings = await prisma.setting.findMany();
  return settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);
}

export async function saveSetting(key: string, value: string) {
  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  revalidatePath("/");
}

export async function saveMultipleSettings(settings: Record<string, string>) {
  const operations = Object.entries(settings).map(([key, value]) => 
    prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  );
  await prisma.$transaction(operations);
  revalidatePath("/");
  revalidatePath("/admin/about");
}

// PACKAGE TYPES
export async function getPackageTypes() {
  return prisma.packageType.findMany({ orderBy: { createdAt: "asc" } });
}

export async function createPackageType(data: { name: string; icon: string }) {
  await prisma.packageType.create({ data });
  revalidatePath("/");
  revalidatePath("/admin/package-types");
  revalidatePath("/admin/packages");
}

export async function updatePackageType(id: string, data: { name: string; icon: string }) {
  await prisma.packageType.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/admin/package-types");
  revalidatePath("/admin/packages");
}

export async function deletePackageType(id: string) {
  await prisma.packageType.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/package-types");
  revalidatePath("/admin/packages");
}

// DISHES
export async function getDishes() {
  return prisma.dish.findMany({ orderBy: { createdAt: "asc" } });
}

export async function createDish(data: { name: string; imageUrl: string }) {
  await prisma.dish.create({ data });
  revalidatePath("/");
  revalidatePath("/admin/dishes");
}

export async function updateDish(id: string, data: { name: string; imageUrl: string }) {
  await prisma.dish.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/admin/dishes");
}

export async function deleteDish(id: string) {
  await prisma.dish.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/dishes");
}

// PACKAGES
export async function getPackages() {
  return prisma.package.findMany({ 
    orderBy: { createdAt: "asc" },
    include: { packageType: true }
  });
}

export async function createPackage(data: { name: string; description: string; price: string; features: string[]; isFeatured: boolean; iconType: string; packageTypeId?: string; imageUrl?: string; imagePosition?: string }) {
  await prisma.package.create({ data });
  revalidatePath("/");
  revalidatePath("/admin/packages");
}

export async function updatePackage(id: string, data: { name: string; description: string; price: string; features: string[]; isFeatured: boolean; iconType: string; packageTypeId?: string; imageUrl?: string; imagePosition?: string }) {
  await prisma.package.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/admin/packages");
}

export async function deletePackage(id: string) {
  await prisma.package.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/packages");
}

// FEATURES (MENGAPA PILIH KAMI)
export async function getFeatures() {
  return prisma.feature.findMany({ orderBy: { order: "asc" } });
}

export async function createFeature(data: { title: string; description: string; icon: string; order: number }) {
  await prisma.feature.create({ data });
  revalidatePath("/");
  revalidatePath("/admin/features");
}

export async function updateFeature(id: string, data: { title: string; description: string; icon: string; order: number }) {
  await prisma.feature.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/admin/features");
}

export async function deleteFeature(id: string) {
  await prisma.feature.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/features");
}

// TESTIMONIALS
export async function getTestimonials() {
  return prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
}

// GALLERY
export async function getGalleries() {
  return prisma.gallery.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createGallery(data: { imageUrl: string; altText?: string }) {
  await prisma.gallery.create({ data });
  revalidatePath("/");
  revalidatePath("/admin/gallery");
}

export async function deleteGallery(id: string) {
  await prisma.gallery.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/gallery");
}
