const IMAGE_KEY_PREFIX = "gunnilse:taktiktavla:image:";

export function getTacticsImageKey(activityId: string) {
  return `${IMAGE_KEY_PREFIX}${encodeURIComponent(activityId)}`;
}

export function getTacticsImage(activityId: string): string | null {
  try {
    const raw = localStorage.getItem(getTacticsImageKey(activityId));
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return typeof parsed?.image === "string" ? parsed.image : raw;
    } catch {
      return raw;
    }
  } catch {
    return null;
  }
}

export function removeTacticsImage(activityId: string) {
  try {
    localStorage.removeItem(getTacticsImageKey(activityId));
  } catch {
    /* storage may be unavailable */
  }
}
