'use babel';

import * as acorn from 'acorn';
import { File } from 'atom';
import { takeLatest, select, put } from 'redux-saga/effects';
import { FILE_SAVED, SET_CONFIG_PATH, populateFileImports } from '../actions';

const IMPORT_DECLARATION_TYPE = 'ImportDeclaration';


const readFileTree = async (file) => {
  try {
    return acorn.parse(await file.read(true), { sourceType: 'module' });
  } catch (e) {
    console.log("error readig tree", e.toString());
  }
};

const parseFileImports = function* (file) {
  const tree = yield readFileTree(file);
  if (!tree) return null;
  const { body } = tree;

  return body
    .filter(({ type }) => type === IMPORT_DECLARATION_TYPE)
    .map(({ source }) => {
      return source.value;
    });
};

export default function* () {
  yield takeLatest([FILE_SAVED, SET_CONFIG_PATH], function* ({ data }) {
    const { filePath } = data;
    if (!(yield select((state) => state.files[filePath] && state.files[filePath].configDirectory))) return;

    const file = new File(filePath);
    const directoryPath = (yield file.getParent()).path;
    const imports = yield parseFileImports(file, directoryPath);
    if (!imports) return;
    yield put(populateFileImports(filePath, directoryPath, imports));
  });
};
