import { h, Component } from 'preact';
import style from './style';

export default class TicketIcon extends Component {
	render() {
		return (
			<svg class={style.ticket_icon+' '+this.props.style } aria-hidden="true"viewBox="0 0 59.3 66.3" >
			<rect y="0.4" fill="#FAD2CF" width="32.8" height="65.4" />
			<g>
				<path fill="#EA4435" d="M52.2,22.3v22.6v5.6L46,44.3L45.7,44h-0.4H15.8V22.3H52.2 M53.2,21.3H14.9v23.6h30.5l7.8,7.8v-7.8V21.3   L53.2,21.3z"/>
			</g>
			</svg>
		);
	}
}