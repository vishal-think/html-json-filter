// Note: Please do not use JSDOM or any other external library/package (sorry)
/*
type Metadata = {
  url: string;
  siteName: string;
  title: string;
  description: string;
  keywords: string[];
  author: string;
};
*/

/**
 * Gets the URL, site name, title, description, keywords, and author info out of the <head> meta tags from a given html string.
 * 1. Get the URL from the <meta property="og:url"> tag.
 * 2. Get the site name from the <meta property="og:site_name"> tag.
 * 3. Get the title from the the <title> tag.
 * 4. Get the description from the <meta property="og:description"> tag or the <meta name="description"> tag.
 * 5. Get the keywords from the <meta name="keywords"> tag and split them into an array.
 * 6. Get the author from the <meta name="author"> tag.
 * If any of the above tags are missing or if the values are empty, then the corresponding value will be null.
 * @param html The complete HTML document text to parse
 * @returns A Metadata object with data from the HTML <head>
 */
export default function getMetadata(html) {
  // TODO: delete and replace this with your code
  let output = {
    url: null,
    site_name: null,
    title: null,
    description: null,
    keywords: null,
    author: null,
  }
  if (!html || (!html.includes('</html>') && !html.includes('</HTML>'))) {
    return {
      url: null,
      siteName: null,
      title: null,
      description: null,
      keywords: null,
      author: null,
    };
  }
  let isCaps = html.includes('</HTML>')
  html.split('<head>')
  let head
  head = isCaps ? getMiddle(html, '<HEAD>', '</HEAD>') : getMiddle(html, '<head>', '</head>')
  if (html.includes('</title>') || html.includes('</TITLE>')) {
    const title = isCaps ? getMiddle(html, '<TITLE>', '</TITLE>') : getMiddle(html, '<title>', '</title>')
    output['title'] = title
  }
  head = isCaps ? head.replace(/<META/gi, "#<META") : head.replace(/<meta/gi, "#<meta");
  const metaArray = head.split('#')
  metaArray.forEach(meta => {
    if (meta.includes('meta')) {
      const result = getMetaValues(meta)
      if (result) {
        output = { ...output, ...result }
      }
    }
  })
  function getMetaValues(meta) {
    const metaFields = ["url", "site_name", "description", "keywords", "author"]
    const key = JSON.parse(JSON.stringify(meta)).toLowerCase();
    if ((key.indexOf('property="og:') > -1) || (key.indexOf('name') > -1)) {
      const sliceKey = getMiddle(key, 'property=', '</head>')
      const replaceKey = sliceKey.replaceAll('"', "'");
      const matchKey = replaceKey.match(/'([^']+)'/)[1].replace("og:", "");
      if (metaFields.includes(matchKey)) {
        const value = JSON.parse(JSON.stringify(meta));
        const middleValue = getMiddle(value, 'content=', '</head>')
        const replaceContent = middleValue.replaceAll('"', "`");
        let response = {}
        if (replaceContent.includes("`` />")) {
          response[matchKey] = matchKey === "keywords" ? [] : "";
          return response;
        }
        const matchValue = replaceContent.match(/`([^`]+)`/);
        if (matchValue) {
          response[matchKey] = matchKey === "keywords" ? matchValue[1].split(',') : matchValue[1]
          return response;
        }
      }
    }
  }
  function getMiddle(tag, startText, endText) {
    let middle = tag.slice(
      tag.indexOf(startText) + startText.length,
      tag.lastIndexOf(endText),
    );
    return middle;
  }
  return {
    url: output.url,
    siteName: output.site_name,
    title: output.title,
    description: output.description,
    keywords: output.keywords,
    author: output.author,
  };
}