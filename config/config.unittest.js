'use strict';

const redis = require('redis-mock');

exports.sequelize = {
  dialect: 'sqlite',
  storage: 'test.sqlite',
  define: { freezeTableName: true, timestamps: false },
};

exports.redis = redis.createClient();
