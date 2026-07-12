import { createClient } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";

import { qaValue } from "../e2e/helpers/qa-environment";

const url = qaValue("NEXT_PUBLIC_SUPABASE_URL");
const key = qaValue("NEXT_PUBLIC_SUPABASE_ANON_KEY");
const password = qaValue("QA_TEST_PASSWORD");
const studentId = "10000000-0000-4000-8000-000000000001";

async function clientFor(emailKey: string) {
  const client = createClient(url, key, { auth: { persistSession: false } });
  const result = await client.auth.signInWithPassword({ email: qaValue(emailKey), password });
  expect(result.error).toBeNull();
  return client;
}

describe("private evidence storage", () => {
  it("enforces owner upload rules and linked-reader isolation", async () => {
    const student = await clientFor("QA_STUDENT_EMAIL");
    const path = `${studentId}/qa-storage-${Date.now()}/evidence.png`;
    const png = new Blob([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])], { type: "image/png" });
    const upload = await student.storage.from("evidence").upload(path, png);
    expect(upload.error).toBeNull();

    const tutor = await clientFor("QA_TUTOR_EMAIL");
    expect((await tutor.storage.from("evidence").download(path)).error).toBeNull();
    const parent = await clientFor("QA_PARENT_EMAIL");
    expect((await parent.storage.from("evidence").download(path)).error).toBeNull();
    const unrelatedParent = await clientFor("QA_PARENT_B_EMAIL");
    expect((await unrelatedParent.storage.from("evidence").download(path)).error).not.toBeNull();

    const wrongPath = await student.storage.from("evidence").upload(`10000000-0000-4000-8000-000000000003/qa-${Date.now()}.png`, png);
    expect(wrongPath.error).not.toBeNull();
    const wrongType = await student.storage.from("evidence").upload(`${studentId}/qa-${Date.now()}.html`, new Blob(["<script></script>"], { type: "text/html" }));
    expect(wrongType.error).not.toBeNull();
    const oversized = await student.storage.from("evidence").upload(`${studentId}/qa-${Date.now()}-large.png`, new Blob([new Uint8Array(5 * 1024 * 1024 + 1)], { type: "image/png" }));
    expect(oversized.error).not.toBeNull();

    expect((await student.storage.from("evidence").remove([path])).error).toBeNull();
  }, 30_000);
});
