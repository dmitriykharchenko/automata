'use babel';

export default (urlTemplate, params) => {
  return urlTemplate.replace(/:([\w\d-]+)/g, (sustr, match) => {
    return (params && params[match]) || '';
  });
};
