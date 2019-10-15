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

export default class Sponsor extends Component {
  state = {
    checkInMode: "qr"
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
    document.title = "Spnsor - DevFest 2019 Kuala Lumpur";
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
            isSponsor: true,
            adminUser: snapshot.data(),
          });

          if (this.camPreview) {
            console.log("loaded");
          }
        })
        .catch(err => {
          console.log(err);
          this.setState({
            isSponsor: false
          });
        });
    }
  }
  
  

  render(
    { rootPath, user },
    { isSponsor,adminUser, username, password, authError, isLoading, 
      errorSave, ticketInfo, ticketStamped, stampedTicket, checkInMode, searchTicketId,notFound }
  ) {
    return (
      <div>
        <div class={`${style.hero} hero`}>
          <div class={style.heroText}>
            <IoLogo rootPath={rootPath} />
            <div class={style.description}>
            {user && !isSponsor && (<p>Please log out of your current user.</p>)}
              {!user && (<div>
                <p>Hello Sponsor, please sign in using the booth credentials given</p>

               <div class={style.loginContainer}>
               <p>{authError}</p>
               <FormField>
                  <TextField label="Username" value={username} onChange={(event)=>{
                    this.setState({
                      username: event.target.value
                    });
                  }}>
                  </TextField>
                </FormField><br/>
                <FormField>
                  <TextField label="Password" value={password} onChange={(event)=>{
                    this.setState({
                      password: event.target.value
                    })
                  }}>
                  </TextField>
                  </FormField><br/>
                  <a
                    class={style.btn}
                    onClick={() => {
                      this.setState({
                        isLoading: true,
                      })
                     firebase.auth().signInWithEmailAndPassword(username, password).then((user)=>{
                      this.setState({
                        isLoading: false,
                        sponsorUser: user
                      });

                     }).catch((error)=>{
                      this.setState({
                        isLoading: false,
                        authError:  error.message
                      });
                     });
                     
                    }}
                  >
                    {isLoading ? <Loader /> : "LOGIN"}
                  </a>
               </div>
              </div>)}
              
              {isSponsor && (
                <div>
                  <h2>{adminUser.company.toUpperCase()}, begin scanning particpant ticket </h2>
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
                  <br/>
                  <div>
                    {checkInMode === "qr" && (
                      <QrCodeScanner
                        onResultReceived={result => {
                          if(result){
                            this.tagTicket(result);
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
                            this.tagTicket(searchTicketId);
                          }}
                        >
                        {isLoading ? (
                            <Loader />
                          ) : errorSave ? (
                            "ERROR"
                          ) : (
                            "STAMP TICKET"
                          )}
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
                    {ticketStamped && (<h2>{stampedTicket.customerName} - Ticket Stamped!</h2>)}
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

  tagTicket(ticketId) {
    this.setState({
      isLoading: true,
      ticketStamped: false,
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
          });
        
        
        querySnapshot.forEach(doc => {
          this.stampTicket(doc.id);
          this.setState({
            stampedTicket: doc.data()
          });
          
        });
      })
      .catch(err => {
        this.setState({
          isLoading: false,
          ticketInfo: null,
          errorSave: true,
        });
        console.log(err);
      });
  }

  stampTicket(email) {
    this.setState({
      isLoading: true
    });
    const path = `tickets/${email}`;

    firebase
      .firestore()
      .doc(path)
      .update({
        sponsors: firebase.firestore.FieldValue.arrayUnion(this.state.adminUser.company)
      })
      .then(() => {
        this.setState({
          isLoading: false,
          ticketStamped: true,
          searchTicketId: null,
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isLoading: false,
          errorSave: true,
          ticketStamped: false
        });
      });
  }
}
