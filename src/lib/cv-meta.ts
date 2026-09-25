/**
 * The CV's path and download name, with no filesystem access, so client
 * components (the nav) can link it. `cv.ts` re-exports these alongside the
 * build-time file size.
 */
export const CV_FILE = "janith-godage-cv.pdf";
export const CV_HREF = `/${CV_FILE}`;
export const CV_DOWNLOAD_NAME = "Janith-Godage-CV.pdf";
