import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Compare courses online | Skills Compare",
  description:
    "Compare online courses by price, duration, level and certificate before deciding."
};

export default function HomePage() {
  return <HomeClient />;
}
