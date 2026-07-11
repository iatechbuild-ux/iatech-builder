import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "IATECH Builder", short_name: "IATECH", description: "Build real solutions, prove capability, and grow a reviewed portfolio.", start_url: "/", display: "standalone", background_color: "#f7f8f7", theme_color: "#0f6e56", icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" }] };
}
