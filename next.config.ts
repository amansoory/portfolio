import type { NextConfig } from "next";
import { execSync } from "node:child_process";

/** The deployed commit, shown in the status bar: Vercel's system variable, or local git. */
function commitSha() {
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA;
  try {
    return execSync("git rev-parse HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return "";
  }
}

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  env: { NEXT_PUBLIC_COMMIT_SHA: commitSha() },
};

export default nextConfig;
