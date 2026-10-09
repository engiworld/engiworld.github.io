window.ENGIWORLD_SCOPE = {
  "benchmark": {
    "total": 1301,
    "cli": 691,
    "gui": 610,
    "domains": [
      "CAD",
      "CAE",
      "CAM",
      "BIM",
      "EDA",
      "DCC"
    ],
    "software": 26
  },
  "evaluation": {
    "total": 306,
    "cli": 158,
    "gui": 148,
    "non_open_strata": 72,
    "categories": {
      "image": 36,
      "multi": 24,
      "selection": 28,
      "quantitative": 33,
      "single": 175,
      "open": 10
    }
  },
  "task_types": [
    {
      "key": "single",
      "name": "Single-Software Execution",
      "short": "Single",
      "total": 931,
      "evaluation_count": 175,
      "description": "Model, modify, or simulate an artifact in one designated application."
    },
    {
      "key": "selection",
      "name": "Software Selection",
      "short": "Select.",
      "total": 140,
      "evaluation_count": 28,
      "description": "Choose suitable software from a permitted set and complete the task."
    },
    {
      "key": "image",
      "name": "Vision-Guided Modeling",
      "short": "Vision",
      "total": 120,
      "evaluation_count": 36,
      "description": "Build engineering models from reference drawings and visual requirements."
    },
    {
      "key": "quantitative",
      "name": "Design Optimization",
      "short": "Optim.",
      "total": 40,
      "evaluation_count": 33,
      "description": "Optimize design quality while satisfying engineering feasibility constraints."
    },
    {
      "key": "multi",
      "name": "Cross-Software Coordination",
      "short": "Cross",
      "total": 60,
      "evaluation_count": 24,
      "description": "Carry out workflows that pass dependent artifacts across applications."
    },
    {
      "key": "open",
      "name": "Open-Environment Engineering",
      "short": "Open",
      "total": 10,
      "evaluation_count": 10,
      "description": "Choose and install software in a blank environment, then solve the engineering problem end to end."
    }
  ]
};
