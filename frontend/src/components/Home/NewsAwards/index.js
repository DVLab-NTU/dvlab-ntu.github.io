// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ index.js ]
// * PackageName  [ src/components/Home/NewsAwards ]
// * Synopsis     [ Implement "Awards" in "Home" page ]
// * Author       [ Cheng-Hua Lu (Front), Chin-Yi Cheng (Back) ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import './index.scss'
import Item from './Item'
import React, { useState } from 'react'
import { useLocale } from '../../../i18n/LocaleContext'
import AnimatedLetters from '../../AnimatedLetters'

import { getAwardData } from '../../../siteData'


const NewsAwards = () => {
  // * NewsAwards: Implement "Awards" in "Home" page (News was removed)
  // @param letterClass     String      the animation for title
  //        itemList        Array       data for each item
  const { locale, t } = useLocale()
  const newsAwards = getAwardData()
  const [letterClass] = useState('text-animate')

  const title = t('home.awardsTitle')

  return (
    <div className="news-container">
      <div className="wrapper">
        <div className="title">
          <h1>
            <AnimatedLetters
              letterClass={letterClass}
              strArray={title.split('')}
              idx={20}
            />
          </h1>
        </div>
        <div className="content">
          {newsAwards.map((item) => (
            <Item
              key={item.TITLE}
              year={item.YEAR}
              month={item.MONTH}
              title={locale === 'zh' && item.TITLE_ZH ? item.TITLE_ZH : item.TITLE}
              source={item.SOURCE}
              students={item.STUDENTS}
              advisors={item.ADVISORS}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default NewsAwards
