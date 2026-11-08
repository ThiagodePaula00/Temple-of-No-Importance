import { apiUrl } from "@/utils/api-request";

type RouteContext = { params: Promise<{ filename: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { filename } = await params;

  if (!/^[\w.-]+\.webp$/.test(filename)) {
    return new Response("Not found", { status: 404 });
  }

  const response = await fetch(`${apiUrl}/uploads/${encodeURIComponent(filename)}`, {
    cache: "no-store",
  });

  if (!response.ok || !response.body) {
    return new Response("Not found", { status: response.status || 404 });
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
