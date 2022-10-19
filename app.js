'use strict';

class AppBookHook {
  constructor(app) {
    this.app = app;
  }

  async serverDidReady() {
    // init redis value
    if (this.app.config.env === 'unittest') {
      return;
    }
    const ctx = await this.app.createAnonymousContext();
    await ctx.service.token.initTokenAddressList();
    await ctx.service.token.updateMarketCapHistory();
  }
}

module.exports = AppBookHook;
