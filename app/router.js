'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/writeCurrentSpecifyTokenMarketCap', controller.token.writeCurrentSpecifyTokenMarketCap)
  router.post('/writeSpecifyTokenMarketCapHistory', controller.token.writeSpecifyTokenMarketCapHistory)
};
