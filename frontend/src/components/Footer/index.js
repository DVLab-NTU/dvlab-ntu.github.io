// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ index.js ]
// * PackageName  [ src/components/Footer ]
// * Synopsis     [ Implement footer at the bottom of each page ]
// * Author       [ Cheng-Hua Lu ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import './index.scss'
import React from 'react'
import { useLocale } from '../../i18n/LocaleContext'

import { getMaintainerData } from '../../siteData'


const Footer = () => {
  // * Footer: Implement footer at the bottom of each page.
  // @param authors:    Array       Data for each authors.

  const { t } = useLocale()
  const authors = getMaintainerData()
  return (
    <div className="footer-container">
      <div className="wrapper">
        <div className="left-col">{t('footer.copyright')}</div>
        <div className="right-col">
          {t('footer.thanks')}{' '}
          {authors.map((item, idx) => (
            <span key={item.NAME}>
              <a href={item.LINK} target="_blank" rel="noreferrer">
                {item.NAME}
              </a>
              {idx === authors.length - 2
                ? ' ' + t('footer.and') + ' '
                : idx === authors.length - 1
                ? ''
                : ', '}
            </span>
          ))}{' '}
          {t('footer.forMaintaining')}
        </div>
        <div className="links-col">
          <span className="links-title">{t('footer.linksTitle')}</span>
          <a href="https://github.com/DVLab-NTU" target="_blank" rel="noreferrer">
            {t('footer.githubOrg')}
          </a>
        </div>
      </div>
    </div>
  )
}

export default Footer
