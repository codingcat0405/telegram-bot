import TelegramBot = require("node-telegram-bot-api");
import * as dotenv from 'dotenv'
import moment = require("moment");
import VnExpressCrawler from "./VnExpressCrawler";
import TruyenQQCrawler from "./TruyenQQCrawler";
import { convertBytesToGB, getCPUFreeAsync, getCPUUsageAsync } from "../util";
import checkDiskSpace from 'check-disk-space'
// see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import * as os from "os-utils";
import { log } from "console";
import FacebookVideoDownloaderService from "./FacebookVideoDownloaderService";
import { unlinkSync } from "fs";

export default class TelegramService {

  private readonly _vnExpressCrawler: VnExpressCrawler;
  // private readonly chatId = 1740827516;
  private readonly _bot: TelegramBot;
  private readonly _truyenQQCrawler: TruyenQQCrawler;

  private readonly _listCommands: any[];
  private readonly _fbVideoDownloaderService: FacebookVideoDownloaderService;


  constructor() {
    this._bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
    this._vnExpressCrawler = new VnExpressCrawler();
    this._truyenQQCrawler = new TruyenQQCrawler();
    this._fbVideoDownloaderService = new FacebookVideoDownloaderService();
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
      },
      {
        command: "fbdownload",
        handler: this.downloadFbVideo.bind(this),
        description: "Tải video từ facebook: hiện hỗ trợ reel và facebook watch"
      }

    ]
  }
  private async downloadFbVideo(chatId, params = []) {
    const url = params[0];
    if (!url) {
      await this._bot.sendMessage(chatId, "Thiếu video url rồi. hdsd: /fbdownload <url>");
      return;
    }
    const fileName = `out/videos/${new Date().getTime()}.mp4`
    const downloadSuccess = await this._fbVideoDownloaderService.downloadVideo(url, fileName);
    if (!downloadSuccess) {
      await this._bot.sendMessage(chatId, "Tải video thất bại");
      return;
    }
    await this._bot.sendMessage(chatId, "Vid của thí chủ đây >>");
    await this._bot.sendVideo(chatId, fileName);
    //delete file after send
    unlinkSync(fileName);

  }
  private async cpuCheck(chatId) {
    const cpuUsage = await getCPUUsageAsync();
    const cpuFree = await getCPUFreeAsync();
    let { free, size } = await checkDiskSpace('/');
    const usedPercents = Math.round((size - free) / size * 100);

    const message = `CPU đã bị húp: ${(cpuUsage * 100).toFixed(2)}%\n` +
      `CPU chưa dùng: ${(cpuFree * 100).toFixed(2)}%\n` +
      `Tổng Ram: ${(os.totalmem() / 1024).toFixed(2)} GB\n` +
      `Ram chưa bị húp: ${(os.freemem() / 1024).toFixed(2)} GB\n` +
      `Phần trăm ram bị húp: ${((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(2)}%\n` +
      `Còn ${convertBytesToGB(free).toFixed(2)} GB chưa bị húp trên tổng số ${convertBytesToGB(size).toFixed(2)} GB\n` +
      `=> Đã sử dụng ${usedPercents} % bộ nhớ\n` +
      `Platform: ${os.platform()}\n`;
    const finalMsg = "Tình trạng sức khỏe của tao:\n" + message;
    await this._bot.sendMessage(chatId, finalMsg);
  }

  private async getLatestOnePieces(chatId) {
    const latestChapters = await this._truyenQQCrawler.getLatestOnePieceChapter();
    if (!latestChapters) {
      await this._bot.sendMessage(chatId, "Tèo rồi, tao không lấy chap mới nhất được");
      return;
    }

    moment.locale("vi");
    const currentTime = moment().format("LLLL");
    let message = `Chap one piece mới nhât ngày: ${currentTime}:\n`;
    latestChapters.forEach(([href, title]) => {
      message += `👉 ${title}: ${href}\n`;
    });
    await this._bot.sendMessage(chatId, message);
  }

  private async getLatestNews(chatId) {
    const latestNews = await this._vnExpressCrawler.getLatestNews();
    if (!latestNews) {
      await this._bot.sendMessage(chatId, "Tèo rồi, tao không lấy được tin tức");
      return;
    }
    moment.locale("vi");
    const currentTime = moment().format("LLLL");
    let message = `Cập nhật tin tức từ vn express: ${currentTime}:\n`;
    latestNews.forEach(([title, href]) => {
      message += `👉 ${title}: ${href}\n`;
    });
    await this._bot.sendMessage(chatId, message);
  }

  private async getTime(chatId) {
    moment.locale("vi");
    const currentTime = moment().format("LLLL");
    await this._bot.sendMessage(chatId, `Bây giờ là: ${currentTime}`);
  }

  private async healthCheck(chatId) {
    const healthCheckMsgs = [`Tao vẫn sống`, `Gọi cc`, `Sủa lên`, `Đang ngủ`, `Pong`, `Gọi ít thôi`];
    const randomIndex = Math.floor(Math.random() * healthCheckMsgs.length);
    await this._bot.sendMessage(chatId, healthCheckMsgs[randomIndex]);
  }

  private async help(chatId) {
    const listCmdMsg = this._listCommands.map((c) => `/${c.command}: ${c.description}`).join("\n");
    const helpMsg = `Nói chuyện với tao bằng cách gõ lệnh sau:\n${listCmdMsg}`;
    await this._bot.sendMessage(chatId, helpMsg);
  }

  async sendMessage(chatId, message: string) {
    await this._bot.sendMessage(chatId, message);
  }

  async sendImage(chatId, filePath: string) {
    await this._bot.sendPhoto(chatId, filePath);
  }

  async startListen() {
    console.log("start listen");
    this._bot.onText(/\/(.+)/, async (msg, match) => {
      // 'msg' is the received Message from Telegram
      // 'match' is the result of executing the regexp above on the text content
      // of the message

      const chatId = msg.chat.id;
      const command = match[1].split(" ")[0].trim();
      //get user params ex /weather hanoi => params = ["hanoi"]
      const params = match.input.split(" ").slice(1);
      console.log(`${new Date()}: received command "${command}" from chatId: ${chatId} with params: ${JSON.stringify(params)}`);

      const commandHandler = this._listCommands.find((c) => c.command.toLowerCase() === command.toLowerCase());
      if (!commandHandler) {
        await this._bot.sendMessage(chatId, "Lệnh ngu tao đ hiểu gõ /help để biêt lệnh nào tao hiểu");
        return;
      }

      await commandHandler.handler(chatId, params);
    });
  }
}
