require('./string')

describe('string.js', () => {
  describe('strip', () => {
    it('returns same string with nothing to split', () => {
      const input = 'Just a simple string'
      expect(input.strip()).toEqual(input)
    })

    it('returns same string with nothing to split', () => {
      const input = 'Just a simple string\n  with new line.'
      expect(input.strip()).toEqual(input)
    })

    it('returns string without empty first line', () => {
      const input = `
Some string with an empty first line.`
      expect(input.strip()).toEqual(`Some string with an empty first line.`)
    })

    it('returns string without empty last line', () => {
      const input = `Some string with an empty last line.
      `
      expect(input.strip()).toEqual(`Some string with an empty last line.`)
    })

    it('returns string with leading spaces of first non-empty line removed', () => {
      const input = `
        Some string with leading space
        Some other line
          An indented line.`
      expect(input.strip()).toEqual(`Some string with leading space\nSome other line\n  An indented line.`)
    })
  })
})
