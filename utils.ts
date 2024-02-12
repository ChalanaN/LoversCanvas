export const getContentType = (fileExtension) => {
    fileExtension = fileExtension.split(".").pop()
    switch (fileExtension) {
        case "html": return "text/html";
        case "css": return "text/css";
        case "js": return "text/javascript";
        case "json": return "application/json";
        case "png": return "image/png";
        case "jpg": case "jpeg": return "image/jpeg";
        case "svg": return "image/svg+xml";
        case "ico": return "image/x-icon";
    }
}