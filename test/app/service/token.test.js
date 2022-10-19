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
    let redisSetKey;
    let clock;
    beforeEach(() => {
      apiCmcGetTokenInfo = sinon.stub(ctx.service.api.cmc, 'getTokenInfo');
      redisGetKey = sinon.stub(ctx.service.redis, 'getKey');
      redisSetKey = sinon.stub(ctx.service.redis, 'setKey');
      clock = clock = sinon.useFakeTimers(1666191579000);
    });
    afterEach(() => {
      apiCmcGetTokenInfo.restore();
      redisGetKey.restore();
      clock.restore();
    });

    it('redis 有記錄', async () => {
      ctx.service.api.cmc.getTokenInfo.callsFake(() => {
        return [
          [
            1666152702345,
            2314984.636774073,
          ],
          [
            1666156228716,
            2312412.490397777,
          ],
          [
            1666159846241,
            2310274.596421973,
          ],
          [
            1666162854327,
            2309222.5076192007,
          ],
          [
            1666166660652,
            2310092.3829915905,
          ],
          [
            1666170189374,
            2310446.523144649,
          ],
          [
            1666173985013,
            2309415.3639961486,
          ],
          [
            1666177348274,
            2307144.629794483,
          ],
          [
            1666181284083,
            2306342.2311084163,
          ],
          [
            1666185083736,
            2309555.0007808623,
          ],
          [
            1666189484000,
            2303387.0000323653,
          ],
        ];
      });
      ctx.service.redis.getKey.callsFake(() => {
        return null;
      });
      const inputAddress = '0x4a615bb7166210cce20e6642a6f8fb5d4d044496';
      const inputDays = 7;
      await ctx.service.token.setHistoryMarketCap(inputAddress, inputDays);
      sinon.assert.callCount(redisSetKey, 1);
    });
    it('redis 無紀錄', async () => {
      ctx.service.api.cmc.getTokenInfo.callsFake(() => {
        return [
          [
            1666152702345,
            2314984.636774073,
          ],
          [
            1666156228716,
            2312412.490397777,
          ],
          [
            1666159846241,
            2310274.596421973,
          ],
          [
            1666162854327,
            2309222.5076192007,
          ],
          [
            1666166660652,
            2310092.3829915905,
          ],
          [
            1666170189374,
            2310446.523144649,
          ],
          [
            1666173985013,
            2309415.3639961486,
          ],
          [
            1666177348274,
            2307144.629794483,
          ],
          [
            1666181284083,
            2306342.2311084163,
          ],
          [
            1666185083736,
            2309555.0007808623,
          ],
          [
            1666189484000,
            2303387.0000323653,
          ],
        ];
      });
      ctx.service.redis.getKey.callsFake(() => {
        return JSON.stringify({
          history: [
            [
              1666152702345,
              2314984.636774073,
            ],
            [
              1666156228716,
              2312412.490397777,
            ],
            [
              1666159846241,
              2310274.596421973,
            ],
            [
              1666162854327,
              2309222.5076192007,
            ],
            [
              1666166660652,
              2310092.3829915905,
            ],
            [
              1666170189374,
              2310446.523144649,
            ],
            [
              1666173985013,
              2309415.3639961486,
            ],
            [
              1666177348274,
              2307144.629794483,
            ],
            [
              1666181284083,
              2306342.2311084163,
            ],
            [
              1666185083736,
              2309555.0007808623,
            ],
            [
              1666189484000,
              2303387.0000323653,
            ],
          ],
        });
      });
      const inputAddress = '0x4a615bb7166210cce20e6642a6f8fb5d4d044496';
      const inputDays = 7;
      await ctx.service.token.setHistoryMarketCap(inputAddress, inputDays);
      sinon.assert.callCount(redisSetKey, 1);
    });
  });
});
