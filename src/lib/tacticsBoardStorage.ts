const IMAGE_KEY_PREFIX = "gunnilse:taktiktavla:image:";
const STATE_KEY_PREFIX = "gunnilse:taktiktavla:state:";

function readImage(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed?.image === "string" ? parsed.image : raw;
  } catch {
    return raw;
  }
}

export function getTacticsImageKey(activityId: string) {
  return `${IMAGE_KEY_PREFIX}${encodeURIComponent(activityId)}`;
}

export function getTacticsImage(activityId: string): string | null {
  try {
    return readImage(localStorage.getItem(getTacticsImageKey(activityId)));
  } catch {
    return null;
  }
}

export function getLatestTacticsImage(): string | null {
  try {
    return readImage(localStorage.getItem("gunnilse:taktiktavla:latest-image"));
  } catch {
    return null;
  }
}

export function getTacticsStateKey(contextId: string) {
  return `${STATE_KEY_PREFIX}${encodeURIComponent(contextId)}`;
}

export function removeTacticsImage(activityId: string) {
  try {
    localStorage.removeItem(getTacticsImageKey(activityId));
    localStorage.removeItem(getTacticsStateKey(activityId));
  } catch {
    /* storage may be unavailable */
  }
}
