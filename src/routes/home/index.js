import { Component } from "preact";
import IoLogo from "../../components/io_logo";
import SocialFooter from "../../components/social_footer";
import Footer from "../../components/footer";
import GalleryBlock from "../../components/gallery_block";
import Countdown from "../../components/Countdown";
import style from "./style";

export default class Home extends Component {
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
  handleScroll() {
    const ele = document.querySelector(".topappbar.mdc-top-app-bar");
    if (document.documentElement.scrollTop < 56) {
      ele.setAttribute("top", true);
    } else {
      ele.removeAttribute("top");
    }
  }

  componentDidMount() {
    document.title = "DevFest 2019 Kuala Lumpur";
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    this.handleScroll();

    const ele = document.querySelector(".belt");
    const cover = document.querySelector("#cover");
    const sponsorLogos = document.querySelectorAll(".sponsor_logo");

    if (!this.io) return;

    this.io.observe(ele);
    this.io.observe(cover);
    sponsorLogos.forEach(logo => this.io.observe(logo));
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    document.querySelector(".topappbar.mdc-top-app-bar").removeAttribute("top");

    if (!this.io) return;
    this.io.disconnect();
  }

  render({ rootPath }) {
    return (
      <div>
        <div class={`${style.hero} hero`}>
          <div class={style.hero_title}>
            <img src={`assets/devfest-cover.svg`} />
            <h2>
            DevFests are community-led, developer events hosted by GDG chapters around the globe focused on community building and learning about Google’s technologies. 
            DevFest at its core is powered by a shared belief that when developers come together to exchange ideas, amazing things can happen.
            </h2>
            <br />
            <h4>7 December 2019 · Asia Pacific University</h4>
          </div>
        </div>
        <div class={`${style.belt} belt`}>
          <img
            id="cover"
            crossorigin="anonymous"
            data-src="https://res.cloudinary.com/limhenry/image/upload/v1536157604/devfestkl18_pwa/misc/cover.jpg"
          />
        </div>
        <div class={style.home_info}>
          <div class={style.text}>
            <h3>What you need to know, before you ask.</h3>
            <p>
              DevFest 2019 Kuala Lumpur brings together the world class
              experts in Android, Web, Machine Learning and Cloud technologies
              for one full day of sessions, workshops and showcases.
            </p>
          </div>
          <div class={style.stats}>
            <div class={style.stat}>
              <div class={style.number}>800</div>
              <div class={style.label}>Attendees</div>
            </div>
            <div class={style.stat}>
              <div class={style.number}>1</div>
              <div class={style.label}>Day</div>
            </div>
          </div>
        </div>
        <GalleryBlock />
        
          <div class={style.partners}>
            <h3>Partners</h3>
            <h4>Main Partner of 2019</h4>
              <a
                class={style.item}
                href="https://www.rhbgroup.com/index.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  crossorigin="anonymous"
                  class="sponsor_logo"
                  data-src="https://res.cloudinary.com/shangyilim/image/upload/v1569938788/devfest19/RHB_1.png"
                  alt="RHB Bank"
                />
              </a>
              <div class={style.partner}>
              <h4>Mind Blowing Partners</h4>
              <div class={style.sponsor}>
             
              <a
                class={style.item}
                href="http://www.apu.edu.my/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  crossorigin="anonymous"
                  class="sponsor_logo"
                  data-src="https://res.cloudinary.com/shangyilim/image/upload/v1569943211/devfest19/apu-logo.png"
                  alt="Asia Pacific University of Technology and Innovation"
                />
              </a>
              <a
                class={style.item}
                href="https://www.inmagine.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  crossorigin="anonymous"
                  class="sponsor_logo"
                  data-src="https://res.cloudinary.com/shangyilim/image/upload/v1569939571/devfest19/inmagine.png"
                  alt="Inmagine"
                />
              </a>
              <a
                class={style.item}
                href="https://www.ptw.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  crossorigin="anonymous"
                  class="sponsor_logo"
                  data-src="https://res.cloudinary.com/shangyilim/image/upload/v1569939923/devfest19/ptw.png"
                  alt="Pole To Win"
                />
              </a>
              </div>
              </div>
              <div class={style.partner}>
              <h4>Our Awesome Partners</h4>
              <div class={style.sponsor}>
              <a
                class={style.item}
                href="https://www.mindvalley.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  crossorigin="anonymous"
                  class="sponsor_logo"
                  data-src="https://res.cloudinary.com/shangyilim/image/upload/c_scale,h_100/v1569940560/devfest19/mv.png"
                  alt="MindValley"
                />
              </a>
              <a
                class={style.item}
                href="https://corporate.exxonmobil.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  crossorigin="anonymous"
                  class="sponsor_logo"
                  data-src="https://res.cloudinary.com/shangyilim/image/upload/c_scale,h_100/v1569940881/devfest19/ExxonMobil-Logo.png"
                  alt="ExxonMobil"
                />
              </a>
              </div>
              </div>
              <div class={style.partner}>
              <h4>Our Hardcore Fans</h4>
              <div class={style.sponsor}>
              <a
                class={style.item}
                href="http://www.google.com.my/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  crossorigin="anonymous"
                  class="sponsor_logo"
                  data-src="https://res.cloudinary.com/shangyilim/image/upload/v1569943447/devfest19/google.svg"
                  alt="Google"
                />
              </a>
              <a
                class={style.item}
                href="https://myfave.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  crossorigin="anonymous"
                  class="sponsor_logo"
                  data-src="https://res.cloudinary.com/shangyilim/image/upload/c_scale,h_200/v1569941791/devfest19/Fave-Pink-Logo-300dpi.png"
                  alt="Fave"
                />
              </a>
              <a
                class={style.item}
                href="https://www.jp-associates.asia/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  crossorigin="anonymous"
                  class="sponsor_logo"
                  data-src="https://res.cloudinary.com/shangyilim/image/upload/v1570194980/devfest19/jp-associates.jpg"
                  alt="JP Associates"
                />
              </a>
              <a
                class={style.item}
                href="https://corporate.exxonmobil.com"
                target="_blank"
                rel="noopener noreferrer"
                style="width: 150px;height: 150px!important"
              >
                <img
                  crossorigin="anonymous"
                  class="sponsor_logo"
                  data-src="https://res.cloudinary.com/shangyilim/image/upload/c_scale,h_100/v1569942456/devfest19/AirAsia_Logo_Transparent.png"
                  alt="AirAsia"
                />
              </a>

              <a
                class={style.item}
                href="https://corporate.exxonmobil.com"
                target="_blank"
                rel="noopener noreferrer"
                style="width: 150px!important"
              >
                <img
                  crossorigin="anonymous"
                  class="sponsor_logo"
                  data-src="https://res.cloudinary.com/shangyilim/image/upload/v1569942906/devfest19/StartupTshirt_logo_RGB.png"
                  alt="startuptshirt"
                />
              </a>

              <a
                class={style.item}
                href="https://itrain.com.my"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  crossorigin="anonymous"
                  class="sponsor_logo"
                  data-src="https://res.cloudinary.com/shangyilim/image/upload/v1570193971/devfest19/itrain.png"
                  alt="iTrain Asia"
                />
              </a>
              
              </div>
              </div>
              <div class={style.partner}>
              <h4>With Love from</h4>
              <div class={style.sponsor}>
              <a
                class={style.item}
                href="http://www.gdgkl.dev/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  crossorigin="anonymous"
                  class="sponsor_logo"
                  data-src="https://res.cloudinary.com/shangyilim/image/upload/v1560263354/gdgkl.png"
                  alt="Google"
                />
              </a>
              <a
                class={style.item}
                href="https://apusds.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  crossorigin="anonymous"
                  class="sponsor_logo"
                  data-src="https://res.cloudinary.com/shangyilim/image/upload/v1570194707/devfest19/dsc_apu.png"
                  alt="Developer Student Club APU"
                />
              </a>
              
              </div></div>
            {/* {partners.partner && (
              <div class={style.partner}>
                <div class={style.sponsor}>
                  {partners.partner.map(item => (
                    <a
                      class={style.item}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        class="sponsor_logo"
                        crossorigin="anonymous"
                        data-src={item.image}
                        alt={item.name}
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {partners.general_sponsor && (
              <div class={style.partner}>
                <h4>Our Mind-blowing Gold Sponsors</h4>
                <div class={style.sponsor}>
                  {partners.general_sponsor.map(item => (
                    <a
                      class={style.item}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        class="sponsor_logo"
                        crossorigin="anonymous"
                        data-src={item.image}
                        alt={item.name}
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
            {partners.sponsors && (
              <div class={style.partner}>
                <h4>Our Awesome Silver Sponsors</h4>
                <div class={style.sponsor}>
                  {partners.sponsors.map(item => (
                    <a
                      class={style.item}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        class="sponsor_logo"
                        crossorigin="anonymous"
                        data-src={item.image}
                        alt={item.name}
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
            {partners.community_sponsors && (
              <div class={style.partner}>
                <h4>Our Hardcore Fans</h4>
                <div class={style.sponsor}>
                  {partners.community_sponsors.map(item => (
                    <a
                      class={style.item}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        class="sponsor_logo"
                        crossorigin="anonymous"
                        data-src={item.image}
                        alt={item.name}
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
            {partners.sponsors && (
              <div class={style.partner}>
                <h4>Official Ticketing Partner</h4>
                <div class={style.sponsor}>
                  {partners.ticketing_partner.map(item => (
                    <a
                      class={style.item}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        class="sponsor_logo"
                        crossorigin="anonymous"
                        data-src={item.image}
                        alt={item.name}
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
            {partners.organizers && (
              <div class={style.partner}>
                <h4>With Love From</h4>
                <div class={style.sponsor}>
                  {partners.organizers.map(item => (
                    <a
                      class={style.item}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        class="sponsor_logo"
                        crossorigin="anonymous"
                        data-src={item.image}
                        alt={item.name}
                      />
                    </a>
                  ))}
                </div>
              </div>
            )} */}
          </div>
        
        <SocialFooter rootPath={rootPath} />
        <Footer rootPath={rootPath} />
      </div>
    );
  }
}
