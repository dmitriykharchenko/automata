'use babel';

import * as acorn from 'acorn';
import { File } from 'atom';
import { takeLatest, select, put } from 'redux-saga/effects';
import { FILE_SAVED, populateFileImports } from '../actions';

const IMPORT_DECLARATION_TYPE = 'ImportDeclaration';


const readFileTree = async (file) => {
  return acorn.parse(await file.read(true), { sourceType: 'module' });
};

const parseFileImports = function* (file) {
  const { body } = yield readFileTree(file);
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
    yield put(populateFileImports(data.filePath, (yield file.getParent()).path, yield parseFileImports(file)));
  });
};
