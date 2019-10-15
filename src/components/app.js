import { Component } from 'preact';
import { Router } from 'preact-router';
import firebase from './firebase';
import NavBar from './navbar';
import idb from 'idb';
import Home from '../routes/home';
import Attending from 'async!../routes/attending';
import Registration from 'async!../routes/registration';
import FpxStatusPage from 'async!../routes/fpxstatuspage';
import CommunityGuidelines from 'async!../routes/communityguidelines';
import NotFoundPage from 'async!../routes/404';
import Faq from 'async!../routes/faq';
import EventMapPage from 'async!../routes/map';
import Schedule from 'async!../routes/schedule';
import Speakers from 'async!../routes/speakers';
import Checkin from 'async!../routes/checkin';
import Sponsor from 'async!../routes/sponsor';
import Redemption from 'async!../routes/redemption';
import Snackbar from 'preact-material-components/Snackbar';
import 'preact-material-components/Snackbar/style.css';

export default class App extends Component {
	handleRoute = e => {
		this.currentUrl = e.url;
		if (typeof window !== 'undefined') {
			if (window.swUpdate) return (window.location = e.url);
			if (e.previous) {
				if (
					e.url.startsWith(this.state.rootPath + 'schedule') &&
					e.previous.startsWith(this.state.rootPath + 'schedule')
				) {
				}
				else if (
					e.url.startsWith(this.state.rootPath + 'speakers') &&
					e.previous.startsWith(this.state.rootPath + 'speakers')
				) {
				}
				else {
					document.documentElement.scrollTop = 0;
				}
			}
			if (window.ga) {
				window.ga('set', 'page', 'window.location.pathname');
				window.ga('send', 'pageview');
			}
		}

	};


	showRefreshSnack = () => {
		this.snackbar.MDComponent.show({
			message: 'Site updated. Refresh this page for better experience.',
			actionText: 'Refresh',
			timeout: 5000,
			actionHandler: () => {
				window.location.reload();
			}
		});
	};

	componentDidMount() {
		window.addEventListener('showRefreshSnack', this.showRefreshSnack);

	
		
	}

	componentWillUnmount() {
		window.removeEventListener('showRefreshSnack', this.showRefreshSnack);
		if(this.detachSiteInfo){
			this.detachSiteInfo();
		}
	}

	componentWillMount() {
		if (typeof window !== 'undefined') {
			this.db = firebase.firestore();
			this.rtdb = firebase.database();

		
			this.detachSiteInfo = this.db.doc("site/info").onSnapshot(docSnapshot => {
			
				this.setState({
					info: docSnapshot.data()
				})
			}, (error)=>{
				this.Sentry.captureException(error);
			});

			this.dbPromise = idb.open('', 1, upgradeDB => {
				upgradeDB.createObjectStore('data');
			});

			this.getDb('schedule').then(val => {
				this.setState({ schedule: val });
			});

			this.getDb('userSchedule').then(val => {
				this.setState({ userSchedule: val });
			});

			this.getDb('speakers').then(val => {
				this.setState({ speakers: val });
			});

			this.getDb('sessions').then(val => {
				this.setState({ sessions: val });

				if (this.id && val[this.id]) {
					this.setState({ dialogOpened: true });
					this.dialog.toggle(this.id, val[this.id]);
				}
			});
			this.rtdb
				.ref('schedule')
				.once('value')
				.then(snapshot => {
					const data = snapshot.val();
					this.setState({ schedule: data });
					this.setDb('schedule', data);
				});

			this.rtdb
				.ref('sessions')
				.once('value')
				.then(snapshot => {
					const data = snapshot.val();
					this.setState({ sessions: data });
					this.setDb('sessions', data);
				});

			this.rtdb
				.ref('speakers')
				.once('value')
				.then(snapshot => {
					const data = snapshot.val();
					this.setState({ speakers: data });
					this.setDb('speakers', data);
				});

			
			this.setState({userState: 'logging_in'});
			firebase.auth().onAuthStateChanged(currentUser => {
				this.setState({userState: 'completed_login'});

				this.setState({ currentUser });
				if (currentUser) {
					window.Sentry.configureScope((scope) => {
						scope.setUser({
							email: currentUser.email,
							id: currentUser.uid
						});
					});

					
					this.rtdb.ref(`users/${currentUser.uid}/schedule/`).on('value', snapshot => {
						const data = snapshot.val();
						this.setState({ userSchedule: data });
						this.setDb('userSchedule', data);
					});
			
				}
				else {
					
					window.Sentry.configureScope((scope) => {
						scope.setUser({});
					});
				}
			});
		}
	}


