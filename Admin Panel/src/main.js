import "./style.css";
import renderLoading from "./components/loader.js";
import { navigateTo } from "./utils/router.js";

const app = document.querySelector("#app");

function init() {
  app.innerHTML = renderLoading();
  navigateTo(window.location.pathname);
}

init();
