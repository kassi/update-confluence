String.prototype.strip = function () {
  var str = this.valueOf();

  str = str.replace(/^\n/, "")
  str = str.replace(/\s+$/, "")

  let x = str.match(/^(\s*)/)
  if (x) {
    const indentation = x[0]
    const regex = new RegExp(`^${indentation}`, 'gm')
    str = str.replaceAll(regex, "")
  }

  return str
}
