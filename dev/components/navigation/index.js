// 替换Logo
document.querySelector(".one-page-site_nav .logo").onclick = () => {
  let newText = window.prompt("请输入新的logo文本");
  document.querySelector(".one-page-site_nav .logo").textContent = newText;
};
