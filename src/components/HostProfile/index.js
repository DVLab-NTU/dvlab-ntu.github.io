// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ index.js ]
// * PackageName  [ src/components/HostProfile ]
// * Synopsis     [ Implement "Host Profile" page ]
// * Author       [ Cheng-Hua Lu ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import './index.scss'
import Loader from 'react-loaders'
import configData from '../../config.json'
import AnimatedLetters from '../AnimatedLetters'
import React, { useState, useEffect } from 'react'
import { useSpring, animated, config } from 'react-spring'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareEnvelope } from '@fortawesome/free-solid-svg-icons'
import {
  faLinkedin,
  faSquareFacebook,
  faSquareGithub,
} from '@fortawesome/free-brands-svg-icons'

const HostProfile = () => {
  // * HostProfile: Implement "Host Profile" page.
  // @param props:          useSpring   the animation for animated.div
  //        letterClass     String      the animation for title
  
  const [letterClass, setLetterClass] = useState('text-animate')
  const props = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    reset: false,
    delay: 2000,
    config: config.molasses,
  })

  // * Scroll to top of the page when rendering
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <div className="host-profile-container">
        <div className="wrapper">
          <div className="title">
            <h1>
              <AnimatedLetters
                letterClass={letterClass}
                strArray={configData.HOST_PROFILE_PAGE.NAME.split('')}
                idx={5}
              />
            </h1>
          </div>
          <animated.div className="content" style={props}>
            <div className="content-info">
              <div className="left-col">
                <div className="img-container">
                  <img src={configData.HOST_PROFILE_PAGE.PHOTO} />
                </div>
              </div>
              <div className="right-col">
                <ul className="position-list">
                  {configData.HOST_PROFILE_PAGE.POSITION.map((item) => (
                    <li>{item}</li>
                  ))}
                </ul>
                <div className="media-list">
                  <a
                    href={'mailto:' + configData.HOST_PROFILE_PAGE.INFO.EMAIL}
                    target="_blank"
                  >
                    <FontAwesomeIcon
                      className="media-icon"
                      icon={faSquareEnvelope}
                    />
                  </a>
                  <a
                    href={configData.HOST_PROFILE_PAGE.INFO.FACEBOOK}
                    target="_blank"
                  >
                    <FontAwesomeIcon
                      className="media-icon"
                      icon={faSquareFacebook}
                    />
                  </a>
                  <a
                    href={configData.HOST_PROFILE_PAGE.INFO.GITHUB}
                    target="_blank"
                  >
                    <FontAwesomeIcon
                      className="media-icon"
                      icon={faSquareGithub}
                    />
                  </a>
                  <a
                    href={configData.HOST_PROFILE_PAGE.INFO.LINKEDIN}
                    target="_blank"
                  >
                    <FontAwesomeIcon className="media-icon" icon={faLinkedin} />
                  </a>
                </div>
              </div>
            </div>
            <div className="education">
              <h3>Education</h3>
              <ul className="edu-list">
                <li>B.S. {configData.HOST_PROFILE_PAGE.EDUCATION.BACHELOR}</li>
                <li>Ph.D. {configData.HOST_PROFILE_PAGE.EDUCATION.PHD}</li>
              </ul>
            </div>
            <div className="education">
              <h3>{configData.HOST_PROFILE_PAGE.MAJOR_RESEARCH_AREA.TITLE}</h3>
              <ul className="edu-list">
                {configData.HOST_PROFILE_PAGE.MAJOR_RESEARCH_AREA.CONTENTS.map(
                  (item, idx) => (
                    <p>
                      {idx + 1}. {item}
                      <br />
                    </p>
                  )
                )}
              </ul>
            </div>
            <div className="education">
              <h3>{configData.HOST_PROFILE_PAGE.RESEARCH_SUMMARY.TITLE}</h3>
              <ul className="edu-list">
                {configData.HOST_PROFILE_PAGE.RESEARCH_SUMMARY.CONTENTS.map(
                  (paragraph) => (
                    <p className="summary-paragraph">{paragraph}</p>
                  )
                )}
              </ul>
            </div>
          </animated.div>
        </div>
      </div>
      <Loader type="line-scale" />
    </>
  )
}

export default HostProfile
