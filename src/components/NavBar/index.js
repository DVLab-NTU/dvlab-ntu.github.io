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
import { NavLink } from 'react-router-dom'
import frontendData from '../../config/frontend.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLightbulb,
  faHome,
  faUserGraduate,
  faUserGroup,
  faLandmark,
  faBars,
} from '@fortawesome/free-solid-svg-icons'

const NavBar = () => {
  // * NavBar: Implement "NavBar" in each page
  // TODO: Add the function for auto-width

  return (
    <Navbar className="navbar navbar-expand-lg navbar-container" sticky="top">
      <a className="navbar-brand" href="/">
        <img src={Logo} />
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
            <NavLink className="nav-link" to="/about" exact>
              <FontAwesomeIcon
                className="nav-icon"
                icon={faHome}
              ></FontAwesomeIcon>
              <span className="nav-text">
                {frontendData.ABOUT_DV_LAB_PAGE.TITLE}
              </span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/host" exact>
              <FontAwesomeIcon
                className="nav-icon"
                icon={faUserGraduate}
              ></FontAwesomeIcon>
              <span className="nav-text">
                {frontendData.HOST_PROFILE_PAGE.TITLE}
              </span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/publications" exact>
              <FontAwesomeIcon
                className="nav-icon"
                icon={faLightbulb}
              ></FontAwesomeIcon>
              <span className="nav-text">
                {frontendData.PUBLICATIONS_PAGE.TITLE}
              </span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/members" exact>
              <FontAwesomeIcon
                className="nav-icon"
                icon={faUserGroup}
              ></FontAwesomeIcon>
              <span className="nav-text">{frontendData.MEMBERS_PAGE.TITLE}</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/courses" exact>
              <FontAwesomeIcon
                className="nav-icon"
                icon={faLandmark}
              ></FontAwesomeIcon>
              <span className="nav-text">{frontendData.COURSES_PAGE.TITLE}</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </Navbar>
  )
}

export default NavBar
