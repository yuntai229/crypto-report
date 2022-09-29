'use strict'

const Subscription = require('egg').Subscription;

class Mins extends Subscription {
    static get schedule() {
        return {
          interval: '5m',
          type: 'worker',
        };
    }

    async subscribe() {
        await this.service.token.writeCurrentMarketCap()
    }
}

module.exports = Mins