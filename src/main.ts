import TelegramService from "./services/TelegramService";

const schedule = require('node-schedule');

async function main() {

  const telegramService = new TelegramService();
  const currentTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"});
  const date = new Date();
  const morningMsg = `Uống thuốc sáng: ${currentTime}
    - 1 viên thuốc bổ
    - 1 viên thuốc họat huyết 
  `;
  const eveningMsg = `Uống thuốc tối: ${currentTime}
    - 1 viên thuốc bổ
    - 2 viên thuốc họat huyết`

  const myTimeZone = 7;

  console.log("current time: " + currentTime);
  // my timezone is GMT+7 so I will set the time to 0 0 1 * * * (8am everyday in GMT+7)
  const morningReminderJobFirstTime = schedule.scheduleJob('* * 1 * * *', async () => {
    console.log('Send morning reminder first!');
    await telegramService.sendMessage(morningMsg);
  });
  //send reminder again after 30m
  const morningReminderJobSecondTime = schedule.scheduleJob('* 30 1 * * *', async () => {
    console.log('Send morning reminder second!');
    await telegramService.sendMessage(morningMsg);
  });
  //send reminder again after 1h
  const morningReminderJobThirdTime = schedule.scheduleJob('* * 2 * * *', async () => {
    console.log('Send morning reminder third!');
    await telegramService.sendMessage(morningMsg);
  });

  // my timezone is GMT+7 so I will set the time to 0 0 1 * * * (8am everyday in GMT+7)
  const eveningReminderJob = schedule.scheduleJob('* * 12 * * *', async () => {
    console.log('Send evening reminder!');
    await telegramService.sendMessage(eveningMsg);
  });
  //send reminder again after 30m
  const eveningReminderJobSecondTime = schedule.scheduleJob('* 30 12 * * *', async () => {
    console.log('Send evening reminder second!');
    await telegramService.sendMessage(eveningMsg);
  });
  //send reminder again after 1h
  const eveningReminderJobThirdTime = schedule.scheduleJob('* * 13 * * *', async () => {
    console.log('Send evening reminder third!');
    await telegramService.sendMessage(eveningMsg);
  });
  //send reminder again after 1h30
  const eveningReminderJobFourthTime = schedule.scheduleJob('* 30 13 * * *', async () => {
    console.log('Send evening reminder fourth!');
    await telegramService.sendMessage(eveningMsg);
  });
  await telegramService.startListen();

}

main().then();