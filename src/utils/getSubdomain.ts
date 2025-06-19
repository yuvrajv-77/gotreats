export function getSubdomain(): string | null {
  const host = window.location.hostname;

  // localhost: admin.localhost, client.localhost
  if (host.includes("localhost")) {
    const parts = host.split(".");
    return parts.length > 1 ? parts[0] : null; // "admin" from "admin.localhost"
  }

  // Production domains: admin.gotreats.in
  const domainParts = host.split(".");
  if (domainParts.length > 2) {
    return domainParts[0]; // "admin" from "admin.gotreats.in"
  }

  return null;
}
