'use strict'

const Service = require('egg').Service

class CmcService extends Service {
    async getTokenInfo(tokenAddress, days) {
        const res = await this.ctx.curl(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${tokenAddress}/market_chart/?vs_currency=usd&days=${days}`, {
            dataType: 'json',
        })

        const marketCaps = res.data.market_caps
        return marketCaps
    }
}

module.exports = CmcService

// `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=${this.config.cmcKey}`
//h ttps://pro-api.coinmarketcap.com/v1/cryptocurrency/map