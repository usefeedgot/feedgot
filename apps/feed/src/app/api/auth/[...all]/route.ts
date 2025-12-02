import { auth } from "@feedgot/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { isTrustedOrigin, corsHeaders } from "@feedgot/auth/trust";
const handler = toNextJsHandler(auth);

async function isTrusted(origin: string): Promise<boolean> {
  return isTrustedOrigin(origin);
}

async function withCors(req: Request, res: Response): Promise<Response> {
  const origin = req.headers.get("origin") || "";
  const trusted = await isTrusted(origin);
  if (origin && trusted) {
    const h = new Headers(res.headers);
    const ch = corsHeaders(origin);
    Object.entries(ch).forEach(([k, v]) => h.set(k, v));
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: h,
    });
  }
  return res;
}

export const OPTIONS = async (req: Request) => {
  const origin = req.headers.get("origin") || "";
  if (origin && (await isTrustedOrigin(origin))) {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  return new Response(null, { status: 204 });
};

export const GET = async (req: Request) =>
  withCors(req, await handler.GET(req));
export const POST = async (req: Request) =>
  withCors(req, await handler.POST(req));
