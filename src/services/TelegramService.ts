import TelegramBot = require("node-telegram-bot-api");
import * as dotenv from 'dotenv'
import moment = require("moment");
import VnExpressCrawler from "./VnExpressCrawler";
import TruyenQQCrawler from "./TruyenQQCrawler";
import {getCPUFreeAsync, getCPUUsageAsync} from "../util";
// see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import * as os from "os-utils";

export default class TelegramService {

  private readonly _vnExpressCrawler = new VnExpressCrawler();
  private readonly chatId = 1740827516;
  private readonly _bot: TelegramBot;
  private readonly _truyenQQCrawler = new TruyenQQCrawler();

  private readonly _listCommands: any[];


  constructor() {
    this._bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: true});
    this._vnExpressCrawler = new VnExpressCrawler();
    this._truyenQQCrawler = new TruyenQQCrawler();
    this._listCommands = [
      {
        command: "ping",
        handler: this.healthCheck.bind(this),
        description: "Xem tao còn sống không"
      },
      {
        command: "time",
        handler: this.getTime.bind(this),
        description: "Chúng ta đang sống ở năm bao nhiêu"
      },
      {
        command: "help",
        handler: this.help.bind(this),
        description: "Xem lệnh nào tao hiểu"
      },
      {
        command: "news",
        handler: this.getLatestNews.bind(this),
        description: "Cập nhật tin tức cho người tối cổ"
      },
      {
        command: "onepiece",
        handler: this.getLatestOnePieces.bind(this),
        description: "Cập nhật chap mới nhất của one piece cho mấy thằng wibu"
      },
      {
        command: "health",
        handler: this.cpuCheck.bind(this),
        description: "Khám sức khỏe cho tao"
      }

    ]
  }

  private async cpuCheck() {
    const cpuUsage = await getCPUUsageAsync();
    const cpuFree = await getCPUFreeAsync();

    const message = `CPU đã bị húp: ${(cpuUsage * 100).toFixed(2)}%\n` +
      `CPU chưa dùng: ${(cpuFree * 100) .toFixed(2)}%\n` +
      `Tổng Ram: ${(os.totalmem() / 1024).toFixed(2)} GB\n` +
      `Ram chưa bị húp: ${(os.freemem() / 1024).toFixed(2)} GB\n` +
      `Phần trăm ram bị húp: ${((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(2)}%\n` +
      `Platform: ${os.platform()}\n`;
    const finalMsg = "Tình trạng sức khỏe của tao:\n" + message;
    await this._bot.sendMessage(this.chatId, finalMsg);
  }

  private async getLatestOnePieces() {
    const latestChapters = await this._truyenQQCrawler.getLatestOnePieceChapter();
    if (!latestChapters) {
      await this._bot.sendMessage(this.chatId, "Tèo rồi, tao không lấy chap mới nhất được");
      return;
    }

    moment.locale("vi");
    const currentTime = moment().format("LLLL");
    let message = `Chap one piece mới nhât ngày: ${currentTime}:\n`;
    latestChapters.forEach(([href, title]) => {
      message += `👉 ${title}: ${href}\n`;
    });
    await this._bot.sendMessage(this.chatId, message);
  }

  private async getLatestNews() {
    const latestNews = await this._vnExpressCrawler.getLatestNews();
    if (!latestNews) {
      await this._bot.sendMessage(this.chatId, "Tèo rồi, tao không lấy được tin tức");
      return;
    }
    moment.locale("vi");
    const currentTime = moment().format("LLLL");
    let message = `Cập nhật tin tức từ vn express: ${currentTime}:\n`;
    latestNews.forEach(([title, href]) => {
      message += `👉 ${title}: ${href}\n`;
    });
    await this._bot.sendMessage(this.chatId, message);
  }

  private async getTime() {
    moment.locale("vi");
    const currentTime = moment().format("LLLL");
    await this._bot.sendMessage(this.chatId, `Bây giờ là: ${currentTime}`);
  }

  private healthCheck: () => Promise<void> = async () => {
    const healthCheckMsgs = [`Tao vẫn sống`, `Gọi cc`, `Sủa lên`, `Đang ngủ`, `Pong`, `Gọi ít thôi`];
    const randomIndex = Math.floor(Math.random() * healthCheckMsgs.length);
    await this._bot.sendMessage(this.chatId, healthCheckMsgs[randomIndex]);
  }
  private help: () => Promise<void> = async () => {
    const listCmdMsg = this._listCommands.map((c) => `/${c.command}: ${c.description}`).join("\n");
    const helpMsg = `Nói chuyện với tao bằng cách gõ lệnh sau:\n${listCmdMsg}`;
    await this._bot.sendMessage(this.chatId, helpMsg);
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
      const command = match[1];
      console.log(`${new Date()}: received command "${command}" from chatId: ${chatId}`);
      const commandHandler = this._listCommands.find((c) => c.command.toLowerCase() === command.toLowerCase());
      if (!commandHandler) {
        await this._bot.sendMessage(chatId, "Lệnh ngu tao đ hiểu gõ /help để biêt lệnh nào tao hiểu");
        return;
      }
      await commandHandler.handler();
    });
  }
}
