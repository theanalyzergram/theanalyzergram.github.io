// =================================================================== \\
//                            FORMAT DETECTION                         \\
// =================================================================== \\
// Tries to detect the format of a file inside a ZIP archive.          \\
//                                                                     \\
// It first checks the file extension (html, json, xml, txt, etc.).    \\
// If the extension is not conclusive, it reads the first part         \\
// of the content and tries to guess the format based on               \\
// typical characteristics:                                            \\
//  - Starts with "<" and contains "<html" → HTML                      \\
//  - Starts with "<" without "<html" → XML                            \\
//  - Valid JSON.parse() result → JSON                                 \\
//  - Fallback → plain text                                            \\
//                                                                     \\
// Returns one of: "html", "json", "xml", "txt", or "unknown".         \\
// =================================================================== \\



export async function detectFormat(zip, filePath) {
    const ext = (filePath.split(".").pop() || "").toLowerCase();

    const knownExts = ["html", "htm", "json", "xml", "txt"];
    if (knownExts.includes(ext)) {
        return ext === 'htm' ? 'html' : ext;
    }
    try {
        const content = await zip.file(filePath).async("string");
        const snippet = content.trim().slice(0, 500);

        if (snippet.startsWith("<")) {
            if (snippet.includes("<html") || snippet.includes("<!DOCTYPE html")) {
                return "html";
            }
            return "xml";
        }
        try {
            JSON.parse(content);
            return "json";
        } catch {
        }
        return "txt";
    } catch (err) {
        console.warn(`Unable to read file ${filePath} to detect format:`, err);
        return "unknown";
    }
}