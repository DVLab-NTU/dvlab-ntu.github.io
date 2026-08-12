// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ index.js ]
// * PackageName  [ src/components/Courses ]
// * Synopsis     [ Implement "Courses" page ]
// * Author       [ Cheng-Hua Lu (Front), Chin-Yi Cheng (Back) ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import './index.scss'
import Course from './Course'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import React, { useState, useEffect } from 'react'
import { useSpring, animated, config } from 'react-spring'
import { useLocale } from '../../i18n/LocaleContext'

import { getCourseData } from '../../siteData'

const Courses = () => {
  // * Courses: Implement "Courses" page, it contains Course.
  // @param props:          useSpring   the animation for animated.div
  //        letterClass     String      the animation for title
  const { locale, t } = useLocale()
  const courses = getCourseData()
  const [letterClass] = useState('text-animate')
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
      <div className="courses-container">
        <div className="wrapper">
          <div className="title">
            <h1>
              <AnimatedLetters
                letterClass={letterClass}
                strArray={t('courses.title').split('')}
                idx={16}
              />
            </h1>
          </div>
          <animated.div className="courses-list" style={props}>
            {courses.length !== 0 ?
              <>
                {courses.map((course, idx) => (
                  <Course course={course} locale={locale} key={course.TITLE + idx} />
                ))}
              </>
              : <Loader type="line-scale" />}
          </animated.div>
        </div>
      </div>
      <Loader type="line-scale" />
    </>
  )
}

export default Courses
