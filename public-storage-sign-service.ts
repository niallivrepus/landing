/**
 * **Purpose:** Server-side Supabase Storage signed URLs for marketing routes (never expose service role to browser).
 * **Connects to:** `public-blurbs-feed-service.ts`, `public-profile-service.ts`.
 */

const IDENTITY_PHOTOS_BUCKET = "identity-photos";
const BLURBS_MEDIA_BUCKET = "blurbs-media";

export type PublicStorageSignRuntime = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceKey: string | null;
};

function encodeObjectPath(objectPath: string): string {
  return objectPath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function storageSignEndpoint(supabaseUrl: string, bucket: string, objectPath: string): string {
  return `${supabaseUrl}/storage/v1/object/sign/${bucket}/${encodeObjectPath(objectPath)}`;
}

function resolveAbsoluteSignedUrl(supabaseUrl: string, relative: string): string {
  if (relative.startsWith("http")) return relative;
  return `${supabaseUrl}/storage/v1${relative.startsWith("/") ? "" : "/"}${relative}`;
}

/**
 * **Creates** a short-lived signed HTTPS URL for a private storage object.
 * **Inputs:** bucket name + object path. **Outputs:** absolute URL or `null` when signing fails.
 */
export async function signedStorageObjectUrl(
  bucket: string,
  objectPath: string | null | undefined,
  runtime: PublicStorageSignRuntime,
  expiresInSeconds = 60 * 60 * 6,
): Promise<string | null> {
  const path = objectPath?.trim();
  if (!path) return null;
  if (path.startsWith("data:") || path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const apiKey = runtime.supabaseServiceKey ?? runtime.supabaseAnonKey;
  const response = await fetch(storageSignEndpoint(runtime.supabaseUrl, bucket, path), {
    method: "POST",
    headers: {
      apikey: apiKey,
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ expiresIn: expiresInSeconds }),
  });
  if (!response.ok) return null;
  const payload = (await response.json()) as { signedURL?: string; signedUrl?: string };
  const relative = payload.signedURL ?? payload.signedUrl;
  if (!relative) return null;
  return resolveAbsoluteSignedUrl(runtime.supabaseUrl, relative);
}

/** **Signs** an `identity-photos` object for public profile / blurb author avatars. */
export async function signedIdentityPhotoUrl(
  objectPath: string | null | undefined,
  runtime: PublicStorageSignRuntime,
): Promise<string | null> {
  return signedStorageObjectUrl(IDENTITY_PHOTOS_BUCKET, objectPath, runtime);
}

/** **Signs** a `blurbs-media` object for public blurb attachments (requires service role). */
export async function signedBlurbsMediaUrl(
  objectPath: string | null | undefined,
  runtime: PublicStorageSignRuntime,
): Promise<string | null> {
  return signedStorageObjectUrl(BLURBS_MEDIA_BUCKET, objectPath, runtime);
}
