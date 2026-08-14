import fs from "node:fs";
import path from "node:path";

/**
 * The CV, described once.
 *
 * Both the home page and /about link this file; they previously repeated the
 * path and the download name, so a rename would have half-broken the site.
 *
 * Server-only — it reads the filesystem. Client components take `CV_SIZE` as a
 * prop rather than importing this module.
 */

export const CV_FILE = "janith-godage-cv.pdf";
export const CV_HREF = `/${CV_FILE}`;
export const CV_DOWNLOAD_NAME = "Janith-Godage-CV.pdf";

/**
 * Measured off disk at build time, never hand-written. Stating a size is only
 * worth doing if it is the real one, and a hardcoded number silently becomes a
 * lie the first time the PDF is replaced. Returns null if the file is missing,
 * and the UI simply omits the figure.
 */
export const CV_SIZE = (() => {
  try {
    const bytes = fs.statSync(path.join(process.cwd(), "public", CV_FILE)).size;
    return bytes >= 1024 * 1024
      ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(bytes / 1024)} KB`;
  } catch {
    return null;
  }
})();
