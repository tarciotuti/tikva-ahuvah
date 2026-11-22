let assets: Record<string, any> = {};

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const local = require('./manuscriptAssets.local');
  if (local && local.MANUSCRIPT_ASSETS) {
    assets = local.MANUSCRIPT_ASSETS;
  }
} catch {
  // Arquivo local privado ausente no repositório público
}

export const MANUSCRIPT_ASSETS: Record<string, any> = assets;
