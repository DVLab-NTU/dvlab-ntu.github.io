// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ index.js ]
// * PackageName  [ src/components/Home/NewsAwards ]
// * Synopsis     [ Implement "News & Awards" in "Home" page ]
// * Author       [ Cheng-Hua Lu (Front), Chin-Yi Cheng (Back) ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import './index.scss'
import Item from './Item'
import React, { useState, useEffect } from 'react'
import frontendData from '../../../config/frontend.json'
import AnimatedLetters from '../../AnimatedLetters'

//Backend Additions
import axios from 'axios'
const API_ROOT = 'http://localhost:4000/api'
const instance = axios.create({
  baseURL: API_ROOT
})

const NewsAwards = () => {
  // * NewsAwards: Implement "News & Awards" in "Home" page
  // TODO: Add the function to show the first three items
  // TODO: Add a new page to show all the news and awards
  // @param letterClass     String      the animation for title
  //        itemList        Array       data for each item
  const [newsAwards, setNewsAwards] = useState([])     // to store 
  const [letterClass, setLetterClass] = useState('text-animate')
  const getNewsAwards = async () => {
    const back = await instance.get('/getNewsAward')
    const newsAward = back.data.contents
    setNewsAwards(newsAward)
  }
  // * Scroll to top of the page when rendering
  useEffect(() => {
    if (newsAwards.length === 0)
      getNewsAwards()
  }, [])

  return (
    <div className="news-container">
      <div className="wrapper">
        <div className="title">
          <h1>
            <AnimatedLetters
              letterClass={letterClass}
              strArray={frontendData.HOME_PAGE.NEWS_AWARDS_PART.TITLE.split('')}
              idx={20}
            />
          </h1>
        </div>
        <div className="content">
          {newsAwards.map((item) => (
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
