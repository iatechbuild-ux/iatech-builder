import DataDrivenMissionPage from "../[slug]/page";

export default function NeverCountTwiceMissionPage() {
  return <DataDrivenMissionPage params={Promise.resolve({ slug: "never-count-twice" })} />;
}
