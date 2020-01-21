import React from "react";
import { render } from "react-dom";
import "./index.css";
import RootContainer from "./client/RootContainer";
import * as serviceWorker from "./serviceWorker";
import { subscribeUser } from "./subscription";

render(<RootContainer />, document.getElementById("root"));

console.log("public url: ", process.env);

serviceWorker.register();

subscribeUser();
