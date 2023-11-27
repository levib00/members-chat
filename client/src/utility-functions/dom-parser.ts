const parseDom = (str: string) => {  // Parses special characters from html code to unicode characters.
  const doc = new DOMParser().parseFromString(str, "text/html");
  return doc.documentElement.textContent || '';
}

export default parseDom
