import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let password = req.headers.get("x-admin-password");
    if (!password) {
      try {
        const body = await req.json();
        password = body.password;
      } catch {}
    }
    const adminPass = process.env.BLOG_ADMIN_PASSWORD;

    if (password && password === adminPass) {
      return NextResponse.json({ success: true, message: "Autentikasi berhasil" });
    }

    return NextResponse.json(
      { success: false, message: "Password admin tidak cocok." },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  const adminPass = process.env.BLOG_ADMIN_PASSWORD || "ghitechadmin2026";
  if (password && password === adminPass) {
    return NextResponse.json({ success: true, message: "Valid" });
  }
  return NextResponse.json(
    { success: false, message: "Invalid" },
    { status: 401 }
  );
}

