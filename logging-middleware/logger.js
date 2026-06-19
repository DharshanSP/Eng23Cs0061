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
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzLnAuZGFyc2hhbjA0MTdAZ21haWwuY29tIiwiZXhwIjoxNzgxODQ3MzI5LCJpYXQiOjE3ODE4NDY0MjksImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI4YTMzZjJmMy0wM2YyLTQwNDItOGFiYi1mYmNiNjY3OTU1ZTgiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJkaGFyc2hhbnNwIiwic3ViIjoiMGQ1NDQ0MzktMGI1OS00YmIyLTk3ZjQtYzk3OWM5MDUxOWRkIn0sImVtYWlsIjoicy5wLmRhcnNoYW4wNDE3QGdtYWlsLmNvbSIsIm5hbWUiOiJkaGFyc2hhbnNwIiwicm9sbE5vIjoiZW5nMjNjczAwNjEiLCJhY2Nlc3NDb2RlIjoiQmdXWlNXIiwiY2xpZW50SUQiOiIwZDU0NDQzOS0wYjU5LTRiYjItOTdmNC1jOTc5YzkwNTE5ZGQiLCJjbGllbnRTZWNyZXQiOiJGWFB1eHJjSERockJEZUpFIn0.ZFwRYac8msu8cU4k-Xq0UzbcUY6Cm2pt_NkuYbeakhg"
  return token;
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