	logSentryInfo(message){
		if(window.Sentry){
			window.Sentry.captureMessage(message);
		}
	}

	setDb(key, val) {
		return this.dbPromise.then(db => {
			const tx = db.transaction('data', 'readwrite');
			tx.objectStore('data').put(val, key);
			return tx.complete;
		});
	}

	getDb(key) {
		return this.dbPromise.then(db =>
			db
				.transaction('data')
				.objectStore('data')
				.get(key)
		);
	}


	constructor() {
		super();

		this.state = {
			currentUser: null,
			schedule: [],
			sessions: {},
			speakers: {},
			userApplication: {},
			ticket: null,
			userSchedule: {},
			info: {},
			rootPath: '/'
		};

		if (typeof window !== 'undefined') {
			this.setState({ rootPath: window.GlobalVars.rootPath || '/' });
			if (window.Sentry) {
				window.Sentry.init(
					{ dsn: 'https://910a6b35cb4547c1b26cd72736f9d729@sentry.io/1777367' }
				);
			}
		}
	}

	render(
		{ },
		{
			currentUser,
			schedule,
			sessions,
			speakers,
			userSchedule,
			userApplication,
			ticket,
			info,
			rootPath,
			userState
		}
	) {

		return (
			<div id="app">
				<NavBar user={currentUser} rootPath={rootPath} />
				<Router onChange={this.handleRoute}>
					<Attending
						path={rootPath + 'attending/'}
						rootPath={rootPath}
						info={info}
					/>
					<Schedule
						path={rootPath + 'schedule/'}
						user={currentUser}
						schedule={schedule}
						userSchedule={userSchedule}
						sessions={sessions}
						speakers={speakers}
						db={this.rtdb}
						info={info}
						rootPath={rootPath}
					/>
					<Schedule
						path={rootPath + 'schedule/:id'}
						user={currentUser}
						schedule={schedule}
						userSchedule={userSchedule}
						sessions={sessions}
						speakers={speakers}
						db={this.rtdb}
						rootPath={rootPath}
					/>
					<Speakers
						path={rootPath + 'speakers/'}
						user={currentUser}
						speakers={speakers}
						db={this.db}
						info={info}
						rootPath={rootPath}
					/>
					<Speakers
						path={rootPath + 'speakers/:id'}
						user={currentUser}
						schedule={schedule}
						userSchedule={userSchedule}
						sessions={sessions}
						speakers={speakers}
						db={this.db}
						info={this.info}
						rootPath={rootPath}
					/>

					<Registration
						path={rootPath + 'registration/'}
						user={currentUser}
						userApplication={userApplication}
						user={currentUser}
						ticket={ticket}
						info={info}
						rootPath={rootPath}
						userState={userState}
					/>
					<CommunityGuidelines
						path={rootPath + 'faq/communityguidelines/'}
						rootPath={rootPath}
					/>
					<Faq path={rootPath + 'faq/'} rootPath={rootPath} />
					<Home
						path={rootPath}
						rootPath={rootPath}
					/>
					<EventMapPage path={rootPath + 'map/'}
						rootPath={rootPath}
						info={info} />
					<FpxStatusPage path={rootPath + 'registration/fpx-status/'}
						user={currentUser}
						ticket={ticket}
						rootPath={rootPath}
						info={info} />
					<Checkin path={rootPath + 'checkin/'}
						user={currentUser}
					 />
					 <Sponsor path={rootPath + 'sponsor/'}
						user={currentUser}
					 />
					  <Redemption path={rootPath + 'redeem/'}
						user={currentUser}
					 />
					<NotFoundPage rootPath={rootPath} default />

				</Router>
				<Snackbar
					ref={snackbar => {
						this.snackbar = snackbar;
					}}
				/>
			</div>
		);
	}
}
