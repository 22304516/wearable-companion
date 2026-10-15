export async function exportCsv(content: string, fileName: string): Promise<void> {
  if (typeof document === 'undefined' || typeof URL.createObjectURL !== 'function') {
    throw new Error('CSV download is not available in this browser.');
  }

  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
