'use strict'

module.exports = app => {
    return {
        schedule: {
            interval: '5m',
            type: 'worker',
        }, 

        async task (ctx) {
            await ctx.service.token.writeCurrentMarketCap()
        },
    
    };
}