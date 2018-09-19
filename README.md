# solidity-utils

### Installation

```bash
npm i --save solidity-helpers
```

### Usage

```javascript
const pc = 10
const bin = <contract source>
const srcmap = <contract sourcemap>
const txt = <source code>
const { PCToSource } = require('solidity-helpers')
const pcToSource = new PCToSource({bin, srcmap, txt})
const result = pcToSource.toSource(10) // line: Line number ; txt: part of your souce code
```
