import { Component } from "preact";

import style from "./style";
export default class Loader extends Component {
  render({ rootPath }) {
    return (
      <div class={style.loadingContainer}>
        <div class="lds-ellipsis">
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    );
  }
}
