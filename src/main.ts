import TelegramService from "./services/TelegramService";
import * as schedule from "node-schedule";

async function main() {

  const telegramService = new TelegramService();
  await telegramService.startListen();
  // await telegramService.sendImage('1740827516', 'http://truyentuan.com/manga2/one-piece/1071/01.jpg');

  // const job = schedule.scheduleJob('0 1 * * *', function () {
  //   telegramService.sendMessage('1740827516', 'Nộp đơn xin xét tốt nghiệp bổ sung từ 5/9 đến 8/9')
  // });
}

main().then();
