# Design Verification Lab Website

## Data
* Frontend data are in `src/config/frontend.json`.
* Beckend data in MongoDB

## Structure

```
src
├── App.js
├── App.scss
├── components
│   ├── About
│   │   ├── Gallery
│   │   ├── Slide
│   ├── AnimatedLetters
│   ├── Courses
│   │   ├── Course
│   ├── Footer
│   ├── Home
│   │   ├── Logo
│   │   ├── NewsAwards
│   │   │   ├── Item
│   ├── HostProfile
│   ├── Members
│   │   ├── Group
│   │   ├── MemBio
│   │   ├── Member
│   ├── NavBar
│   └── Publications
│       ├── Pub
├── config.json
├── index.js
├── index.scss
└── logo.png
server
├── models
│   ├── course.js
│   ├── maintainer.js
│   ├── member.js
│   ├── newsAward.js
│   ├── maintainer.js
│   ├── publication.js
├── routes
│   ├── index.js
│   ├── course.js
│   ├── maintainer.js
│   ├── member.js
│   ├── newsAward.js
│   ├── maintainer.js
│   ├── publication.js
└── server.js
```
