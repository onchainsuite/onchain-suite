import { NextResponse } from "next/server";
import { z } from "zod";

import { serverEnv } from "@/lib/env/server";

const base = serverEnv.R3TAIN_INFRA_URL.replace(/\/$/, "");

const ContactCreateSchema = z.object({
  projectId: z.string().min(1),
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  status: z.string().optional(),
  tags: z.array(z.string()).optional(),
  customFields: z.record(z.string(), z.any()).optional(),
  source: z.string().optional(),
  campaignId: z.string().optional(),
});

export async function GET() {
  try {
    const res = await fetch(`${base}/api/contacts`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json({ ok: true, data }, { status: res.status });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to fetch contacts";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ContactCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const res = await fetch(`${base}/api/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    const data = await res.json();
    return NextResponse.json({ ok: true, data }, { status: res.status });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to create contact";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
