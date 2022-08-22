// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ index.js ]
// * PackageName  [ src/components/Courses ]
// * Synopsis     [ Implement "Courses" page ]
// * Author       [ Cheng-Hua Lu ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import './index.scss'
import Course from './Course'
import Loader from 'react-loaders'
import frontendData from '../../config/frontend.json'
import courseList from '../../config/course.json'
import AnimatedLetters from '../AnimatedLetters'
import React, { useState, useEffect } from 'react'
import { useSpring, animated, config } from 'react-spring'

const Courses = () => {
  // * Courses: Implement "Courses" page, it contains Course.
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
      <div className="courses-container">
        <div className="wrapper">
          <div className="title">
            <h1>
              <AnimatedLetters
                letterClass={letterClass}
                strArray={frontendData.COURSES_PAGE.TITLE.split('')}
                idx={16}
              />
            </h1>
          </div>
          <animated.div className="courses-list" style={props}>
            {courseList.map((course, idx) => (
              <Course course={course} />
            ))}
          </animated.div>
        </div>
      </div>
      <Loader type="line-scale" />
    </>
  )
}

export default Courses
