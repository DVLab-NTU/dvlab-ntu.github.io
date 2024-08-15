// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ index.js ]
// * PackageName  [ src/components/Publications/Pub ]
// * Synopsis     [ Implement Pub in "Publications" page ]
// * Author       [ Cheng-Hua Lu ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import './index.scss'
import React from 'react'

const Pub = ({ pub_info }) => {
    // * Pub: Implement Pub in "Publications" page.
    // @param imgExist    bool       If true, show image in Pub
    //        linkExist   bool       If true, show "learn more" in Pub
    const imgExist = pub_info.IMG !== ''
    const linkExist = pub_info.LINK !== ''
    return (
        <div className="pub-container">
            <div className="wrapper">
                <div
                    className="img-block"
                    style={imgExist ? { width: '30%' } : { width: '0%', display: 'none' }}
                >
                    <img src={pub_info.IMG} />
                </div>

                <div
                    className="text-block"
                    style={imgExist ? { width: '65%' } : { width: '97%' }}
                >
                    <h2>{pub_info.TITLE}</h2>
                    <div className="author-list">
                        {pub_info.AUTHOR.map((name, idx) => (
                            <span>
                                {name}
                                {idx !== pub_info.AUTHOR.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </div>
                    <div className="date">{pub_info.DATE}</div>
                    <div className="abstract">{pub_info.ABSTRACT}</div>
                    <div className="keywords-list">
                        {pub_info.KEYWORDS.map((keyword) => (
                            <div className="keyword">#{keyword}</div>
                        ))}
                    </div>
                    <div
                        className="link-button"
                        style={linkExist ? {} : { display: 'none' }}
                    >
                        <a href={pub_info.LINK} target="_blank">
                            {' '}
                            Learn More {'>> '}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pub
