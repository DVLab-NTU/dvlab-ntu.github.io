// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ index.js ]
// * PackageName  [ src/components/Home/NewsAwards/Item ]
// * Synopsis     [ Implement each item in News & Awards" of "Home" page ]
// * Author       [ Cheng-Hua Lu ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import './index.scss'
import React from 'react'

const Item = ({ year, month, title, attendants }) => {
  // * Item: Implement each item in News & Awards" of "Home" page
  // @param year            String         The year of the item
  //        month           String         The month of the item (In English spelling)
  //        title           String         The title of the item
  //        attendants      Array          All the attendants of the item

  return (
    <div className="item-container">
      <div className="wrapper">
        <div className="left-col">
          <p>{year}</p>
          <p>{month}</p>
        </div>
        <div className="right-col">
          <h3>{title}</h3>
          <div className="attendants-list">
            {attendants.map((a, idx) => (
              <span>
                {a}
                {idx === attendants.length - 1 ? '' : ', '}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Item
