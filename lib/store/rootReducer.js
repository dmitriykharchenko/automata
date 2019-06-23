'use babel';

import { combineReducers } from 'redux';
import files from '../files/redux/reducer';

export default combineReducers({
  files,
});
