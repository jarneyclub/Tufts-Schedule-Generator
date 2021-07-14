import React from "react";
import ReactDOM from "react-dom";
import { StylesProvider } from "@material-ui/core/styles";
import App from "./App";

// the following is for react-bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";
import "./components/reusable/reusableStyles/Form.module.css";
import "./fonts/Eina03-SemiBold.ttf";

// import initFBSDK from './components/views/scripts/fb.js';

// /* load React App after FB SDK is received */
// initFBSDK().then(
//   ReactDOM.render(
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>,
//     document.getElementById('root')
//   )

// );

ReactDOM.render(
  <React.StrictMode>
    <StylesProvider injectFirst>
      <App />
    </StylesProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
