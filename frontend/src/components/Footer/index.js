// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ index.js ]
// * PackageName  [ src/components/Footer ]
// * Synopsis     [ Implement footer at the bottom of each page ]
// * Author       [ Cheng-Hua Lu (Front), Chin-Yi Cheng (Back) ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import './index.scss'
import React, { useEffect, useState } from 'react'
import frontendData from '../../config/frontend.json'

import instance from '../../axiosInstance'


const Footer = () => {
  // * Footer: Implement footer at the bottom of each page.
  // TODO: The format for multiple maintainer.
  // @param authors:    Array       Data for each authors.

  const [authors, setAuthor] = useState([])     // to store 

  const getAuthors = async () => {
    // get Bios from backend
    const back = await instance.get('/getMaintainer')
    const maintainer = back.data.contents
    setAuthor(maintainer)
  }
  useEffect(() => {
    if (authors.length === 0)
      getAuthors()
  })
  return (
    <div className="footer-container">
      <div className="wrapper">
        <div className="left-col">{frontendData.FOOTER.COPYRIGHT}</div>
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
