import { Component } from 'preact';
import SocialFooter from '../../components/social_footer';
import Footer from '../../components/footer';
import style from './style';

export default class EventMapPage extends Component {
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
		document.title = 'Event Map - DevFest 2019 Kuala Lumpur';
		window.addEventListener('scroll', this.handleScroll, { passive: true });
		this.handleScroll();
	}

	componentWillUnmount() {
		document.querySelector('.topappbar.mdc-top-app-bar').removeAttribute('top');
	}

	render({ rootPath, info}) {
		return (
			<div class={style.scrollbar}>
				{info && info.map_image  && info.map_ready && (<img class={style.mapImage} crossorigin="anonymous"  src={info.map_image} />)}
				{info && !info.map_ready && (
				<div class={`${style.hero} hero`}>
				<h2>Work in progress</h2></div>)}
			
				<div class={style.footer}>
					<SocialFooter rootPath={rootPath} />
					<Footer rootPath={rootPath} />
				</div>
			</div>
		);
	}
}
