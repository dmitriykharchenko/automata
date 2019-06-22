'use babel';
import { File } from 'atom';

export default async (imports, options) => {
  const newFiles = await Promise.all(imports.map(async ({ fullPath, defaultValue }) => {
    const newFile = new File(fullPath);
    if (await newFile.exists()) return;
    console.log("CREATE", fullPath, defaultValue);
    await newFile.write(defaultValue);
  }));
};
