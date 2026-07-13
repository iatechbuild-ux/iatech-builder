import MissionWorkspacePage from "../../[slug]/workspace/page";

export default function NeverCountTwiceWorkspacePage() {
  return <MissionWorkspacePage params={Promise.resolve({ slug: "never-count-twice" })} />;
}
