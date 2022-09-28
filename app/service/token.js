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
            await this.service.redis.updateTokenAddressList(tokenAddressList)
        } catch (err) {
            this.logger.error('[initTokenList] res: %s', err.message)
        }
    }

    async writeCurrentMarketCap() {
        try {
            this.logger.info('[writeCurrentMarketCap]')
            const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
            console.log('cccc', currentTime)
            // get all token
            const tokenAddressList = []
            const allToken = await this.ctx.model.Token.getAll()
            for (const item of allToken) {
                tokenAddressList.push(item.address)
            }
            // update list
            //await this.service.redis.updateTokenAddressList(tokenAddressList)
        } catch (err) {
            this.logger.error('[writeCurrentMarketCap] res: %s', err.message)
        }
    }
}

module.exports = TokenService