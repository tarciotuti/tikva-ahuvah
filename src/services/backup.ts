import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { getAllDataForBackup, restoreDataFromBackup } from './database';
import { BackupPayload } from '../types';

export async function saveImageToAppDirectory(sourceUri: string): Promise<string> {
  try {
    const photosDir = `${FileSystem.documentDirectory}photos/`;
    const dirInfo = await FileSystem.getInfoAsync(photosDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(photosDir, { intermediates: true });
    }

    const filename = `photo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.jpg`;
    const destinationUri = `${photosDir}${filename}`;

    await FileSystem.copyAsync({
      from: sourceUri,
      to: destinationUri,
    });

    return destinationUri;
  } catch (error) {
    console.error('Erro ao salvar foto no armazenamento local:', error);
    return sourceUri;
  }
}

export async function exportBackup(): Promise<{ success: boolean; message: string }> {
  try {
    const { memories, capsules, notes } = getAllDataForBackup();

    const payload: BackupPayload = {
      version: 2,
      appName: 'Memórias, Fé & Afeto',
      exportedAt: new Date().toISOString(),
      memories,
      capsules,
      notes,
    };

    const jsonString = JSON.stringify(payload, null, 2);
    const backupFilePath = `${FileSystem.documentDirectory}memorias_backup_${new Date().toISOString().slice(0, 10)}.json`;

    await FileSystem.writeAsStringAsync(backupFilePath, jsonString, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      return {
        success: false,
        message: 'O compartilhamento não está disponível neste dispositivo.',
      };
    }

    await Sharing.shareAsync(backupFilePath, {
      mimeType: 'application/json',
      dialogTitle: 'Salvar Backup das Memórias e Caderno no Google Drive',
      UTI: 'public.json',
    });

    return {
      success: true,
      message: 'Backup gerado com sucesso! Escolha o Google Drive ou seu app preferido para salvar.',
    };
  } catch (error: any) {
    console.error('Erro ao exportar backup:', error);
    return {
      success: false,
      message: error?.message || 'Falha ao gerar o arquivo de backup.',
    };
  }
}

export function restoreBackup(jsonString: string): { success: boolean; message: string; count?: number } {
  try {
    const data = JSON.parse(jsonString);

    if (!data.memories || !Array.isArray(data.memories) || !data.capsules || !Array.isArray(data.capsules)) {
      throw new Error('Formato de arquivo inválido. O arquivo de backup deve conter memórias e cápsulas.');
    }

    restoreDataFromBackup(data.memories, data.capsules, data.notes || []);

    return {
      success: true,
      message: `Restauração concluída! ${data.memories.length} memórias, ${data.capsules.length} cápsulas e ${(data.notes || []).length} anotações recuperadas.`,
      count: data.memories.length,
    };
  } catch (error: any) {
    console.error('Erro ao restaurar backup:', error);
    return {
      success: false,
      message: error?.message || 'Falha ao processar o arquivo de restauração.',
    };
  }
}
