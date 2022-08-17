// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ index.js ]
// * PackageName  [ src/components/Home/NewsAwards ]
// * Synopsis     [ Implement "News & Awards" in "Home" page ]
// * Author       [ Cheng-Hua Lu ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import './index.scss'
import Item from './Item'
import React, { useState } from 'react'
import configData from '../../../config.json'
import AnimatedLetters from '../../AnimatedLetters'

const NewsAwards = () => {
  // * NewsAwards: Implement "News & Awards" in "Home" page
  // TODO: Add the function to show the first three items
  // TODO: Add a new page to show all the news and awards
  // @param letterClass     String      the animation for title
  //        itemList        Array       data for each item

  const [letterClass, setLetterClass] = useState('text-animate')
  const itemList = Object.values(configData.HOME_PAGE.NEWS_AWARDS_PART.CONTENTS)
  return (
    <div className="news-container">
      <div className="wrapper">
        <div className="title">
          <h1>
            <AnimatedLetters
              letterClass={letterClass}
              strArray={configData.HOME_PAGE.NEWS_AWARDS_PART.TITLE.split('')}
              idx={20}
            />
          </h1>
        </div>
        <div className="content">
          {itemList.map((item) => (
            <Item
              year={item.YEAR}
              month={item.MONTH}
              title={item.TITLE}
              link={item.LINK}
              attendants={item.ATTENDANTS}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default NewsAwards
