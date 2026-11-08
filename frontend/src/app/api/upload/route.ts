import { NextResponse } from "next/server";
import { getLoginSessionForApi } from "@/lib/login/manage-login";
import { apiUrl } from "@/utils/api-request";

export async function POST(request: Request) {
  try {
    const token = await getLoginSessionForApi();

    if (!token) {
      return NextResponse.json(
        { message: "Authentication is required." },
        { status: 401 },
      );
    }

    const formData = await request.formData();

    const response = await fetch(`${apiUrl}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({
      message: "Invalid response from upload server.",
    }));

    if (response.ok && typeof data.url === "string") {
      const filename = data.url.split("/").pop();
      if (filename) {
        return NextResponse.json({ url: `/api/uploads/${encodeURIComponent(filename)}` }, {
          status: response.status,
        });
      }
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Upload route error:", error);

    return NextResponse.json(
      { message: "Unable to process the image upload." },
      { status: 500 },
    );
  }
}
