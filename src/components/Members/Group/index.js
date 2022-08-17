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

const Group = ({ group_members }) => {
  // * Group: Implement Group in "Members" page, it contains Member.
  // @param group_members   Array       Data for all members in the group
  //        group_name      String      Group name
  //        data_list       Array       List of group name

  const group_name = Object.values(group_members)[0].item
  const data_list = Object.values(group_members)[1]

  return (
    <div className="group-container">
      {data_list.length === 0 ? (
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
            {data_list.map((d) => (
              <Member name={d.NAME} img_path={d.IMG} personal_id={d.ID} />
            ))}
          </Slider>
        </div>
      )}
    </div>
  )
}

export default Group
