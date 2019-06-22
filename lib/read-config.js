'use babel';

import { File, Directory } from 'atom';

const CONFIG_DIR_NAME = '_automata';
const IGNORE_STRUCTURE_NAMES = [
  'config.json',
];

const findConfigDirectory = async (file) => {
  const parent = await file.getParent();
  if (!parent || !(await parent.exists())) return null;
  const configDir = parent.getSubdirectory(CONFIG_DIR_NAME);
  if (await configDir.exists()) return configDir;
  return findConfigDirectory(parent);
};

const parseConfig = async (directory, structure = {}) => {
  const entries = await new Promise((resolve, reject) => directory.getEntries((err, entries) => {
    if (err) return reject(err);
    return resolve(entries);
  }));
  for (const entry of entries) {
    const name = await entry.getBaseName();
    if (IGNORE_STRUCTURE_NAMES.indexOf(name) >= 0) continue;
    if (entry.isFile()) {
      structure[name] = await entry.read(true);
    } else {
      structure[name] = await parseConfig(entry, {});
    }
  }
  return structure;
};

const flattenStructure = (structure, prefix = '', resultStructure = {}) => {
  const keys = Object.keys(structure);

  for (const key of keys) {
    if (typeof structure[key] === 'string') {
      resultStructure[`${prefix}/${key}`] = structure[key];
    } else {
      flattenStructure(structure[key], `${prefix}/${key}`, resultStructure);
    }
  }

  return resultStructure;
};


export default async (file) => {
  const configDirectory = await findConfigDirectory(file);
  const filesStructure = await parseConfig(configDirectory);
  return {
    structure: flattenStructure(filesStructure),
    rootDirectory: await configDirectory.getParent(),
  };
}
