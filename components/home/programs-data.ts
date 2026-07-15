export const PROGRAM_SLUGS = ['resettlement', 'shelter', 'livelihoods', 'protection'] as const

export type ProgramSlug = (typeof PROGRAM_SLUGS)[number]
