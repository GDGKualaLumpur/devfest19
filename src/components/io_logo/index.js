import { h, Component } from 'preact';

import style from './style';
export default class IoLogo extends Component {
	render({ rootPath }) {
		return (
			<div class={style.logo_container}>
			<img src="assets/devfest19-logo.svg" />
			</div>
		);
	}
}