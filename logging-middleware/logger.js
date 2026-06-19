const LOG_URL = "http://4.224.186.213/evaluation-service/logs"

const allowedStacks = new Set(["frontend", "backend"])
const allowedLevels = new Set(["debug", "info", "warn", "error", "fatal"])
const allowedPackages = new Set([
  "api",
  "component",
  "hook",
  "page",
  "state",
  "style",
  "auth",
  "config",
  "middleware",
  "utils",
])

function getAuthToken() {
  const viteToken = typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_AUTH_TOKEN;
  return process.env.AUTH_TOKEN || viteToken || "";
}

export async function Log(stack, level, packageName, message) {
  if (
    !allowedStacks.has(stack) ||
    !allowedLevels.has(level) ||
    !allowedPackages.has(packageName)
  ) {
    return;
  }

  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    await fetch(LOG_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        stack,
        level,
        package: packageName,
        message,
      }),
    });
  } catch(err) {
    console.error("log failed",err);
  }
}
