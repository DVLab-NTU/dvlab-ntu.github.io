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
import { useState, useEffect } from "react";
import AnimatedLetters from "../AnimatedLetters";
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
                idx={1000}
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
              {gallery_list.map((item, idx) => (
                <Gallery
                  idx={idx}
                  img_path={item.IMAGE}
                  subtitle={item.TITLE}
                  text={item.DETAILS}
                />
              ))}
            </div>
            {/* <Slider
                className="slider"
                dots="true"
                infinite="true"
                slidesToShow={1}
                slidesToScroll={1}
                speed={500}
              >
                {slides_list.map((slide) => (
                  <Slide text={slide.TEXT} img_path={slide.IMAGE} />
                ))}
              </Slider> */}
          </animated.div>
        </div>
      </div>
      <Loader type="line-scale" />
    </>
  );
};

export default AboutLab;
