// =================================================================== //
//                       INITIALIZER UTILITIES                         //
// =================================================================== //


// Global configuration object.
// This will be populated by loadConfig() with key-value pairs from a .conf file.
export const CONFIG = {};


// Loads and parses a .conf file from the given URL.
// Reads the file line by line, ignoring comment lines starting with '#'.
// Each valid line should have the format: key = value.
// If a key ends with '_regex', tries to parse the value as a RegExp literal (e.g. /pattern/flags).
// Stores all parsed key-value pairs in the CONFIG object.
export async function loadConfig(url) {
  const response = await fetch(url);
  const text = await response.text();
  const lines = text.split("\n");
  let i = 0;
  while (i < lines.length) {
    let line = lines[i].trim();
    if (line && !line.startsWith("#")) {
      const parts = line.split("=");
      if (parts.length === 2) {
        const key = parts[0].trim();
        const value = parts[1].trim();

        if (key.endsWith('_regex')) {
          const regexParts = value.match(/^\/(.*)\/([a-z]*)$/i);
          if (regexParts) {
            CONFIG[key] = new RegExp(regexParts[1], regexParts[2]);
          } else {
            CONFIG[key] = value;
          }
        } else {
          CONFIG[key] = value;
        }
      }
    }
    i++;
  }
}
