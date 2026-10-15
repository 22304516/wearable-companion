import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export async function exportCsv(content: string, fileName: string): Promise<void> {
  const file = new File(Paths.cache, fileName);
  if (file.exists) file.delete();
  file.create();
  file.write(content);
  await Sharing.shareAsync(file.uri, {
    dialogTitle: 'Export synthetic reading history',
    mimeType: 'text/csv',
    UTI: 'public.comma-separated-values-text',
  });
}
