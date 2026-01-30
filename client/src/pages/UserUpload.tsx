import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Loader2, Upload } from 'lucide-react';
import documentService, { UploadResponse, Document } from '@/services/api';

interface UserUploadProps {
  userId: string;
  onUploadSuccess?: (response: UploadResponse) => void;
}

export default function UserUpload({ userId, onUploadSuccess }: UserUploadProps) {
  const [files, setFiles] = useState<Record<string, File | null>>({
    cpf: null,
    rg: null,
    comprovante: null,
    historico: null,
  });

  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<Document[]>([]);

  const documentLabels: Record<string, string> = {
    cpf: 'CPF',
    rg: 'RG',
    comprovante: 'Comprovante de Residência',
    historico: 'Histórico Escolar',
  };

  const handleFileChange = (fieldName: string, file: File | null) => {
    setFiles((prev) => ({
      ...prev,
      [fieldName]: file,
    }));
    if (file) {
      setSelectedPreview(fieldName);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const requiredFields = ['cpf', 'rg', 'comprovante', 'historico'];
      const missingFiles = requiredFields.filter((field) => !files[field]);

      if (missingFiles.length > 0) {
        throw new Error(`Arquivos obrigatórios ausentes: ${missingFiles.map(f => documentLabels[f]).join(', ')}`);
      }

      const response = await documentService.uploadDocuments(userId, files as Record<string, File>);

      setMessage({
        type: 'success',
        text: response.message,
      });

      setUploadedDocuments(response.documents);

      // Limpar formulário
      setFiles({
        cpf: null,
        rg: null,
        comprovante: null,
        historico: null,
      });

      setSelectedPreview(null);

      // Resetar inputs
      const inputs = document.querySelectorAll('input[type="file"]');
      inputs.forEach((input) => {
        (input as HTMLInputElement).value = '';
      });

      if (onUploadSuccess) {
        onUploadSuccess(response);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao fazer upload dos documentos';
      setMessage({
        type: 'error',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const getPreviewContent = (fieldName: string) => {
    const file = files[fieldName];
    if (!file) return null;

    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';

    if (isImage) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt={`Preview ${documentLabels[fieldName]}`}
          className="max-w-full max-h-96 object-contain rounded"
        />
      );
    }

    if (isPdf) {
      return (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📄</div>
          <p className="text-sm text-muted-foreground">{file.name}</p>
          <p className="text-xs text-muted-foreground mt-2">PDF - {(file.size / 1024).toFixed(2)} KB</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Envio de Documentos</h1>
          <p className="text-slate-600">Envie seus documentos para análise. Todos os campos são obrigatórios.</p>
          <p className="text-sm text-slate-500 mt-2">Usuário ID: <span className="font-mono bg-slate-200 px-2 py-1 rounded">{userId}</span></p>
        </div>

        {/* Message Alert */}
        {message && (
          <Card className={`mb-6 border-l-4 ${message.type === 'success' ? 'border-l-green-500 bg-green-50' : 'border-l-red-500 bg-red-50'}`}>
            <CardContent className="pt-6 flex items-start gap-3">
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                  {message.text}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Formulário de Upload</CardTitle>
                <CardDescription>Selecione os arquivos necessários</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {Object.entries(documentLabels).map(([fieldName, label]) => (
                    <div key={fieldName} className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">
                        {label} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange(fieldName, e.target.files?.[0] || null)}
                          disabled={loading}
                          required
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-slate-400 transition-colors">
                          <Upload className="w-5 h-5 mx-auto text-slate-400 mb-2" />
                          <p className="text-sm text-slate-600">
                            {files[fieldName] ? files[fieldName]!.name : 'Clique para selecionar ou arraste'}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">Imagem ou PDF</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      'Enviar Documentos'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Preview</CardTitle>
                <CardDescription>
                  {selectedPreview ? `${documentLabels[selectedPreview]}` : 'Selecione um arquivo'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedPreview && getPreviewContent(selectedPreview) ? (
                  <div className="bg-slate-50 rounded-lg p-4">
                    {getPreviewContent(selectedPreview)}
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-lg p-8 text-center">
                    <p className="text-sm text-slate-500">Nenhum arquivo selecionado</p>
                  </div>
                )}

                {/* File List */}
                <div className="mt-6 space-y-2">
                  <p className="text-xs font-semibold text-slate-600 uppercase">Arquivos selecionados</p>
                  {Object.entries(documentLabels).map(([fieldName, label]) => (
                    <div
                      key={fieldName}
                      className={`text-xs p-2 rounded flex items-center justify-between cursor-pointer transition-colors ${
                        files[fieldName]
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                      onClick={() => files[fieldName] && setSelectedPreview(fieldName)}
                    >
                      <span>{label}</span>
                      {files[fieldName] && <span className="text-lg">✓</span>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Uploaded Documents */}
        {uploadedDocuments.length > 0 && (
          <Card className="mt-6 bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900">Documentos Enviados com Sucesso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {uploadedDocuments.map((doc) => (
                  <div key={doc.id} className="text-sm text-green-800 flex items-center gap-2">
                    <span className="text-lg">✓</span>
                    <span>{doc.type} - {doc.originalName}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
