'use babel';

import * as acorn from 'acorn';
import { File } from 'atom';
import { takeLatest, select, put } from 'redux-saga/effects';
import { FILE_SAVED, populateFileImports } from '../actions';

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
  const fileDirectoryPath = (yield file.getParent()).getPath();

  return body
    .filter(({ type }) => type === IMPORT_DECLARATION_TYPE)
    .map(({ source }) => {
      return source.value;
    })

};

export default function* () {
  yield takeLatest(FILE_SAVED, function* ({ data }) {
    const file = new File(data.filePath);
    const imports = yield parseFileImports(file);
    if (!imports) return;
    yield put(populateFileImports(data.filePath, (yield file.getParent()).path, imports));
  });
};
