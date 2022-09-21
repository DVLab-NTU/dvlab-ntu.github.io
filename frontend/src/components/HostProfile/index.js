// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ index.js ]
// * PackageName  [ src/components/HostProfile ]
// * Synopsis     [ Implement "Host Profile" page ]
// * Author       [ Cheng-Hua Lu ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import "./index.scss";
import Loader from "react-loaders";
import frontendData from "../../config/frontend.json";
import AnimatedLetters from "../AnimatedLetters";
import React, { useState, useEffect } from "react";
import { useSpring, animated, config } from "react-spring";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faLinkedin,
  faSquareFacebook,
  faSquareGithub,
  faLine,
} from "@fortawesome/free-brands-svg-icons";

const HostProfile = () => {
  // * HostProfile: Implement "Host Profile" page.
  // @param props:          useSpring   the animation for animated.div
  //        letterClass     String      the animation for title

  const [letterClass, setLetterClass] = useState("text-animate");
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
      <div className="host-profile-container">
        <div className="wrapper">
          <div className="title">
            <h1>
              <AnimatedLetters
                letterClass={letterClass}
                strArray={frontendData.HOST_PROFILE_PAGE.NAME.split("")}
                idx={4}
              />
            </h1>
          </div>
          <animated.div className="content" style={props}>
            <div className="header">
              <p>"{frontendData.HOST_PROFILE_PAGE.HEADER}"</p>
            </div>
            <div className="content-info">
              <div className="left-col">
                {frontendData.HOST_PROFILE_PAGE.SHORT_BIO.map((paragraph) => (
                  <p>{paragraph}</p>
                ))}
              </div>
              <div className="right-col">
                <div>
                <div className="img-container">
                  <img src={frontendData.HOST_PROFILE_PAGE.PHOTO} />
                </div>
                <div className="media-list">
                  <a
                    href={"mailto:" + frontendData.HOST_PROFILE_PAGE.INFO.EMAIL}
                    target="_blank"
                  >
                    <FontAwesomeIcon
                      className="media-icon"
                      icon={faSquareEnvelope}
                    />
                  </a>
                  <a
                    href={frontendData.HOST_PROFILE_PAGE.INFO.LINKEDIN}
                    target="_blank"
                  >
                    <FontAwesomeIcon className="media-icon" icon={faLinkedin} />
                  </a>
                  <a
                    href={frontendData.HOST_PROFILE_PAGE.INFO.FACEBOOK}
                    target="_blank"
                  >
                    <FontAwesomeIcon
                      className="media-icon"
                      icon={faSquareFacebook}
                    />
                  </a>
                  <a
                    href={frontendData.HOST_PROFILE_PAGE.INFO.LINE}
                    target="_blank"
                  >
                    <FontAwesomeIcon className="media-icon" icon={faLine} />
                  </a>
                </div>

                </div>
                
              </div>
            </div>

            {/* <div className="education">
              <h3>Education</h3>
              <ul className="edu-list">
                <li>B.S. {frontendData.HOST_PROFILE_PAGE.EDUCATION.BACHELOR}</li>
                <li>Ph.D. {frontendData.HOST_PROFILE_PAGE.EDUCATION.PHD}</li>
              </ul>
            </div> */}
            {/* <div className="education">
              <h3>{frontendData.HOST_PROFILE_PAGE.MAJOR_RESEARCH_AREA.TITLE}</h3>
              <ul className="edu-list">
                {frontendData.HOST_PROFILE_PAGE.MAJOR_RESEARCH_AREA.CONTENTS.map(
                  (item, idx) => (
                    <p>
                      {idx + 1}. {item}
                      <br />
                    </p>
                  )
                )}
              </ul>
            </div> */}
            {/* <div className="education">
              <h3>{frontendData.HOST_PROFILE_PAGE.RESEARCH_SUMMARY.TITLE}</h3>
              <ul className="edu-list">
                {frontendData.HOST_PROFILE_PAGE.RESEARCH_SUMMARY.CONTENTS.map(
                  (paragraph) => (
                    <p className="summary-paragraph">{paragraph}</p>
                  )
                )}
              </ul>
            </div> */}
          </animated.div>
        </div>
      </div>
      <Loader type="line-scale" />
    </>
  );
};

export default HostProfile;
