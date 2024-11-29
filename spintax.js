function parseSpintax(text) {
    const regex = /\{([^{}]*)\}/;
    let match = regex.exec(text);
  
    while (match) {
      const options = match[1].split("|");
      const randomOption = options[Math.floor(Math.random() * options.length)];
      text = text.replace(match[0], randomOption);
      match = regex.exec(text);
    }
  
    return text;
  }
  
  module.exports = { parseSpintax };
  