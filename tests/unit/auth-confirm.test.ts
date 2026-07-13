import { beforeEach, describe, expect, it, vi } from "vitest";

const { verifyOtp } = vi.hoisted(() => ({
  verifyOtp: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(async () => ({
    auth: { verifyOtp },
  })),
}));

import { GET } from "@/app/auth/confirm/route";

describe("cross-device email confirmation", () => {
  beforeEach(() => {
    verifyOtp.mockReset();
  });

  it("verifies a recovery token hash and opens the password form", async () => {
    verifyOtp.mockResolvedValue({ error: null });

    const response = await GET(new Request(
      "https://iatech-builder.vercel.app/auth/confirm?token_hash=single-use-token&type=recovery&next=/reset-password",
    ) as never);

    expect(verifyOtp).toHaveBeenCalledWith({ token_hash: "single-use-token", type: "recovery" });
    expect(response.headers.get("location")).toBe("https://iatech-builder.vercel.app/reset-password");
  });

  it("does not expose provider errors for invalid or consumed links", async () => {
    verifyOtp.mockResolvedValue({ error: new Error("One-time token not found") });

    const response = await GET(new Request(
      "https://iatech-builder.vercel.app/auth/confirm?token_hash=consumed&type=recovery&next=/reset-password",
    ) as never);
    const location = new URL(response.headers.get("location")!);

    expect(location.pathname).toBe("/forgot-password");
    expect(location.searchParams.get("error")).toContain("invalid or has expired");
    expect(location.href).not.toContain("One-time");
  });

  it("rejects an external next destination", async () => {
    verifyOtp.mockResolvedValue({ error: null });

    const response = await GET(new Request(
      "https://iatech-builder.vercel.app/auth/confirm?token_hash=valid&type=recovery&next=https://attacker.example",
    ) as never);

    expect(response.headers.get("location")).toBe("https://iatech-builder.vercel.app/reset-password");
  });
});
