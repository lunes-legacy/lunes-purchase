import _Promise from 'bluebird';

/**
 * functions generators to resolve with Promise.coroutine
 * @param {*} generatorsFn
 */
const wrapGenerator = (generatorsFn) => {
  const cr = _Promise.coroutine(generatorsFn);
  return function(req, res, next) {
    cr(req, res, next).catch(next);
  };
};

export default {
  wrapGenerator
};
