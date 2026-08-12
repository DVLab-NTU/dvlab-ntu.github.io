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
import AnimatedLetters from '../AnimatedLetters'
import React, { useState, useEffect } from 'react'
import { useSpring, animated, config } from 'react-spring'
import { useLocale } from '../../i18n/LocaleContext'

import { getMemberData } from '../../siteData'

const Members = () => {
  // * Members: Implement "Members" page, it contains Group.
  // Current students are grouped by research team; graduates by cohort.
  // @param props:          useSpring   the animation for animated.div
  //        letterClass     String      the animation for title
  //        all_member_data Array       Data for all members
  const { t } = useLocale()
  const memBriefs = getMemberData()
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

  const students = memBriefs.filter((m) => m.STATUS !== 'Graduated')
  const graduates = memBriefs.filter((m) => m.STATUS === 'Graduated')

  const studentTeams = [...new Set(students.map((m) => m.TEAM))]
  const graduateCohorts = [...new Set(graduates.map((m) => m.COHORT))].sort()

  return (
    <>
      <div className="members-container">
        <div className="wrapper">
          <h1>
            <AnimatedLetters
              letterClass={letterClass}
              strArray={t('members.title').split('')}
              idx={20}
            />
          </h1>
          <animated.div style={props}>
            {studentTeams.map((team) => (
              <Group
                key={`student-${team}`}
                group_name={team}
                group_members={students.filter((m) => m.TEAM === team)}
              />
            ))}
            {graduateCohorts.map((cohort) => (
              <Group
                key={`graduate-${cohort}`}
                group_name={`${t('members.graduates')} (${cohort})`}
                group_members={graduates.filter((m) => m.COHORT === cohort)}
              />
            ))}
          </animated.div>
        </div>
      </div>
      <Loader type="line-scale" />
    </>
  )
}

export default Members
