// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ index.js ]
// * PackageName  [ src/components/Publications ]
// * Synopsis     [ Implement "Publications" page ]
// * Author       [ Cheng-Hua Lu (Front), Chin-Yi Cheng (Back) ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import './index.scss'
import Pub from './Pub'
import Loader from 'react-loaders'
import frontendData from '../../config/frontend.json'
import AnimatedLetters from '../AnimatedLetters'
import React, { useState, useEffect } from 'react'
import { useSpring, animated, config } from 'react-spring'

import instance from '../../axiosInstance'

const Publications = () => {
    // * Publications: Implement "Publications" page, it contains Pub.
    // @param props:          useSpring   the animation for animated.div
    //        letterClass     String      the animation for title
    const [publications, setPublications] = useState([])     // to store 
    const [letterClass, setLetterClass] = useState('text-animate')
    const props = useSpring({
        to: { opacity: 1 },
        from: { opacity: 0 },
        reset: false,
        delay: 2000,
        config: config.molasses,
    })
    const getPublications = async () => {
        // get Bios from backend
        const back = await instance.get('/getPublications')
        const publication = back.data.contents
        setPublications(publication)
    }
    // * Scroll to top of the page when rendering
    useEffect(() => {
        if (publications.length === 0)
            getPublications()
        window.scrollTo(0, 0)
    }, [])

    return (
        <>
            <div className="publications-container">
                <div className="wrapper">
                    <div className="title">
                        <h1>
                            <AnimatedLetters
                                letterClass={letterClass}
                                strArray={frontendData.PUBLICATIONS_PAGE.TITLE.split('')}
                                idx={20}
                            />
                        </h1>
                    </div>
                    <animated.div className="pub-list" style={props}>
                        {publications.length !== 0 ?
                            <>
                                {publications.map((pub) => (
                                    <Pub pub_info={pub} />
                                ))}
                            </>
                            : <Loader type="line-scale" />}
                    </animated.div>
                </div>
            </div>
            <Loader type="line-scale" />
        </>
    )
}

export default Publications
