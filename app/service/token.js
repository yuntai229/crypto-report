'use strict'

const Service = require('egg').Service
const moment = require('moment')

class TokenService extends Service {
    async initTokenAddressList() {
        try {
            this.logger.info('[initTokenList]')
            // get all token
            const tokenAddressList = []
            const allToken = await this.ctx.model.Token.getAll()
            for (const item of allToken) {
                tokenAddressList.push(item.address)
            }
            // update list
            await this.service.redis.setKeyList('token_address_list', tokenAddressList)
        } catch (err) {
            this.logger.error('[initTokenList] res: %s', err.message)
        }
    }

    async writeCurrentMarketCap() {
        try {
            this.logger.info('[writeCurrentMarketCap]')
            
            // get all token
            const tokenAddressList = await this.service.redis.getListData('token_address_list')
            const days = 1
            for (const item of tokenAddressList) {
                const marketCaps = await this.service.api.cmc.getTokenInfo(item, days)
                const currentMarketCaps = marketCaps.pop()[1]
                await this.service.redis.setKey(`current_${item}`, currentMarketCaps)
            }
        } catch (err) {
            this.logger.error('[writeCurrentMarketCap] res: %s', err.message)
        }
    }

    async updateMarketCapHistory() {
        try {
            this.logger.info('[updateMarketCapHistory]')
            
            // get all token
            const tokenAddressList = await this.service.redis.getListData('token_address_list')
            const days = 7
            for (const item of tokenAddressList) {
                const marketCaps = await this.service.api.cmc.getTokenInfo(item, days)
                
                const marketCapsHistory = Array.from(await this.service.redis.getListData(`history_${item}`))
                if (marketCapsHistory.length < 48) {
                    let beginIndex = 0
                    const index = []
                    const beginTimeStamp = moment().subtract(6, 'days').startOf('day').unix()
                    
                    for (let i = 0; i < marketCaps.length; i++) {
                        if (marketCaps[i][0]/1000 >= beginTimeStamp) {
                            beginIndex = i
                            break;
                        }
                    }
                    for (let i = beginIndex; i < marketCaps.length; i += 3) {
                        if (marketCapsHistory.length === 48) {
                            marketCapsHistory.shift()
                        }
                        marketCapsHistory.push({
                            date: moment(marketCaps[i][0]).format('YYYY-MM-DD HH:mm:ss'),
                            marketCap: marketCaps[i][1]
                        }) 
                    }
                } else {
                    const currentMarketCaps = marketCaps.pop()
                    marketCapsHistory.shift()
                    marketCapsHistory.push({
                        date: moment(currentMarketCaps[0]).format('YYYY-MM-DD HH:mm:ss'),
                        marketCap: currentMarketCaps[1]
                    })
                }
                await this.service.redis.setKeyList(`history_${item}`, marketCapsHistory)
            }
        } catch (err) {
            this.logger.error('[updateMarketCapHistory] res: %s', err.message)
        }
    }
}

module.exports = TokenService
// const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')