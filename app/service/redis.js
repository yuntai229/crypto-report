'use strict'

const Service = require('egg').Service

class RedisService extends Service {
    async getListData(key) {
        try {
            this.logger.info('[updateTokenAddressList]')
            const tokenAddressList = await this.app.redis.smembers(key);
            return tokenAddressList
        } catch (err) {
            this.logger.error('[updateTokenAddressList] res: %s', err.message)
        }
    }

    async setKeyList(key, list) {
        try {
            this.logger.info('[setKeyList] req: %s', JSON.stringify({ key, list }))
            await this.app.redis.sadd(key, list);
        } catch (err) {
            this.logger.error('[setKeyList] req: %s, res: %s', JSON.stringify({ key, value }), err.message)
        }
    }

    async setKey(key, value) {
        try {
            this.logger.info('[setKey] req: %s', JSON.stringify({ key, value }))
            const tokenAddressList = await this.app.redis.set(key, value);
            return tokenAddressList
        } catch (err) {
            this.logger.error('[setKey] req: %s, res: %s', JSON.stringify({ key, value }), err.message)
        }
    }
}

module.exports = RedisService