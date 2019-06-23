'use babel';

import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';

export const sagaMiddleware = createSagaMiddleware();


export default () => {
  const middlewares = [
    sagaMiddleware,
  ];

  sagaMiddleware.run(rootSaga);

  return middlewares;
};
