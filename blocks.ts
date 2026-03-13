export type LearningBlockId = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';

export interface LearningBlockDefinition {
  id: LearningBlockId;
  order: number;
}

export const LEARNING_BLOCKS: LearningBlockDefinition[] = [
  { id: 'I', order: 1 },
  { id: 'II', order: 2 },
  { id: 'III', order: 3 },
  { id: 'IV', order: 4 },
  { id: 'V', order: 5 },
  { id: 'VI', order: 6 },
];

export const LEARNING_BLOCKS_BY_ID = Object.fromEntries(
  LEARNING_BLOCKS.map((block) => [block.id, block])
) as Record<LearningBlockId, LearningBlockDefinition>;