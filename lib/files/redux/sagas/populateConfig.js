'use babel';

import { takeEvery, put, select } from 'redux-saga/effects';
import { File, Directory } from 'atom';
import { FILE_SAVED, populateConfig } from '../actions';

const CONFIG_DIR_NAME = '_automata';
const IGNORE_STRUCTURE_NAMES = [
  'config.json',
];

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

export default function* () {
  yield takeEvery(FILE_SAVED, function* ({ data: { filePath }}) {
    const existingConfig = yield select((state) => {
      const file = state.files[filePath];
      if (!file) return null;
      return state.files.configs[file.config];
    });
    if (existingConfig) return existingConfig;

    const file = new File(filePath);
    const configDirectory = yield findConfigDirectory(file);
    const config = yield require(`${configDirectory.path}/config.js`);
    console.log("config", config);
    const configRootDirectory = yield configDirectory.getParent();

    yield put(populateConfig(filePath, {
      structure: flattenStructure(yield parseConfig(configDirectory)),
      rootDirectory: configRootDirectory.path,
    }));
  });
};
