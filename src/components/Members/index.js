// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ index.js ]
// * PackageName  [ src/components/Members ]
// * Synopsis     [ Implement "Members" page ]
// * Author       [ Cheng-Hua Lu (Front), Chin-Yi Cheng (Back) ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import './index.scss'
import Group from './Group'
import Loader from 'react-loaders'
import frontendData from '../../config/frontend.json'
import AnimatedLetters from '../AnimatedLetters'
import React, { useState, useEffect } from 'react'
import { useSpring, animated, config } from 'react-spring'

//Backend Additions
import axios from 'axios'
const API_ROOT = 'http://localhost:4000/api'
const instance = axios.create({
  baseURL: API_ROOT
})
const Members = () => {
  // * Members: Implement "Members" page, it contains Group.
  // @param props:          useSpring   the animation for animated.div
  //        letterClass     String      the animation for title
  //        all_member_data Array       Data for all members
  //        group_list      Array       List of group name
  const [memBriefs, setMemBriefs] = useState([])
  const [letterClass, setLetterClass] = useState('text-animate')
  const props = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    reset: false,
    delay: 2000,
    config: config.molasses,
  })
  const getMemBriefs = async () => {
    const back = await instance.get('/getMemBrief')
    const memBrief = back.data.contents
    setMemBriefs(memBrief)
  }
  // * Scroll to top of the page when rendering
  useEffect(() => {
    if (memBriefs.length === 0)
      getMemBriefs()
    window.scrollTo(0, 0)
  }, [])

  const all_member_data = memBriefs
  const group_list = Object.values(frontendData.MEMBERS_PAGE.GROUP)
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

  return (
    <>
      <div className="members-container">
        <div className="wrapper">
          <h1>
            <AnimatedLetters
              letterClass={letterClass}
              strArray={frontendData.MEMBERS_PAGE.TITLE.split('')}
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
