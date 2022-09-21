// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ index.js ]
// * PackageName  [ src/components/Members/Member ]
// * Synopsis     [ Implement Member in Group of "Members" page ]
// * Author       [ Cheng-Hua Lu ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import './index.scss'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Member = ({ name, img_path, personal_id }) => {
  // * Member: Implement Member in Group of "Members" page.
  // @param name          String        The name of the member
  //        img_path      String        The path of the member's image
  //        personal_id   String        The id of the member -> for navigate to MemBio
  //        navigate      useNavigate   For navigate to MemBio

  const navigate = useNavigate()
  const navigateToMemBio = () => {
    navigate('/members/' + personal_id)
  }

  return (
    <div className="member-container" onClick={navigateToMemBio}>
      <div className="wrapper">
        <div className="img-block">
          <img src={img_path} />
        </div>
        <div className="name-block">
          <span>{name}</span>
        </div>
      </div>
    </div>
  )
}

export default Member
