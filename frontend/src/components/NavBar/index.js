// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ index.js ]
// * PackageName  [ src/components/NavBar ]
// * Synopsis     [ Implement "NavBar" in each page ]
// * Author       [ Cheng-Hua Lu ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import './index.scss'
import React from 'react'
import Logo from '../../logo.png'
import { Navbar } from 'react-bootstrap'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLocale, LOCALE_PREFIX } from '../../i18n/LocaleContext'
import {
  faLightbulb,
  faHome,
  faUserGraduate,
  faUserGroup,
  faLandmark,
  faBars,
  faLanguage,
} from '@fortawesome/free-solid-svg-icons'

const NavBar = () => {
  // * NavBar: Implement "NavBar" in each page
  const { t, localize } = useLocale()
  const location = useLocation()
  const navigate = useNavigate()

  const switchLocale = () => {
    const current = location.pathname
    const target = current.startsWith(LOCALE_PREFIX)
      ? current.slice(LOCALE_PREFIX.length) || '/'
      : `${LOCALE_PREFIX}${current}`
    navigate(target)
  }

  return (
    <Navbar className="navbar navbar-expand-lg navbar-container" sticky="top">
      <a className="navbar-brand" href={localize('/')}>
        <img src={Logo} alt="DV Lab" />
      </a>

      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarToggler"
        aria-controls="navbarToggler"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <FontAwesomeIcon className="nav-icon" icon={faBars}></FontAwesomeIcon>
      </button>
      <div
        className="collapse navbar-collapse justify-content-end"
        id="navbarToggler"
      >
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <NavLink className="nav-link" to={localize('/about')} end>
              <FontAwesomeIcon
                className="nav-icon"
                icon={faHome}
              ></FontAwesomeIcon>
              <span className="nav-text">{t('nav.about')}</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to={localize('/host')} end>
              <FontAwesomeIcon
                className="nav-icon"
                icon={faUserGraduate}
              ></FontAwesomeIcon>
              <span className="nav-text">{t('nav.host')}</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to={localize('/publications')} end>
              <FontAwesomeIcon
                className="nav-icon"
                icon={faLightbulb}
              ></FontAwesomeIcon>
              <span className="nav-text">{t('nav.publications')}</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to={localize('/members')} end>
              <FontAwesomeIcon
                className="nav-icon"
                icon={faUserGroup}
              ></FontAwesomeIcon>
              <span className="nav-text">{t('nav.members')}</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to={localize('/courses')} end>
              <FontAwesomeIcon
                className="nav-icon"
                icon={faLandmark}
              ></FontAwesomeIcon>
              <span className="nav-text">{t('nav.courses')}</span>
            </NavLink>
          </li>
          <li className="nav-item lang-item">
            <button
              className="btn btn-link nav-link lang-switcher"
              type="button"
              onClick={switchLocale}
              aria-label={t('nav.switchLabel')}
            >
              <FontAwesomeIcon className="nav-icon" icon={faLanguage} />
              <span className="nav-text">{t('nav.switchTo')}</span>
            </button>
          </li>
        </ul>
      </div>
    </Navbar>
  )
}

export default NavBar
