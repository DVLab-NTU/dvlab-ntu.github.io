// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ index.js ]
// * PackageName  [ src/components/Home/Logo ]
// * Synopsis     [ Implement Logo in "Home" page ]
// * Author       [ Cheng-Hua Lu ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import './index.scss'
import React from 'react'
import configData from '../../../config.json'
import { useSpring, animated, config } from 'react-spring'

const Logo = () => {
  // * Logo: Implement "Home" page, it contains Logo and NewsAwards
  // @param chip:           useSpring   The animation for chip(img)
  //        bug:            useSpring   The animation for bug(img)
  //        magnifier:      useSpring   The animation for magnifier(img)
  //        ntugiee:        useSpring   The animation for ntugiee(img)
  //        dvlab:          useSpring   The animation for dvlab(img)
  //        description:    useSpring   The animation for description(img)

  const chip = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    reset: false,
    delay: 2000,
    config: config.molasses,
  })
  const bug = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    reset: false,
    delay: 3000,
    config: config.molasses,
  })
  const magnifier = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    reset: false,
    delay: 3000,
    config: config.molasses,
  })
  const ntugiee = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    reset: false,
    delay: 4000,
    config: config.molasses,
  })
  const dvlab = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    reset: false,
    delay: 5000,
    config: config.molasses,
  })
  const description = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    reset: false,
    delay: 5500,
    config: config.molasses,
  })

  return (
    <div className="logo-container">
      <div className="wrapper">
        <animated.div>
          <animated.img
            className="chip_img"
            src={configData.LOGO_SUB_PIC.CHIP}
            style={chip}
          />
          <animated.img
            className="bug_img"
            src={configData.LOGO_SUB_PIC.BUG}
            style={bug}
          />
          <animated.img
            className="maginfier_img"
            src={configData.LOGO_SUB_PIC.MAGNIFIER}
            style={magnifier}
          />
          <animated.img
            className="ntugiee_img"
            src={configData.LOGO_SUB_PIC.NTUGIEE}
            style={ntugiee}
          />
          <animated.img
            className="dvlab_img"
            src={configData.LOGO_SUB_PIC.DVLAB}
            style={dvlab}
          />
          <animated.img
            className="description_img"
            src={configData.LOGO_SUB_PIC.DESCRIPTION}
            style={description}
          />
        </animated.div>
      </div>
    </div>
  )
}

export default Logo
