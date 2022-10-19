'use strict';

const Controller = require('egg').Controller;

class TokenController extends Controller {
  async writeCurrentSpecifyTokenMarketCap() {
    const { ctx } = this;
    const requestBody = this.ctx.request.body;

    this.ctx.validate({
      tokenAddress: 'string',
    }, requestBody);

    await this.service.token.writeCurrentSpecifyTokenMarketCap(requestBody);
    ctx.body = {
      code: '200',
    };
  }

  async writeSpecifyTokenMarketCapHistory() {
    const { ctx } = this;
    const requestBody = this.ctx.request.body;

    this.ctx.validate({
      tokenAddress: 'string',
    }, requestBody);

    await this.service.token.writeSpecifyTokenMarketCapHistory(requestBody);
    ctx.body = {
      code: '200',
    };
  }
}

module.exports = TokenController;
