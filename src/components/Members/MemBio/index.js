// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ index.js ]
// * PackageName  [ src/components/Members/MemBio ]
// * Synopsis     [ Implement "MemBio" page for each member ]
// * Author       [ Cheng-Hua Lu ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import './index.scss'
import Loader from 'react-loaders'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import configData from '../../../config.json'
import { useSpring, animated, config } from 'react-spring'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSquareEnvelope,
  faSquareRss,
} from '@fortawesome/free-solid-svg-icons'
import {
  faSquareFacebook,
  faSquareGithub,
  faLinkedin,
  faResearchgate,
} from '@fortawesome/free-brands-svg-icons'

const MemBio = () => {
  // * MemBio: Implement "MemBio" page for each member.
  // @param memberId      useParams     The id of the member
  //        props         useSpring     The animation for animated.div
  //        mem_info      Dictionary    The information for the member

  const { memberId } = useParams()
  const props = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    reset: false,
    delay: 2000,
    config: config.molasses,
  })

  let mem_info = {}
  configData.MEMBERS_PAGE.MEMBIO.forEach((member) => {
    if (member.ID === memberId) {
      mem_info = member
    }
  })

  // * Scroll to top of the page when rendering
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <div className="membio-container">
        <div className="wrapper">
          <animated.div className="content" style={props}>
            <div className="content-info">
              <div className="left-col">
                <div className="img-container">
                  <img src={'../' + mem_info.IMG} />
                </div>
                <h3>{mem_info.NAME}</h3>
                {mem_info.CHINESE_NAME !== '' &&
                mem_info.ENGLISH_NAME !== '' ? (
                  <h6>
                    {mem_info.CHINESE_NAME} • {mem_info.ENGLISH_NAME}
                  </h6>
                ) : mem_info.CHINESE_NAME !== '' ? (
                  <h6>{mem_info.CHINESE_NAME} </h6>
                ) : mem_info.ENGLISH_NAME !== '' ? (
                  <h6>{mem_info.ENGLISH_NAME}</h6>
                ) : (
                  <></>
                )}
                <div className="media-list">
                  {mem_info.EMAIL !== '' ? (
                    <div className="media-item">
                      <FontAwesomeIcon
                        className="media-icon"
                        icon={faSquareEnvelope}
                      />
                      <a href={'mailto:' + mem_info.EMAIL} target="_blank">
                        {mem_info.EMAIL.length > 30
                          ? mem_info.EMAIL.substring(0, 30) + '...'
                          : mem_info.EMAIL}
                      </a>
                    </div>
                  ) : (
                    <></>
                  )}
                  {mem_info.GITHUB !== '' ? (
                    <div className="media-item">
                      <FontAwesomeIcon
                        className="media-icon"
                        icon={faSquareGithub}
                      />
                      <a href={mem_info.GITHUB} target="_blank">
                        {mem_info.GITHUB.length > 30
                          ? mem_info.GITHUB.substring(0, 30) + '...'
                          : mem_info.GITHUB}
                      </a>
                    </div>
                  ) : (
                    <></>
                  )}
                  {mem_info.FACEBOOK !== '' ? (
                    <div className="media-item">
                      <FontAwesomeIcon
                        className="media-icon"
                        icon={faSquareFacebook}
                      />
                      <a href={mem_info.FACEBOOK} target="_blank">
                        {mem_info.FACEBOOK.length > 30
                          ? mem_info.FACEBOOK.substring(0, 30) + '...'
                          : mem_info.FACEBOOK}
                      </a>
                    </div>
                  ) : (
                    <></>
                  )}
                  {mem_info.LINKEDIN !== '' ? (
                    <div className="media-item">
                      <FontAwesomeIcon
                        className="media-icon"
                        icon={faLinkedin}
                      />
                      <a href={mem_info.LINKEDIN} target="_blank">
                        {mem_info.LINKEDIN.length > 30
                          ? mem_info.LINKEDIN.substring(0, 30) + '...'
                          : mem_info.LINKEDIN}
                      </a>
                    </div>
                  ) : (
                    <></>
                  )}
                  {mem_info.PERSONAL_WEBSITE !== '' ? (
                    <div className="media-item">
                      <FontAwesomeIcon
                        className="media-icon"
                        icon={faSquareRss}
                      />
                      <a href={mem_info.PERSONAL_WEBSITE} target="_blank">
                        {mem_info.PERSONAL_WEBSITE.length > 30
                          ? mem_info.PERSONAL_WEBSITE.substring(0, 30) + '...'
                          : mem_info.PERSONAL_WEBSITE}
                      </a>
                    </div>
                  ) : (
                    <></>
                  )}
                  {mem_info.RESEARCH_GATE !== '' ? (
                    <div className="media-item">
                      <FontAwesomeIcon
                        className="media-icon"
                        icon={faResearchgate}
                      />
                      <a href={mem_info.RESEARCH_GATE} target="_blank">
                        {mem_info.RESEARCH_GATE.length > 30
                          ? mem_info.RESEARCH_GATE.substring(0, 30) + '...'
                          : mem_info.RESEARCH_GATE}
                      </a>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="right-col">
                <div className="item-block">
                  <h3>Short Bio</h3>
                  {mem_info.SHORT_BIO.map((item) => (
                    <p>{item}</p>
                  ))}
                </div>
                <div className="item-block">
                  <h3>Fields of Interest</h3>
                  <ul>
                    {mem_info.INTEREST_FIELDS.map((item) => (
                      <li>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="education">
              <h3>Education</h3>
              <div className="edu-list">
                {Object.values(mem_info.EDUCATION).map((item) => (
                  <div className="edu-item">
                    <div className="edu-subitem" style={{ width: '15%' }}>
                      {item.DEGREE}
                    </div>
                    <div className="edu-subitem" style={{ width: '35%' }}>
                      {item.DEPARTMENT}
                    </div>
                    <div className="edu-subitem" style={{ width: '30%' }}>
                      {item.SCHOOL}
                    </div>
                    <div
                      className="edu-subitem"
                      style={{ width: '20%', textAlign: 'right' }}
                    >
                      {item.DURATION}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {Object.values(mem_info.PUBLICATION).length !== 0 ? (
              <div className="publications">
                <h3>Publications</h3>
                <div className="pub-list">
                  {Object.values(mem_info.PUBLICATION).map((item) => (
                    <div className="pub-item">
                      <a
                        className="pub-subitem"
                        href={item.LINK}
                        target={item.LINK !== "" ? "_blank" : ""}
                        style={{
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          textDecoration: 'none',
                        }}
                      >
                        {item.TITLE}
                      </a>
                      <div className="pub-subitem">
                        {item.AUTHORS.map((author, idx) => (
                          <span>
                            {author}
                            {idx !== item.AUTHORS.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                      <div
                        className="pub-subitem institution"
                        style={{ textAlign: 'right' }}
                      >
                        {item.INSTITUTION}, {item.YEAR}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <></>
            )}
          </animated.div>
        </div>
      </div>
      <Loader type="line-scale" />
    </>
  )
}

export default MemBio
