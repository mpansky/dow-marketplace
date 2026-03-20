import type { PipelineEntry } from '../types'

export const pipelineEntries: PipelineEntry[] = [
  // ch-indo-1: cUAS - awarded, in performance period
  {
    id: 'pipe-001',
    challengeId: 'ch-indo-1',
    vendorId: 'anduril',
    stage: 'performance_period',
    enteredStageAt: '2026-01-15T09:00:00Z',
    daysInStage: 22,
    awardValue: 4800000,
    healthStatus: 'green',
  },
  // ch-indo-1: another vendor at OT award stage
  {
    id: 'pipe-002',
    challengeId: 'ch-indo-1',
    vendorId: 'epirus',
    stage: 'ot_award',
    enteredStageAt: '2026-01-28T10:00:00Z',
    daysInStage: 9,
    awardValue: 3200000,
    healthStatus: 'green',
  },
  // ch-indo-2: autonomous ISR - at prototype demo
  {
    id: 'pipe-003',
    challengeId: 'ch-indo-2',
    vendorId: 'shield-ai',
    stage: 'prototype_demo',
    enteredStageAt: '2026-01-20T08:00:00Z',
    daysInStage: 17,
    awardValue: 5500000,
    healthStatus: 'green',
  },
  // ch-indo-3: maritime surveillance - at shortlist
  {
    id: 'pipe-004',
    challengeId: 'ch-indo-3',
    vendorId: 'saildrone',
    stage: 'shortlist',
    enteredStageAt: '2026-02-01T09:00:00Z',
    daysInStage: 5,
    healthStatus: 'green',
  },
  {
    id: 'pipe-005',
    challengeId: 'ch-indo-3',
    vendorId: 'saronic',
    stage: 'evaluation',
    enteredStageAt: '2026-01-10T10:00:00Z',
    daysInStage: 27,
    healthStatus: 'yellow',
  },
  // ch-indo-4: expeditionary strike/ISR - evaluation
  {
    id: 'pipe-006',
    challengeId: 'ch-indo-4',
    stage: 'evaluation',
    enteredStageAt: '2026-01-25T08:00:00Z',
    daysInStage: 12,
    healthStatus: 'green',
  },
  // ch-indo-5: data fusion - awarded
  {
    id: 'pipe-007',
    challengeId: 'ch-indo-5',
    vendorId: 'palantir',
    stage: 'performance_period',
    enteredStageAt: '2026-01-05T09:00:00Z',
    daysInStage: 30,
    awardValue: 12500000,
    healthStatus: 'green',
  },
  // ch-indo-6: edge AI - at shortlist
  {
    id: 'pipe-008',
    challengeId: 'ch-indo-6',
    vendorId: 'latent-ai',
    stage: 'shortlist',
    enteredStageAt: '2026-02-03T10:00:00Z',
    daysInStage: 3,
    healthStatus: 'green',
  },
  // ch-indo-7: RF geolocation - in performance period
  {
    id: 'pipe-009',
    challengeId: 'ch-indo-7',
    vendorId: 'hawkeye360',
    stage: 'performance_period',
    enteredStageAt: '2026-01-10T08:00:00Z',
    daysInStage: 27,
    awardValue: 3500000,
    healthStatus: 'green',
  },
  // ch-indo-8: infrastructure inspection - submissions open
  {
    id: 'pipe-010',
    challengeId: 'ch-indo-8',
    stage: 'submissions_open',
    enteredStageAt: '2026-01-30T09:00:00Z',
    daysInStage: 7,
    healthStatus: 'green',
  },
  // ch-indo-9: logistics delivery - market scan
  {
    id: 'pipe-011',
    challengeId: 'ch-indo-9',
    stage: 'market_scan',
    enteredStageAt: '2026-02-01T10:00:00Z',
    daysInStage: 5,
    healthStatus: 'green',
  },
  // ch-indo-10: OSINT - at shortlist
  {
    id: 'pipe-012',
    challengeId: 'ch-indo-10',
    vendorId: 'vannevar',
    stage: 'shortlist',
    enteredStageAt: '2026-01-22T08:00:00Z',
    daysInStage: 15,
    healthStatus: 'yellow',
  },
  // ch-indo-11: multi-domain surveillance - submissions open
  {
    id: 'pipe-013',
    challengeId: 'ch-indo-11',
    stage: 'submissions_open',
    enteredStageAt: '2026-02-04T09:00:00Z',
    daysInStage: 2,
    healthStatus: 'green',
  },
  // ch-cyber-1: data-centric security - performance period
  {
    id: 'pipe-014',
    challengeId: 'ch-cyber-1',
    vendorId: 'virtru',
    stage: 'performance_period',
    enteredStageAt: '2026-01-02T09:00:00Z',
    daysInStage: 30,
    awardValue: 1500000,
    healthStatus: 'green',
  },
  // ch-cyber-2: microsegmentation - prototype demo
  {
    id: 'pipe-015',
    challengeId: 'ch-cyber-2',
    vendorId: 'illumio',
    stage: 'prototype_demo',
    enteredStageAt: '2026-01-18T10:00:00Z',
    daysInStage: 19,
    awardValue: 2200000,
    healthStatus: 'green',
  },
  {
    id: 'pipe-016',
    challengeId: 'ch-cyber-2',
    vendorId: 'zscaler',
    stage: 'evaluation',
    enteredStageAt: '2026-01-15T08:00:00Z',
    daysInStage: 22,
    healthStatus: 'yellow',
  },
  // ch-cyber-3: endpoint protection - awarded
  {
    id: 'pipe-017',
    challengeId: 'ch-cyber-3',
    vendorId: 'crowdstrike',
    stage: 'ot_award',
    enteredStageAt: '2026-02-01T09:00:00Z',
    daysInStage: 5,
    awardValue: 3500000,
    healthStatus: 'green',
  },
  {
    id: 'pipe-018',
    challengeId: 'ch-cyber-3',
    vendorId: 'sentinelone',
    stage: 'prototype_demo',
    enteredStageAt: '2026-01-20T10:00:00Z',
    daysInStage: 17,
    awardValue: 2800000,
    healthStatus: 'green',
  },
  // ch-cyber-4: OT/ICS security - evaluation
  {
    id: 'pipe-019',
    challengeId: 'ch-cyber-4',
    vendorId: 'dragos',
    stage: 'evaluation',
    enteredStageAt: '2026-01-28T09:00:00Z',
    daysInStage: 9,
    healthStatus: 'green',
  },
  // ch-cyber-5: cloud security - submissions open
  {
    id: 'pipe-020',
    challengeId: 'ch-cyber-5',
    stage: 'submissions_open',
    enteredStageAt: '2026-02-02T08:00:00Z',
    daysInStage: 4,
    healthStatus: 'green',
  },
  // ch-cyber-6: OT zero trust - shortlist
  {
    id: 'pipe-021',
    challengeId: 'ch-cyber-6',
    vendorId: 'xage',
    stage: 'shortlist',
    enteredStageAt: '2026-01-25T10:00:00Z',
    daysInStage: 12,
    healthStatus: 'green',
  },
  // ch-cyber-7: threat intel - performance period
  {
    id: 'pipe-022',
    challengeId: 'ch-cyber-7',
    vendorId: 'recorded-future',
    stage: 'performance_period',
    enteredStageAt: '2026-01-08T09:00:00Z',
    daysInStage: 29,
    awardValue: 2500000,
    healthStatus: 'green',
  },
  // ch-cyber-8: air-gapped DevSecOps - prototype demo
  {
    id: 'pipe-023',
    challengeId: 'ch-cyber-8',
    vendorId: 'defense-unicorns',
    stage: 'prototype_demo',
    enteredStageAt: '2026-01-22T08:00:00Z',
    daysInStage: 15,
    awardValue: 1600000,
    healthStatus: 'green',
  },
  // ch-cyber-9: predictive maintenance AI - evaluation, slow progress
  {
    id: 'pipe-024',
    challengeId: 'ch-cyber-9',
    stage: 'evaluation',
    enteredStageAt: '2025-12-20T09:00:00Z',
    daysInStage: 28,
    healthStatus: 'red',
  },
  // ch-cyber-10: MLOps - market scan
  {
    id: 'pipe-025',
    challengeId: 'ch-cyber-10',
    stage: 'market_scan',
    enteredStageAt: '2026-02-03T10:00:00Z',
    daysInStage: 3,
    healthStatus: 'green',
  },
  // ch-cyber-11: EW/spectrum - challenge published
  {
    id: 'pipe-026',
    challengeId: 'ch-cyber-11',
    stage: 'challenge_published',
    enteredStageAt: '2026-02-05T08:00:00Z',
    daysInStage: 1,
    healthStatus: 'green',
  },
  // Additional entries for depth
  {
    id: 'pipe-027',
    challengeId: 'ch-indo-3',
    vendorId: 'anduril',
    stage: 'evaluation',
    enteredStageAt: '2026-01-12T09:00:00Z',
    daysInStage: 25,
    healthStatus: 'red',
  },
  {
    id: 'pipe-028',
    challengeId: 'ch-indo-5',
    vendorId: 'scale-ai',
    stage: 'evaluation',
    enteredStageAt: '2026-01-18T10:00:00Z',
    daysInStage: 19,
    healthStatus: 'yellow',
  },
]
