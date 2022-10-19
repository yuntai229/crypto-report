'use strict';

const { app } = require('egg-mock/bootstrap');
const sinon = require('sinon');

describe('test/app/service/token.test.js', () => {
  let ctx;
  beforeEach(() => {
    ctx = app.mockContext();
  });
  describe('[Function] initTokenAddressList', () => {
    let modelTokenGetAll;
    let redisSetKeyList;
    beforeEach(() => {
      modelTokenGetAll = sinon.stub(ctx.model.Token, 'getAll');
      redisSetKeyList = sinon.stub(ctx.service.redis, 'setKeyList');
    });
    afterEach(() => {
      modelTokenGetAll.restore();
      redisSetKeyList.restore();
    });
    it('token 清單初始化', async () => {
      ctx.model.Token.getAll.callsFake(() => {
        return [];
      });

      await ctx.service.token.initTokenAddressList();
      sinon.assert.callCount(redisSetKeyList, 1);
    });

  });

  describe('[Function] writeCurrentMarketCap', () => {
    let setCurrentMarketCap;
    let redisGetListData;
    beforeEach(() => {
      setCurrentMarketCap = sinon.stub(ctx.service.token, 'setCurrentMarketCap');
      redisGetListData = sinon.stub(ctx.service.redis, 'getListData');
    });
    afterEach(() => {
      setCurrentMarketCap.restore();
      redisGetListData.restore();
    });
    it('token 個別寫入現在市值', async () => {
      ctx.service.redis.getListData.callsFake(() => {
        return [ 1, 2, 3 ];
      });
      await ctx.service.token.writeCurrentMarketCap();
      sinon.assert.callCount(setCurrentMarketCap, 3);
    });
  });

  describe('[Function] setCurrentMarketCap', () => {
    let apiCmcGetTokenInfo;
    let redisSetKey;
    beforeEach(() => {
      apiCmcGetTokenInfo = sinon.stub(ctx.service.api.cmc, 'getTokenInfo');
      redisSetKey = sinon.stub(ctx.service.redis, 'setKey');
    });
    afterEach(() => {
      apiCmcGetTokenInfo.restore();
      redisSetKey.restore();
    });
    it('api 取得資訊寫回 redis', async () => {
      const inputTokenAddress = '0x4a615bb7166210cce20e6642a6f8fb5d4d044496';
      const inputDays = 1;
      ctx.service.api.cmc.getTokenInfo.callsFake(() => {
        return [
          [
            1666079218758,
            0.031026483718307796,
          ],
          [
            1666079539737,
            0.030982132556693343,
          ],
        ];
      });
      await ctx.service.token.setCurrentMarketCap(inputTokenAddress, inputDays);
      sinon.assert.callCount(redisSetKey, 1);
    });
  });

  describe('[Function] writeCurrentSpecifyTokenMarketCap', () => {
    let setCurrentMarketCap;
    beforeEach(() => {
      setCurrentMarketCap = sinon.stub(ctx.service.token, 'setCurrentMarketCap');
    });
    afterEach(() => {
      setCurrentMarketCap.restore();
    });
    it('redis 寫入 token 市值', async () => {
      const input = {
        tokenAddress: '0x4a615bb7166210cce20e6642a6f8fb5d4d044496',
      };
      await ctx.service.token.writeCurrentSpecifyTokenMarketCap(input);
      sinon.assert.callCount(setCurrentMarketCap, 1);
    });
  });

  describe('[Function] writeSpecifyTokenMarketCapHistory', () => {
    let setHistoryMarketCap;
    beforeEach(() => {
      setHistoryMarketCap = sinon.stub(ctx.service.token, 'setHistoryMarketCap');
    });
    afterEach(() => {
      setHistoryMarketCap.restore();
    });
    it('redis 寫入 token 歷史市值', async () => {
      const input = {
        tokenAddress: '0x4a615bb7166210cce20e6642a6f8fb5d4d044496',
      };
      await ctx.service.token.writeSpecifyTokenMarketCapHistory(input);
      sinon.assert.callCount(setHistoryMarketCap, 1);
    });
  });

  describe('[Function] updateMarketCapHistory', () => {
    let setHistoryMarketCap;
    let redisGetListData;
    beforeEach(() => {
      setHistoryMarketCap = sinon.stub(ctx.service.token, 'setHistoryMarketCap');
      redisGetListData = sinon.stub(ctx.service.redis, 'getListData');
    });
    afterEach(() => {
      setHistoryMarketCap.restore();
      redisGetListData.restore();
    });
    it('token 個別寫入現在市值', async () => {
      ctx.service.redis.getListData.callsFake(() => {
        return [ 1, 2, 3 ];
      });
      await ctx.service.token.updateMarketCapHistory();
      sinon.assert.callCount(setHistoryMarketCap, 3);
    });
  });

  describe('[Function] setHistoryMarketCap', () => {
    let apiCmcGetTokenInfo;
    let redisGetKey;
    beforeEach(() => {
      apiCmcGetTokenInfo = sinon.stub(ctx.service.api.cmc, 'getTokenInfo');
      redisGetKey = sinon.stub(ctx.service.redis, 'getKey');
    });
    afterEach(() => {
      apiCmcGetTokenInfo.restore();
      redisGetKey.restore();
    });

    /* it('redis 有記錄', async () => {
      ctx.service.api.cmc.getTokenInfo(() => {
        return []
      })
      ctx.service.redis.getKey.callsFake(() => {
        return null
      })
      const inputAddress = '0x4a615bb7166210cce20e6642a6f8fb5d4d044496'
      const inputDays = 7
      await ctx.service.token.setHistoryMarketCap()
    }) */
    /*     it('redis 無紀錄', async () => {

    }) */
  });
});
