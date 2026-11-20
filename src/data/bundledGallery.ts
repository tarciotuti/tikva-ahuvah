import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import { saveGalleryPhoto, getGalleryPhotos } from '../services/database';

export const BUNDLED_GALLERY_IMAGES = [
  require('../../assets/gallery/foto_01.jpg'),
  require('../../assets/gallery/foto_02.jpg'),
  require('../../assets/gallery/foto_03.jpg'),
  require('../../assets/gallery/foto_04.jpg'),
  require('../../assets/gallery/foto_05.jpg'),
  require('../../assets/gallery/foto_06.jpg'),
  require('../../assets/gallery/foto_07.jpg'),
  require('../../assets/gallery/foto_08.jpg'),
  require('../../assets/gallery/foto_09.jpg'),
  require('../../assets/gallery/foto_10.jpg'),
  require('../../assets/gallery/foto_11.jpg'),
  require('../../assets/gallery/foto_12.jpg'),
  require('../../assets/gallery/foto_13.jpg'),
  require('../../assets/gallery/foto_14.jpg'),
  require('../../assets/gallery/foto_15.jpg'),
  require('../../assets/gallery/foto_16.jpg'),
  require('../../assets/gallery/foto_17.jpg'),
  require('../../assets/gallery/foto_18.jpg'),
  require('../../assets/gallery/foto_19.jpg'),
  require('../../assets/gallery/foto_20.jpg'),
  require('../../assets/gallery/foto_21.jpg'),
  require('../../assets/gallery/foto_22.jpg'),
  require('../../assets/gallery/foto_23.jpg'),
  require('../../assets/gallery/foto_24.jpg'),
  require('../../assets/gallery/foto_25.jpg'),
  require('../../assets/gallery/foto_26.jpg'),
  require('../../assets/gallery/foto_27.jpg'),
  require('../../assets/gallery/foto_28.jpg'),
];

export async function ensureBundledGalleryLoaded(): Promise<number> {
  const existing = getGalleryPhotos();
  if (existing.length > 0) {
    return existing.length;
  }

  const photosDir = `${FileSystem.documentDirectory}photos/`;
  const dirInfo = await FileSystem.getInfoAsync(photosDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(photosDir, { intermediates: true });
  }

  let addedCount = 0;
  for (let i = 0; i < BUNDLED_GALLERY_IMAGES.length; i++) {
    try {
      const asset = Asset.fromModule(BUNDLED_GALLERY_IMAGES[i]);
      await asset.downloadAsync();
      const filename = `foto_${String(i + 1).padStart(2, '0')}.jpg`;
      const targetUri = `${photosDir}${filename}`;

      const sourceUri = asset.localUri || asset.uri;
      if (sourceUri) {
        await FileSystem.copyAsync({
          from: sourceUri,
          to: targetUri,
        });

        saveGalleryPhoto({
          uri: targetUri,
          caption: `Momento especial #${i + 1}`,
          date: new Date(Date.now() - (28 - i) * 86400000).toISOString().slice(0, 10),
        });
        addedCount++;
      }
    } catch (err) {
      console.warn(`Erro ao carregar foto bundled ${i + 1}:`, err);
    }
  }

  return addedCount;
}
