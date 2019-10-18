/**
 * Copyright 2016 Oleh Zasadnyy, GDG Lviv
 * Source: https://github.com/gdg-x/hoverboard
 */

import { Component } from "preact";
import style from "./style";

export default class GalleryBlock extends Component {
  constructor(props) {
    super(props);
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      this.io = new IntersectionObserver(
        entries => {
          const visibleEntries = entries.filter(e => e.isIntersecting);

          visibleEntries
            .filter(e => e.target instanceof HTMLImageElement)
            .forEach(e => {
              e.target.src = e.target.dataset.src;
            });
        },
        {
          /* Using default options. Details below */
        }
      );
    }
  }

  componentDidMount() {
    if (!this.io) return;

    const elements = document.querySelectorAll(`.${style.grid_item}`);

    elements.forEach(element => this.io.observe(element));
  }

  componentWillUnmount() {
    if (!this.io) return;

    this.io.disconnect();
  }

  render() {
    return (
      <div class={style.photos_grid}>
        <img
          crossorigin="anonymous"
          class={style.grid_item}
          data-src="https://res.cloudinary.com/limhenry/image/upload/v1537072861/devfestkl18_pwa/gallery/1.jpg"
        />
        <img
          crossorigin="anonymous"
          class={style.grid_item}
          data-src="https://res.cloudinary.com/shangyilim/image/upload/c_scale,h_372/v1564582278/IMG_2767.jpg"
        />
        <img
          crossorigin="anonymous"
          class={style.grid_item}
          data-src="https://res.cloudinary.com/shangyilim/image/upload/c_scale,w_393/v1564582115/DevFestKL18-6.jpg"
        />
        <img
          crossorigin="anonymous"
          class={style.grid_item}
          data-src="https://res.cloudinary.com/shangyilim/image/upload/c_scale,w_556/v1564582619/Group_Photo_-_1.jpg"
        />
        <img
          crossorigin="anonymous"
          class={style.grid_item}
          data-src="https://res.cloudinary.com/shangyilim/image/upload/c_scale,h_363/v1564582756/DSCF1242_1.jpg"
        />
        <img
          crossorigin="anonymous"
          class={style.grid_item}
          data-src="https://res.cloudinary.com/limhenry/image/upload/v1537072846/devfestkl18_pwa/gallery/6.jpg"
        />
        <img
          crossorigin="anonymous"
          class={style.grid_item}
          data-src="https://res.cloudinary.com/limhenry/image/upload/v1537072883/devfestkl18_pwa/gallery/7.jpg"
        />
        <img
          crossorigin="anonymous"
          class={style.grid_item}
          data-src="https://res.cloudinary.com/limhenry/image/upload/v1537072866/devfestkl18_pwa/gallery/8.jpg"
        />
        <div crossorigin="anonymous" class={style.gallery_info}>
          <div>
            <h2>DevFest KL 2018 highlights</h2>
            <p>
              This year's festival built lots of excitement. Check out photos
              from featured talks, hands-on learning sessions, and after-hours
              fun.
            </p>
          </div>
          <a
            href="https://photos.app.goo.gl/AfuFKVTzSfxkKZk6A"
            target="_blank"
            rel="noopener noreferrer"
          >
            See all photos
          </a>
        </div>
      </div>
    );
  }
}
