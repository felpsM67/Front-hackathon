import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle, Download, Eye, Loader2, Search, X } from 'lucide-react';
import documentService, { Document } from '@/services/api';

export default function SecretariaPanel() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'TODOS' | 'PENDENTE' | 'APROVADO' | 'REJEITADO'>('PENDENTE');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Carregar documentos
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await documentService.listDocuments();
        setDocuments(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Filtrar documentos
  useEffect(() => {
    let filtered = documents;

    // Filtro por status
    if (statusFilter !== 'TODOS') {
      filtered = filtered.filter((doc) => doc.status === statusFilter);
    }

    // Filtro por busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.userId.toLowerCase().includes(term) ||
          doc.originalName.toLowerCase().includes(term) ||
          doc.type.toLowerCase().includes(term)
      );
    }

    setFilteredDocuments(filtered);
  }, [documents, statusFilter, searchTerm]);

  const getDocumentTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      CPF: 'CPF',
      RG: 'RG',
      COMPROVANTE_RESIDENCIA: 'Comprovante de Residência',
      HISTORICO_ESCOLAR: 'Histórico Escolar',
    };
    return labels[type] || type;
  };

  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case 'APROVADO':
        return 'bg-green-100 text-green-800';
      case 'REJEITADO':
        return 'bg-red-100 text-red-800';
      case 'PENDENTE':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleUpdateStatus = async (documentId: number, newStatus: 'APROVADO' | 'REJEITADO') => {
    try {
      setUpdatingId(documentId);
      setMessage(null);

      await documentService.updateDocumentStatus(documentId, newStatus);

      // Atualizar lista local
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === documentId ? { ...doc, status: newStatus } : doc
        )
      );

      setMessage({
        type: 'success',
        text: `Documento ${newStatus === 'APROVADO' ? 'aprovado' : 'rejeitado'} com sucesso!`,
      });

      setSelectedDocument(null);
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message,
      });
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-slate-600">Carregando documentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Painel da Secretaria</h1>
          <p className="text-slate-600">Gerencie e valide os documentos enviados pelos usuários</p>
        </div>

        {/* Message Alert */}
        {message && (
          <Card className={`mb-6 border-l-4 ${message.type === 'success' ? 'border-l-green-500 bg-green-50' : 'border-l-red-500 bg-red-50'}`}>
            <CardContent className="pt-6 flex items-center justify-between">
              <div className="flex items-start gap-3">
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <p className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                  {message.text}
                </p>
              </div>
              <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="mb-6 border-l-4 border-l-red-500 bg-red-50">
            <CardContent className="pt-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filters */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Filtros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Buscar por usuário, arquivo ou tipo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex gap-2 flex-wrap">
                  {(['TODOS', 'PENDENTE', 'APROVADO', 'REJEITADO'] as const).map((status) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter(status)}
                      className={statusFilter === status ? 'bg-blue-600' : ''}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Documents Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Documentos ({filteredDocuments.length})</CardTitle>
                <CardDescription>
                  {statusFilter === 'TODOS'
                    ? 'Todos os documentos'
                    : `Documentos ${statusFilter.toLowerCase()}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredDocuments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500">Nenhum documento encontrado</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-slate-200 bg-slate-50">
                        <tr>
                          <th className="text-left p-3 font-semibold text-slate-700">Usuário</th>
                          <th className="text-left p-3 font-semibold text-slate-700">Tipo</th>
                          <th className="text-left p-3 font-semibold text-slate-700">Arquivo</th>
                          <th className="text-left p-3 font-semibold text-slate-700">Tamanho</th>
                          <th className="text-left p-3 font-semibold text-slate-700">Status</th>
                          <th className="text-left p-3 font-semibold text-slate-700">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDocuments.map((doc) => (
                          <tr key={doc.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                            <td className="p-3 font-mono text-xs text-slate-600">{doc.userId}</td>
                            <td className="p-3 text-slate-900">{getDocumentTypeLabel(doc.type)}</td>
                            <td className="p-3 text-slate-600 truncate max-w-xs">{doc.originalName}</td>
                            <td className="p-3 text-slate-600">{formatFileSize(doc.size)}</td>
                            <td className="p-3">
                              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(doc.status)}`}>
                                {doc.status}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedDocument(doc)}
                                  className="text-xs"
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  Ver
                                </Button>
                                <a
                                  href={doc.url}
                                  download={doc.fileName}
                                  className="inline-flex items-center gap-1 px-2 py-1 text-xs border border-slate-300 rounded hover:bg-slate-100 transition-colors"
                                >
                                  <Download className="w-3 h-3" />
                                  Baixar
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Document Preview */}
          <div className="lg:col-span-1">
            {selectedDocument ? (
              <Card className="sticky top-4">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{getDocumentTypeLabel(selectedDocument.type)}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        Usuário: {selectedDocument.userId}
                      </CardDescription>
                    </div>
                    <button
                      onClick={() => setSelectedDocument(null)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Preview */}
                  <div className="bg-slate-50 rounded-lg p-4 max-h-64 overflow-auto">
                    {selectedDocument.mimeType === 'application/pdf' ? (
                      <iframe
                        src={selectedDocument.url}
                        title={`Preview de ${selectedDocument.originalName}`}
                        className="w-full h-64 rounded border border-slate-200"
                      />
                    ) : selectedDocument.mimeType.startsWith('image/') ? (
                      <img
                        src={selectedDocument.url}
                        alt={`Preview de ${selectedDocument.originalName}`}
                        className="w-full h-auto rounded border border-slate-200"
                      />
                    ) : (
                      <p className="text-sm text-slate-500 text-center py-8">
                        Tipo de arquivo não suportado para preview
                      </p>
                    )}
                  </div>

                  {/* Document Info */}
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-semibold">Arquivo</p>
                      <p className="text-slate-900 break-all">{selectedDocument.originalName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-semibold">Tamanho</p>
                      <p className="text-slate-900">{formatFileSize(selectedDocument.size)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-semibold">Status</p>
                      <p className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(selectedDocument.status)}`}>
                        {selectedDocument.status}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  {selectedDocument.status === 'PENDENTE' && (
                    <div className="space-y-2 pt-4 border-t border-slate-200">
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        disabled={updatingId === selectedDocument.id}
                        onClick={() => handleUpdateStatus(selectedDocument.id, 'APROVADO')}
                      >
                        {updatingId === selectedDocument.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Aprovar
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-red-300 text-red-600 hover:bg-red-50"
                        disabled={updatingId === selectedDocument.id}
                        onClick={() => handleUpdateStatus(selectedDocument.id, 'REJEITADO')}
                      >
                        {updatingId === selectedDocument.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          'Rejeitar'
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Download Button */}
                  <a
                    href={selectedDocument.url}
                    download={selectedDocument.fileName}
                    className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Download className="w-4 h-4 inline mr-2" />
                    Baixar Arquivo
                  </a>
                </CardContent>
              </Card>
            ) : (
              <Card className="sticky top-4 bg-slate-50">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-slate-500">Selecione um documento para visualizar</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
