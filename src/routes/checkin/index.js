import { h, Component } from "preact";
import TicketIcon from "../../components/ticket_icon";
import IoLogo from "../../components/io_logo";
import SocialFooter from "../../components/social_footer";
import Footer from "../../components/footer";
import Loader from "../../components/loader";
import style from "./style";
import firebase from "../../components/firebase";
import QrCodeScanner from "./qrcode-scanner";
import FormField from "preact-material-components/FormField";
import "preact-material-components/FormField/style.css";
import TextField from "preact-material-components/TextField";
import "preact-material-components/TextField/style.css";

export default class Checkin extends Component {
  state = {
    checkInMode: "qr"
  };

  shirtSize = {
    s: "Unisex Small",
    m: "Unisex Medium",
    l: "Unisex Large",
    xl: "Unisex Extra Large",
    xxl: "Unisex Extra Extra Large",
    xxxl: "Unisex Extra Extra Extra Large",
    noshirt: "I dont't want a shirt"
  };

  handleScroll() {
    const ele = document.querySelector(".topappbar.mdc-top-app-bar");
    if (document.documentElement.scrollTop < 56) {
      ele.setAttribute("top", true);
    } else {
      ele.removeAttribute("top");
    }
  }

  constructor(props) {
    super(props);
    this.props = props;
  }

  componentDidMount() {
    document.title = "Checkin - DevFest 2019 Kuala Lumpur";
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    this.handleScroll();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    document.querySelector(".topappbar.mdc-top-app-bar").removeAttribute("top");
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      firebase
        .firestore()
        .collection("admin")
        .doc(nextProps.user.email)
        .get()
        .then(snapshot => {
          this.setState({
            isAdmin: true
          });

          if (this.camPreview) {
            console.log("loaded");
          }
        })
        .catch(err => {
          //window.location = "404";
        });
    }
  }

  render(
    { rootPath, user },
    { isAdmin, ticketInfo, isLoading, errorSave, checkInMode, searchTicketId,notFound }
  ) {
    return (
      <div>
        <div class={`${style.hero} hero`}>
          <div class={style.heroText}>
            <IoLogo rootPath={rootPath} />
            <div class={style.description}>
              {!user && <p>Please sign in</p>}
              {(!isAdmin || !user) && (<Loader />)}
              {isAdmin && (
                <div>
                  <a
                    class={style.btn}
                    onClick={() => {
                      this.setState({
                        checkInMode: checkInMode === "qr" ? "ticket" : "qr"
                      });
                    }}
                  >
                    {checkInMode === "qr"
                      ? "SWITCH TO TICKET MODE"
                      : "SWITCH TO QR MODE"}
                  </a>
                  <br/>
                  <div>
                    {checkInMode === "qr" && (
                      <QrCodeScanner
                        onResultReceived={result => {
                          if(result){
                            this.getTicketInfo(result);
                          }
                        }}
                      />
                    )}

                    {checkInMode === "ticket" && (
                      <div class={style.ticketModeContainer}>
                        <FormField>
                        <TextField
                         style="font-size:25px"
                         required  
                        pattern="[0-9]*"
                        inputmode="tel"
                        label="TICKET ID" 
                        value={searchTicketId}
                        onChange={(event)=>{
                          this.setState({
                            searchTicketId: event.target.value
                          });
                        }} />
                      </FormField><br/>
                      <a
                          class={style.btn}
                          onClick={() => {
                            this.getTicketInfo(searchTicketId);
                          }}
                        >
                         {isLoading ? <Loader /> : "SEARCH TICKET"}
                        </a>
                      </div>
                    )}

                    {ticketInfo && (
                      <div>
                        Ticket
                        <div class={style.ticketInfo}>
                          {ticketInfo.ticketId}{" "}
                        </div>
                        Name:{" "}
                        <div class={style.ticketInfo}>
                          {ticketInfo.application.fullName}{" "}
                        </div>
                        Shirt:{" "}
                        <div class={style.ticketInfo}>
                          {this.shirtSize[ticketInfo.application.shirtSize]}
                        </div>
                        Checked In:{" "}
                        <div class={style.ticketInfo}>
                          {ticketInfo.checkedIn ? "Already checked In" : "Nope"}
                        </div>
                        <a
                          class={style.btn}
                          onClick={() => {
                            this.checkInTicket(ticketInfo.id);
                          }}
                        >
                          {isLoading ? (
                            <Loader />
                          ) : errorSave ? (
                            "ERROR"
                          ) : (
                            "CHECK IN"
                          )}
                        </a>
                      </div>
                    )}
                    {notFound && (<h2>Ticket not found</h2>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <SocialFooter rootPath={rootPath} />
        <Footer rootPath={rootPath} />
      </div>
    );
  }

  getTicketInfo(ticketId) {
    this.setState({
      isLoading: true
    });

    firebase
      .firestore()
      .collection("tickets")
      .where("ticketId", "==", ticketId)
      .get()
      .then(querySnapshot => {
          this.setState({
            notFound: querySnapshot.empty,
            isLoading: false,
            searchTicketId: null,
          });
        
        
        querySnapshot.forEach(doc => {
          const ticketInfo = doc.data();

          this.setState({
            isLoading: false,
            ticketInfo: {
              ...ticketInfo,
              id: doc.id
            }
          });
        });
      })
      .catch(err => {
        this.setState({
          isLoading: false,
          ticketInfo: null
        });
        console.log(err);
      });
  }

  checkInTicket(email) {
    this.setState({
      isLoading: true
    });
    const path = `tickets/${email}`;

    firebase
      .firestore()
      .doc(path)
      .update({
        checkedIn: true
      })
      .then(() => {
        this.setState({
          isLoading: false,
          ticketInfo: {
            ...this.state.ticketInfo,
            checkedIn: true
          },
          searchTicketId: null,
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isLoading: false,
          errorSave: true
        });
      });
  }
}
