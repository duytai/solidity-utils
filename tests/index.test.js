const fs = require('fs')
const path = require('path')
const map = require('./data/map.json')
const { PCToSource } = require('../')

const txt = fs.readFileSync(path.join(__dirname, './data/SimpleStorage.sol'), 'utf8')
const {
  contracts: {
    'SimpleStorage.sol:SimpleStorage': {
      bin,
      'bin-runtime': binRuntime,
      'srcmap-runtime': srcmapRuntime,
      srcmap,
      asm,
    },
  },
} = map

test('runtimeCode', () => {
  const pcToSource = new PCToSource({ bin: binRuntime, srcmap: srcmapRuntime, txt })
  const { pcToInstruction, fullSourcemap } = pcToSource
  const asmCode = asm['.data']['0']['.code'].filter(t => t.name !== 'tag')
  Object.keys(pcToInstruction).forEach((key) => {
    const k = parseInt(key, 10)
    if (k >= fullSourcemap.length) return
    const instruction = pcToInstruction[k]
    const { s, l } = fullSourcemap[instruction]
    expect(asmCode[instruction].end).toEqual(s + l)
    expect(asmCode[instruction].begin).toEqual(s)
  })
})

test('deployCode', () => {
  const pcToSource = new PCToSource({ bin, srcmap, txt })
  const { pcToInstruction, fullSourcemap } = pcToSource
  const asmCode = asm['.code'].filter(t => t.name !== 'tag')
  Object.keys(pcToInstruction).forEach((key) => {
    const k = parseInt(key, 10)
    if (k >= fullSourcemap.length) return
    const instruction = pcToInstruction[k]
    const { s, l } = fullSourcemap[instruction]
    expect(asmCode[instruction].end).toEqual(s + l)
    expect(asmCode[instruction].begin).toEqual(s)
  })
})
