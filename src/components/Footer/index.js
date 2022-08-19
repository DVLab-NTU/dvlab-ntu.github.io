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
import maintainer from '../../config/maintainer.json'
import configData from '../../config/frontend.json'

const Footer = () => {
  // * Footer: Implement footer at the bottom of each page.
  // TODO: The format for multiple maintainer.
  // @param authors:    Array       Data for each authors.

  const authors = Object.values(maintainer)
  console.log(authors)
  return (
    <div className="footer-container">
      <div className="wrapper">
        <div className="left-col">{configData.FOOTER.COPYRIGHT}</div>
        <div className="right-col">
          We thank{' '}
          {authors.map((item, idx) => (
            <a href={item.LINK} target="_blank">
              {' '}
              {item.NAME}
              {/* {idx === authors.length - 1 ? ' ' : ' and '} */}
            </a>
          ))}
          for creating and maintaining the DV Lab official website.
        </div>
      </div>
    </div>
  )
}

export default Footer
