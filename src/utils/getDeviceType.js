export function getDeviceType() {
  if (/iPhone|iPad/.test(navigator.userAgent)) {
    return "iOS";
  } else if (/Android/.test(navigator.userAgent)) {
    return "Android";
  } else if (/Windows|Mac/.test(navigator.userAgent)) {
    return "PC";
  } else {
    return "Unknown";
  }
}
