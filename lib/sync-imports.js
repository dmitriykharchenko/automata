'use babel';

import * as acorn from 'acorn';
import path from 'path';
import wildcard from 'wildcard';
import createFiles from './create-files';
import { File } from 'atom';

const IMPORT_DECLARATION_TYPE = 'ImportDeclaration';
const isRelativeRegexp = new RegExp(/^\.+\//);
const isGlobalModule = new RegExp();

const createFile = async (filePath, { fileTypes }) => {
  const pattern = fileTypes.find(({ pattern }) => patter.match(filePath));
  const file = new File(filePath);

  if (!(file.exists) && pattern) {
    await file.write(pattern.defaultValue);
  }
};

const readFileTree = async (file) => {
  return acorn.parse(await file.read(true), { sourceType: 'module' });
};

const findImports = async (file, { body }, { rootDirectory, structure }) => {
  const fileDirectoryPath = (await file.getParent()).getPath();
  const rootDirectoryPath = rootDirectory.getPath();
  const rootDirectoryName = rootDirectory.getBaseName();
  const rootDirectoryRegexp = new RegExp(`^${rootDirectoryName}/`);

  const imports = body
    .filter(({ type }) => type === IMPORT_DECLARATION_TYPE)
    .map(({ source }) => {
      if (source.value.match(isRelativeRegexp)) {
        return path.join(fileDirectoryPath, source.value);
      }
      if (!source.value.match(rootDirectoryRegexp)) {
        return null;
      }
      return source.value;
    })
    .filter(Boolean);

  const wildcarts = Object.keys(structure);
  return imports.map((fullPath) => {
    const relativeToRootPath = fullPath.replace(rootDirectoryPath, '');
    const hasExtension = relativeToRootPath.match(/\.[\w]+$/);
    const pattern = wildcarts.find((wildc) => {
      const patternExtension = wildc.match(/\.([\w]+)$/)[1];
      return wildcard(wildc, hasExtension ? relativeToRootPath : `${relativeToRootPath}.${patternExtension}`);
    });
    if (pattern) {
      const patternExtension = pattern.match(/\.([\w]+)$/)[1];
      return {
        fullPath: hasExtension ? fullPath : `${fullPath}.${patternExtension}`,
        relativeToRootPath,
        defaultValue: structure[pattern],
        pattern,
      };
    }
  }).filter(Boolean);
};


export default async (file, { structure, rootDirectory }) => {
  const fileTree = await readFileTree(file);
  const imports = await findImports(file, fileTree, { structure, rootDirectory });
  await createFiles(imports, { structure, rootDirectory });
};
