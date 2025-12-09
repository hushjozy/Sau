import { formatDistanceToNow } from "date-fns";

export const ENVIRONMENT_ENV = __DEV__ ? "staging" : "production";

export const BASE_URL = {
  staging: "https://sauapi.lapapps.ng/api/",
  production: "https://sauapi.lapapps.ng/api/",
}[ENVIRONMENT_ENV];

export function myDebounce<T extends (...args: any[]) => void>(
  cb: T,
  delay: number
) {
  let timer: NodeJs.Timeout;

  return function (...args: Parameters<T>) {
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}

export const capitalizeFirstLetter = (str: string) => {
  if (typeof str !== "string") return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => {
      // Skip fully parenthetical like (s), (optional)
      if (/^\(.*\)$/.test(word)) return word;

      // Handle hyphenated words like "self-employed"
      return word
        .split("-")
        .map((part) => {
          // Capitalize only if it starts with a letter
          return part.charAt(0).match(/[a-z]/i)
            ? part.charAt(0).toUpperCase() + part.slice(1)
            : part;
        })
        .join("-");
    })
    .join(" ");
};

export const userLocalDate = (date: string) => {
  const past = new Date(date);

  // const nowUtc = new Date(new Date().toISOString());
  // const diffUtc = Math.floor((nowUtc - past) / 60000);

  // // Current WAT time (UTC+1)
  // const nowWat = new Date(
  //   new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" })
  // );
  // const diffWat = Math.floor((nowWat.getTime() - past.getTime()) / 60000);
  // console.log(`UTC: ${diffUtc} minutes ago`);
  // console.log(`WAT: ${diffWat} minutes ago`);
  const formatWithOffset = (past?: Date | string | null) => {
    if (!past) return ""; // handle undefined/null

    const pastDate = past instanceof Date ? past : new Date(past);

    if (isNaN(pastDate.getTime())) return ""; // handle invalid date

    // Add 7 minutes
    const corrected = new Date(pastDate.getTime() + 7 * 60 * 1000);

    return formatDistanceToNow(corrected, { addSuffix: true });
  };
  formatWithOffset(past);
};
export const extractUrls = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex);
};
export const getInitials = (name: string) => {
  console.log("initials", name);

  return name?.length > 0
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "--";
};
export const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const getMediaType = (contentType: string) => {
  if (contentType.includes("pdf")) return "PDF";
  if (contentType.includes("docx")) return "DOC";
  if (contentType.includes("txt")) return "TXT";
  return "Unknown";
};
export const formatLabel = (text: string) => {
  if (!text) return "";
  return text
    .replace(/([A-Z])/g, " $1") // insert space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // capitalize first letter
};
