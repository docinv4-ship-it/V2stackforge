import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StackForge AI",
    short_name: "StackForge",
    description: "Discover and compare the best AI tools and marketing platforms for your business",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0c10",
    theme_color: "#9333ea",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
