'use strict'

const isEmpty = require('lodash').isEmpty

module.exports = () => {
	return async (ctx, next) => {
		try {
			const { request, response } = ctx
			const req = { header: {} }
			if (ctx.get('Content-type')) req.header['Content-type'] = ctx.get('Content-type')
			if (isEmpty(request.query)) req.query = request.query
			if (isEmpty(request.body)) req.query = request.body
			ctx.logger.debug(`[accessLogger] req: ${JSON.stringify(req)}`);
			await next()
			ctx.logger.debug(`[accessLogger] res: ${JSON.stringify(response.body)}`);
		} catch (err) {
			const status = err.status || 500
			ctx.status = status
			ctx.body = {
				code: status,
				message: err.message,
			}
			ctx.logger.error(`[accessLogger] err: ${JSON.stringify(ctx.body)}`);
		}
	}
}

