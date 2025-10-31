import { type NextRequest, NextResponse } from "next/server";

import { serverEnv } from "@/lib/env/server";

const base = serverEnv.R3TAIN_INFRA_URL.replace(/\/$/, "");

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const res = await fetch(`${base}/resend/domains/${id}`, {
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json({ ok: true, data }, { status: res.status });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Failed to get domain" },
      { status: 500 }
    );
  }
}
