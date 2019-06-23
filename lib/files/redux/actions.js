'use babel';

export const POPULATE_CONFIG = 'POPULATE_CONFIG';
export const POPULATE_FILE_IMPORTS = 'POPULATE_FILE_IMPORTS';

export const FILE_SAVED = 'FILE_SAVED';
export const FILE_IMPORTS_PARSED = 'FILE_IMPORTS_PARSED';


export const fileSaved = (filePath) => ({
  data: { filePath },
  type: FILE_SAVED,
});

export const populateFileImports = (filePath, imports) => ({
  data: { filePath, imports },
  type: POPULATE_FILE_IMPORTS,
});

export const populateConfig = (filePath, config) => ({
  data: { filePath, config },
  type: POPULATE_CONFIG,
});

export const syncFileImports = (filePath) => ({
  data: { filePath },
  type: SYNC_IMPORTS,
});
