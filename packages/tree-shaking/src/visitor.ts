class Visitor {
  // 访问变量申明
  visitVariableDeclaration(node: any): string {
    let str = ''
    str += `${node.kind} `
    str += this.visitNodes(node.declarations)
    return `${str}\n`
  }

  // 访问定义的变量名
  visitVariableDeclarator(node: any, kind?: string): string {
    let str = ''
    str += kind ? `${kind} ` : str
    str += `${this.visitNode(node.id)} `
    str += '= '
    str += this.visitNode(node.init)
    return `${str};` + `\n`
  }

  // 访问标识符
  visitIdentifier(node: any): string {
    let str = ''
    str += node.name
    return str
  }

  // 访问箭头函数
  visitArrowFunctionExpression(node: any): string {
    let str = ''
    str += '('
    node.params.forEach((param: any, index: number) => {
      str += this.visitNode(param)
      str += index === node.params.length - 1 ? '' : ','
    })
    str += ')'
    str += '=>'
    str += this.visitNode(node.body)
    return `${str}\n`
  }

  // 访问字符常量
  visitLiteral(node: any): string {
    let str = ''
    str += node.raw
    return str
  }

  // 访问操作符
  visitBinaryExpression(node: any): string {
    let str = ''
    str += this.visitNode(node.left)
    str += node.operator
    str += this.visitNode(node.right)
    return `${str}\n`
  }

  visitCallExpression(node: any): string {
    let str = ''
    str += this.visitNode(node.callee)
    str += '('
    node.arguments.forEach((param: any, index: number) => {
      str += this.visitNode(param)
      str += index === node.arguments.length - 1 ? '' : ','
    })
    str += ')'
    return str
  }

  visitNodes(nodes: any[]): string {
    let str = ''
    nodes.forEach((node) => {
      str += this.visitNode(node)
    })
    return str
  }

  visitNode(node: any): string {
    let str = ''
    switch (node.type) {
      case 'VariableDeclaration':
        str += this.visitVariableDeclaration(node)
        break
      case 'VariableDeclarator':
        str += this.visitVariableDeclarator(node)
        break
      case 'Identifier':
        str += this.visitIdentifier(node)
        break
      case 'ArrowFunctionExpression':
        str += this.visitArrowFunctionExpression(node)
        break
      case 'BinaryExpression':
        str += this.visitBinaryExpression(node)
        break
      case 'Literal':
        str += this.visitLiteral(node)
        break
      case 'CallExpression':
        str += this.visitCallExpression(node)
        break
      default:
        break
    }
    return str
  }

  run(body: any[]): string {
    let str = ''
    // 遍历
    str += this.visitNodes(body)
    return str
  }
}

export default Visitor
