'use strict';

const Subscription = require('egg').Subscription;

class Hours extends Subscription {
  static get schedule() {
    return {
      cron: '0 0 */3 * * *',
      type: 'worker',
    };
  }

  async subscribe() {
    await this.service.token.initTokenAddressList();
    await this.service.token.updateMarketCapHistory();
  }
}

module.exports = Hours;
