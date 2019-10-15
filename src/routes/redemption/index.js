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
import Select from 'preact-material-components/Select';
import 'preact-material-components/List/style.css';
import 'preact-material-components/Menu/style.css';
import 'preact-material-components/Select/style.css';

export default class Checkin extends Component {
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
    document.title = "Redemption - DevFest 2019 Kuala Lumpur";
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
        console.log("getting redemption items");
        firebase.firestore().collection("redemptionItems").get().then(querySnapshot => {
         
          const redemptionItems = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              key: doc.id,
              value: data
            }
          });

          this.setState({
            redemptionItems,
          });
        })
    }
  }

  render(
    { rootPath, user },
    { isAdmin, ticketInfo, isLoading, errorSave, checkInMode, searchTicketId,notFound, redemptionItems, selectedItemKey   }
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
                        Points:{" "}
                        <div class={style.ticketInfo}>
                          {ticketInfo.points || 0}
                        </div>
                        Items Redeemed:{" "}
                        <div class={style.ticketInfo}>
                          {ticketInfo.redemptionItems && (
                            <div>
                              {ticketInfo.redemptionItems.map(t=><div>{ t.name}</div> )}
                              {this.isMaximumRedemption() && 
                              (<div>You have hit the maximum redemption</div>)
                            }
                            </div>
                          )}
                        </div>


                      {redemptionItems && (<div>

                              <Select hintText="Redeem Item"
                                value={selectedItemKey}
                                onChange={(e)=>{
                                  this.setState({
                                    selectedItemKey: e.target.value
                                  });
                                }}>
                                {redemptionItems.map(r => <Select.Item value={r.key} disabled={
                                  ticketInfo.points < r.value.points || 
                                  this.isAlreadyRedeemed(r.key) ||
                                  this.isOutOfStock(r) ||
                                  this.isMaximumRedemption()
                                }>{`${r.value.name} - ${r.value.points} points - ${r.value.quantity - r.value.soldQuantity} left`}</Select.Item>)}
                              </Select>
                      </div>)}
                        
                        <button
                        disabled={!selectedItemKey}
                          class={style.btn}
                          onClick={() => {
                            this.redeemItem(ticketInfo.id);
                          }}
                        >
                          {isLoading ? (
                            <Loader />
                          ) : errorSave ? (
                            "ERROR"
                          ) : (
                            "REDEEM"
                          )}
                        </button>
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

  redeemItem(email) {
    const redemptionItem = this.state.redemptionItems.find( r=> r.key === this.state.selectedItemKey);
    this.setState({
      isLoading: true
    });
    const path = `tickets/${email}`;

    firebase
      .firestore()
      .doc(path)
      .update({
        redemptionItems: firebase.firestore.FieldValue.arrayUnion({
          id: this.state.selectedItemKey,
          name: redemptionItem.value.name,
        }),
        points: this.state.ticketInfo.points - redemptionItem.value.points
      })
      .then(() => {
        this.getTicketInfo(this.state.ticketInfo.ticketId);
        this.updateStock(this.state.selectedItemKey);
        this.setState({
          selectedItemKey: null,
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

  isAlreadyRedeemed(key){
    if(!this.state.ticketInfo.redemptionItems) {
      return false;
    }

    return this.state.ticketInfo.redemptionItems.find(r => r.id === key) != null;
  }

  isOutOfStock(redemptionItem){
    return redemptionItem.value.quantity - redemptionItem.value.soldQuantity <= 0;
  }

  isMaximumRedemption(){
    return this.state.ticketInfo.redemptionItems.length >= 2;
  }

  updateStock(key){
    return firebase.firestore()
    .doc(`redemptionItems/${key}`)
    .set({
      soldQuantity: firebase.firestore.FieldValue.increment(1)
    }, {
      merge: true
    });
  }
}
