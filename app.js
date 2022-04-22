const parser = require("@babel/parser");
const fs = require("fs");

const getAST = (filename) => {
  const content = fs.readFileSync(__dirname + "/files/" + filename, "utf8");

  return parser.parse(content, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });
};

const reduceAstNode = (
  oldNode,
  currentNode,
  isConditional,
  currentImportDeclarations,
  relativePath
) => {
  if (!currentNode) {
    return;
  }
  let element = {};

  if (
    ["FunctionDeclaration", "ExportNamedDeclaration"].includes(currentNode.type)
  ) {
    reduceAstNode(
      oldNode,
      currentNode.body,
      undefined,
      currentImportDeclarations,
      relativePath
    );
  }

  if (currentNode.type === "ReturnStatement") {
    reduceAstNode(
      oldNode,
      currentNode.argument,
      undefined,
      currentImportDeclarations,
      relativePath
    );
  }

  if (currentNode.type === "BlockStatement" || currentNode.type === "Program") {
    currentNode.body.forEach((child) => {
      reduceAstNode(
        oldNode,
        child,
        undefined,
        currentImportDeclarations,
        relativePath
      );
    });
  }

  if (currentNode.type === "VariableDeclaration") {
    currentNode.declarations.forEach((child) => {
      reduceAstNode(
        oldNode,
        child.init.body,
        undefined,
        currentImportDeclarations,
        relativePath
      );
    });
  }

  if (currentNode.type === "JSXFragment" && currentNode.children) {
    currentNode.children.forEach((child) => {
      reduceAstNode(
        oldNode,
        child,
        undefined,
        currentImportDeclarations,
        relativePath
      );
    });
  }

  if (currentNode.type === "JSXExpressionContainer") {
    reduceAstNode(
      oldNode,
      currentNode.expression.consequent,
      true,
      currentImportDeclarations,
      relativePath
    );
    reduceAstNode(
      oldNode,
      currentNode.expression.alternate,
      true,
      currentImportDeclarations,
      relativePath
    );
  }

  if (currentNode.type === "JSXElement") {
    const { name } = currentNode.openingElement.name;

    const inImports = currentImportDeclarations.find(
      (declaration) => declaration.componentName === name
    );

    element = {
      name,
      children: [],
      isConditional,
      inImports,
    };

    if (inImports) {
      const filename = inImports.src + ".tsx";
      console.info(relativePath, filename);
      element.children = getTree(getAST(relativePath + "/" + filename));
    }

    oldNode.push(element);

    if (currentNode.children) {
      currentNode.children.forEach((node) =>
        oldNode.length > 0
          ? reduceAstNode(
              element.children,
              node,
              undefined,
              currentImportDeclarations,
              relativePath
            )
          : reduceAstNode(
              oldNode,
              node,
              undefined,
              currentImportDeclarations,
              relativePath
            )
      );
    }
  }

  return oldNode;
};

const getTree = (ast, relPath) => {
  const importDeclarations = [...ast.program.body]
    .filter((node) => node.type === "ImportDeclaration")
    .map((declaration) => {
      // console.info(declaration);
      return (declaration.specifiers.length &&
        declaration.source.value.startsWith("./")) ||
        declaration.source.value.startsWith("../")
        ? {
            componentName: declaration.specifiers[0].local.name,
            src: declaration.source.value,
          }
        : {};
    });

  // console.info(importDeclarations);

  const functionDeclaration = ast.program.body.find(
    (node) => node.type === "FunctionDeclaration"
  );

  if (functionDeclaration) {
    console.info("function");
    return reduceAstNode(
      [],
      functionDeclaration,
      undefined,
      importDeclarations,
      relPath
    );
  } else {
    console.info("named");
    return reduceAstNode(
      [],
      ast.program,
      undefined,
      importDeclarations,
      relPath
    );
  }
};

const result = getTree(getAST("App.tsx"), "/");
// const result = getTree(getAST("/components/breed.tsx"), "components");
console.dir(JSON.stringify(result), null, 2);
