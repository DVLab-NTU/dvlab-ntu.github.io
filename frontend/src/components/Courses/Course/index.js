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
import { useLocale } from '../../../i18n/LocaleContext'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Course = ({ course, locale }) => {
  // * Course: Implement each course in Courses.
  // @param show            bool          If true, show the contents of each course.
  //        showBtnOnClick  function      OnClick button to contrl show or not show the contents.
  //        linkExist       bool          If true, show "Learn more >>" to link to the new page.

  const { t } = useLocale()
  const [show, setShow] = useState(false)
  const showBtnOnClick = () => {
    if (show) setShow(false)
    else setShow(true)
  }
  const linkExist = course.LINK !== ''

  const isZh = locale === 'zh'
  const title = isZh && course.TITLE_ZH ? course.TITLE_ZH : course.TITLE
  const intro = isZh && course.INTRO_ZH ? course.INTRO_ZH : course.INTRO
  const contents = isZh && course.CONTENTS_ZH ? course.CONTENTS_ZH : course.CONTENTS

  return (
    <div className="course-container">
      <div className="course-wrapper">
        <div className="content-wrapper">
          <h2>{title}</h2>
          <div className="icon-list">
            <div className="semester">
              <FontAwesomeIcon className="semester-icon" icon={faCalendar} />
              <span className="semester-text">{course.SEMESTER}</span>
            </div>
            {course.GITHUB !== '' ? (
              <a className="github-repo" href={course.GITHUB} target="_blank" rel="noreferrer">
                <FontAwesomeIcon className="github-icon" icon={faGithub} />
                <span className="github-text">{t('courses.githubRepo')}</span>
              </a>
            ) : (
              <></>
            )}
          </div>
          {intro.map((paragraph) => (
            <p className="intro-block" key={paragraph}>{paragraph}</p>
          ))}
          {show ? (
            <div className="content-with-button">
              <div className="content-list">
                <ul>
                  {contents.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <button onClick={showBtnOnClick}>
                {show ? t('courses.showLess') : t('courses.showMore')}
              </button>
            </div>
          ) : (
            <div className="content-with-button">
              <div className="content-list"> </div>
              <button onClick={showBtnOnClick}>
                {show ? t('courses.showLess') : t('courses.showMore')}
              </button>
            </div>
          )}

          <div
            className="link-button"
            style={linkExist ? {} : { display: 'none' }}
          >
            <a href={course.LINK} target="_blank" rel="noreferrer">
              {' '}
              {t('courses.learnMore')}{' '}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Course
