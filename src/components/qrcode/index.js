import { Component } from "preact";

import style from "./style";

export default class Qrcode extends Component {
  componentDidMount() {

    if(typeof QRCode !== "undefined"){
      this.qrcode = this.createQrCode();
      return ;
    }

    let qrCodeScript = document.createElement("script");
    qrCodeScript.id = "qrcode-script";
    qrCodeScript.src =
      "https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js";
    qrCodeScript.className = "qrcode-script";

    document.body.appendChild(qrCodeScript);
    qrCodeScript.onload = () => {
      this.qrcode = this.createQrCode();
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.qrcode) {
      this.qrcode.clear();
      this.qrcode.makeCode(`${this.props.value}`);
      return;
    }
  }

  render({ rootPath }) {
    return <div id="qrcode" />;
  }

  createQrCode(){

    if(document.getElementById("qrcode").children.length){
      return ;
    }
    return new QRCode(document.getElementById("qrcode"), {
       
      text: `${this.props.value}`,
      width: 180,
      height: 180,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
    });
  }
}
