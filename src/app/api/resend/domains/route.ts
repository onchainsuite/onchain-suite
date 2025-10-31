import { NextResponse } from "next/server";
import { z } from "zod";

import { serverEnv } from "@/lib/env/server";

const base = serverEnv.R3TAIN_INFRA_URL.replace(/\/$/, "");

const DomainCreateSchema = z.object({
  domain: z.string().min(3),
});

export async function GET() {
  try {
    const res = await fetch(`${base}/resend/domains`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json({ ok: true, data }, { status: res.status });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Failed to list domains" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = DomainCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const res = await fetch(`${base}/resend/domains`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    const data = await res.json();
    return NextResponse.json({ ok: true, data }, { status: res.status });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Failed to create domain" },
      { status: 500 }
    );
  }
}
