"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const secretKey = process.env.JWT_SECRET || "default_secret";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function loginAdmin(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validEmail = process.env.ADMIN_EMAIL;
  let validPassword = process.env.ADMIN_PASSWORD;

  // Try to get dynamic password from settings
  try {
    const passwordSetting = await prisma.setting.findUnique({
      where: { key: "admin_password" }
    });
    if (passwordSetting && passwordSetting.value) {
      validPassword = passwordSetting.value;
    }
  } catch (err) {
    console.error("Failed to fetch admin password setting", err);
  }

  if (email === validEmail && password === validPassword) {
    // Berhasil login
    const user = { email };
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 hari
    
    const session = await encrypt({ user, expires });
    
    // Set cookie di browser
    (await cookies()).set("session", session, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    
    return { success: true, message: "Login berhasil!" };
  } else {
    // Gagal login
    return { success: false, message: "Email atau Password salah!" };
  }
}

export async function logoutAdmin() {
  // Hapus cookie
  (await cookies()).set("session", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}
