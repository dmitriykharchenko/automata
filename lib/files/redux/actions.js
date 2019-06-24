'use babel';

export const SET_CONFIG_PATH = 'SET_CONFIG_PATH';
export const POPULATE_FILE_IMPORTS = 'POPULATE_FILE_IMPORTS';

export const FILE_SAVED = 'FILE_SAVED';
export const FILE_IMPORTS_PARSED = 'FILE_IMPORTS_PARSED';


export const fileSaved = (filePath) => ({
  data: { filePath },
  type: FILE_SAVED,
});

export const populateFileImports = (filePath, fileDirectory, imports) => ({
  data: { filePath, fileDirectory, imports },
  type: POPULATE_FILE_IMPORTS,
});

export const setConfigPath = (filePath, configDirectoryPath) => ({
  data: { filePath, configDirectoryPath },
  type: SET_CONFIG_PATH,
});

export const syncFileImports = (filePath) => ({
  data: { filePath },
  type: SYNC_IMPORTS,
});
