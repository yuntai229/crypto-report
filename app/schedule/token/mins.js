'use strict'

module.exports = app => {
    return {
        schedule: {
            interval: '60s',
            type: 'worker',
        }, 

        async task (ctx) {
            await ctx.service.token.writeCurrentMarketCap()
        },
    
    };
}