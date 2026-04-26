// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-首页",
    title: "首页",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-recruiting",
          title: "recruiting",
          description: "2027 admissions information for SOARLAB.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/en/recruiting/";
          },
        },{id: "nav-招生",
          title: "招生",
          description: "SOARLAB 2027 届招生信息。",
          section: "Navigation",
          handler: () => {
            window.location.href = "/recruiting/";
          },
        },{id: "nav-research",
          title: "research",
          description: "Research directions and platforms of SOARLAB.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/en/research/";
          },
        },{id: "nav-研究",
          title: "研究",
          description: "SOARLAB 研究方向与平台。",
          section: "Navigation",
          handler: () => {
            window.location.href = "/research/";
          },
        },{id: "nav-publications",
          title: "publications",
          description: "Selected publications by Hao Xu and collaborators.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/en/publications/";
          },
        },{id: "nav-论文",
          title: "论文",
          description: "徐浩老师与合作者的代表论文。",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-open-source",
          title: "open source",
          description: "Open-source projects, paper code, and research tools from SOARLAB.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/en/open-source/";
          },
        },{id: "nav-开源",
          title: "开源",
          description: "SOARLAB 的开源项目、论文代码和研究工具。",
          section: "Navigation",
          handler: () => {
            window.location.href = "/open-source/";
          },
        },{id: "nav-people",
          title: "people",
          description: "SOARLAB members.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/en/people/";
          },
        },{id: "nav-成员",
          title: "成员",
          description: "SOARLAB 团队成员。",
          section: "Navigation",
          handler: () => {
            window.location.href = "/people/";
          },
        },{id: "nav-news",
          title: "news",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/en/news/";
          },
        },{id: "nav-新闻",
          title: "新闻",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/news/";
          },
        },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-soarlab-飞行通用智能课题组-即将在南京大学智能科学与技术学院开展工作-面向-2027-届招收直博生-普博生和硕士研究生",
          title: 'SOARLAB（飞行通用智能课题组）即将在南京大学智能科学与技术学院开展工作，面向 2027 届招收直博生、普博生和硕士研究生。',
          description: "",
          section: "News",},{id: "news-2027-招生方向",
          title: '2027 招生方向',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_2/";
            },},{id: "news-早期成员将参与课题组基础设施建设-包括计算服务器-实验场地-无人机与机器人验证平台",
          title: '早期成员将参与课题组基础设施建设，包括计算服务器、实验场地、无人机与机器人验证平台。',
          description: "",
          section: "News",},{id: "projects-aerial-swarm-and-distributed-slam",
          title: 'Aerial Swarm and Distributed SLAM',
          description: "Distributed perception, state estimation, SLAM, and autonomous swarm systems.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/aerial-swarm-slam/";
            },},{id: "projects-robotics-agent",
          title: 'Robotics Agent',
          description: "Agent-oriented perception, world models, planning, control, and simulation.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/robotics-agent/";
            },},{id: "projects-wam-vla-robot-foundation-models",
          title: 'WAM/VLA Robot Foundation Models',
          description: "World-action and vision-language-action models for real robots.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/wam-vla/";
            },},{id: "teachings-data-science-fundamentals",
          title: 'Data Science Fundamentals',
          description: "This course covers the foundational aspects of data science, including data collection, cleaning, analysis, and visualization. Students will learn practical skills for working with real-world datasets.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/data-science-fundamentals/";
            },},{id: "teachings-introduction-to-machine-learning",
          title: 'Introduction to Machine Learning',
          description: "This course provides an introduction to machine learning concepts, algorithms, and applications. Students will learn about supervised and unsupervised learning, model evaluation, and practical implementations.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/introduction-to-machine-learning/";
            },},{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/xuhao1", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=XF_6HvcAAAAJ", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
