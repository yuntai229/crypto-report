'use strict';

const Service = require('egg').Service;

class RedisService extends Service {
  async getListData(key) {
    try {
      this.logger.info('[getListData]');
      const list = await this.app.redis.smembers(key);
      return list;
    } catch (err) {
      this.logger.error('[getListData] res: %s', err.message);
    }
  }

  async setKeyList(key, list) {
    try {
      this.logger.info('[setKeyList] req: %s', JSON.stringify({ key, list }));
      await this.app.redis.sadd(key, list);
    } catch (err) {
      this.logger.error('[setKeyList] req: %s, res: %s', JSON.stringify({ key }), err.message);
    }
  }

  async setKey(key, value) {
    try {
      this.logger.info('[setKey] req: %s', JSON.stringify({ key, value }));
      await this.app.redis.set(key, value);
    } catch (err) {
      this.logger.error('[setKey] req: %s, res: %s', JSON.stringify({ key, value }), err.message);
    }
  }

  async getKey(key) {
    try {
      this.logger.info('[getKey] req: %s', JSON.stringify({ key }));
      return await this.app.redis.get(key);
    } catch (err) {
      this.logger.error('[getKey] req: %s, res: %s', JSON.stringify({ key }), err.message);
    }
  }
}

module.exports = RedisService;
