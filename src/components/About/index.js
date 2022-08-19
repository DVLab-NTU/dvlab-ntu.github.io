// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ index.js ]
// * PackageName  [ src/components/About ]
// * Synopsis     [ Implement "About DV Lab" page ]
// * Author       [ Cheng-Hua Lu ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import "./index.scss";
import React from "react";
import Slide from "./Slide";
import Gallery from "./Gallery";
import Slider from "react-slick";
import Loader from "react-loaders";
import configData from "../../config.json";
import Typewriter from "typewriter-effect";
import { useState, useEffect } from "react";
import AnimatedLetters from "../AnimatedLetters";
// import { Typewriter } from "react-simple-typewriter";
import { useSpring, animated, config } from "react-spring";

const AboutLab = () => {
  // * AboutLab: Implement "About DV Lab" page, it contains slider(Slide) and Gallery
  // @param slider_list:    Array       data for Slider (texts and images) -> Lab Introduction
  //        gallery_list:   Array       data for Gallery (texts and images) -> Lab Culture
  //        props:          useSpring   the animation for animated.div
  //        letterClass     String      the animation for title

  const [letterClass, setLetterClass] = useState("text-animate");
  // const slides_list = Object.values(configData.ABOUT_DV_LAB_PAGE.DESCRIPTION);
  const gallery_list = Object.values(
    configData.ABOUT_DV_LAB_PAGE.LAB_CULTURE.CONTENTS
  );
  const props = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    reset: false,
    delay: 2000,
    config: config.molasses,
  });

  // * Scroll to top of the page when rendering
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="about-lab-container" id="about">
        <div className="wrapper">
          <div className="title">
            <h1>
              <AnimatedLetters
                letterClass={letterClass}
                strArray={configData.ABOUT_DV_LAB_PAGE.SUBTITLE.split("")}
                idx={1}
              />
            </h1>
          </div>

          <animated.div className="about-content" style={props}>
            <div className="introduction">
              <div className="left-col">
                {configData.ABOUT_DV_LAB_PAGE.DESCRIPTION.TEXT.map(
                  (paragraph) => (
                    <p>{paragraph}</p>
                  )
                )}
              </div>
              <div className="right-col">
                <img src={configData.ABOUT_DV_LAB_PAGE.DESCRIPTION.IMAGE} />
              </div>
            </div>
            <div className="lab-culture">
              <span>
                <Typewriter
                  options={{
                    strings: configData.ABOUT_DV_LAB_PAGE.LAB_CULTURE.SUBTITLE,
                    autoStart: true,
                    loop: true,
                    cursor: "_",
                    delay: 20,
                    deleteSpeed: 30,
                  }}
                />
              </span>
              <Slider
                className="gallery"
                dots={true}
                infinite={true}
                slidesToShow={1}
                slidesToScroll={1}
                speed={2000}
                autoplay={true}
                autoplaySpeed={5000}
                arrows={false}
                cssEase="linear"
                pauseOnHover={true}
              >
                {configData.ABOUT_DV_LAB_PAGE.LAB_CULTURE.GALLERY.map(
                  (photo) => (
                    <Slide img_path={photo}/>
                    
                  )
                )}
              </Slider>
            </div>
          </animated.div>
        </div>
      </div>
      <Loader type="line-scale" />
    </>
  );
};

export default AboutLab;
