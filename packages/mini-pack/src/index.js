'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const fs_1 = require('node:fs')
const path_1 = require('node:path')
const babylon_1 = require('babylon')
const babel_core_1 = require('babel-core')
const babel_traverse_1 = require('babel-traverse')

let aid = 0
const createAsset = function (filename) {
  const id = aid++
  const dependencies = []
  const content = fs_1.default.readFileSync(filename, 'utf-8')
  const ast = babylon_1.default.parse(content, {
    sourceType: 'module',
  });
  (0, babel_traverse_1.default)(ast, {
    ImportDeclaration(_a) {
      const node = _a.node
      dependencies.push(node.source.value)
    },
  })
  const code = (0, babel_core_1.transformFromAst)(ast, undefined, {
    presets: ['env'],
  }).code
  return {
    id,
    filename,
    dependencies,
    code,
  }
}
const createGraph = function (entry) {
  const mainAsset = createAsset(entry)
  const queue = [mainAsset]
  const _loop_1 = function (asset) {
    asset.mapping = {}
    const dirname = path_1.default.dirname(asset.filename)
    asset.dependencies.forEach((relativePath) => {
      const absolutePath = path_1.default.join(dirname, relativePath)
      const child = createAsset(absolutePath)
      asset.mapping[relativePath] = child.id
      queue.push(child)
    })
  }
  for (let _i = 0, queue_1 = queue; _i < queue_1.length; _i++) {
    const asset = queue_1[_i]
    _loop_1(asset)
  }
  return queue
}
function boundle(graph) {
  let modules = ''
  graph.forEach((mod) => {
    modules += ''.concat(mod.id, ': [\n      function (module, exports, require) {\n        ').concat(mod.code, '\n      },\n      ').concat(JSON.stringify(mod.mapping), '\n    ],\n    ')
  })
  const ret = '(function(modules){\n    function require (id) {\n      const [fn, mapping] = modules[id];\n\n      function localRequire(name) {\n        return require(mapping[name]);\n      }\n\n      let module = {\n        exports: {},\n        loaded: false\n      };\n\n      fn(module, module.exports, localRequire);\n      \n      module.loaded = true;\n\n      return module.exports\n    }\n  \n    require(0)\n  })({'.concat(modules, '});')
  fs_1.default.writeFile(path_1.default.join(__dirname, '../example/bundle.js'), ret, (err) => {
    if (err)
      throw err
    console.log('packing success!')
  })
}
const graph = createGraph(path_1.default.join(__dirname, '../example/entry.js'))
boundle(graph)
exports.default = boundle
