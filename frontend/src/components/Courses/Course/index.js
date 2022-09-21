// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ index.js ]
// * PackageName  [ src/components/Courses/Course ]
// * Synopsis     [ Implement each course in Courses ]
// * Author       [ Cheng-Hua Lu ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import './index.scss'
import React, { useState } from 'react'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Course = ({ course }) => {
  // * Course: Implement each course in Courses.
  // @param show            bool          If true, show the contents of each course.
  //        showBtnOnClick  function      OnClick button to contrl show or not show the contents.
  //        linkExist       bool          If true, show "Learn more >>" to link to the new page.

  const [show, setShow] = useState(false)
  const showBtnOnClick = () => {
    if (show) setShow(false)
    else setShow(true)
  }
  const linkExist = course.LINK !== ''

  return (
    <div className="course-container">
      <div className="course-wrapper">
        <div className="content-wrapper">
          <h2>{course.TITLE}</h2>
          <div className="icon-list">
            <div className="semester">
              <FontAwesomeIcon className="semester-icon" icon={faCalendar} />
              <span className="semester-text">{course.SEMESTER}</span>
            </div>
            {course.GITHUB !== '' ? (
              <a className="github-repo" href={course.GITHUB} target="_blank">
                <FontAwesomeIcon className="github-icon" icon={faGithub} />
                <span className="github-text">GitHub Repo</span>
              </a>
            ) : (
              <></>
            )}
          </div>
          {course.INTRO.map((paragraph) => (
            <p className="intro-block">{paragraph}</p>
          ))}
          {show ? (
            <div className="content-with-button">
              <div className="content-list">
                <ul>
                  {course.CONTENTS.map((item, idx) => (
                    <li>{item}</li>
                  ))}
                </ul>
              </div>
              <button onClick={showBtnOnClick}>
                {show ? 'Show Less' : 'Show More'}
              </button>
            </div>
          ) : (
            <div className="content-with-button">
              <div className="content-list"> </div>
              <button onClick={showBtnOnClick}>
                {show ? 'Show Less' : 'Show More'}
              </button>
            </div>
          )}

          <div
            className="link-button"
            style={linkExist ? {} : { display: 'none' }}
          >
            <a href={course.LINK} target="_blank">
              {' '}
              Learn More >>{' '}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Course
