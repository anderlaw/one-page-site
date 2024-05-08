// var Watchpack = require("watchpack");
import Watchpack from "watchpack";
import * as sass from "sass";
import fs from "fs";
var wp = new Watchpack({
  // options:
  // fire "aggregated" event when after a change for 1000ms no additional change occurred

  poll: 100,
  // poll: true - use polling with the default interval
  // poll: 10000 - use polling with an interval of 10s
  // poll defaults to undefined, which prefer native watching methods
  // Note: enable polling when watching on a network path
  // When WATCHPACK_POLLING environment variable is set it will override this option

  followSymlinks: true,
  // true: follows symlinks and watches symlinks and real files
  //   (This makes sense when symlinks has not been resolved yet, comes with a performance hit)
  // false (default): watches only specified item they may be real files or symlinks
  //   (This makes sense when symlinks has already been resolved)

  ignored: "**/.git",
  // ignored: "string" - a glob pattern for files or folders that should not be watched
  // ignored: ["string", "string"] - multiple glob patterns that should be ignored
  // ignored: /regexp/ - a regular expression for files or folders that should not be watched
  // ignored: (entry) => boolean - an arbitrary function which must return truthy to ignore an entry
  // For all cases expect the arbitrary function the path will have path separator normalized to '/'.
  // All subdirectories are ignored too
});

// Watchpack.prototype.watch({
//   files: Iterable<string>,
//   directories: Iterable<string>,
//   missing: Iterable<string>,
//   startTime?: number
// })
wp.watch({
  directories: ["./dev"],
  startTime: Date.now() - 10000,
});
// starts watching these files and directories
// calling this again will override the files and directories
// files: can be files or directories, for files: content and existence changes are tracked
//        for directories: only existence and timestamp changes are tracked
// directories: only directories, directory content (and content of children, ...) and
//              existence changes are tracked.
//              assumed to exist, when directory is not found without further information a remove event is emitted
// missing: can be files or directorees,
//          only existence changes are tracked
//          expected to not exist, no remove event is emitted when not found initially
// files and directories are assumed to exist, when they are not found without further information a remove event is emitted
// missing is assumed to not exist and no remove event is emitted

const parseFileContent = (compDir) => {
  const htmlContent_raw = fs.readFileSync(compDir + "/index.html").toString();
  const cssContent = fs.readFileSync(compDir + "/index.css").toString();
  const jsContent = fs.readFileSync(compDir + "/index.js").toString();

  const fileName = compDir.split("/").reverse()[0];
  const htmlContent = htmlContent_raw.match(
    /<tricky-template[^>]*>([^<]*(?:(?!<\/template>)<[^<]*)*)<\/tricky-template>/i
  )[1];

  return {
    name: fileName,
    html: htmlContent,
    js: jsContent,
    css: cssContent,
  };
};
const run = () => {
  console.log("组件发生改动，编译中...");
  //重新生成组件配置文件到public里。
  /**
   * 读取二级目录结构里的组件
   * Layout
   *  Card
   *  Nav
   * Data
   * 然后将代码分析并提取为js，css，html。然后生成配置文件到public目录
   * 工作台里通过ajax请求获取或者模块导入的形式拿到数据：
   * 将组件列表渲染到组件栏。
   */
  const compDir = fs.readdirSync("./dev/components");
  const parsedList = [];
  for (let i = 0; i < compDir.length; i++) {
    const pathName = compDir[i];
    parsedList.push(parseFileContent(`./dev/components/${pathName}`));
  }
  //写入到 ./app/config/components.json
  fs.writeFileSync(
    "./app/config/components.json",
    JSON.stringify(parsedList)
  );
  //把common.css也写入到app里
  const commonCss = fs.readFileSync("./dev/assets/common.css").toString();
  fs.writeFileSync("./app/assets/common.css",commonCss)
  console.log("编译更新完成！");
};
wp.on("change", function (filePath, mtime, explanation) {
  // filePath: the changed file
  // mtime: last modified time for the changed file
  // explanation: textual information how this change was detected
  run();
});
run();
console.log("watcher 已启动, 正在监听组件目录的任何变动，并自动编译！");
