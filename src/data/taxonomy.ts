import type { DomainInfo } from '../types'

export const domains: DomainInfo[] = [
  {
    id: 'cuas',
    name: 'cUAS / Counter-Drone',
    description: 'Systems and technologies for detecting, tracking, identifying, and defeating unmanned aerial threats.',
    icon: 'Shield',
    subcategories: [
      'Detection & Tracking (radar, RF, EO/IR, acoustic)',
      'Electronic Defeat (jamming, spoofing, protocol exploitation)',
      'Kinetic Defeat (directed energy, projectile, net/capture)',
      'C2 Integration (COP fusion, engagement authority automation)',
      'Counter-Swarm (multi-target engagement, AI-prioritization)',
      'Mobile/Expeditionary (man-portable, vehicle-mounted, shipboard)',
    ],
  },
  {
    id: 'cyber',
    name: 'Cyber / Zero Trust',
    description: 'Cybersecurity solutions spanning zero-trust architecture, threat detection, offensive tools, and OT/ICS security.',
    icon: 'Lock',
    subcategories: [
      'Zero Trust Architecture (micro-segmentation, identity, SDP)',
      'Threat Detection & Hunting (SIEM/SOAR, NDR, EDR, AI-powered)',
      'Offensive Cyber Tools (pen testing, red team, exploit development)',
      'Vulnerability Management (scanning, prioritization, remediation)',
      'Secure Communications (E2EE, quantum-resistant, DDIL-capable)',
      'OT/ICS Security (SCADA, industrial control, critical infrastructure)',
      'Cyber Resilience (scoring, simulation, recovery automation)',
    ],
  },
  {
    id: 'aiml',
    name: 'AI/ML Solutions',
    description: 'Artificial intelligence and machine learning solutions for defense applications from edge inference to decision support.',
    icon: 'Brain',
    subcategories: [
      'Computer Vision (object detection, classification, tracking)',
      'Natural Language Processing (entity extraction, translation, summarization)',
      'Edge Inference (on-device ML, compressed models, SWAP-C optimized)',
      'Predictive Analytics (maintenance, logistics, threat forecasting)',
      'Decision Support (COA analysis, wargaming, resource optimization)',
      'Responsible AI (bias detection, explainability, test & evaluation)',
      'Generative AI (content generation, synthetic data, simulation)',
    ],
  },
  {
    id: 'autonomy',
    name: 'Autonomy & Robotics',
    description: 'Unmanned systems, autonomous platforms, and robotic solutions across air, ground, and maritime domains.',
    icon: 'Bot',
    subcategories: [
      'Unmanned Aerial Systems (ISR, delivery, swarm)',
      'Unmanned Ground Vehicles (logistics, EOD, reconnaissance)',
      'Unmanned Maritime Systems (surface, subsurface, mine countermeasures)',
      'Autonomous Navigation (GPS-denied, multi-domain, obstacle avoidance)',
      'Human-Machine Teaming (interface, trust calibration, handoff protocols)',
      'Swarm Intelligence (coordination, task allocation, resilience)',
      'Robotic Process Automation (logistics, maintenance, mission planning)',
    ],
  },
]
