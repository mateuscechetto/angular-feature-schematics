import {
  Rule,
  SchematicsException,
  Tree,
  apply,
  // applyTemplates,
  branchAndMerge,
  chain,
  filter,
  mergeWith,
  move,
  // move,
  template,
  url,
} from '@angular-devkit/schematics';

import {
  classify,
  dasherize,
  camelize,
  underscore,
} from '@angular-devkit/core/src/utils/strings';
import { normalize } from '@angular-devkit/core';
import { Project, SyntaxKind } from 'ts-morph';

const toUpperCase = (str: string): string => {
  return str.toUpperCase();
};

const stringUtils = { classify, dasherize, camelize, underscore, toUpperCase };

function updateTsConfig(options: any): Rule {
  return (tree: Tree) => {
    const tsConfigPath = 'tsconfig.json';
    const buffer = tree.read(tsConfigPath);
    if (!buffer) {
      throw new SchematicsException('Could not find tsconfig.json');
    }

    options.path = options.path ? normalize(options.path) : options.path;

    const tsConfig = JSON.parse(buffer.toString());
    const newPathKey = `@${dasherize(options.name)}/*`;
    const newPathValue = [`${options.path}/${dasherize(options.name)}/*`];

    if (!tsConfig.compilerOptions.paths) {
      tsConfig.compilerOptions.paths = {};
    }
    tsConfig.compilerOptions.paths[newPathKey] = newPathValue;

    tree.overwrite(tsConfigPath, JSON.stringify(tsConfig, null, 2));
    return tree;
  };
}

function updateMainTs(options: any): Rule {
  return (tree: Tree) => {
    const mainTsPath = 'src/main.ts';
    const buffer = tree.read(mainTsPath);
    if (!buffer) {
      throw new SchematicsException('Could not find main.ts');
    }

    const project = new Project();
    project.addSourceFileAtPath(mainTsPath);
    const sourceFile = project.getSourceFileOrThrow(mainTsPath);

    const routeArray = sourceFile.getVariableDeclarationOrThrow('ROUTES');
    const arrayLiteral = routeArray.getInitializerIfKindOrThrow(
      SyntaxKind.ArrayLiteralExpression
    );

    const elements = arrayLiteral.getElements();
    const wildcardRouteIndex = elements.findIndex((element) =>
      element.getText().includes('**')
    );

    arrayLiteral.insertElement(
      wildcardRouteIndex - 3,
      `{
      path: '${dasherize(options.name)}',
      loadChildren: () =>
        import('./app/${dasherize(options.name)}/feature/${dasherize(
        options.name
      )}.routes').then(
          (r) => r.${toUpperCase(underscore(options.name))}_ROUTES
        ),
    },`
    );

    sourceFile.saveSync();
    return tree;
  };
}

function filterTemplates(options: any) {
  if (!options.service) {
    return filter(
      (path) =>
        !path.match(/\.service\ts$/) &&
        !path.match(/-item\.ts$/) &&
        !path.match(/\.bak$/)
    );
  }
  return filter((path) => !path.match(/\.bak$/));
}

export function generateFeature(options: any): Rule {
  options.path = options.path ? normalize(options.path) : options.path;

  const templateSource = apply(url('./files'), [
    filterTemplates(options),
    template({
      ...stringUtils,
      ...options,
    }),
    move(options.path),
  ]);
  return chain([
    branchAndMerge(
      chain([
        mergeWith(templateSource),
        updateTsConfig(options),
        updateMainTs(options),
      ])
    ),
  ]);
}
