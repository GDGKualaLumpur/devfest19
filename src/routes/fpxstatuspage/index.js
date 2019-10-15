import { Component } from "preact";
import Loader from "../../components/loader";
import SocialFooter from "../../components/social_footer";
import Footer from "../../components/footer";
import style from "./style";
import firebase from "../../components/firebase";

export default class FpxStatusPage extends Component {
  handleScroll() {
    const ele = document.querySelector(".topappbar.mdc-top-app-bar");
    if (document.documentElement.scrollTop < 56) {
      ele.setAttribute("top", true);
    } else {
      ele.removeAttribute("top");
    }
  }

  componentDidMount() {
    document.title = "FPX Status - DevFest 2019 Kuala Lumpur";
    window.addEventListener("scroll", this.handleScroll, { passive: true });
		this.handleScroll();

    this.loadTicket();
  }

  componentWillUnmount() {
		document.querySelector(".topappbar.mdc-top-app-bar").removeAttribute("top");
		if(this.detachTicketSnapshot){
      this.detachTicketSnapshot();
    }
	}

	componentDidUpdate(prevProps){
		this.loadTicket();
	}
	componentWillReceiveProps(nextProps){

		if(nextProps.ticket && !nextProps.ticket.fpxPayment){
			window.location = "/registration";
		}
	}
	
	loadTicket(){
    if(this.props.user && !this.detachTicketSnapshot){
      this.detachTicketSnapshot = firebase.firestore()
      .doc(`tickets/${this.props.user.email}`)
      .onSnapshot(docSnapshot => {
				console.log(`listening to tickets/
				${this.props.user.email}`);
        this.setState({
          ticket: docSnapshot.data()
        });
      });
    }
	}
	

  render({ rootPath, info }) {

		const ticket = this.state.ticket;

    return (
      <div class={style.scrollbar}>
        <div class={`${style.hero} hero`}>
          {!ticket && <Loader />}
          {ticket && ticket.fpxPayment && ticket.fpxPayment.transactionStatus === "succeeded" && (
            <h2>FPX Payment Success!</h2>
          )}

          {ticket && ticket.fpxPayment && (
            <div>
							<table class={style.transactionTable}>
								<tr>
									<td> Transaction Date and Time</td>
									<td>{this.getDate(ticket.fpxPayment)}</td>
								</tr>
								<tr>
									<td>Amount</td>
									<td>RM{ticket.price}</td>
								</tr>
								<tr>
									<td>Bank Name</td>
									<td>{ticket.fpxPayment.buyerBankName}</td>
								</tr>
								{ticket.fpxPayment.paymentErrorMessage && (<tr>
									<td>Payment Error Message</td>
									<td>{ticket.fpxPayment.paymentErrorMessage}</td>
								</tr>)}
								<tr>
									<td>FPX Transaction ID</td>
									<td>{ticket.fpxPayment.fpxTransactionId || "-"}</td>
								</tr>
								
								<tr>
									<td>Transaction Status</td>
									<td>{ticket.fpxPayment.transactionStatus}</td>
								</tr>
								
							</table>
							<a  class={style.btn} onClick={()=>{
								window.location = "/registration";
			
							}}>{ticket.paymentStatus === "payment_completed" ? 'Show Ticket': 'Back to Registration'}</a>
            </div>
          )}

			
          <div class={style.footer}>
            <SocialFooter rootPath={rootPath} />
            <Footer rootPath={rootPath} />
          </div>
        </div>
      </div>
    );
  }

  getDate(fpxPayment) {
    return new Date(fpxPayment.transactionDateTime * 1000).toString();
  }
}
