'use babel';

import actionFileTemplate from './lib/domain/redux/actions';
import reducerFileTemplate from './lib/domain/redux/reducer';
import sagaFileTemplate from './lib/domain/redux/sagas/saga';
import componentTemplate from './lib/domain/components/Component/index.js';



export default {
  paths: {
    '/lib/:domain/redux/actions': actionFileTemplate,
    '/lib/:domain/redux/reducer': reducerFileTemplate,
    '/lib/:domain/redux/sagas/:sagaName': sagaFileTemplate,
    '/lib/:domain/components/:componentName/index': componentTemplate,
    '/lib/:domain/components/:componentName': componentTemplate,
  },
  override: {
    '/lib/:domain/components/:componentName': '/lib/:domain/components/:componentName/index',
  }
};
