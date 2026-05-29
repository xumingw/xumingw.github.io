/* ============================================================
   SITE DATA - single source of truth for the personal homepage.
   ============================================================ */
window.SITE_DATA = {
  profile: {
    name: "Mingwang Xu",
    role: "PhD Student in Computer Science",
    affiliation: "Fudan University",
    advisor: "Advisor: Prof. Siyu Zhu",
    location: "Shanghai, China",
    email: "mwxu25@m.fudan.edu.cn",
    photo: "avatar-square.jpeg",
    tagline: "I work on vision-language-action models and video generation.",
    about: [
      "I am a PhD student in Computer Science at Fudan University, advised by Prof. Siyu Zhu. My research centers on vision-language-action models and video generation.",
      "Before joining the PhD program, I worked on video generation models as a research assistant at Fudan University. My recent work includes WAM-Diff, currently under review, OpenHumanVid, accepted to CVPR 2025, and Hallo4, accepted to SIGGRAPH Asia 2025.",
      "I also release code for my research papers when possible. The open-source release of Hallo has received 8.6k GitHub stars."
    ],
    interests: ["Vision-Language-Action Models", "Video Generation"]
  },

  social: [
    { label: "Email", href: "mailto:mwxu25@m.fudan.edu.cn" },
    { label: "Google Scholar", href: "https://scholar.google.com/citations?user=j4xiRjIAAAAJ&hl=en" },
    { label: "GitHub", href: "https://github.com/xumingw" }
  ],

  topics: ["Video Generation", "Portrait Animation", "Autonomous Driving", "Datasets", "Medical AI"],

  publications: [
    {
      id: "wam-flow",
      title: "WAM-Flow: Parallel Coarse-to-Fine Motion Planning via Discrete Flow Matching for Autonomous Driving",
      scholarTitle: "WAM-Flow: Parallel Coarse-to-Fine Motion Planning via Discrete Flow Matching for Autonomous Driving",
      githubRepo: "fudan-generative-vision/WAM-Flow",
      authors: ["Yifang Xu", "Jiahao Cui", "Feipeng Cai", "Zhihao Zhu", "Hanlin Shang", "Shan Luan", "Mingwang Xu", "Neng Zhang", "Yaoyi Li", "Jia Cai", "Siyu Zhu"],
      venue: "CVPR",
      year: 2026,
      topics: ["Autonomous Driving"],
      award: "CCF-A",
      selected: true,
      links: { arxiv: "https://arxiv.org/abs/2512.06112", code: "https://github.com/fudan-generative-vision/WAM-Flow" }
    },
    {
      id: "wam-diff",
      title: "WAM-Diff: A Masked Diffusion VLA Framework with MoE and Online Reinforcement Learning for Autonomous Driving",
      scholarTitle: "WAM-Diff: A Masked Diffusion VLA Framework with MoE and Online Reinforcement Learning for Autonomous Driving",
      githubRepo: "fudan-generative-vision/WAM-Diff",
      authors: ["Mingwang Xu", "Jiahao Cui", "Feipeng Cai", "Hanlin Shang", "Zhihao Zhu", "Shan Luan", "Yifang Xu", "Neng Zhang", "Yaoyi Li", "Jia Cai", "Siyu Zhu"],
      venue: "Under Review",
      year: 2025,
      topics: ["Autonomous Driving"],
      selected: true,
      links: { arxiv: "https://arxiv.org/abs/2512.11872", code: "https://github.com/fudan-generative-vision/WAM-Diff" }
    },
    {
      id: "hallo4",
      title: "Hallo4: High-Fidelity Dynamic Portrait Animation via Direct Preference Optimization",
      scholarTitle: "Hallo4: High-Fidelity Dynamic Portrait Animation via Direct Preference Optimization",
      scholarAliases: ["Hallo4: High-Fidelity Dynamic Portrait Animation via Direct Preference Optimization and Temporal Motion Modulation"],
      githubRepo: "fudan-generative-vision/hallo4",
      authors: ["Jiahao Cui", "Yan Chen", "Mingwang Xu", "Hanlin Shang", "Yuxuan Chen", "Yun Zhan", "Zilong Dong", "Yao Yao", "Jingdong Wang", "Siyu Zhu"],
      equalContribution: 3,
      venue: "SIGGRAPH Asia",
      year: 2025,
      topics: ["Portrait Animation", "Video Generation"],
      award: "CCF-A",
      selected: true,
      links: { arxiv: "https://arxiv.org/abs/2505.23525", code: "https://github.com/fudan-generative-vision/hallo4" }
    },
    {
      id: "openhumanvid",
      title: "OpenHumanVid: A Large-Scale High-Quality Dataset for Enhancing Human-Centric Video Generation",
      scholarTitle: "OpenHumanVid: A Large-Scale High-Quality Dataset for Enhancing Human-Centric Video Generation",
      authors: ["Hui Li", "Mingwang Xu", "Yun Zhan", "Shan Mu", "Jiaye Li", "Kaihui Cheng", "Yuxuan Chen", "Tan Chen", "Mao Ye", "Jingdong Wang", "Siyu Zhu"],
      equalContribution: 2,
      venue: "CVPR",
      year: 2025,
      topics: ["Datasets", "Video Generation"],
      award: "CCF-A",
      selected: true,
      links: { arxiv: "https://arxiv.org/abs/2412.00115", project: "https://fudan-generative-vision.github.io/OpenHumanVid/" }
    },
    {
      id: "tdsc-abus",
      title: "Tumor Detection, Segmentation and Classification Challenge on Automated 3D Breast Ultrasound: The TDSC-ABUS Challenge",
      scholarTitle: "Tumor Detection, Segmentation and Classification Challenge on Automated 3D Breast Ultrasound: The TDSC-ABUS Challenge",
      authors: ["Gongning Luo", "Mingwang Xu", "Hongyu Chen", "Xinjie Liang", "Xing Tao", "Dong Ni", "et al."],
      venue: "arXiv",
      year: 2025,
      topics: ["Medical AI", "Datasets"],
      selected: false,
      links: { arxiv: "https://arxiv.org/abs/2501.15588", project: "https://tdsc-abus2023.grand-challenge.org/" }
    },
    {
      id: "graph-rls-abus",
      title: "Graph Regularized Least Squares Regression for Automated Breast Ultrasound Imaging",
      scholarTitle: "Graph regularized least squares regression for automated breast ultrasound imaging",
      authors: ["Yue Zhou", "Meng Zhang", "Yong Pan", "Shuang Cai", "Aihua Wu", "Xueqi Shu", "Mingwang Xu", "Xiaoying Yin", "Guangming Zhang", "et al."],
      venue: "Neurocomputing",
      year: 2025,
      topics: ["Medical AI"],
      selected: false,
      links: { }
    },
    {
      id: "hallo",
      title: "Hallo: Hierarchical Audio-Driven Visual Synthesis for Portrait Image Animation",
      scholarTitle: "Hallo: Hierarchical Audio-Driven Visual Synthesis for Portrait Image Animation",
      githubRepo: "fudan-generative-vision/hallo",
      authors: ["Mingwang Xu", "Hui Li", "Qingkun Su", "Hanlin Shang", "Liwei Zhang", "Ce Liu", "Jingdong Wang", "Yao Yao", "Siyu Zhu"],
      venue: "arXiv",
      year: 2024,
      topics: ["Portrait Animation", "Video Generation"],
      award: "GitHub 8.6k Stars",
      selected: true,
      links: { arxiv: "https://arxiv.org/abs/2406.08801", code: "https://github.com/fudan-generative-vision/hallo", project: "https://fudan-generative-vision.github.io/hallo/" }
    },
    {
      id: "dual-capsvit",
      title: "Vision Transformers(ViT) Pretraining on 3D ABUS Image and Dual-CapsViT: Enhancing ViT Decoding via Dual-Channel Dynamic Routing",
      scholarTitle: "Vision Transformers(ViT) Pretraining on 3D ABUS Image and Dual-CapsViT: Enhancing ViT Decoding via Dual-Channel Dynamic Routing",
      authors: ["Mingwang Xu", "Wei Wang", "Kuanquan Wang", "Suyu Dong", "Pengzhong Sun", "Jinwei Sun", "Gongning Luo"],
      venue: "IEEE BIBM",
      year: 2023,
      topics: ["Medical AI"],
      award: "CCF-B",
      selected: false,
      links: { }
    }
  ],

  awards: [
    { year: "Fudan", title: "Open Source Pioneer Award", note: "Fudan University" },
    { year: "Fudan", title: "First-Class Scholarship", note: "Fudan University" },
    { year: "HIT", title: "First-Class Scholarship", note: "Harbin Institute of Technology" },
    { year: "HIT", title: "Outstanding Student", note: "Harbin Institute of Technology" },
    { year: "CQU", title: "Outstanding Award, Student Research Training Program", note: "Chongqing University" },
    { year: "CQU", title: "Outstanding Social Practice Award", note: "Chongqing University" }
  ],

  education: [
    { period: "2025.09 - Present", title: "PhD in Computer Science", org: "Fudan University", note: "Research on generative models and multimodal intelligence" },
    { period: "2021.05 - 2023.06", title: "M.S. in Software Engineering", org: "Harbin Institute of Technology", note: "Medical image analysis and computer vision" },
    { period: "2014.09 - 2018.06", title: "B.Eng. in Electrical Engineering and Automation", org: "Chongqing University", note: "Electrical engineering, automation, and control systems" }
  ],

  experience: [
    { period: "2025.09 - Present", title: "Internship", org: "Huawei Yinwang", note: "Working on VLA for autonomous driving" },
    { period: "2024.03 - 2025.09", title: "Research Assistant", org: "Fudan University", note: "Worked on video generation models" },
    { period: "2018.07 - 2019.05", title: "Electrical Engineer", org: "NR Electric Co., Ltd.", note: "Engineering work in power and electrical systems" }
  ]
};
