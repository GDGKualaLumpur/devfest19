import { Component } from "preact";
import Loader from "../loader";
import style from "./style";

export default class StripeFpx extends Component {
  constructor(props) {
    super();
  }
  componentDidMount() {
    if (this.props.stripe) {
      const elements = this.props.stripe.elements();
      const style = {
        base: {
          // Add your base input styles here. For example:
          padding: "10px 12px",
          color: "#32325d",
          fontSize: "16px"
        }
      };

      // Create an instance of the fpxBank Element.
      this.fpxBank = elements.create("fpxBank", {
        style: style,
        accountHolderType: "individual"
      });

      // Add an instance of the fpxBank Element into the container with id `fpx-bank-element`.
      this.fpxBank.mount("#fpx-bank-element");

      this.fpxBank.on("change", ({ value }) => {
        console.log("value", value);
        const bank = value;
        // Perform any additional logic here...
        this.setState({
          selectedBank: bank
        });
      });
    }
  }

  render() {
    return (
      <div>
        <div>
          <img src="assets/fpx-logo.jpg" alt="fpx logo" style="width:55px" />
          <div id="fpx-bank-element"></div>
        </div>
        <div style="margin-top:10px">
          By clicking on the ‘Proceed’ button, you agree to FPX’s&nbsp;
          <a
            href="https://www.mepsfpx.com.my/FPXMain/termsAndConditions.jsp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms and Conditions.
          </a>
        </div>

        <button
          class={style.purchase_ticket_btn}
          disabled={!this.state.selectedBank || this.state.loading}
          onClick={() => {
            this.setState({
              loading: true
            });
            const paymentIntentData = {
              return_url: `${window.location.href}fpx-status`
            };
            const clientSecret = this.props.clientSecret;

            this.props.stripe.handleFpxPayment(
              clientSecret,
              this.fpxBank,
              paymentIntentData
            ).then(result => {

            if (result.error) {
              this.setState({
                errorMessage: result.error.message
              });
            }
          });
        }}
        >
          {!this.state.loading && (
            <div>
              {this.state.selectedBank
                ? `Proceed with ${this.state.selectedBank}`
                : "Pay with Bank"}
            </div>
          )}
          {this.state.loading && <Loader />}
        </button>

        <div style="color: red">{this.state.errorMessage}</div>
      </div>
    );
  }
}
