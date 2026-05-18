export function isVideo(src: string | undefined | null): boolean {
  if (!src) return false;
  return /\.(mp4|webm|mov|ogg|ogv)(\?.*)?$/i.test(src);
}
