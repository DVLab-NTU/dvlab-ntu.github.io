// * //////////////////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ index.js ]
// * PackageName  [ src/components/About/Gallery ]
// * Synopsis     [ Implement Gallery of "About DV Lab " page (Lab Culture) ]
// * Author       [ Cheng-Hua Lu ]
// * Copyright    [ 2022 8 ]
// *
// * //////////////////////////////////////////////////////////////////////////////////////

import './index.scss'
import React from 'react'

const Gallery = ({ idx, img_path, subtitle, text }) => {
  // * Slide: Implement each slide in Slider in "About DV Lab" page
  // @param idx:        int       The idx of the image (even: left, odd: right)
  //        img_path:   String    The path of the image
  //        subtitle:   String    The title for the image
  //        text:       String    The description of the image

  const odd = idx % 2 === 1
  return (
    <div className="gallery-container">
      <div className="wrapper">
        {odd ? (
          <div className="a-row">
            <div className="left-col">
              <div className="content">
                <h3>{subtitle}</h3>
                {/* <p>{text}</p> */}
              </div>
            </div>
            <div className="right-col">
              <img src={img_path} alt={subtitle} />
            </div>
          </div>
        ) : (
          <div className="a-row">
            <div className="right-col">
              <img src={img_path} alt={subtitle} />
            </div>
            <div className="left-col">
              <div className="content">
                <h3>{subtitle}</h3>
                {/* <p>{text}</p> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Gallery
