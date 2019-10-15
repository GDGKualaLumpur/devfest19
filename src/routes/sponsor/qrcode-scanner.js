import { h, Component } from "preact";
import QrScanner from 'qr-scanner'; 
import QrScannerWorkerPath from '!!file-loader!qr-scanner/qr-scanner-worker.min.js';
QrScanner.WORKER_PATH = QrScannerWorkerPath;

export default class QrCodeScanner extends Component {
  state = {
   
  };
  constructor(props) {
    super(props);
    this.props = props;
  }

  componentDidMount() {
   
    if(this.camPreview){
      this.qrScanner = new QrScanner(this.camPreview, result => {
        this.props.onResultReceived(result);
        console.log('decoded qr code:', result)
      });
      this.qrScanner.start();
    }
  }

  componentWillUnmount() {
   this.qrScanner.destroy();
   this.qrScanner = null;
  }

  componentWillReceiveProps(nextProps) {
    
  }

  render({ rootPath, user,  }, {isAdmin}) {
    return (
      <video id="preview" style="width:100%;height:100%;max-height: 300px;" ref={element => {
        this.camPreview = element;
      }}>
      </video>
    );
  }

}
