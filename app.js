'use strict'

class AppBookHook {
    constructor(app) {
        this.app = app
    }

    async serverDidReady() {
        // init redis value
        const ctx = await this.app.createAnonymousContext()
        await ctx.service.token.initTokenAddressList()
    }
}

module.exports = AppBookHook