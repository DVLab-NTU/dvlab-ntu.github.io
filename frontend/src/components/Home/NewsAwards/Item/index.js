// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ index.js ]
// * PackageName  [ src/components/Home/NewsAwards/Item ]
// * Synopsis     [ Implement each item in "Awards" of "Home" page ]
// * Author       [ Cheng-Hua Lu ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import './index.scss'
import React from 'react'
import { useLocale } from '../../../../i18n/LocaleContext'

const Item = ({ year, month, title, students, advisors, source }) => {
  // * Item: Implement each item in "Awards" of "Home" page
  // @param year            String         The year of the item
  //        month           String         The month of the item (In English spelling)
  //        title           String         The title of the item
  //        students        Array          Student collaborators/recipients
  //        advisors        Array          Advisor(s) of the award
  //        source          String         Public source URL of the award record

  const { t } = useLocale()

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
            <strong>{t('awards.students')}</strong>
            {students.join(', ')}
            {advisors.length !== 0 && (
              <>
                <br />
                <strong>{t('awards.advisors')}</strong>
                {advisors.join(', ')}
              </>
            )}
            {source !== '' && (
              <>
                <br />
                <a href={source} target="_blank" rel="noreferrer">
                  {t('awards.source')}
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Item
