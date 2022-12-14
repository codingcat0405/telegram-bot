import VnExpressCrawler from "./services/VnExpressCrawler";
import TruyenQQCrawler from "./services/TruyenQQCrawler";
import {getCPUFreeAsync, getCPUUsageAsync} from "./util";
import * as os from "os-utils";

async function test() {

  const cpuUsage = await getCPUUsageAsync();
  const cpuFree = await getCPUFreeAsync();
  console.log(cpuUsage);
  console.log(cpuFree);
  console.log(os.platform());
  console.log(os.totalmem());
  console.log(os.freemem());
}

test().then()
