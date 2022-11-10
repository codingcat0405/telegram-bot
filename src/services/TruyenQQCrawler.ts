import {getWebsiteContent} from "../util";
import {JSDOM} from "jsdom";

class TruyenQQCrawler {

  public async getLatestOnePieceChapter() {
    try {
      const url = "https://truyentranhtuan.com/one-piece/"
      const websiteHtml = await getWebsiteContent(url);

      if (!websiteHtml) {
        throw new Error('Empty website content');
      }
      const dom: JSDOM = new JSDOM(websiteHtml);
      const doc: Document = dom.window.document;
      const chapterLinkEls = doc.querySelectorAll("span.chapter-name a");
      if (!chapterLinkEls) {
        throw new Error('Empty chapter links');
      }
      const chapterLinks = new Map<string, string>(); //href -> title

      for (let i = 0; i < chapterLinkEls.length; i++) {
        const chapterLinkEl = chapterLinkEls[i];
        const href = chapterLinkEl.getAttribute("href");
        if (!href) {
          continue;
        }
        const title = chapterLinkEl.textContent
        if (chapterLinks.has(href)) {
          continue;
        }
        chapterLinks.set(href, title);
      }
      //return top 10 latest chapters
      return Array.from(chapterLinks.entries()).slice(0, 10);
    } catch (err: any) {
      console.error(err);
      return null;
    }
  }
}

export default TruyenQQCrawler;