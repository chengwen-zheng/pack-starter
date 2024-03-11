import fs from 'node:fs'
import path from 'node:path'
import acorn from 'acorn'
import Visitor from './visitor'

const visitor = new Visitor()

// 获取命令行参数
const buffer = fs.readFileSync(path.join(__dirname, '../example/test.js')).toString()
const body = acorn.parse(buffer, {
  ecmaVersion: 6,
}).body

const decls: Map<string, string> = new Map() // 记录所有申明过的变量
const calledDecls: string[] = [] // 记录调用过的函数
let code: string[] | string = []; // 存放源代码

(body).forEach((node: any) => {
  if (node.type === 'VariableDeclaration') {
    const kind = node.kind
    for (const decl of node.declarations) {
      decls.set(visitor.visitNode(decl.id), visitor.visitVariableDeclarator(decl, kind))
      if (decl.init?.type === 'CallExpression') {
        calledDecls.push(visitor.visitIdentifier(decl.init.callee))
        const args = decl.init.arguments
        for (const arg of args) {
          if (arg.type === 'Identifier')
            calledDecls.push(visitor.visitNode(arg))
        }
      }
    }
  }
  if (node.type === 'Identifier')
    calledDecls.push(node.name);

  (code as Array<string>).push(visitor.run([node]))
})

code = calledDecls
  .map((c) => {
    return decls.get(c)
  })
  .join('')

fs.writeFileSync(path.join(__dirname, './test.shaked.js'), code)
