import * as ts from 'typescript';

export function setParent(node: ts.Node): void {
  if (!node) return;
  ts.forEachChild(node, n => {
    n.parent = node;
    setParent(n);
  });
}

export function getScope(node: ts.Node): ts.Node {
  if (node.kind === ts.SyntaxKind.SourceFile) {
    return node;
  }

  if (isScopeKind(node.kind)) {
    return node;
  }

  return getScope(node.parent);
}

export function isAnyOrLiteralKind(kind: ts.SyntaxKind): boolean {
  return kind === ts.SyntaxKind.AnyKeyword || kind === ts.SyntaxKind.LiteralType;
}

// TODO: test
export function identifierExistsUp(node: ts.Node, id: string | ts.Identifier) {
  if (typeof id !== 'string') id = id.text;
  let current = node;
  while (current.parent) current = current.parent;
  return identifierExistsDown(current, id, node);
}

// TODO: test
export function identifierExistsDown(node: ts.Node, id: string, stop?: ts.Node): boolean {
  if (!node || node === stop) return false;
  return node.kind === ts.SyntaxKind.Identifier && (node as ts.Identifier).text === id ?
    true : !!ts.forEachChild(node, n => identifierExistsDown(n, id, stop));
}

export function isScopeKind(kind: ts.SyntaxKind): boolean {
  switch (kind) {
    case ts.SyntaxKind.SourceFile:
    case ts.SyntaxKind.Block:
    case ts.SyntaxKind.ModuleBlock:
    case ts.SyntaxKind.CaseBlock:
      return true;
    default:
      return false;
  }
}

export function isKind(node: ts.Node, kind: ts.SyntaxKind): boolean {
  return node.kind === kind;
}