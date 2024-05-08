const compsContainer = document.querySelector(".left-side");
compsContainer.addEventListener("dragstart", (e) => {
  console.log("dragstart");
  const name = e.target.dataset.name;
  window.currentComponent = window.onePageSiteComponents.find(
    (component) => component.name === name
  );
});
//放置区
const canvasZone = document.querySelector("#canvas-zone");
canvasZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  console.log("dragover");
  // todo: 绘制虚线。
});
canvasZone.addEventListener("drop", (e) => {
  e.preventDefault();
  console.log("drop");
  //实现元素的放置。
  canvasZone.innerHTML += currentComponent.html;
  document.head.innerHTML += `
        <!-- ${currentComponent.name}'s style below -->
        <style need-export>
        ${currentComponent.css}
        </style>
        `;
  const jsEle = document.createElement("script");
  jsEle.setAttribute("need-export", true);
  jsEle.innerHTML = currentComponent.js;
  document.body.appendChild(jsEle);
});
// 组件资源
fetch("/config/components.json")
  .then((response) => response.json())
  .then((res) => {
    console.log(res);
    window.onePageSiteComponents = res;
    res.forEach((comp) => {
      //DOM操作
      compsContainer.innerHTML += `
        <div class="comp-box" data-name="${comp.name}" draggable="true">
        ${comp.name}
        </div>
        `;
    });
  });
//样式资源
fetch("/assets/common.css")
  .then((response) => response.text())
  .then((res) => {
    document.head.innerHTML =
      `<style need-export>${res}</style>` + document.head.innerHTML;
  });
//   导出功能
const donwloadFile = (textContent) => {
  const a = document.createElement("a");
  a.href = `data:text/plain;charset=utf-8,${encodeURIComponent(textContent)}`;
  a.download = "one-page-site.html";
  a.click();
};

document.querySelector("#output").onclick = () => {
  //收集html+css+js
  //整合为html
  //下载文件。
  const html = canvasZone.innerHTML;
  const js = document.querySelectorAll("script[need-export]");
  const css = document.querySelectorAll("style[need-export]");
  console.log(html, js, css);
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>单文件页面生成器</title>
        ${Array.prototype.map
          .call(css, (item) => "<style>" + item.textContent + "</style>")
          .join("\n")}
    </head>
    <body>
        ${html}
        ${Array.prototype.map
          .call(js, (item) => "<script>" + item.textContent + "</script>")
          .join("\n")}
    </body>
    </html>
    `;
  donwloadFile(htmlContent);
};
