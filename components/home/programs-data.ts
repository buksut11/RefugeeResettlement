export const PROGRAM_SLUGS = ['resettlement', 'shelter', 'livelihoods', 'protection'] as const

export type ProgramSlug = (typeof PROGRAM_SLUGS)[number]

export const PROGRAM_ICONS: Record<ProgramSlug, string> = {
  resettlement: '🏠',
  shelter: '🧱',
  livelihoods: '🌱',
  protection: '🛡️',
}
