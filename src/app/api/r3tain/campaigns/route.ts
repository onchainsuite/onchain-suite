import { NextResponse } from "next/server";
import { z } from "zod";

import { serverEnv } from "@/lib/env/server";

const base = serverEnv.R3TAIN_INFRA_URL.replace(/\/$/, "");

const CampaignCreateSchema = z.object({
  projectId: z.string().min(1),
  userId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.string().default("email"),
  status: z.string().default("draft"),
  content: z.any().optional(),
  scheduledAt: z.string().optional(),
});

export async function GET() {
  try {
    const res = await fetch(`${base}/api/campaigns`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json({ ok: true, data }, { status: res.status });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Failed to fetch campaigns";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CampaignCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const res = await fetch(`${base}/api/campaigns`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    const data = await res.json();
    return NextResponse.json({ ok: true, data }, { status: res.status });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Failed to create campaign";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
