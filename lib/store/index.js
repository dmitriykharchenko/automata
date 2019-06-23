'use babel';

import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducer from './rootReducer';
import rootSaga from './rootSaga';

export const sagaMiddleware = createSagaMiddleware();


export default () => {
  const enhancers = [applyMiddleware(sagaMiddleware)];
  const store = createStore(reducer, {
    files: {},
    imports: {},
    configs: {},
  }, compose(...enhancers));

  sagaMiddleware.run(rootSaga);
  return store;
}
