import { MODULE_REGISTRY } from './registry';
import { LEARNING_BLOCKS, LEARNING_BLOCKS_BY_ID, type LearningBlockId } from './blocks';
import type { ModuleDefinition } from './types';

function toRomanBlock(value: string): LearningBlockId | null {
  const normalized = String(value).trim().toUpperCase();

  const map: Record<string, LearningBlockId> = {
    '1': 'I',
    '2': 'II',
    '3': 'III',
    '4': 'IV',
    '5': 'V',
    '6': 'VI',
    I: 'I',
    II: 'II',
    III: 'III',
    IV: 'IV',
    V: 'V',
    VI: 'VI',
  };

  return map[normalized] || null;
}

export function normalizeBlockId(blockValue: unknown): LearningBlockId | null {
  if (blockValue === null || blockValue === undefined) {
    return null;
  }

  if (typeof blockValue === 'number') {
    return toRomanBlock(String(blockValue));
  }

  if (typeof blockValue === 'string') {
    const cleaned = blockValue.trim().toUpperCase();
    const normalized = cleaned
      .replace('BLOK ', '')
      .replace('BLOCK ', '')
      .trim();

    return toRomanBlock(normalized);
  }

  return null;
}

export function getModuleBlockId(module: ModuleDefinition): LearningBlockId {
  return normalizeBlockId(module?.core?.block) || 'I';
}

export function getGroupedModulesByBlock(): Record<LearningBlockId, ModuleDefinition[]> {
  const groups: Record<LearningBlockId, ModuleDefinition[]> = {
    I: [],
    II: [],
    III: [],
    IV: [],
    V: [],
    VI: [],
  };

  for (const module of MODULE_REGISTRY) {
    const blockId = getModuleBlockId(module);
    groups[blockId].push(module);
  }

  for (const blockId of Object.keys(groups) as LearningBlockId[]) {
    groups[blockId].sort((a, b) => a.core.sortOrder - b.core.sortOrder);
  }

  return groups;
}

export function getAvailableBlocks(): typeof LEARNING_BLOCKS {
  const grouped = getGroupedModulesByBlock();

  return LEARNING_BLOCKS.filter((block) => grouped[block.id].length > 0);
}

export function getModulesForBlock(blockId: LearningBlockId): ModuleDefinition[] {
  const grouped = getGroupedModulesByBlock();
  return grouped[blockId] || [];
}

export function getBlockDefinition(blockId: LearningBlockId) {
  return LEARNING_BLOCKS_BY_ID[blockId];
}