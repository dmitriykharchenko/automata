'use babel';

import { all } from 'redux-saga/effects';
import createFilesSaga from '../files/redux/sagas/createFiles';
import populateConfigSaga from '../files/redux/sagas/populateConfig';
import populateImportsSaga from '../files/redux/sagas/populateimports';


const sagasList = [
  createFilesSaga,
  populateConfigSaga,
  populateImportsSaga,
];

export default function* () {
  yield all(sagasList.map((saga) => {
    return saga();
  }));
};
