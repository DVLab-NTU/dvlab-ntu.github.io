// * ////////////////////////////////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ index.js ]
// * PackageName  [ src/components/About/Slide ]
// * Synopsis     [ Implement each slide in Slider of "About DV Lab " page (Lab Introduction) ]
// * Author       [ Cheng-Hua Lu ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////////////////////////////////

import './index.scss'
import React from 'react'

const Slide = ({ text, img_path }) => {
  // * Slide: Implement each slide in Slider in "About DV Lab" page
  // @param text:      String    The description of the image
  //        img_path:  String    The path of the image

  return (
    <div className="slide-container">
      <div className="wrapper">
        <div className="text-col">
          <div className="text-wrapper">
            <span>{text}</span>
          </div>
        </div>
        <div className="image-col">
          <img src={img_path} />
        </div>
      </div>
    </div>
  )
}

export default Slide
