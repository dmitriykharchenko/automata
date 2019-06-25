'use babel';

import { SET_CONFIG_PATH, POPULATE_FILE_IMPORTS } from './actions';

export default (state = { configs: {}, imports: {} }, action) => {
  console.log("action", action.type);
  switch (action.type) {
    case SET_CONFIG_PATH: {
      const { configDirectoryPath, filePath } = action.data;

      return {
        ...state,
        [filePath]: {
          ...(state[filePath] || {}),
          configDirectory: configDirectoryPath,
        }
      };
    }

    case POPULATE_FILE_IMPORTS: {
      const { filePath, fileDirectory, imports } = action.data;
      return {
        ...state,
        [filePath]: {
          ...(state[filePath] || {}),
          filePath,
          fileDirectory,
          imports,
        }
      }
    }

    default: return state;
  }
};
