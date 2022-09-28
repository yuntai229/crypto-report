'use strict'

module.exports = app => {
    return {
        schedule: {
            cron: '0 0 */3 * * *',
            type: 'worker',
        }, 
        async task (ctx) {
            await ctx.service.token.initTokenList()
            await ctx.service.token.updateMarketCapHistory()
        },  
    };
}