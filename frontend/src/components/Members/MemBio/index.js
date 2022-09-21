// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ index.js ]
// * PackageName  [ src/components/Members/MemBio ]
// * Synopsis     [ Implement "MemBio" page for each member ]
// * Author       [ Cheng-Hua Lu (Front), Chin-Yi Cheng (Back) ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import './index.scss'
import frontendData from '../../../config/frontend.json'
import Loader from 'react-loaders'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
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

//Backend Additions
import axios from 'axios'

const instance = axios.create({
  baseURL: frontendData.BackendPort
})

const MemBio = () => {
  // * MemBio: Implement "MemBio" page for each member.
  // @param memberId      useParams     The id of the member
  //        props         useSpring     The animation for animated.div
  //        mem_info      Dictionary    The information for the member

  const [info, setInfo] = useState({})     // to store 
  const [ready, setReady] = useState(false)     // to store 
  const { memberId } = useParams()
  const props = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    reset: false,
    delay: 2000,
    config: config.molasses,
  })

  const getBios = async () => {
    // get Bios from backend
    const a = await instance.get('/getMemBio', { params: {ID: memberId} })
    const bio = a.data.contents
    setInfo(bio)
    setReady(true)
  }
  // * Scroll to top of the page when rendering
  useEffect(() => {
    if (Object.keys(info).length === 0)
      getBios()
    window.scrollTo(0, 0)
  },[])
  return (
    <>
      <div className="membio-container">
        <div className="wrapper">
          <animated.div className="content" style={props}>
            {(ready) ?
              <div className="content-info">
                <div className="left-col">
                  <div className="img-container">
                    <img src={info.IMG} />
                  </div>
                  <h3>{info.NAME}</h3>
                  {info.CHINESE_NAME !== '' &&
                    info.ENGLISH_NAME !== '' ? (
                    <h6>
                      {info.CHINESE_NAME} • {info.ENGLISH_NAME}
                    </h6>
                  ) : info.CHINESE_NAME !== '' ? (
                    <h6>{info.CHINESE_NAME} </h6>
                  ) : info.ENGLISH_NAME !== '' ? (
                    <h6>{info.ENGLISH_NAME}</h6>
                  ) : (
                    <></>
                  )}
                  <div className="media-list">
                    {info.EMAIL !== '' ? (
                      <div className="media-item">
                        <FontAwesomeIcon
                          className="media-icon"
                          icon={faSquareEnvelope}
                        />
                        <a href={'mailto:' + info.EMAIL} target="_blank">
                          {info.EMAIL.length > 30
                            ? info.EMAIL.substring(0, 30) + '...'
                            : info.EMAIL}
                        </a>
                      </div>
                    ) : (
                      <></>
                    )}
                    {info.GITHUB !== '' ? (
                      <div className="media-item">
                        <FontAwesomeIcon
                          className="media-icon"
                          icon={faSquareGithub}
                        />
                        <a href={info.GITHUB} target="_blank">
                          {info.GITHUB.length > 30
                            ? info.GITHUB.substring(0, 30) + '...'
                            : info.GITHUB}
                        </a>
                      </div>
                    ) : (
                      <></>
                    )}
                    {info.FACEBOOK !== '' ? (
                      <div className="media-item">
                        <FontAwesomeIcon
                          className="media-icon"
                          icon={faSquareFacebook}
                        />
                        <a href={info.FACEBOOK} target="_blank">
                          {info.FACEBOOK.length > 30
                            ? info.FACEBOOK.substring(0, 30) + '...'
                            : info.FACEBOOK}
                        </a>
                      </div>
                    ) : (
                      <></>
                    )}
                    {info.LINKEDIN !== '' ? (
                      <div className="media-item">
                        <FontAwesomeIcon
                          className="media-icon"
                          icon={faLinkedin}
                        />
                        <a href={info.LINKEDIN} target="_blank">
                          {info.LINKEDIN.length > 30
                            ? info.LINKEDIN.substring(0, 30) + '...'
                            : info.LINKEDIN}
                        </a>
                      </div>
                    ) : (
                      <></>
                    )}
                    {info.PERSONAL_WEBSITE !== '' ? (
                      <div className="media-item">
                        <FontAwesomeIcon
                          className="media-icon"
                          icon={faSquareRss}
                        />
                        <a href={info.PERSONAL_WEBSITE} target="_blank">
                          {info.PERSONAL_WEBSITE.length > 30
                            ? info.PERSONAL_WEBSITE.substring(0, 30) + '...'
                            : info.PERSONAL_WEBSITE}
                        </a>
                      </div>
                    ) : (
                      <></>
                    )}
                    {info.RESEARCH_GATE !== '' ? (
                      <div className="media-item">
                        <FontAwesomeIcon
                          className="media-icon"
                          icon={faResearchgate}
                        />
                        <a href={info.RESEARCH_GATE} target="_blank">
                          {info.RESEARCH_GATE.length > 30
                            ? info.RESEARCH_GATE.substring(0, 30) + '...'
                            : info.RESEARCH_GATE}
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
                    {info.SHORT_BIO.map((item) => (
                      <p>{item}</p>
                    ))}
                  </div>
                  <div className="item-block">
                    <h3>Fields of Interest</h3>
                    <ul>
                      {info.INTEREST_FIELDS.map((item) => (
                        <li>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div> : <div className="content-info"></div>
            }
            <div className="education">

              {info.EDUCATION === undefined ? <></> :
                <>
                  <h3>Education</h3>
                  <div className="edu-list">
                    {Object.values(info.EDUCATION).map((item) => (
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
                </>
              }
            </div>
            {info.PUBLICATION === undefined ? <></> :
              <div className="publications">
                <h3>Publications</h3>
                <div className="pub-list">
                  {Object.values(info.PUBLICATION).map((item) => (
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
            }
          </animated.div>
        </div>
      </div>
      <Loader type="line-scale" />
    </>
  )
}

export default MemBio
