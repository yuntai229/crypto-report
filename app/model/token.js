'use strict'

module.exports = app => {
    const Token = app.model.define('token', {
        id: { type: app.Sequelize.BIGINT, field: 'id', primaryKey: true, autoIncrement: true },
        address: { type: app.Sequelize.STRING, field: 'address' },
        marketcapHistory: { type: app.Sequelize.JSON, field: 'marketcap_history' },
    });

    Token.getAll = async () => {
        try {
            app.logger.info('[DbLayer][Token.getAll]')

            const  allToken = await Token.findAll()

            return allToken
        } catch (err) {
            app.logger.error('[DbLayer][Token.getAll] err: %s', err.message)
            throw err
        }
    }

    return Token
}