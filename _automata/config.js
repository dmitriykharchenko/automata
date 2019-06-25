'use babel';

import helperTemplate from './lib/domain/helper';
import actionFileTemplate from './lib/domain/redux/actions';
import reducerFileTemplate from './lib/domain/redux/reducer';
import sagaFileTemplate from './lib/domain/redux/sagas/saga';
import componentTemplate from './lib/domain/components/Component/index.js';



export default {
  paths: {
    '/lib/:domain/:filename.js': helperTemplate,
    '/lib/:domain/redux/actions.js': actionFileTemplate,
    '/lib/:domain/redux/reducer.js': reducerFileTemplate,
    '/lib/:domain/redux/sagas/:sagaName.js': sagaFileTemplate,
    '/lib/:domain/components/:componentName/index.js': componentTemplate,
    '/lib/:domain/components/:componentName.js': componentTemplate,
  },
  override: {
    '/lib/:domain/components/:componentName.js': '/lib/:domain/components/:componentName/index.js',
  }
};
