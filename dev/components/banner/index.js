// 修改图片地址
document.querySelector(".one-page-site_banner .icon-edit").onclick = () => {
  let newURL = window.prompt("请输入新的图片地址！");
  console.log(newURL);
  document.querySelector(".one-page-site_banner img").src = newURL;
};
