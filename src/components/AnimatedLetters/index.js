// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ index.js ]
// * PackageName  [ src/components/AnimatedLetter ]
// * Synopsis     [ Implement the animation of the title for each page ]
// * Author       [ Cheng-Hua Lu ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import './index.scss'
import React from 'react'

const AnimatedLetters = ({ letterClass, strArray, idx }) => {
  // * AnimatedLetters: Implement the animation of the title for each page
  // @param letterClass     String      The class of the animation
  //        strArray:       Array       The array of animated target (A char array)
  //        idx:            Array       The idx for the size of strArray

  return (
    <span>
      {strArray.map((char, i) => (
        <span key={char + i} className={`${letterClass} _${i + idx}`}>
          {char}
        </span>
      ))}
    </span>
  )
}

export default AnimatedLetters
