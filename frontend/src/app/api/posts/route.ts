import { NextResponse } from "next/server";
import { apiUrl } from "@/utils/api-request";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim();
  const searchParams = new URLSearchParams();
  if (query) searchParams.set("q", query);

  try {
    const response = await fetch(
      `${apiUrl}/posts${searchParams.size ? `?${searchParams}` : ""}`,
      { cache: "no-store", signal: AbortSignal.timeout(10_000) },
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "Unable to search posts right now." },
        { status: response.status },
      );
    }

    return NextResponse.json(await response.json(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Post search route failed:", error);
    return NextResponse.json(
      { message: "Unable to connect to the posts service." },
      { status: 502 },
    );
  }
}
