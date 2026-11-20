import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { saveBackupSetting } from './backup';

export const GOOGLE_CONFIG = {
  webClientId: '1060265454317-ham4m0krq7sn1ug53cb31u7chfunaema.apps.googleusercontent.com',
  scopes: [
    'https://www.googleapis.com/auth/drive.appdata',
    'https://www.googleapis.com/auth/drive.file',
  ],
};

let isConfigured = false;

export function configureGoogleSignIn(): void {
  if (isConfigured) return;
  try {
    GoogleSignin.configure({
      webClientId: GOOGLE_CONFIG.webClientId,
      scopes: GOOGLE_CONFIG.scopes,
      offlineAccess: true,
    });
    isConfigured = true;
  } catch (err) {
    console.warn('Erro ao configurar Google Sign-In:', err);
  }
}

export interface GoogleAccountInfo {
  email: string;
  name: string;
  photoUrl?: string | null;
}

export async function signInWithGoogle(): Promise<{
  success: boolean;
  account?: GoogleAccountInfo;
  message?: string;
}> {
  try {
    configureGoogleSignIn();
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();

    const user = response.data?.user || (response as any).user;
    if (user && user.email) {
      saveBackupSetting('backup_google_account', user.email);
      return {
        success: true,
        account: {
          email: user.email,
          name: user.name || user.email.split('@')[0],
          photoUrl: user.photo,
        },
      };
    }

    return {
      success: false,
      message: 'Não foi possível obter os dados da conta selecionada.',
    };
  } catch (error: any) {
    console.error('Erro no login Google:', error);
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      return { success: false, message: 'Login cancelado.' };
    } else if (error.code === statusCodes.IN_PROGRESS) {
      return { success: false, message: 'Login já em andamento.' };
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return { success: false, message: 'Google Play Services não disponível.' };
    }
    return { success: false, message: error.message || 'Falha ao autenticar com o Google.' };
  }
}

export async function signOutGoogle(): Promise<void> {
  try {
    configureGoogleSignIn();
    await GoogleSignin.signOut();
    saveBackupSetting('backup_google_account', 'Conta conectada do Google Drive');
  } catch (err) {
    console.warn('Erro ao desconectar Google:', err);
  }
}

export async function getCurrentGoogleUser(): Promise<GoogleAccountInfo | null> {
  try {
    configureGoogleSignIn();
    const currentUser = await GoogleSignin.getCurrentUser();
    if (currentUser?.user) {
      return {
        email: currentUser.user.email,
        name: currentUser.user.name || '',
        photoUrl: currentUser.user.photo,
      };
    }
  } catch {
    // Silencia se não houver usuário conectado
  }
  return null;
}

export async function getValidAccessToken(): Promise<string | null> {
  try {
    configureGoogleSignIn();
    const tokens = await GoogleSignin.getTokens();
    return tokens.accessToken;
  } catch (err) {
    console.warn('Falha ao obter token de acesso do Google:', err);
    try {
      // Tenta login silencioso para renovar token expirado
      const res = await GoogleSignin.signInSilently();
      const user = res.data?.user || (res as any).user;
      if (user) {
        const refreshedTokens = await GoogleSignin.getTokens();
        return refreshedTokens.accessToken;
      }
    } catch {
      // Ignora falha silenciosa
    }
  }
  return null;
}

const BACKUP_FILENAME = 'tikva_ahuvah_cloud_backup.json';

/**
 * Envia o backup diretamente para a pasta oculta privada (appDataFolder) no Google Drive
 */
export async function uploadBackupToDriveApi(jsonString: string): Promise<{
  success: boolean;
  message: string;
  fileId?: string;
}> {
  try {
    const accessToken = await getValidAccessToken();
    if (!accessToken) {
      return {
        success: false,
        message: 'Conecte sua conta do Google nas configurações antes de fazer o backup em nuvem.',
      };
    }

    // 1. Verifica se já existe um arquivo de backup anterior no appDataFolder
    const searchUrl = `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${BACKUP_FILENAME}'&fields=files(id,name)`;
    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    let existingFileId: string | null = null;
    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData.files && searchData.files.length > 0) {
        existingFileId = searchData.files[0].id;
      }
    }

    // 2. Se já existe, atualiza diretamente
    if (existingFileId) {
      const patchUrl = `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=media`;
      const patchRes = await fetch(patchUrl, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonString,
      });

      if (patchRes.ok) {
        return {
          success: true,
          message: 'Backup atualizado com sucesso no Google Drive!',
          fileId: existingFileId,
        };
      }
    }

    // 3. Se não existe, cria novo arquivo multipart na pasta privada appDataFolder
    const metadata = JSON.stringify({
      name: BACKUP_FILENAME,
      parents: ['appDataFolder'],
    });

    const boundary = '-------TikvaDriveBoundary' + Date.now();
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const multipartBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      metadata +
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      jsonString +
      closeDelimiter;

    const createUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
    const createRes = await fetch(createUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartBody,
    });

    if (createRes.ok) {
      const createdData = await createRes.json();
      return {
        success: true,
        message: 'Backup enviado e protegido com sucesso no seu Google Drive!',
        fileId: createdData.id,
      };
    }

    const errText = await createRes.text();
    console.error('Erro na resposta do Google Drive:', errText);
    return {
      success: false,
      message: 'Falha ao salvar no Google Drive. Verifique a conexão com a internet.',
    };
  } catch (error: any) {
    console.error('Erro ao enviar backup para o Google Drive:', error);
    return {
      success: false,
      message: error?.message || 'Falha ao comunicar com a API do Google Drive.',
    };
  }
}

/**
 * Baixa o backup salvo na nuvem diretamente do Google Drive
 */
export async function downloadBackupFromDriveApi(): Promise<{
  success: boolean;
  jsonString?: string;
  message: string;
}> {
  try {
    const accessToken = await getValidAccessToken();
    if (!accessToken) {
      return {
        success: false,
        message: 'Conecte sua conta do Google para restaurar da nuvem.',
      };
    }

    const searchUrl = `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${BACKUP_FILENAME}'&fields=files(id,name,size,modifiedTime)`;
    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!searchRes.ok) {
      return { success: false, message: 'Não foi possível consultar os backups no Google Drive.' };
    }

    const searchData = await searchRes.json();
    if (!searchData.files || searchData.files.length === 0) {
      return {
        success: false,
        message: 'Nenhum backup automático foi encontrado na sua conta do Google Drive.',
      };
    }

    const fileId = searchData.files[0].id;
    const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    const downloadRes = await fetch(downloadUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!downloadRes.ok) {
      return { success: false, message: 'Falha ao baixar o arquivo de backup do Google Drive.' };
    }

    const jsonString = await downloadRes.text();
    return {
      success: true,
      jsonString,
      message: 'Backup da nuvem baixado com sucesso!',
    };
  } catch (err: any) {
    console.error('Erro ao baixar backup do Google Drive:', err);
    return {
      success: false,
      message: err?.message || 'Erro ao sincronizar com o Google Drive.',
    };
  }
}
