'use babel';
import { File } from 'atom';
import path from 'path';
import pathToRegexp from "path-to-regexp";
import { takeEvery, select } from 'redux-saga/effects';
import { SET_CONFIG_PATH, POPULATE_FILE_IMPORTS } from '../actions';

const isRelativeRegexp = new RegExp(/^\.+\//);

export default function* () {
  yield takeEvery([SET_CONFIG_PATH, POPULATE_FILE_IMPORTS], function* ({ type, data: { filePath }}) {
    const file = yield select((state) => state.files[filePath]);
    if (!file || !file.configDirectory) return;

    const fileConfig = yield require(`${file.configDirectory}/_automata/config.js`);
    if (!fileConfig) return;

    const { imports, fileDirectory } = file;
    const paths = Object.keys(fileConfig.paths).map((path) => {
      return {
        path,
        regexp: pathToRegexp(path),
        template: fileConfig.paths[path],
      };
    });

    const matchingPaths = imports.map((importPath) => {
      if (importPath.match(/^\.+\//)) {
        return path.resolve(fileDirectory, importPath);
      }
      return importPath;
    }).map((importPath) => {
      return paths.find(({ regexp }) => Boolean(importPath.replace(file.configDirectory, '').match(regexp)));
    }).filter(Boolean);

    console.log(filePath, imports, matchingPaths, paths, fileConfig, file);
  });
};
