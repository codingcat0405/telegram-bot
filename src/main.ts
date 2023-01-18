import TelegramService from "./services/TelegramService";

async function main() {

  const telegramService = new TelegramService();
  await telegramService.startListen();
  // await telegramService.sendImage('1740827516', 'http://truyentuan.com/manga2/one-piece/1071/01.jpg');

}

main().then();
