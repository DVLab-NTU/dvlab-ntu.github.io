// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ index.js ]
// * PackageName  [ src/components/Home ]
// * Synopsis     [ Implement "Home" page ]
// * Author       [ Cheng-Hua Lu ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import './index.scss'
import Logo from './Logo'
import Loader from 'react-loaders'
import NewsAwards from './NewsAwards'
import React, { useEffect } from 'react'
import Particles from 'react-tsparticles'
import frontendData from '../../config/frontend.json'
import { useSpring, animated, config } from 'react-spring'

const Home = () => {
  // * Home: Implement "Home" page, it contains Logo and NewsAwards
  // @param props:    useSpring   The animation for animated.div

  const props = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    reset: false,
    delay: 2000,
    config: config.molasses,
  })
  

  // * Scroll to top of the page when rendering
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <div className="home-container">
        <div className="wrapper">
          <Particles
            id="tsparticles"
            options={{
              fpsLimit: 600,
              interactivity: {
                events: {
                  onClick: { enable: true, mode: 'push' },
                  onHover: { enable: true, mode: 'repulse' },
                  resize: true,
                },
                modes: {
                  bubble: {
                    distance: 100,
                    duration: 2,
                    opacity: 0.8,
                    size: 40,
                  },
                  push: { quantity: 4 },
                  repulse: { distance: 200, duration: 0.4 },
                },
              },
              particles: {
                color: { value: '#fcffcc' },
                links: {
                  color: '#fcffcc',
                  distance: 150,
                  enable: true,
                  opacity: 0.1,
                  width: 0.5,
                },
                collisions: { enable: true },
                move: {
                  direction: 'none',
                  enable: true,
                  outMode: 'bounce',
                  random: true,
                  speed: 0.5,
                  straight: false,
                },
                number: {
                  density: { enable: true, area: 800 },
                  value: 80,
                },
                opacity: { value: 0.5 },
                shape: { type: 'square' },
                size: { random: true, value: 3 },
              },
              detectRetina: true,
            }}
          />
        </div>

        <animated.div style={props}>
          <Logo img_path={frontendData.LOGO} />
          <NewsAwards />
        </animated.div>
      </div>
      <Loader type="line-scale" />
    </>
  )
}

export default Home
