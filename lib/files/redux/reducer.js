'use babel';

import { POPULATE_CONFIG, POPULATE_FILE_IMPORTS } from './actions';

export default (state = { configs: {}, imports: {} }, action) => {
  console.log("ACTION", action);
  switch (action.type) {
    case POPULATE_CONFIG: {
      const { config, filePath } = action.data;

      return {
        ...state,
        configs: {
          ...state.configs,
          [config.rootDirectory]: config,
        },
        [filePath]: {
          ...(state[filePath] || {}),
          config: config.rootDirectory,
        }
      };
    }

    case POPULATE_FILE_IMPORTS: {
      const { filePath, imports } = action.data;
      return {
        ...state,
        [filePath]: {
          ...(state[filePath] || {}),
          imports,
        }
      }
    }

    default: return state;
  }
};
