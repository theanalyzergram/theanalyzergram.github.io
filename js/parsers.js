// =================================================================== //
//                           PARSERS UTILITIES                         //
// =================================================================== //
// These utility functions are responsible for parsing different       //
// types of files (HTML, JSON) contained within a ZIP archive.         //
// Each function extracts meaningful textual data from the files       //
// and returns it as a cleaned array of strings.                       //
//                                                                     //
// The expected input for all functions is:                            //
//   - `zip`: a JSZip instance representing the archive                //
//   - `filePath`: the path to the specific file inside the archive    //
//                                                                     //
// All functions return a Promise that resolves to an array of strings.//
// =================================================================== //


// Parses an HTML file inside the ZIP archive.
// Extracts all text content from <a> and <span> elements.
// Returns an array of non-empty trimmed strings.
export async function parseHTML(zip, filePath) {
    const content = await zip.file(filePath).async("string");
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    return Array.from(doc.querySelectorAll('a, span'))
        .map(el => el.textContent.trim())
        .filter(Boolean);
}

// Parses a JSON file inside the ZIP archive.
// Assumes the JSON is an array of objects with a `string_list_data` field.
// Extracts the `value` field from each item in `string_list_data`.
// Returns an array of non-empty values.
// Estrae tutti gli username da un JSON Instagram export
export async function parseJSON(zip, filePath) {
    const content = await zip.file(filePath).async("string");
    const data = JSON.parse(content);

    let entries = [];

    // DISCLAIMER : Instagram SWE at META are so smart to have different JSON format
    // for followers and following (other than the name ....)
    // We reverse-engineerd the format finding this logic 
    // PAY ATTENTION: could not work if modifying name of attributes.
    if (data.relationships_following && Array.isArray(data.relationships_following)) {
        // JSON following
        entries = data.relationships_following;
    } else if (Array.isArray(data)) {
        // JSON followers
        entries = data;
    } else {
        return [];
    }

    // Extract the usernames
    const usernames = entries.flatMap(entry => {
        if (!entry.string_list_data || !Array.isArray(entry.string_list_data)) return [];
        return entry.string_list_data
            .map(item => item.value)
            .filter(Boolean);
    });

    return usernames;
}

// PAY ATTENTION: THIS FUNCTION IS NOT USED, is only a base for possible future implementation
// Parses an XML file inside the ZIP archive.
// Extracts text from <value> nodes inside <item> elements,
// which are children of <string_list_data>.
// Returns an array of non-empty trimmed values.
export async function parseXML(zip, filePath) {
    const content = await zip.file(filePath).async("string");
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, "application/xml");

    const valueNodes = xmlDoc.querySelectorAll("string_list_data > item > value");

    const results = Array.from(valueNodes)
        .map(node => node.textContent.trim())
        .filter(Boolean);

    return results;
}


// PAY ATTENTION: THIS FUNCTION IS NOT USED, is only a base for possible future implementation
// Parses a plain text file inside the ZIP archive.
// Splits the content by line breaks and trims each line.
// Returns an array of non-empty lines.
export async function parseTXT(zip, filePath) {
    const content = await zip.file(filePath).async("string");
    return content.split('\n')
        .map(line => line.trim())
        .filter(Boolean);
}
