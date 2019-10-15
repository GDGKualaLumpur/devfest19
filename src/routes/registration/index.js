import { h, Component } from "preact";
import TicketIcon from "../../components/ticket_icon";
import IoLogo from "../../components/io_logo";
import SocialFooter from "../../components/social_footer";
import Footer from "../../components/footer";
import Loader from "../../components/loader";
import RegistrationShape from "../../components/SVG/Shape/RegistrationShape";
import RegistrationShapeMobile from "../../components/SVG/Shape/RegistrationShapeMobile";
import style from "./style";
import firebase from "../../components/firebase";
import FormField from "preact-material-components/FormField";
import Radio from "preact-material-components/Radio";
import "preact-material-components/Radio/style.css";
import "preact-material-components/FormField/style.css";
import TextField from "preact-material-components/TextField";
import Checkbox from "preact-material-components/Checkbox";
import "preact-material-components/TextField/style.css";
import "preact-material-components/Checkbox/style.css";
import Dialog from "preact-material-components/Dialog";
import "preact-material-components/Dialog/style.css";
import Qrcode from "../../components/qrcode";
import config from "../../config";
import StripeFpx from "../../components/stripe_fpx";

export default class Registration extends Component {
  state = {
    registrationStatus: "opening_soon",
    registrationStatusText: "Loading ...",
    showInviteForm: false,
    applicationForm: {
      fullName: "",
      company: "",
      jobRole: [],
      devPlatform: [],
      excitedAbout: "",
      gender: "",
      shirtSize: "",
      food: "",
      signedTnC: false
    },
    isDevelopOthersChecked: false,
    isRoleOthersChecked: false,
    formError: {},
    formSaving: false,
    enableStripeRedirect: false,
    stripeSessionLoading: false,
    userApplicationState: "initial",
    ticketState: "initial",
  };

  handleScroll() {
    const ele = document.querySelector(".topappbar.mdc-top-app-bar");
    if (document.documentElement.scrollTop < 56) {
      ele.setAttribute("top", true);
    } else {
      ele.removeAttribute("top");
    }
  }

  changeRegistrationStatusText(status) {
    if (status === "opening_soon") {
      this.setState({ registrationStatusText: "Opening Soon" });
    }
    if (status === "closed") {
      this.setState({ registrationStatusText: "Closed" });
    }
    if (status === "open") {
      this.setState({ registrationStatusText: "Open" });
    }
  }

  constructor(props) {
    super(props);
    this.props = props;

    if (props.info) {
      const status = props.info.registration_status;
      this.setState({ registrationStatus: status });
      this.changeRegistrationStatusText(status);
    }

    if (typeof window !== "undefined") {
      this.stripe = window.Stripe(config.stripeKey, {
        betas: ['fpx_bank_beta_1'],
      });
     
    }
  }

  componentDidMount() {
    document.title = "Registration - DevFest 2019 Kuala Lumpur";
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    this.handleScroll();

    this.loadApplication();
    this.loadTicket();
    
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    document.querySelector(".topappbar.mdc-top-app-bar").removeAttribute("top");

    if(this.detachTicketSnapshot){
      console.log('detach ticket snapshot');
      this.detachTicketSnapshot();
    }

    if(this.detachApplicationSnapshot){
      console.log('detach application snapshot');
      this.detachApplicationSnapshot();
    }

  }

  componentWillReceiveProps(nextProps) {
    
    if (nextProps.info !== this.props.info) {
      if (nextProps.info) {
        const status = nextProps.info.registration_status;
        this.setState({ registrationStatus: status });
        this.changeRegistrationStatusText(status);
      }
    }
    
  }
  componentDidUpdate(prevProps){
    this.loadTicket();
    this.loadApplication();

    if(this.state.ticket && this.state.ticket.stripeCheckoutSessionId && 
      this.state.ticket.paymentMethod === 'cc' && this.state.enableStripeRedirect){
    this.stripe.redirectToCheckout({
      sessionId: this.state.ticket.stripeCheckoutSessionId
    });
  }
  }


  loadTicket(){
    if(this.props.user && !this.detachTicketSnapshot){
      this.setState({
        ticketState: "loading"
      });

      this.detachTicketSnapshot = firebase.firestore()
      .doc(`tickets/${this.props.user.email}`)
      .onSnapshot(docSnapshot => {
        console.log(`listening to tickets/${this.props.user.email}`);
        this.setState({
          ticket: docSnapshot.data(),
          ticketState: "loaded",
        });
      });
    }
  }

