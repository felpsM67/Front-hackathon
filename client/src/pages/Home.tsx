import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileText, Lock, User } from 'lucide-react';
import UserUpload from './UserUpload';
import SecretariaPanel from './SecretariaPanel';

type UserRole = 'selection' | 'user' | 'secretaria';

export default function Home() {
  const [role, setRole] = useState<UserRole>('selection');
  const [userId, setUserId] = useState('');
  const [tempUserId, setTempUserId] = useState('');

  const handleUserAccess = () => {
    if (tempUserId.trim()) {
      setUserId(tempUserId);
      setRole('user');
    }
  };

  const handleSecretariaAccess = () => {
    setRole('secretaria');
  };

  const handleBackToSelection = () => {
    setRole('selection');
    setUserId('');
    setTempUserId('');
  };

  if (role === 'user' && userId) {
    return (
      <div>
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-slate-900">Secretaria Docs</h1>
            </div>
            <Button variant="outline" onClick={handleBackToSelection}>
              Voltar
            </Button>
          </div>
        </div>
        <UserUpload userId={userId} />
      </div>
    );
  }

  if (role === 'secretaria') {
    return (
      <div>
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-slate-900">Secretaria Docs</h1>
            </div>
            <Button variant="outline" onClick={handleBackToSelection}>
              Voltar
            </Button>
          </div>
        </div>
        <SecretariaPanel />
      </div>
    );
  }

  // Selection Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900">Secretaria Docs</h1>
          </div>
          <p className="text-lg text-slate-600">Sistema de Gestão de Documentos</p>
          <p className="text-sm text-slate-500 mt-2">Selecione seu perfil para continuar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Card */}
          <Card className="hover:shadow-lg transition-shadow border-2 border-slate-200 hover:border-blue-400">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-4 rounded-full">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Usuário</CardTitle>
              <CardDescription>Envie seus documentos para análise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Seu ID de Usuário
                </label>
                <Input
                  placeholder="Ex: user-123"
                  value={tempUserId}
                  onChange={(e) => setTempUserId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleUserAccess()}
                  className="border-slate-300"
                />
                <p className="text-xs text-slate-500">
                  Digite um identificador único para sua conta
                </p>
              </div>

              <Button
                onClick={handleUserAccess}
                disabled={!tempUserId.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Acessar como Usuário
              </Button>

              <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
                <p className="font-medium mb-1">✓ Você poderá:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Enviar documentos (CPF, RG, Comprovante, Histórico)</li>
                  <li>• Visualizar preview dos arquivos</li>
                  <li>• Acompanhar o status de análise</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Secretaria Card */}
          <Card className="hover:shadow-lg transition-shadow border-2 border-slate-200 hover:border-emerald-400">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-emerald-100 p-4 rounded-full">
                  <Lock className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Secretaria</CardTitle>
              <CardDescription>Gerencie e valide os documentos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleSecretariaAccess}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Acessar Painel da Secretaria
              </Button>

              <div className="bg-emerald-50 p-3 rounded text-sm text-emerald-800">
                <p className="font-medium mb-1">✓ Você poderá:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Listar todos os documentos recebidos</li>
                  <li>• Buscar por usuário ou tipo de documento</li>
                  <li>• Visualizar e baixar arquivos</li>
                  <li>• Aprovar ou rejeitar documentos</li>
                  <li>• Filtrar por status</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-xs text-yellow-800">
                <p className="font-medium">⚠ Acesso Restrito</p>
                <p className="mt-1">Este painel requer permissões de administrador</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-slate-500">
            © 2026 Secretaria Docs. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
