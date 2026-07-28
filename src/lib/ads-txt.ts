const PUBLISHER_ID_PATTERN = /^\d{16}$/;
const CLIENT_PATTERN = /^ca-pub-(\d{16})$/;

export function publisherIdFromClient(client?: string) {
  return client?.trim().match(CLIENT_PATTERN)?.[1];
}

export function buildAdsTxt(publisherId?: string) {
  const normalized = publisherId?.trim();
  if (!normalized || !PUBLISHER_ID_PATTERN.test(normalized)) return "";
  return `google.com, pub-${normalized}, DIRECT, f08c47fec0942fa0\n`;
}
