// =================================================================== \\
//                              ZIP UTILITIES                          \\
// =================================================================== \\
// These utility functions handle loading, decompressing, and parsing  \\
// different types of files (HTML, JSON, XML, TXT) contained in a ZIP  \\
// archive. Each function extracts meaningful textual data from the    \\
// files and returns it as a cleaned array of strings.                 \\
//                                                                     \\
// Expected input for all functions:                                   \\
//   - `zip`: a JSZip instance representing the ZIP archive            \\
//   - `filePath`: the path to the specific file inside the archive    \\
//                                                                     \\
// All functions return a Promise that resolves to an array of strings.\\
// =================================================================== \\

import {CONFIG} from './init.js';
import { detectFormat } from './format-detection.js';
import { parseHTML, parseJSON, parseXML, parseTXT } from './parsers.js'

// Loads and decompresses a ZIP file using JSZip
// Takes a File object (ZIP archive) and returns a JSZip instance representing the extracted archive
export async function loadZip(file) {
    const JSZipInstance = new JSZip();
    return await JSZipInstance.loadAsync(file);
}

// Finds relevant file paths inside the ZIP archive to be then processed
// Searches for files related to "following" and "followers" based on their path patterns
// Returns an object containing two arrays: followingFiles and followersFiles
export function findRelevantFiles(zip) {

    const keys = Object.keys(zip.files);

    const followingFiles = new Set();
    const followersFiles = new Set();
    //loadConfig()
    const patternFollowing = CONFIG.following_files_path_regex;
    const patternFollowers = CONFIG.followers_files_path_regex;

    let i = 0;
    while (i<keys.length){
        let key = keys[i];
        if (patternFollowing.test(key)) {
            followingFiles.add(key);
        }
        if (patternFollowers.test(key)) {
            followersFiles.add(key);
        }
        i++;
    }

    return {
        followingFiles: Array.from(followingFiles),
        followersFiles: Array.from(followersFiles)
    };
}


// Removes duplicate entries from an array
// Returns a new array containing only unique elements from the input array
export function removeDuplicates(array) {
    return [...new Set(array)];
}

// Loads and parses multiple files from the ZIP archive given their paths
// For each file path, it loads the file content, parses it accordingly,
// and aggregates the extracted usernames into a single array with duplicates removed
export async function loadAndParseFiles(zip, filePaths) {
    const result = [];

    let i = 0;
    while (i < filePaths.length) {
        const items = await loadAndParseFile(zip, filePaths[i]);
        result.push(...items);
        i++;
    }
    return removeDuplicates(result);
}

// Routing function for proper parsing files
export async function loadAndParseFile(zip, filePath) {
    const type = (await detectFormat(zip, filePath)).toLowerCase();


    switch (type) {
        case "html":
            return await parseHTML(zip, filePath);
        case "json":
            return await parseJSON(zip, filePath);
        case "xml":
            return await parseXML(zip, filePath);
        case "txt":
            return await parseTXT(zip, filePath);
        default:
            console.warn(`Unknown file format for: ${filePath}`);
            return [];
    }
}