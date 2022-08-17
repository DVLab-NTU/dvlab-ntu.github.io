// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ index.js ]
// * PackageName  [ src/components/Members ]
// * Synopsis     [ Implement "Members" page ]
// * Author       [ Cheng-Hua Lu ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import './index.scss'
import Group from './Group'
import Loader from 'react-loaders'
import configData from '../../config.json'
import AnimatedLetters from '../AnimatedLetters'
import React, { useState, useEffect } from 'react'
import { useSpring, animated, config } from 'react-spring'

const Members = () => {
  // * Members: Implement "Members" page, it contains Group.
  // @param props:          useSpring   the animation for animated.div
  //        letterClass     String      the animation for title
  //        all_member_data Array       Data for all members
  //        group_list      Array       List of group name

  const [letterClass, setLetterClass] = useState('text-animate')
  const props = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    reset: false,
    delay: 2000,
    config: config.molasses,
  })
  const all_member_data = Object.values(configData.MEMBERS_PAGE.MEMBIO)
  const group_list = Object.values(configData.MEMBERS_PAGE.GROUP)
  let group_member_list = []
  group_list.map((item) =>
    group_member_list.push({
      key: { item },
      values: [],
    })
  )

  all_member_data.map((one_mem) =>
    group_member_list[
      group_list.findIndex((group_name) => group_name === one_mem.TEAM)
    ].values.push(one_mem)
  )

  // * Scroll to top of the page when rendering
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <div className="members-container">
        <div className="wrapper">
          <h1>
            <AnimatedLetters
              letterClass={letterClass}
              strArray={configData.MEMBERS_PAGE.TITLE.split('')}
              idx={20}
            />
          </h1>
          <animated.div style={props}>
            {Object.values(group_member_list).map((group_members) => (
              <Group group_members={group_members} />
            ))}
          </animated.div>
        </div>
      </div>
      <Loader type="line-scale" />
    </>
  )
}

export default Members
