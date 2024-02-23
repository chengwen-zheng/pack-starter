import fs from 'node:fs'
import path from 'node:path'
import babylon from 'babylon'
import { transformFromAst } from 'babel-core'
import traverse from 'babel-traverse'

let aid = 0
type Graph = (Asset & {
  id?: number
})[]

interface Asset {
  id: number
  filename: string
  dependencies: string[]
  code: string | undefined
  mapping?: { [key: string]: number }
}

const createAsset: (filename: string) => Asset = (filename: string) => {
  const id = aid++
  const dependencies: any[] = []
  const content = fs.readFileSync(filename, 'utf-8')
  const ast = babylon.parse(content, {
    sourceType: 'module',
  })

  traverse(ast, {
    ImportDeclaration({ node }) {
      dependencies.push(node.source.value)
    },
  })

  const { code } = transformFromAst(ast, undefined, {
    presets: ['env'],
  })

  return {
    id,
    filename,
    dependencies,
    code,
  }
}

const createGraph: (entry: string) => Graph = (entry: string) => {
  const mainAsset = createAsset(entry)
  const queue = [mainAsset]

  for (const asset of queue) {
    asset.mapping = {}
    const dirname = path.dirname(asset.filename)
    asset.dependencies.forEach((relativePath) => {
      const absolutePath = path.join(dirname, relativePath)

      const child = createAsset(absolutePath)
      asset.mapping![relativePath] = child.id

      queue.push(child)
    })
  }
  return queue
}

function boundle(graph: Graph) {
  let modules = ''
  graph.forEach((mod) => {
    modules += `${mod.id}: [
      function (module, exports, require) {
        ${mod.code}
      },
      ${JSON.stringify(mod.mapping)}
    ],
    `
  })
  const ret = `(function(modules){
    function require (id) {
      const [fn, mapping] = modules[id];

      function localRequire(name) {
        return require(mapping[name]);
      }

      let module = {
        exports: {},
        loaded: false
      };

      fn(module, module.exports, localRequire);
      
      module.loaded = true;

      return module.exports
    }
  
    require(0)
  })({${modules}});`

  fs.writeFile(path.join(__dirname, '../example/bundle.js'), ret, (err) => {
    if (err)
      throw err
    console.log('packing success!')
  })
}

const graph: Graph = createGraph(path.join(__dirname, '../example/entry.js'))

boundle(graph)
export default boundle
