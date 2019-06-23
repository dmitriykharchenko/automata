'use babel';
import { File } from 'atom';
import path from 'path';
import { takeEvery, select } from 'redux-saga/effects';
import { POPULATE_CONFIG, POPULATE_FILE_IMPORTS } from '../actions';

const isRelativeRegexp = new RegExp(/^\.+\//);

export default function* () {
  yield takeEvery([POPULATE_CONFIG, POPULATE_FILE_IMPORTS], function* ({ type, data: { filePath }}) {
    console.log("ACTION", type);
    const file = yield select((state) => state.files[filePath]);
    console.log("FILE", file);
    if (!file || !file.config) return;

    const fileConfig = yield select((state) => state.files.configs[file.config]);
    console.log("CIONFIG", filePath, fileConfig, yield select((state) => state));
    if (!fileConfig) return;

    const { imports } = file;
    console.log(filePath, imports, fileConfig);
  });
};
