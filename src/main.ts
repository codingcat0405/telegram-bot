import TelegramService from "./services/TelegramService";
import moment = require("moment");

const schedule = require('node-schedule');

async function main() {

  const telegramService = new TelegramService();
  await telegramService.startListen();

}

main().then();
