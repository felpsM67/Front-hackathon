import axios, { AxiosInstance } from 'axios';

// Tipos para a API
export interface Document {
  id: number;
  userId: string;
  type: 'CPF' | 'RG' | 'COMPROVANTE_RESIDENCIA' | 'HISTORICO_ESCOLAR';
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
  url: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UploadResponse {
  message: string;
  documents: Document[];
}

export interface ListDocumentsResponse {
  documents: Document[];
}

class DocumentService {
  private api: AxiosInstance;
  private baseURL = 'http://localhost:3000/api';

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Faz upload de documentos
   * @param userId - ID do usuário
   * @param files - Objeto com os arquivos (cpf, rg, comprovante, historico)
   */
  async uploadDocuments(userId: string, files: Record<string, File>): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('userId', userId);

    // Adiciona cada arquivo ao FormData
    Object.entries(files).forEach(([fieldName, file]) => {
      formData.append(fieldName, file);
    });

    try {
      const response = await this.api.post<UploadResponse>('/documentos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Erro ao fazer upload dos documentos');
    }
  }

  /**
   * Lista documentos de um usuário
   * @param userId - ID do usuário (opcional)
   * @param status - Status do documento (opcional)
   */
  async listDocuments(userId?: string, status?: string): Promise<Document[]> {
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (status) params.append('status', status);

      const response = await this.api.get<Document[]>('/documentos', {
        params: Object.fromEntries(params),
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Erro ao listar documentos');
    }
  }

  /**
   * Atualiza o status de um documento
   * @param documentId - ID do documento
   * @param status - Novo status
   */
  async updateDocumentStatus(documentId: number, status: 'APROVADO' | 'REJEITADO'): Promise<Document> {
    try {
      const response = await this.api.patch<Document>(`/documentos/${documentId}`, { status });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Erro ao atualizar status do documento');
    }
  }

  /**
   * Obtém a URL de preview de um documento
   * @param fileName - Nome do arquivo
   */
  getPreviewUrl(fileName: string): string {
    return `http://localhost:3000/files/${fileName}`;
  }

  /**
   * Obtém a URL para download de um documento
   * @param fileName - Nome do arquivo
   */
  getDownloadUrl(fileName: string): string {
    return this.getPreviewUrl(fileName);
  }
}

export default new DocumentService();
