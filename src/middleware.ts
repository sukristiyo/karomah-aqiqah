import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  
  // Rute yang butuh proteksi (semua di bawah /admin)
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  
  // Jika user mencoba akses /admin tanpa token yang valid
  if (isAdminRoute) {
    if (!session) {
      // Tidak ada token, redirect ke login
      return NextResponse.redirect(new URL("/login", request.url));
    }
    
    try {
      // Verifikasi token JWT
      const secretKey = process.env.JWT_SECRET || "default_secret";
      const key = new TextEncoder().encode(secretKey);
      
      await jwtVerify(session, key, {
        algorithms: ["HS256"],
      });
      
      // Token valid, boleh masuk
      return NextResponse.next();
      
    } catch (error) {
      // Token tidak valid atau expired
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Jika mencoba ke halaman /login tapi sudah punya sesi aktif, redirect ke /admin
  if (request.nextUrl.pathname === "/login") {
    if (session) {
      try {
        const secretKey = process.env.JWT_SECRET || "default_secret";
        const key = new TextEncoder().encode(secretKey);
        await jwtVerify(session, key, { algorithms: ["HS256"] });
        
        // Sudah login, arahkan ke dashboard
        return NextResponse.redirect(new URL("/admin", request.url));
      } catch (error) {
        // Abaikan error jika token salah saat di halaman login, biarkan login ulang
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  // Hanya jalankan middleware ini pada rute-rute berikut
  matcher: ["/admin/:path*", "/login"],
};
