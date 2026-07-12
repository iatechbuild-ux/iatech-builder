import { createClient } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";

import { qaValue } from "../e2e/helpers/qa-environment";

const url = qaValue("NEXT_PUBLIC_SUPABASE_URL");
const key = qaValue("NEXT_PUBLIC_SUPABASE_ANON_KEY");
const password = qaValue("QA_TEST_PASSWORD");

async function visibleProfiles(email: string) {
  const client = createClient(url, key, { auth: { persistSession: false } });
  const login = await client.auth.signInWithPassword({ email, password });
  expect(login.error).toBeNull();
  const result = await client.from("profiles").select("id").order("id");
  expect(result.error).toBeNull();
  return result.data?.map((row) => row.id) ?? [];
}

describe("profile RLS isolation", () => {
  it("student sees only their own profile", async () => {
    expect(await visibleProfiles(qaValue("QA_STUDENT_EMAIL"))).toEqual([
      "10000000-0000-4000-8000-000000000001",
    ]);
  });

  it("Tutor A sees only their own profile and Cohort A learners", async () => {
    expect(await visibleProfiles(qaValue("QA_TUTOR_EMAIL"))).toEqual([
      "10000000-0000-4000-8000-000000000001",
      "10000000-0000-4000-8000-000000000002",
      "10000000-0000-4000-8000-000000000004",
    ]);
  });

  it("Parent A sees only their own profile and verified child", async () => {
    expect(await visibleProfiles(qaValue("QA_PARENT_EMAIL"))).toEqual([
      "10000000-0000-4000-8000-000000000001",
      "10000000-0000-4000-8000-000000000006",
    ]);
  });

  it("admin sees the complete QA account set", async () => {
    expect(await visibleProfiles(qaValue("QA_ADMIN_EMAIL"))).toHaveLength(10);
  });

  it("anonymous callers cannot invoke relationship helpers", async () => {
    const client = createClient(url, key, { auth: { persistSession: false } });
    const result = await client.rpc("can_read_student", {
      student_profile_id: "10000000-0000-4000-8000-000000000001",
    });
    expect(result.error).not.toBeNull();
  });

  it("database computes placement and rejects incomplete answers", async () => {
    const client = createClient(url, key, { auth: { persistSession: false } });
    await client.auth.signInWithPassword({ email: qaValue("QA_STUDENT_EMAIL"), password });
    const incomplete = await client.rpc("complete_placement_assessment", { p_answers: { q1: "2" } });
    expect(incomplete.error?.message).toContain("All placement questions are required");

    const answers = Object.fromEntries(Array.from({ length: 10 }, (_, index) => [`q${index + 1}`, "0"]));
    const complete = await client.rpc("complete_placement_assessment", { p_answers: answers });
    expect(complete.error).toBeNull();
    expect(complete.data).toBe("explorer");
  });
});
