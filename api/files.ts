import axios from "@/core/axios";
import { FileItem } from "@/api/dto/files.dto";

type FileType = "all" | "photos" | "trash";

export const getAll = async (type: FileType = "all"): Promise<FileItem[]> => {
  return (await axios.get("/files?type=" + type)).data;
};

export const remove = (ids: number[]): Promise<void> => {
  return axios.delete("/files?ids=" + ids);
};

export const uploadFile = async (options: any) => {
  const { onSuccess, onError, file, onProgress } = options;

  const formData = new FormData();
  formData.append("file", file);

  const config = {
    headers: { "Content-Type": "multipart/form-data" },
    onProgress: (event: ProgressEvent) => {
      onProgress({ percent: (event.loaded / event.total) * 100 });
    },
  };

  try {
    const { data } = await axios.post("files", formData, config);

    onSuccess();

    return data;
  } catch (err) {
    onError({ err });
  }
};

export const downloadFiles = async (ids: number[]) => {
  try {
    const response = await axios({
      url: `files/download?ids=${ids.join(',')}`,
      method: 'GET',
      responseType: 'blob',
    });

    // Получаем имя файла из заголовка Content-Disposition
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'download';

    console.log('Download response headers:', {
      'content-disposition': contentDisposition,
      'content-type': response.headers['content-type']
    });

    if (contentDisposition) {
      // Сначала пробуем получить UTF-8 имя файла
      const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
      if (utf8Match && utf8Match[1]) {
        filename = decodeURIComponent(utf8Match[1]);
        console.log('Found UTF-8 filename:', filename);
      } else {
        // Затем пробуем обычное имя файла
        const regularMatch = contentDisposition.match(/filename="([^"]+)"/i);
        if (regularMatch && regularMatch[1]) {
          filename = decodeURIComponent(regularMatch[1]);
          console.log('Found regular filename:', filename);
        }
      }
    }

    console.log('Final filename:', filename);

    // Создаем ссылку для скачивания
    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    
    // Скачиваем файл
    document.body.appendChild(link);
    link.click();
    
    // Очищаем
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (err) {
    console.error('Download error:', err);
    throw err;
  }
};
