import { h, Component } from 'preact';
import IoLogo from '../../components/io_logo';
import SocialFooter from '../../components/social_footer';
import Footer from '../../components/footer';
import style from './style';

export default class Faq extends Component {
	handleScroll() {
		const ele = document.querySelector('.topappbar.mdc-top-app-bar');
		if (document.documentElement.scrollTop < 56) {
			ele.setAttribute('top', true);
		}
		else {
			ele.removeAttribute('top');
		}
	}

	componentDidMount() {
		document.title = 'FAQ - DevFest 2019 Kuala Lumpur';
		window.addEventListener('scroll', this.handleScroll, { passive: true });
		this.handleScroll();
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
		document.querySelector('.topappbar.mdc-top-app-bar').removeAttribute('top');
	}

	render({ rootPath }) {
		return (
			<div>
				<div class="hero">
					<IoLogo rootPath={rootPath} />
					<h2>FAQ</h2>
				</div>
				<div class={style.faq}>
					<div class={style.faq_item}>
						<div class={style.faq_title}>General</div>
						<div class={style.faq_content}>
							<p><b>Session Schedule</b></p>
							<p>The schedule can be found <a href={rootPath + 'schedule'}>here</a>.</p>
							<br />
							<p><b>Community Guidelines</b></p>
							<p>Our community guidelines can be found <a href={rootPath + 'faq/communityguidelines'}>here</a>. Be nice to each other, and be respectful and constructive.</p>
							<br />
							<p><b>Date and location</b></p>
							<p>DevFest 2019 Kuala Lumpur will take place on the 7th December 2019 at Asia Pacific University.</p>
							<br />
							<p><b>Stay Informed</b></p>
							<p>To stay up to date on the latest information on sessions, speakers, and activities, be sure to visit the DevFest 2019 Kuala Lumpur website, and follow us on <a href="https://www.facebook.com/GDGKualaLumpur/" target="_blank" rel="noopener noreferrer">Facebook Page</a>. You can also follow and join the social conversation about DevFest 2019 Kuala Lumpur via official hashtags <b>#devfestkl19</b>. In addition, we'll be emailing important information to all registered attendees, along with check-in instructions prior to the conference.</p>
							<br />
							<p><b>Content Formats</b></p>
							<p>During the conference, attendees will be able to attend sessions and hands-on workshops, chat with experts and attendees.</p>
							<br />
							<p><b>Language</b></p>
							<p>All presentations at DevFest 2019 Kuala Lumpur will be in English.</p>
						</div>
					</div>
				</div>
				<div class={style.faq}>
					<div class={style.faq_item}>
						<div class={style.faq_title}>Amenities</div>
						<div class={style.faq_content}>
							<p><b>Internet Access</b></p>
							<p>Attendees can connect to the WiFi network <span style="color:#d84315">SunwayEdu</span>, Username: <span style="color:#d84315">fstwfg</span> Password: <span style="color:#d84315">Sunw@y01 </span>&nbsp; for the duration of the event.</p>
							<br />
							<p><b>Washroom</b></p>
							<p>Washrooms are available at the venue.</p>
							<br />
							<p><b>Drinking Fountain</b></p>
							<p>Drinking fountain/bottle filling stations are available at the venue</p>
							<br />
							<p><b>Surau/Prayer Room</b></p>
							<p>The Surau/Prayer Room care available at the venue</p>
						</div>
					</div>
				</div>
				<div class={style.faq}>
					<div class={style.faq_item}>
						<div class={style.faq_title}>Registration</div>
						<div class={style.faq_content}>
							<p><b>Registration terms &amp; conditions</b></p>
							<ul>
								<li>Each individual may purchase only one ticket.</li>
								<li>You may not register on behalf of anyone else.</li>
								<li>By registering and accepting any discounts, gifts, or items of value related to DevFest 2019 Kuala Lumpur, you certify that you are able to do so in compliance with applicable laws and the internal rules of your organization.</li>
								<li>Tickets may not be sold, bartered, or auctioned in any way, and doing so may result in GDG Kuala Lumpur rendering the ticket null and void without any responsibility to GDG Kuala Lumpur.</li>
								<li>Attendees aren’t permitted to bring guests to DevFest 2019 Kuala Lumpur. If you have someone traveling with you, they’ll need to register themselves and purchase an attendee ticket.</li>
								<li>Photographs and/or video taken at DevFest 2019 Kuala Lumpur by GDG Kuala Lumpur, or others on behalf of GDG Kuala Lumpur, may include your image or likeness. You agree that GDG Kuala Lumpur may use such photographs and/or video for any purpose without compensation to you.</li>
								<li>All information entered into the registration form must be correct and accurate to the best of your knowledge.</li>
								<li>All registered attendees agree to allow GDG Kuala Lumpur to contact them regarding their registration and attendance at the event. By registering for a ticket, you agree to allow GDG Kuala Lumpur to communicate with you via email with information regarding the event.</li>
								<li>You agree to be solely responsible for your own safety, belongings, and well-being while participating in DevFest 2019 Kuala Lumpur. GDG Kuala Lumpur won't be liable for your participation in DevFest 2019 Kuala Lumpur.</li>
								<li>No solicitation or selling of items or services is allowed at DevFest 2019 Kuala Lumpur. Any attendee conducting these activities may be removed from the conference.</li>
							</ul>
						</div>
					</div>
				</div>
				<div class={style.faq}>
					<div class={style.faq_item}>
						<div class={style.faq_title}>Attendance Details</div>
						<div class={style.faq_content}>
							<p><b>Event Attire</b></p>
							<p>DevFest 2019 Kuala Lumpur is a developer event, so please be comfortable and casual. There is no enforced dress code.</p>
							<br />
							<p><b>Onsite food &amp; beverages</b></p>
							<p>Attendees are offered complimentary breakfast, lunch, and tea break.</p>
							<br />
							<p><b>Smoking</b></p>
							<p>Smoking is strictly prohibited in the venue.</p>
							<br />
							<p><b>No Soliciting</b></p>
							<p>No solicitation or selling of items or services is allowed at DevFest 2019 Kuala Lumpur. Any attendee conducting these activities may be removed from the conference.</p>
							<br />
							<p><b>Community Guidelines</b></p>
							<p>Check out the full Community Guidelines <a href={rootPath + 'faq/communityguidelines'}>here</a>.</p>
						</div>
					</div>
				</div>
				<SocialFooter rootPath={rootPath} />
				<Footer rootPath={rootPath} />
			</div>
		);
	}
}
