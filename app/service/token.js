'use strict'

const Service = require('egg').Service
const moment = require('moment')

class TokenService extends Service {
    async initTokenAddressList() {
        try {
            this.logger.info('[initTokenAddressList]')
            // get all token
            const tokenAddressList = []
            const allToken = await this.ctx.model.Token.getAll()
            for (const item of allToken) {
                tokenAddressList.push(item.address)
            }
            // update list
            await this.service.redis.setKeyList('token_address_list', tokenAddressList)
        } catch (err) {
            this.logger.error('[initTokenAddressList] res: %s', err.message)
        }
    }

    async writeCurrentMarketCap() {
        try {
            this.logger.info('[writeCurrentMarketCap]')
            
            // get all token
            const tokenAddressList = await this.service.redis.getListData('token_address_list')
            const days = 1
            for (const item of tokenAddressList) {
                await this.setCurrentMarketCap(item, days)
            }
        } catch (err) {
            this.logger.error('[writeCurrentMarketCap] res: %s', err.message)
            throw err
        }
    }

    async setCurrentMarketCap(tokenAddress, days) {
        try {
            this.logger.info('[setCurrentMarketCap] req: %s', tokenAddress)

            const marketCaps = await this.service.api.cmc.getTokenInfo(tokenAddress, days)
            const currentMarketCaps = marketCaps.pop()[1]
            await this.service.redis.setKey(`current_${tokenAddress}`, currentMarketCaps)
        } catch (err) {
            this.logger.error('[setCurrentMarketCap] req: %s, res: %s', tokenAddress, err.message)
            throw err
        }
    }

    async writeCurrentSpecifyTokenMarketCap(requestBody) {
        try {
            this.logger.info('[writeCurrentSpecifyTokenMarketCap] req: %s', JSON.stringify(requestBody))
            const days = 1
            const tokenAddress =  requestBody.tokenAddress
            await this.setCurrentMarketCap(tokenAddress, days)

        } catch (err) {
            this.logger.error('[writeCurrentSpecifyTokenMarketCap] req: %s, res: %s', JSON.stringify(requestBody), err.message)
            throw err
        }
    }

    async writeSpecifyTokenMarketCapHistory(requestBody) {
        try {
            this.logger.info('[writeSpecifyTokenMarketCapHistory] req: %s', JSON.stringify(requestBody))
            const days = 7
            const tokenAddress =  requestBody.tokenAddress
            await this.setHistoryMarketCap(tokenAddress, days)

        } catch (err) {
            this.logger.error('[writeSpecifyTokenMarketCapHistory] req: %s, res: %s', JSON.stringify(requestBody), err.message)
            throw err
        }
    }

    async updateMarketCapHistory() {
        try {
            this.logger.info('[updateMarketCapHistory]')
            
            // get all token
            const tokenAddressList = await this.service.redis.getListData('token_address_list')
            const days = 7
            for (const item of tokenAddressList) {
                await this.setHistoryMarketCap(item, days)
            }
        } catch (err) {
            this.logger.error('[updateMarketCapHistory] res: %s', err.message)
        }
    }

    async setHistoryMarketCap(tokenAddress, days) {
        try {
            this.logger.info('[setHistoryMarketCap] req: %s', tokenAddress)

            const marketCaps = await this.service.api.cmc.getTokenInfo(tokenAddress, days)
                
            const marketCapsHistory = await this.service.redis.getKey(`history_${tokenAddress}`)
            let marketCapsArr = []
            if (marketCapsHistory === null) {
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
                    if (marketCapsArr.length === 48) {
                        marketCapsArr.shift()
                    }
                    marketCapsArr.push({
                        date: moment(marketCaps[i][0]).format('YYYY-MM-DD HH:mm:ss'),
                        marketCap: marketCaps[i][1]
                    }) 
                }
            } else {
                marketCapsArr = JSON.parse(marketCapsHistory).history
                const currentMarketCaps = marketCaps.pop()
                marketCapsArr.shift()
                marketCapsArr.push({
                    date: moment(currentMarketCaps[0]).format('YYYY-MM-DD HH:mm:ss'),
                    marketCap: currentMarketCaps[1]
                })
            }
    
            await this.service.redis.setKey(`history_${tokenAddress}`, JSON.stringify({history: marketCapsArr}))
        } catch (err) {
            this.logger.error('[setHistoryMarketCap] req: %s, res: %s', tokenAddress, err.message)
            throw err
        }
    }
}

module.exports = TokenService
// const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')