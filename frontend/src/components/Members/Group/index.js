// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ index.js ]
// * PackageName  [ src/components/Members/Group ]
// * Synopsis     [ Implement Group in "Members" page ]
// * Author       [ Cheng-Hua Lu ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import './index.scss'
import React from 'react'
import Member from '../Member'
import Slider from 'react-slick'
import { useLocale } from '../../../i18n/LocaleContext'

const Group = ({ group_name, group_members }) => {
  // * Group: Implement Group in "Members" page, it contains Member.
  // @param group_name     String      Group name
  //        group_members  Array       Data for all members in the group

  const { localize } = useLocale()

  return (
    <div className="group-container">
      {group_members.length === 0 ? (
        <></>
      ) : (
        <div className="wrapper">
          <h1>{group_name}</h1>
          <Slider
            className="center"
            centerMode="true"
            infinite="true"
            centerPadding="210px"
            slidesToShow={3}
            speed={3000}
            slidesToScroll={1}
            autoplay="true"
            autoplaySpeed={3000}
            cssEase="linear"
            pauseOnHover="true"
          >
            {group_members.map((d) => (
              <Member
                key={d.ID}
                name={d.NAME}
                img_path={d.IMG}
                personal_id={d.ID}
                to={localize(`/members/${d.ID}`)}
              />
            ))}
          </Slider>
        </div>
      )}
    </div>
  )
}

export default Group
