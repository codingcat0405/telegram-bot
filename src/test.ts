import VnExpressCrawler from "./services/VnExpressCrawler";
import TruyenQQCrawler from "./services/TruyenQQCrawler";

async function test() {
  const truyenQQCrawler = new TruyenQQCrawler();
  await truyenQQCrawler.getLatestOnePieceChapter();
}

test().then()