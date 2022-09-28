'use strict'

const Service = require('egg').Service

class RedisService extends Service {
    async updateTokenAddressList(tokenAddressList) {
        try {
            this.logger.info('[updateTokenAddressList] req: %s', JSON.stringify({ tokenAddressList }))
            await this.app.redis.sadd('token_address_list', tokenAddressList);
        } catch (err) {
            this.logger.error('[updateTokenAddressList] req: %s, res: %s', JSON.stringify({ tokenAddressList }), err.message)
        }
    }
}

module.exports = RedisService