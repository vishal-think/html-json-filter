/*
type Metadata = {
  url: string | null;
  siteName: string | null;
  title: string | null;
  description: string | null;
  keywords: string[] | null;
  author: string | null;
};
*/

/**
 * Filters the given Metadata array to only include the objects that match the given search query.
 * If the search query has multiple words,
 * treat each word as a separate search term to filter by,
 * in addition to gathering results from the overall query.
 * If the search query has special characters,
 * run the query filter with the special characters removed.
 * Can return an empty array if no Metadata objects match the search query.
 * @param {Metadata[]} metadata - An array of Metadata objects
 * @param {string} query - The search query string
 * @returns {Metadata[]} - An array of Metadata objects that match the given search query
 */
export default function filterMetadata(metadata, query) {
  if (Array.isArray(metadata) && typeof query === "string") {
    const data = metadata.filter((item) => {
      const values = Object.values(item);
      let result = "";
      values.forEach((item2) => {
        const lowVal = String(item2).toLowerCase();
        if (lowVal?.includes(query.toLocaleLowerCase())) {
          result = item;
        }
        if (Array.isArray(item2)) {
          item2.forEach((itemKeyword) => {
            const caseVal3 = itemKeyword.toLocaleLowerCase();
            if (caseVal3.includes(query.toLocaleLowerCase())) {
              result = item;
            }
          });
        }
        if (result === "" && item2?.indexOf(".") !== -1) {
          const newQuery = item2?.replace(/[^a-zA-Z ]/g, "");
          const lowInp = String(newQuery).toLowerCase();
          const lowQuery = String(query).toLowerCase();
          if (lowInp?.includes(lowQuery.trim().toLocaleLowerCase())) {
            result = item;
          }
        }
        if (query.includes(" ")) {
          const queryArray = query.split(" ");
          queryArray.forEach((itemMultiple) => {
            const lowMul = String(item2).toLowerCase();
            if (lowMul?.includes(itemMultiple.toLocaleLowerCase())) {
              result = item;
            }
            if (Array.isArray(item2)) {
              item2.forEach((itemKeyword) => {
                const caseVal3 = itemKeyword.toLocaleLowerCase();
                if (caseVal3.includes(itemMultiple.toLocaleLowerCase())) {
                  result = item;
                }
              });
            }
          });
        }
        if (query.includes(",")) {
          const queryArray = query.split(",");
          queryArray.forEach((itemMultiple) => {
            const lowMul = String(item2).toLowerCase();
            if (lowMul?.includes(itemMultiple.trim().toLocaleLowerCase())) {
              result = item;
            }
          });
        }
        if (query.includes("-")) {
          const queryArray = query.split("-");
          queryArray.forEach((itemMultiple) => {
            const lowMul = String(item2).toLowerCase();
            if (lowMul?.includes(itemMultiple.trim().toLocaleLowerCase())) {
              result = item;
            }
            if (Array.isArray(item2)) {
              item2.forEach((itemKeyword) => {
                const caseVal3 = itemKeyword.toLocaleLowerCase();
                if (
                  caseVal3.includes(itemMultiple.trim().toLocaleLowerCase())
                ) {
                  result = item;
                }
              });
            }
          });
        }
        const format = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
        if (format.test(query)) {
          const newQuery = query.replace(/[^a-zA-Z ]/g, "");
          const lowInp = String(item2).toLowerCase();
          const lowQuery = String(newQuery).toLowerCase();
          if (lowInp?.includes(lowQuery.trim().toLocaleLowerCase())) {
            result = item;
          }
        }
      });
      return result;
    });
    return data;
  }
  return [];
}
