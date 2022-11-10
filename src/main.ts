import TelegramService from "./services/TelegramService";
import moment = require("moment");

const schedule = require('node-schedule');

async function main() {

  const telegramService = new TelegramService();

  const morningMsg = (currentTime) => `Uống thuốc sáng ${currentTime}:
    - 1 viên thuốc bổ
    - 1 viên thuốc họat huyết 
  `;
  const eveningMsg = (currentTime) => `Uống thuốc tối ${currentTime}:
    - 1 viên thuốc bổ
    - 2 viên thuốc họat huyết`

  // my timezone is GMT+7 so I will set the time to 0 0 1 * * * (8am everyday in GMT+7)
  const morningReminderJobFirstTime = schedule.scheduleJob('0 1 * * *', async () => {
    console.log('Send morning reminder first!');
    moment.locale("vi");
    const currentTime = moment().format("LL");
    await telegramService.sendMessage(morningMsg(currentTime));
  });
  //send reminder again after 30m
  const morningReminderJobSecondTime = schedule.scheduleJob('30 1 * * *', async () => {
    console.log('Send morning reminder second!');
    moment.locale("vi");
    const currentTime = moment().format("LL");
    await telegramService.sendMessage(morningMsg(currentTime));
  });
  //send reminder again after 1h
  const morningReminderJobThirdTime = schedule.scheduleJob('0 2 * * *', async () => {
    console.log('Send morning reminder third!');
    moment.locale("vi");
    const currentTime = moment().format("LL");
    await telegramService.sendMessage(morningMsg(currentTime));
  });

  // my timezone is GMT+7 so I will set the time to 0 0 1 * * * (8am everyday in GMT+7)
  const eveningReminderJob = schedule.scheduleJob('0 12 * * *', async () => {
    console.log('Send evening reminder!');
    moment.locale("vi");
    const currentTime = moment().format("LL");
    await telegramService.sendMessage(eveningMsg(currentTime));
  });
  //send reminder again after 30m
  const eveningReminderJobSecondTime = schedule.scheduleJob('30 12 * * *', async () => {
    console.log('Send evening reminder second!');
    moment.locale("vi");
    const currentTime = moment().format("LL");
    await telegramService.sendMessage(eveningMsg(currentTime));
  });
  //send reminder again after 1h
  const eveningReminderJobThirdTime = schedule.scheduleJob('0 13 * * *', async () => {
    console.log('Send evening reminder third!');
    moment.locale("vi");
    const currentTime = moment().format("LL");
    await telegramService.sendMessage(eveningMsg(currentTime));
  });
  //send reminder again after 1h30
  const eveningReminderJobFourthTime = schedule.scheduleJob('30 13 * * *', async () => {
    console.log('Send evening reminder fourth!');
    moment.locale("vi");
    const currentTime = moment().format("LL");
    await telegramService.sendMessage(eveningMsg(currentTime));
  });
  await telegramService.startListen();

}

main().then();