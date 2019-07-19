'use babel';
import { File } from 'atom';
import path from 'path';
import pathToRegexp from "path-to-regexp";
import { takeEvery, select } from 'redux-saga/effects';
import { SET_CONFIG_PATH, POPULATE_FILE_IMPORTS } from '../actions';
import pathInterpolate from '../../pathInterpolate';

const isRelativeRegexp = new RegExp(/^\.+\//);

const getPathParams = (pathTemplate, pathname) => {
  const pathArray = pathname.split('/');
  const pathTemplateArray = pathTemplate.split('/');

  return pathTemplateArray.reduce((params, item, index) => {
    if (item.match(/:[\w\d-]+\.?/)) {
      return {
        ...params,
        [item.replace(/^:|\.[\w]+/g, '')]: pathArray[index],
      };
    }
    return params;
  }, {});
};

export default function* () {
  yield takeEvery([SET_CONFIG_PATH, POPULATE_FILE_IMPORTS], function* ({ type, data: { filePath }}) {
    const file = yield select((state) => state.files[filePath]);
    if (!file || !file.configDirectory || !file.imports) return;

    const fileConfig = yield require(`${file.configDirectory}/_automata/config.js`);
    if (!fileConfig) return;

    const { imports, fileDirectory } = file;
    const paths = Object.keys(fileConfig.paths).map((path) => {
      return {
        path,
        regexp: pathToRegexp(path.replace(/\.\w+$/, '')),
        template: fileConfig.paths[path],
      };
    });

    const matchingImportPaths = imports.map((importPath) => {
      if (importPath.match(/^\.+\//)) {
        return path.resolve(fileDirectory, importPath);
      }
      return importPath;
    }).map((importPath) => {
      const matchedPath = paths.find(({ regexp }) => Boolean(importPath.replace(file.configDirectory, '').match(regexp)));

      return {
        importPath,
        matchedPath,
        newFilePath: '',
      };
    })
    .filter(({ matchedPath }) => Boolean(!!matchedPath))
    .map((matchedImportPathConfig) => {
      const pathParams = getPathParams(
        matchedImportPathConfig.matchedPath.path,
        matchedImportPathConfig.importPath.replace(file.configDirectory, '')
      );
      return {
        ...matchedImportPathConfig,
        pathParams,
        newFilePath: pathInterpolate(matchedImportPathConfig.matchedPath.path, pathParams),
      };
    });


    yield Promise.all(matchingImportPaths.map((async ({ newFilePath, matchedPath }) => {
      const pathToFile = `${file.configDirectory}${newFilePath}`;
      const newFile = new File(pathToFile);
      if (await newFile.exists()) return;
      return newFile.write(matchedPath.template());
    })))
  });
};
