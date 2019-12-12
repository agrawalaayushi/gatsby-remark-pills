const visit = require("unist-util-visit")

const extractString = str => {
  return str.substring(1, str.length - 1)
}
module.exports = ({ markdownAST }, pluginOptions) => {
  visit(markdownAST, "paragraph", node => {
    let shortcode = node.children[0]
    if (shortcode.type === "text" && !!shortcode.value.match(/{{< Pill /)) {
      let str = shortcode.value
      var attributes = {}
      var attrMatch = str
        .trim()
        .match(
          /(?:[\w-]*=\s*(?:(?:"[^"]*")|(?:“[^“”]*”)|(?:‘[^‘’]*’)|(?:'[^']*')|[^}\s]+))/g
        )

      if (attrMatch) {
        attrMatch.map(function(item) {
          var split = item.split("=")
          var key = split.shift().trim()
          // Strip surrounding quotes from value, if they exist.
          var val = split
            .join("=")
            .trim()
            .replace(/^'(.*)'$/)

          attributes[key] = val
        })
      }
      const text = extractString(attributes.text)
      const bgColor = extractString(attributes.bgColor)
      const textColor = extractString(attributes.textColor)
      const borderColor = extractString(attributes.borderColor)

      const html = `<div
      style=\"border: 1px solid ${borderColor}; background-color:${bgColor}; color: ${textColor}; text-align: center; font-size: 0.75em ; display: inline-block; padding: 2px 10px; margin-right: 10px; border-radius: 10rem; font-weight: 500; vertical-align: middle;\"
    >\n 
      ${text}
    </div>`.trim()
      node.type = "html"
      node.children = undefined
      node.value = html
    }
  })
  return markdownAST
}
