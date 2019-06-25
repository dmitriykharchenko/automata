'use babel';

import { takeEvery, put, select } from 'redux-saga/effects';
import { File, Directory } from 'atom';
import { FILE_SAVED, setConfigPath } from '../actions';

const CONFIG_DIR_NAME = '_automata';
const IGNORE_STRUCTURE_NAMES = [
  'config.json',
];

const findConfigDirectory = async (file) => {
  const parent = await file.getParent();
  if (parent.path === file.path) return null;
  if (!parent || !(await parent.exists())) return null;
  const configDir = parent.getSubdirectory(CONFIG_DIR_NAME);
  if (await configDir.exists()) return configDir;
  return findConfigDirectory(parent);
};

export default function* () {
  yield takeEvery(FILE_SAVED, function* ({ data: { filePath }}) {
    const existingConfigPath = yield select((state) => {
      const file = state.files[filePath];
      if (file && file.configDirectory) return file.configDirectory;
      return null;
    });
    if (existingConfigPath) return;

    const file = new File(filePath);
    const configDirectory = yield findConfigDirectory(file);
    if (!configDirectory) return;

    const configRootDirectory = yield configDirectory.getParent();
    yield put(setConfigPath(filePath, configRootDirectory.path));
  });
};
