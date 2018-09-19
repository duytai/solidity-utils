const getLineFromPos = require('get-line-from-pos')

class PCToSource {
  constructor({ bin, srcmap, txt }) {
    this.fullSourcemap = PCToSource.decompressSourcemap(srcmap)
    this.pcToInstruction = PCToSource.mapPCToInstruction(bin)
    this.txt = txt
  }

  toSource(pc) {
    const instruction = this.pcToInstruction[pc]
    if (instruction === undefined) return {
      txt: '',
      line: -1,
    }
    const source = this.fullSourcemap[instruction]
    const { s, l } = source
    return {
      txt: this.txt.slice(s, s + l),
      line: getLineFromPos(this.txt, s),
    }
  }

  static mapPCToInstruction(bin) {
    const code = Buffer.from(bin, 'hex')
    const pcToInstruction = {}
    let pc = 0
    let instruction = 0
    while (pc < code.length) {
      const opcode = code[pc]
      pcToInstruction[pc] = instruction
      if (opcode >= 0x60 && opcode <= 0x7f) {
        pc += opcode - 0x5f
      }
      pc += 1
      instruction += 1
    }
    return pcToInstruction
  }

  static decompressSourcemap(srcmap) {
    return srcmap
      .split(';')
      .reduce((result, slfj) => {
        const [s, l, f, j] = slfj.split(':')
        const [last] = result.slice(-1)
        return result.concat({
          s: s ? parseInt(s, 10) : last.s,
          l: l ? parseInt(l, 10) : last.l,
          f: f ? parseInt(f, 10) : last.f,
          j: j || last.j,
        })
      }, [])
  }
}

module.exports = PCToSource
