import TelegramBot = require("node-telegram-bot-api");
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

export default class TelegramService {


  private readonly chatId = 1740827516;
  private readonly _bot: TelegramBot;


  constructor() {
    this._bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: true});
  }

  async sendMessage(message: string) {
    await this._bot.sendMessage(this.chatId, message);
  }

  async startListen() {
    console.log("start listen");
    this._bot.onText(/\/(.+)/, async (msg, match) => {
      // 'msg' is the received Message from Telegram
      // 'match' is the result of executing the regexp above on the text content
      // of the message

      const chatId = msg.chat.id;
      const command = match[1]; // the captured "whatever"
      if(command === "ping") {
        await this.sendMessage(`Pong!!!!\n🤖:I'm still alive`);

      } else {
        await this.sendMessage("Unknown command");
      }
      console.log("command: " + command);
    });
  }


}