  loadApplication(){
    if(this.props.user && !this.detachApplicationSnapshot){
      this.setState({
        userApplicationState: "loading"
      });
      

      this.detachApplicationSnapshot = firebase.firestore()
      .doc(`applications/${this.props.user.email}`)
      .onSnapshot(docSnapshot => {
        console.log(`listening to applications/${this.props.user.email}`);
        this.setState({
          userApplication: docSnapshot.data(),
          userApplicationState: "loaded",
        });

      });
    }
  }
  
  render(
    { rootPath, info, user,userState },
    {
      ticket,
      userApplication,
      registrationStatus,
      registrationStatusText,
      registrationUrl,
      showInviteForm,
      applicationForm,
      isDevelopOthersChecked,
      isRoleOthersChecked,
      formError,
      formSaving,
      stripeSessionLoading,
      userApplicationState,
      ticketState,
    }
  ) {
    const hasErrors = Object.keys(formError).length > 0;

    const hasApplication =
      userApplication && Object.keys(userApplication).length > 1;

    return (
      <div>
        <div class={`${style.hero} hero`}>
          <div class={style.heroText}>
            {this.renderDialog()}
            <IoLogo rootPath={rootPath} />
            <div class={style.description}>
              {userState === 'completed_login'  && !user && <p>Please sign in to get tickets!</p>}
              {userState === 'logging_in' && <Loader />}
              {(userApplicationState === 'loading' || ticketState === 'loading') && <Loader />}
              {userApplicationState === 'loaded' && !userApplication && user && (
                <div>
                  <h2>Request for an invite!</h2>
                  <p>
                    Join us on Saturday, 7th December 2019 at Asia Pacific
                    University for a day filled with technical talks, fun and
                    games!. Due to the huge demand, limited space and fairness
                    to everyone, please request for an invite to attend the
                    event.
                  </p>
                  {!showInviteForm && (
                    <a
                      class={style.ticket_btn}
                      onClick={() => {
                        this.setState({
                          showInviteForm: true
                        });
                      }}
                    >
                      REQUEST AN INVITE
                    </a>
                  )}

                  {showInviteForm && (
                    <div>
                      <h3>Your Details</h3>
                      <form class={style.form}>
                        {hasErrors && (
                          <p class={style.error}>
                            There were one or more errors in the form. Please
                            correct the highlighted fields and try again.
                          </p>
                        )}
                        <FormField class={style.field + " " + style.fullwidth}>
                          <TextField
                            disabled
                            id="email"
                            name="email"
                            label="Email"
                            value={user.email}
                            helperText="All emails will be sent to this email"
                            helperTextPersistent
                          />
                        </FormField>

                        <FormField class={style.field + " " + style.fullwidth}>
                          <TextField
                            required
                            id="fullName"
                            name="fullName"
                            label="Full Name"
                            value={applicationForm.fullName}
                            onChange={event => this.handleUserInput(event)}
                            valid={!formError.fullName}
                            helperText="Please make sure name is as per IC/Passport. This is checked during registration"
                            helperTextPersistent
                          />
                        </FormField>

                        <FormField class={style.field + " " + style.fullwidth}>
                          <TextField
                            required
                            id="company"
                            name="company"
                            label="Company/Organization "
                            value={applicationForm.company}
                            valid={!formError.company}
                            onChange={event => this.handleUserInput(event)}
                          />
                        </FormField>
                        <div
                          class={`${style.field} ${
                            formError.devPlatform ? style.error : ""
                          }`}
                        >
                          I develop for:*
                          {this.renderCheckBoxGroupFormField(
                            "devPlatform",
                            "Web",
                            "web"
                          )}
                          {this.renderCheckBoxGroupFormField(
                            "devPlatform",
                            "Android",
                            "android"
                          )}
                          {this.renderCheckBoxGroupFormField(
                            "devPlatform",
                            "iOS",
                            "ios"
                          )}
                          {this.renderCheckBoxGroupFormField(
                            "devPlatform",
                            "I don't develop",
                            "none"
                          )}
                          <FormField>
                            <Checkbox
                              id="devPlatformOther"
                              name="devPlatform"
                              onChange={event => {
                                this.setState({
                                  isDevelopOthersChecked: event.target.checked
                                });
                              }}
                            />
                            <label for="devPlatformOther">Others</label>
                          </FormField>
                          {isDevelopOthersChecked && (
                            <FormField
                              class={style.field + " " + style.fullwidth}
                            >
                              <TextField
                                required
                                valid={!formError.otherDevelop}
                                label="Others"
                                value={applicationForm.otherDevelop}
                                onBlur={()=>{this.validate();}}
                                onChange={event => {
                                  this.setState({
                                    applicationForm: {
                                      ...applicationForm,
                                      otherDevelop: event.target.value
                                    }
                                  });
                                }}
                              />
                            </FormField>
                          )}
                        </div>

                        <div
                          class={`${style.field} ${
                            formError.jobRole ? style.error : ""
                          }`}
                        >
                          I am a:*
                          {this.renderCheckBoxGroupFormField(
                            "jobRole",
                            "Full Stack Developer",
                            "fsd"
                          )}
                          {this.renderCheckBoxGroupFormField(
                            "jobRole",
                            "Front End  Developer",
                            "fed"
                          )}
                          {this.renderCheckBoxGroupFormField(
                            "jobRole",
                            "Back End  Developer",
                            "bed"
                          )}
                          {this.renderCheckBoxGroupFormField(
                            "jobRole",
                            "Mobile Developer",
                            "md"
                          )}
                          {this.renderCheckBoxGroupFormField(
                            "jobRole",
                            "UI/UX Designer",
                            "uiux"
                          )}
                          {this.renderCheckBoxGroupFormField(
                            "jobRole",
                            "Tech Lead",
                            "tl"
                          )}
                          {this.renderCheckBoxGroupFormField(
                            "jobRole",
                            "Product Manager",
                            "pm"
                          )}
                          {this.renderCheckBoxGroupFormField(
                            "jobRole",
                            "Data Scientist",
                            "ds"
                          )}
                          {this.renderCheckBoxGroupFormField(
                            "jobRole",
                            "ML Enginner",
                            "mle"
                          )}
                          {this.renderCheckBoxGroupFormField(
                            "jobRole",
                            "Student",
                            "s"
                          )}
                          <FormField>
                            <Checkbox
                              id="o"
                              name="job"
                              onChange={event => {
                                this.setState({
                                  isRoleOthersChecked: event.target.checked
                                });
                              }}
                            />
                            <label for="o">Others</label>
                          </FormField>
                          {isRoleOthersChecked && (
                            <FormField
                              class={style.field + " " + style.fullwidth}
                            >
                              <TextField
                                required
                                valid={!formError.otherJobRole}
                                id="role"
                                name="role"
                                label="Other Role or Job Title"
                                value={applicationForm.otherJobRole}
                                onChange={event => {
                                  this.setState({
                                    applicationForm: {
                                      ...applicationForm,
                                      otherJobRole: event.target.value
                                    }
                                  });
                                }}
                              />
                            </FormField>
                          )}
                        </div>
                        <div
                          class={`${style.field} ${
                            formError.excitedAbout ? style.error : ""
                          }`}
                        >
                          Which aspect of DevFest are you most excited about?*
                          {this.renderRadioButtonGroupFormField(
                            "excitedAbout",
                            "Hearing talks from experts",
                            "talks"
                          )}
                          {this.renderRadioButtonGroupFormField(
                            "excitedAbout",
                            "Networking with my peers",
                            "networking"
                          )}
                          {this.renderRadioButtonGroupFormField(
                            "excitedAbout",
                            "Activities",
                            "activities"
                          )}
                        </div>
                        <div
                          class={`${style.field} ${
                            formError.gender ? style.error : ""
                          }`}
                        >
                          What is your gender?*
                          {this.renderRadioButtonGroupFormField(
                            "gender",
                            "Male",
                            "male"
                          )}
                          {this.renderRadioButtonGroupFormField(
                            "gender",
                            "Female",
                            "female"
                          )}
                          {this.renderRadioButtonGroupFormField(
                            "gender",
                            "Prefer not to say",
                            "unspecified"
                          )}
                        </div>
                        <div
                          class={`${style.field} ${
                            formError.shirtSize ? style.error : ""
                          }`}
                        >
                          <span>Shirt Size:*{" "}
                          <a
                            href="https://res.cloudinary.com/shangyilim/image/upload/c_scale,h_403,w_465/v1569765769/size_Cotton_Roundneck.jpg"
                            alt="size chart"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            (Size Chart)
                          </a></span>
                          {this.renderRadioButtonGroupFormField(
                            "shirtSize",
                            "Unisex Small",
                            "s"
                          )}
                          {this.renderRadioButtonGroupFormField(
                            "shirtSize",
                            "Unisex Medium",
                            "m"
                          )}
                          {this.renderRadioButtonGroupFormField(
                            "shirtSize",
                            "Unisex Large",
                            "l"
                          )}
                          {this.renderRadioButtonGroupFormField(
                            "shirtSize",
                            "Unisex Extra Large",
                            "xl"
                          )}
                          {this.renderRadioButtonGroupFormField(
                            "shirtSize",
                            "Unisex Extra Extra Large",
                            "xxl"
                          )}
                          {this.renderRadioButtonGroupFormField(
                            "shirtSize",
                            "Unisex Extra Extra Extra Large",
                            "xxxl"
                          )}
                          {this.renderRadioButtonGroupFormField(
                            "shirtSize",
                            "I dont't want a shirt",
                            "noshirt"
                          )}
                        </div>

                        <div
                          class={`${style.field} ${
                            formError.food ? style.error : ""
                          }`}
                        >
                          Dietary Restrictions*
                          {this.renderRadioButtonGroupFormField(
                            "food",
                            "I have no dietary requirements or restrictions",
                            "anything"
                          )}
                          {this.renderRadioButtonGroupFormField(
                            "food",
                            "Vegetarian",
                            "vegetarian"
                          )}
                        </div>
                        <FormField class={style.field + " " + style.fullwidth}>
                          <TextField
                            id="sponsorCode"
                            name="sponsorCode"
                            label="Code"
                            helperText="If you were given a code, enter it here."
                            helperTextPersistent
                            value={applicationForm.sponsorCode}
                            onChange={event => this.handleUserInput(event)}
                          />
                        </FormField>
                        <div class={style.field}>
                          <FormField>
                            <Checkbox
                              id="tnc"
                              name="tnc"
                              checked={applicationForm.signedTnC}
                              onChange={event => {
                                this.setState({
                                  applicationForm: {
                                    ...applicationForm,
                                    signedTnC: event.target.checked
                                  }
                                });
                                this.validate();
                              }}
                            />
                            <label
                              for="tnc"
                              class={formError.signedTnC ? style.error : ""}
                            >
                              I have read and accept the{" "}
                              <a
                                href={rootPath + "faq/communityguidelines"}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                community guidelines
                              </a>
                              .*
                            </label>
                          </FormField>
                        </div>

                        {hasErrors && (
                          <p class={style.error}>
                            There were one or more errors in the form. Please
                            correct the highlighted fields and try again.
                          </p>
                        )}

                        <a
                          disabled={formSaving}
                          type="button"
                          class={style.ticket_btn}
                          onClick={() => {
                            this.validateAndSubmit();
                          }}
                        >
                          {formSaving ? <Loader /> : "Submit"}
                        </a>
                      </form>
                    </div>
                  )}
                </div>
              )}
              {userApplication && hasApplication && (
                <div>
                  {!userApplication.approved && (
                    <p>
                      Thank you for your submission! We have received your
                      application to join DevFest 2019! If a spot is available,
                      we will email you.
                    </p>
                  )}

                  {userApplication &&
                    (!ticket || (ticket && ticket.status !== "valid")) && (
                      <h2>
                        {info.registration_text} <br />
                        Application Status:{" "}
                        {!userApplication.approved && (
                          <span class={style.highlight}>Received</span>
                        )}
                        {userApplication.approved && (
                          <span class={style.highlight}>
                            Secure your ticket!
                          </span>
                        )}
                      </h2>
                    )}
                  {userApplication.approved &&
                    ticket &&
                    ticket.status !== "valid" && (
                      <p>
                        Your application has been accepted.{" "}
                        <b>This is NOT a ticket.</b> <br />
                        Please purchase a ticket below to secure a seat.{" "}
                      </p>
                    )}
                </div>
              )}

              {user && userApplication && !hasApplication && <Loader />}
              {ticket && ticket.status === "valid" && (
                <div>
                  <h2>Your ticket</h2>
                  <div class={style.ticketContainer}>
                    <div class={style.ticketHeader}>
                      <TicketIcon style={style.ticketIcon} />
                      <div>
                        <h3> General Admission</h3>
                        <div>{ticket.customerName.toUpperCase()}</div>
                        <div>{ticket.application.company}</div>
                        <div class={style.ticketSeqNumber}>
                          {`${ticket.application.shirtSize.toUpperCase()}`}
                          <br />
                          {`Ticket #: ${ticket.ticketId}`}
                        </div>
                      </div>
                    </div>

                    <div class={style.qrcode}>
                      <Qrcode value={ticket.ticketId} />
                    </div>
                  </div>
                  <br />
                  <h2>Your Points</h2>
                  <div class={style.pointsContainer}>
                    <h3>Booths Visited</h3>
                    {ticket.sponsors && (
                      <div class={style.boothsContainer}>
                        {ticket.sponsors.map(s => (
                          <div class={style.booth}>{s.toUpperCase()}</div>
                        ))}
                      </div>
                    )}
                    {!ticket.sponsors && (
                      <p>
                        You have not visited any booths yet. Visit to get
                        points!
                      </p>
                    )}

                    <h4> Total points collected: {ticket.points || 0}</h4>
                    <p>
                      Points can be used to redeem items at the redemption
                      booth.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {userApplication &&
            userApplication.approved &&
            ticket &&
            ticket.paymentStatus !== "payment_completed" && (
              <div class={style.ticket_types}>
                <h3>Ticket type</h3>
                <div class={style.ticket_types_container}>
                  <div class={style.ticket_type} id={style.general}>
                    <TicketIcon />
                    <div class={style.ticket_content}>
                      <div class={style.ticket_title}>
                        General admission
                        <br />
                        <span class={!ticket.price ? style.strike : ""}>
                         RM {ticket.price } 
                        </span>
                      </div>
                      <div class={style.ticket_body}>
                        DevFest welcomes anyone who pursues development and tech
                        as a career, side occupation, or hobby.
                      </div>
                      <a
                        disabled={stripeSessionLoading}
                        class={style.purchase_ticket_btn}
                        id="checkout-button-sku_Fb77bPHURusyZC"
                        role="link"
                        rel="noopener noreferrer"
                        onClick={() => {
                          this.startCheckout('cc');
                        }}
                      >
                        {stripeSessionLoading && <Loader />}
                        {!stripeSessionLoading && (
                          <span>{!ticket.price ? "Claim" : "Pay with Card"}</span>
                        )}
                      </a>
                      {ticket.price && !ticket.stripePaymentIntentId && (<button
                        disabled={stripeSessionLoading}
                        class={style.purchase_ticket_btn}
                        id="checkout-button-sku_Fb77bPHURusyZC"
                        role="link"
                        rel="noopener noreferrer"
                        onClick={() => {
                          this.startCheckout('fpx');
                        }}
                      >
                        {stripeSessionLoading && <Loader />}
                        {!stripeSessionLoading && (
                          <span>{"Pay with Bank"}</span>
                        )}
                      </button>)}

                      {ticket.stripeClientSecret && (<div>
                      <h4>FPX Bank</h4>
                      <StripeFpx
                      stripe={this.stripe}
                      paymentIntentId={ticket.stripePaymentIntentId}
                      clientSecret={ticket.stripeClientSecret}
                      />
                         
                      </div>)}
                     
                        
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>

        <SocialFooter rootPath={rootPath} />
        <Footer rootPath={rootPath} />
      </div>
    );
  }

  handleUserInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    const { applicationForm } = this.state;
    this.setState({
      applicationForm: {
        ...applicationForm,
        [name]: value
      }
    });
  }

  handleCheckBoxInput(fieldName) {
    const { applicationForm } = this.state;

    const fieldValues = Array.from(
      document.querySelectorAll(`input[name="${fieldName}"]:checked`)
    )
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.id);

    this.setState({
      applicationForm: {
        ...applicationForm,
        [fieldName]: fieldValues
      }
    });
    this.validate();
  }

  renderCheckBoxGroupFormField(groupName, label, value) {
    const { applicationForm } = this.state;
    return (
      <FormField>
        <Checkbox
          id={value}
          name={groupName}
          checked={applicationForm[groupName].find(s => s === value)}
          onChange={event => this.handleCheckBoxInput(groupName)}
        />
        <label for={value}>{label}</label>
      </FormField>
    );
  }

  renderRadioButtonGroupFormField(groupName, label, value) {
    const { applicationForm } = this.state;

    return (
      <FormField>
        <Radio
          id={`${groupName}_${value}`}
          name={groupName}
          checked={applicationForm[groupName] === value}
          value={value}
          onChange={event => {
            this.setState({
              applicationForm: {
                ...applicationForm,
                [groupName]: event.target.value
              }
            });
            this.validate();
          }}
        />
        <label for={`${groupName}_${value}`}>{label}</label>
      </FormField>
    );
  }
  validate() {
    let formError = {};
    const {
      applicationForm,
      isDevelopOthersChecked,
      isRoleOthersChecked
    } = this.state;
    const { otherDevelop, otherJobRole } = applicationForm;
    const { user } = this.props;

    Object.keys(applicationForm).forEach(key => {
      if (!applicationForm[key]) {
        formError[key] = "Required";
      }

      if (
        applicationForm[key] &&
        Array.isArray(applicationForm[key]) &&
        applicationForm[key].length == 0
      ) {
        formError[key] = "Required";
      }
    });

    if (isDevelopOthersChecked && !otherDevelop) {
      formError.otherDevelop = "Required";
    }
    if(isDevelopOthersChecked && otherDevelop){
      if(formError.devPlatform){
        delete formError.devPlatform
      }
    }

    if (isRoleOthersChecked && !otherJobRole) {
      formError.otherJobRole = "Required";
    }
    if (isRoleOthersChecked && otherJobRole) {
      if(formError.jobRole){
        delete formError.jobRole
      }
    }
    
    this.setState({
      formError
    });

    return formError;
  }

  validateAndSubmit() {
    const formError = this.validate();
    const hasErrors = Object.keys(formError).length > 0;

    if (hasErrors) {
      window.scrollTo(0, 200);
      return;
    }

    const { user } = this.props;
    const { applicationForm } = this.state;
    if (!user) {
      return;
    }

    this.setState({
      formSaving: true
    });

    firebase
      .firestore()
      .runTransaction(() => {
        return firebase
          .firestore()
          .doc(`applications/${user.email}`)
          .set({
            ...applicationForm,
            approved: false,
            email: user.email,
            createdOn: firebase.firestore.Timestamp.now(),
            timestamp: (new Date()).toISOString(),
          });
      })
      .then(() => {
        window.scrollTo(0, 0);
      })
      .catch(error => {
        console.log('error', error);

        if(window.Sentry){
          window.Sentry.captureException(err);
        }
        this.errorDialog.MDComponent.show();
        this.setState({
          formSaving: false
        });
      });
  }

  renderDialog() {
    return (
      <Dialog
        ref={errorDialog => {
          this.errorDialog = errorDialog;
        }}
      >
        <Dialog.Header>Unable to save your response</Dialog.Header>
        <Dialog.Body>
          Sorry about that! Might be caused of the following:
          <br />
          <ol>
            <li>You might not be signed in. </li>
            <li>
              <span>
                Data might be tampered.
                <span style="font-family: 'Arial';">( ͡° ͜ʖ ͡°)</span>
              </span>
            </li>
            <li>Something went really really wrong.</li>
          </ol>
          Try refreshing the page. If still an issue, please inform us so we can
          fix this ASAP!
        </Dialog.Body>
        <Dialog.Footer>
          <button
            type="button"
            class={style.ticket_btn}
            onClick={() => {
              this.errorDialog.MDComponent.close();
            }}
          >
            Close
          </button>
        </Dialog.Footer>
      </Dialog>
    );
  }

  startCheckout(paymentMethod) {
    const { user } = this.props;
    this.setState({
      stripeSessionLoading: true
    });

    const {ticket } = this.state;
    if (ticket.expiresOn && new Date(ticket.expiresOn) > new Date() && paymentMethod === 'cc' && ticket.stripeCheckoutSessionId) {
      this.stripe.redirectToCheckout({
        sessionId: ticket.stripeCheckoutSessionId
      });

      return;
    }

    firebase
      .firestore()
      .runTransaction(() => {
        return firebase
          .firestore()
          .doc(`tickets/${user.email}`)
          .update({
            status: "generate_session",
            paymentMethod: paymentMethod,
          });
      })
      .then(() => {
        this.setState({
          enableStripeRedirect: true,
          stripeSessionLoading: false
        });
      })
      .catch(error => {
        console.log(error, error);
        this.errorDialog.MDComponent.show();
        this.setState({
          formSaving: false,
          stripeSessionLoading: false,
        });
      });
  }


}
