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
import Loader from 'react-loaders'
import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSpring, animated, config } from 'react-spring'
import { useLocale } from '../../../i18n/LocaleContext'
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

import { getMemberById } from '../../../siteData'

const MemBio = () => {
  // * MemBio: Implement "MemBio" page for each member.
  // @param memberId      useParams     The id of the member
  //        props         useSpring     The animation for animated.div
  //        mem_info      Dictionary    The information for the member

  const { memberId } = useParams()
  const navigate = useNavigate()
  const { t, localize } = useLocale()
  const info = getMemberById(memberId) || {}
  const ready = Object.keys(info).length !== 0
  const props = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    reset: false,
    delay: 2000,
    config: config.molasses,
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <div className="membio-container">
        <div className="wrapper">
          <div className="back-link">
            <button type="button" onClick={() => navigate(localize('/members'))}>
              {'< '}{t('members.backToMembers')}
            </button>
          </div>
          <animated.div className="content" style={props}>
            {(ready) ?
              <div className="content-info">
                <div className="left-col">
                  <div className="img-container">
                    <img src={info.IMG} alt={info.NAME} />
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
                        <a href={'mailto:' + info.EMAIL} target="_blank" rel="noreferrer">
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
                        <a href={info.GITHUB} target="_blank" rel="noreferrer">
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
                        <a href={info.FACEBOOK} target="_blank" rel="noreferrer">
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
                        <a href={info.LINKEDIN} target="_blank" rel="noreferrer">
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
                        <a href={info.PERSONAL_WEBSITE} target="_blank" rel="noreferrer">
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
                        <a href={info.RESEARCH_GATE} target="_blank" rel="noreferrer">
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
                  {info.SHORT_BIO.length !== 0 ? (
                    <div className="item-block">
                      <h3>{t('members.shortBio')}</h3>
                      {info.SHORT_BIO.map((item) => (
                        <p key={item}>{item}</p>
                      ))}
                    </div>
                  ) : (<></>)}
                  {info.INTEREST_FIELDS.length !== 0 ? (
                    <div className="item-block">
                      <h3>{t('members.fieldsOfInterest')}</h3>
                      <ul>
                        {info.INTEREST_FIELDS.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (<></>)}
                </div>

              </div> : <div className="content-info"></div>
            }
            <div className="education">

              {info.EDUCATION === undefined || Object.values(info.EDUCATION).length === 0 ? <></> :
                <>
                  <h3>{t('members.education')}</h3>
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
            {info.PUBLICATION === undefined || Object.values(info.PUBLICATION).length === 0 ? <></> :
              <div className="publications">
                <h3>{t('members.publications')}</h3>
                <div className="pub-list">
                  {Object.values(info.PUBLICATION).map((item) => (
                    <div className="pub-item">
                      <a
                        className="pub-subitem"
                        href={item.LINK}
                        target={item.LINK !== "" ? "_blank" : ""}
                        rel="noreferrer"
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
