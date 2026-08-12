// UI copy for the static DV Lab site.
// `en` is the default locale; `zh` is Traditional Chinese.
// Data-level content (courses, awards, members) carries its own bilingual fields.
const translations = {
  en: {
    nav: {
      about: 'About DV Lab',
      host: 'Host Profile',
      publications: 'Publications',
      members: 'Members',
      courses: 'Courses',
      switchTo: '中文',
      switchLabel: 'Switch language',
    },
    home: {
      awardsTitle: 'AWARDS',
    },
    footer: {
      copyright: '© 2026 DV Lab, NTUEE. All rights reserved.',
      thanks: 'We thank',
      and: 'and',
      forMaintaining: 'for creating and maintaining the DV Lab official website.',
      linksTitle: 'Links',
      githubOrg: 'DVLab GitHub Organization',
      contact: 'Contact',
    },
    about: {
      title: 'About DV Lab',
      subtitle: 'Exploring the beauty of the unknown and making the known useful',
      description: [
        'In DVLab, we are committed to resolving the verification bottlenecks and building an open-source verification framework for the system-level designs. We believe "automatic abstraction" is the key, where the extracted design features can efficiently reduce the problem complexity, and "intelligent refinement" is the fuel, in which the essential design intents are learned to ensure the success of verification.',
        'We are also curious on how quantum techniques may evolve into the new computing paradigm. Expanding upon our expertise on formal verification, we are on the way to reveal the secret of how quantum algorithms can be realized and optimized on practical quantum devices. This is a research area where the wonderful math, physics, and engineering knowledges meet, and we are thrilled to be part of this exciting journey.',
      ],
      culture: [
        'We research because we are curious',
        'We publish because we love to share',
        'We exercise because we work too hard',
      ],
    },
    host: {
      title: 'Professor Chung-Yang (Ric) Huang',
      header: 'Think Rationally, and Trust Your Intuition.',
      shortBio: [
        'Professor Chung-Yang (Ric) Huang received his B.S. degree from Department of Electrical Engineering, National Taiwan University (NTUEE), in 1992. He obtained his PhD from Department of Electrical and Computer Engineering, University of California at Santa Barbara, in 2000. Before joining NTUEE as an assistant professor in 2004, he was with Cadence Design Systems, where he served as a senior R&D manager and was in charge of the core engine development of their functional verification tools.',
        'Professor Huang\u2019s research interests include (1) design verification for SoCs, (2) quantum circuit optimization, (3) automatic testing and test generation for web services, and (4) entrepreneurship education.',
        'For those new and prospective graduate students looking for an advisor, or undergraduate students who are interested in research projects, please refer to the information in this web site. You are also very welcome to talk to Professor Huang for more details.',
        'ps. Welcome to connect with me on cyberspace. However, please drop me a note about who you are, or your invitation may not be acknowledged.',
      ],
    },
    members: {
      title: 'Members',
      currentStudents: 'Current Students',
      graduates: 'Graduates',
      shortBio: 'Short Bio',
      fieldsOfInterest: 'Fields of Interest',
      education: 'Education',
      publications: 'Publications',
      backToMembers: 'Back to Members',
    },
    courses: {
      title: 'Courses',
      semester: 'Semester',
      githubRepo: 'GitHub Repo',
      showMore: 'Show More',
      showLess: 'Show Less',
      learnMore: 'Learn More >>',
    },
    publications: {
      title: 'Publications',
      learnMore: 'Learn More >>',
    },
    awards: {
      students: 'Students: ',
      advisors: 'Advisors: ',
      source: 'Source',
    },
  },
  zh: {
    nav: {
      about: '關於 DV Lab',
      host: '主持人簡介',
      publications: '研究成果',
      members: '成員',
      courses: '課程',
      switchTo: 'English',
      switchLabel: '切換語言',
    },
    home: {
      awardsTitle: '獲獎紀錄',
    },
    footer: {
      copyright: '© 2026 DV Lab, 台大電機系。版權所有。',
      thanks: '我們感謝',
      and: '與',
      forMaintaining: '建立並維護 DV Lab 官方網站。',
      linksTitle: '相關連結',
      githubOrg: 'DVLab GitHub 組織',
      contact: '聯絡我們',
    },
    about: {
      title: '關於 DV Lab',
      subtitle: '探索未知之美，讓已知更有用',
      description: [
        '在 DVLab，我們致力於解決驗證瓶頸，並為系統層級設計建立開源驗證框架。我們相信「自動抽象化」是關鍵——藉由擷取設計特徵，可有效降低問題複雜度；而「智慧精煉」則是引擎，透過學習關鍵的設計意圖，確保驗證成功。',
        '我們也好奇量子技術將如何演變為新的運算典範。基於我們在形式化驗證上的專長，我們正在揭開量子演算法如何在實際量子裝置上實現與最佳化的秘密。這是一個數學、物理與工程知識交會的研究領域，我們很榮幸能參與這趟令人興奮的旅程。',
      ],
      culture: [
        '我們研究，因為我們好奇',
        '我們發表，因為我們樂於分享',
        '我們運動，因為我們工作太努力',
      ],
    },
    host: {
      title: '黃鐘揚教授',
      header: '理性思考，相信直覺。',
      shortBio: [
        '黃鐘揚教授於 1992 年取得國立臺灣大學電機工程學系學士學位，2000 年於加州大學聖塔芭芭拉分校取得電機與電腦工程博士學位。2004 年加入台大電機系擔任助理教授之前，他曾任職於 Cadence Design Systems，擔任資深研發經理，負責其功能驗證工具的核心引擎開發。',
        '黃教授的研究興趣包括：(1) SoC 設計驗證、(2) 量子電路最佳化、(3) 網路服務之自動化測試與測試產生，以及 (4) 創業教育。',
        '對於想找指導教授的新生或準研究生，或是對研究專題有興趣的大學生，歡迎參考本網站資訊，也歡迎直接與黃教授洽談細節。',
        '備註：歡迎在網路上與我聯繫，但請先告訴我你是誰，否則您的邀請可能不會被接受。',
      ],
    },
    members: {
      title: '成員',
      currentStudents: '在校學生',
      graduates: '畢業校友',
      shortBio: '個人簡介',
      fieldsOfInterest: '研究興趣',
      education: '學歷',
      publications: '發表著作',
      backToMembers: '回到成員列表',
    },
    courses: {
      title: '課程',
      semester: '學期',
      githubRepo: 'GitHub 連結',
      showMore: '展開',
      showLess: '收合',
      learnMore: '了解更多 >>',
    },
    publications: {
      title: '研究成果',
      learnMore: '了解更多 >>',
    },
    awards: {
      students: '學生：',
      advisors: '指導教授：',
      source: '來源',
    },
  },
}

export default translations
