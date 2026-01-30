// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { FileText, Lock, User, AlertCircle, ShieldCheck, Zap, Clock } from 'lucide-react';
// import UserUpload from './UserUpload';
// import SecretariaPanel from './SecretariaPanel';

// type UserRole = 'selection' | 'user' | 'secretaria';

// export default function Home() {
//   const [role, setRole] = useState<UserRole>('selection');
//   const [userId, setUserId] = useState('');
//   const [tempUserId, setTempUserId] = useState('');
//   const [secretariaPass, setSecretariaPass] = useState('');
//   const [showPassInput, setShowPassInput] = useState(false);
//   const [passError, setPassError] = useState(false);

//   const handleUserAccess = () => {
//     if (tempUserId.trim()) {
//       setUserId(tempUserId);
//       setRole('user');
//     }
//   };

//   const handleSecretariaAccess = () => {
//     if (secretariaPass === 'admin123') {
//       setRole('secretaria');
//       setPassError(false);
//     } else {
//       setPassError(true);
//     }
//   };

//   const handleBackToSelection = () => {
//     setRole('selection');
//     setUserId('');
//     setTempUserId('');
//     setSecretariaPass('');
//     setShowPassInput(false);
//     setPassError(false);
//   };

//   // Visão do Usuário Logado
//   if (role === 'user' && userId) {
//     return (
//       <div className="min-h-screen flex flex-col">
//         <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
//           <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <FileText className="w-6 h-6 text-blue-600" />
//               <h1 className="text-xl font-bold text-slate-900">Secretaria Docs</h1>
//             </div>
//             <Button variant="outline" onClick={handleBackToSelection}>Sair</Button>
//           </div>
//         </div>
//         <main className="flex-grow">
//           <UserUpload userId={userId} />
//         </main>
//       </div>
//     );
//   }

//   // Visão da Secretaria Logada
//   if (role === 'secretaria') {
//     return (
//       <div className="min-h-screen flex flex-col">
//         <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
//           <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <FileText className="w-6 h-6 text-blue-600" />
//               <h1 className="text-xl font-bold text-slate-900">Secretaria Docs</h1>
//             </div>
//             <Button variant="outline" onClick={handleBackToSelection}>Sair do Painel</Button>
//           </div>
//         </div>
//         <main className="flex-grow">
//           <SecretariaPanel />
//         </main>
//       </div>
//     );
//   }

//   // Tela de Seleção (Landing Page)
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 flex flex-col">
//       <div className="flex-grow flex items-center justify-center p-4 py-12">
//         <div className="w-full max-w-5xl">
//           {/* Hero Section */}
//           <div className="text-center mb-12">
//             <div className="flex items-center justify-center gap-3 mb-4">
//               <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
//                 <FileText className="w-10 h-10 text-white" />
//               </div>
//               <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">Secretaria Docs</h1>
//             </div>
//             <p className="text-xl text-slate-600 max-w-2xl mx-auto">
//               A plataforma inteligente para gestão, envio e validação de documentos acadêmicos em tempo real.
//             </p>
//           </div>

//           {/* Cards de Acesso */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
//             {/* User Card */}
//             <Card className="hover:shadow-2xl transition-all duration-300 border-none shadow-xl bg-white/80 backdrop-blur-sm">
//               <CardHeader className="text-center pb-2">
//                 <div className="flex justify-center mb-4">
//                   <div className="bg-blue-100 p-4 rounded-full"><User className="w-8 h-8 text-blue-600" /></div>
//                 </div>
//                 <CardTitle className="text-2xl font-bold">Área do Aluno</CardTitle>
//                 <CardDescription>Envie seus documentos para análise oficial</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <Input
//                     placeholder="Digite seu ID de Usuário"
//                     value={tempUserId}
//                     onChange={(e) => setTempUserId(e.target.value)}
//                     onKeyPress={(e) => e.key === 'Enter' && handleUserAccess()}
//                     className="h-12 border-slate-200 focus:ring-blue-500"
//                   />
//                 </div>
//                 <Button onClick={handleUserAccess} disabled={!tempUserId.trim()} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg font-semibold shadow-lg shadow-blue-100">
//                   Acessar como Usuário
//                 </Button>
//               </CardContent>
//             </Card>

//             {/* Secretaria Card */}
//             <Card className="hover:shadow-2xl transition-all duration-300 border-none shadow-xl bg-white/80 backdrop-blur-sm">
//               <CardHeader className="text-center pb-2">
//                 <div className="flex justify-center mb-4">
//                   <div className="bg-emerald-100 p-4 rounded-full"><Lock className="w-8 h-8 text-emerald-600" /></div>
//                 </div>
//                 <CardTitle className="text-2xl font-bold">Painel Administrativo</CardTitle>
//                 <CardDescription>Gestão e validação de documentos recebidos</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {!showPassInput ? (
//                   <Button onClick={() => setShowPassInput(true)} className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-lg font-semibold shadow-lg shadow-emerald-100">
//                     Acessar Secretaria
//                   </Button>
//                 ) : (
//                   <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
//                     <Input
//                       type="password"
//                       placeholder="Senha de Acesso"
//                       value={secretariaPass}
//                       onChange={(e) => setSecretariaPass(e.target.value)}
//                       onKeyPress={(e) => e.key === 'Enter' && handleSecretariaAccess()}
//                       className={`h-12 ${passError ? 'border-red-500 ring-red-100' : 'border-slate-200'}`}
//                       autoFocus
//                     />
//                     <div className="flex gap-2">
//                       <Button variant="outline" onClick={() => setShowPassInput(false)} className="flex-1 h-10">Voltar</Button>
//                       <Button onClick={handleSecretariaAccess} className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700">Entrar</Button>
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Features Section */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
//             <div className="p-4">
//               <div className="bg-white w-12 h-12 rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4">
//                 <ShieldCheck className="w-6 h-6 text-blue-600" />
//               </div>
//               <h4 className="font-bold text-slate-800 mb-1">Segurança Total</h4>
//               <p className="text-sm text-slate-500">Seus documentos são criptografados e armazenados com segurança.</p>
//             </div>
//             <div className="p-4">
//               <div className="bg-white w-12 h-12 rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4">
//                 <Zap className="w-6 h-6 text-yellow-500" />
//               </div>
//               <h4 className="font-bold text-slate-800 mb-1">Análise Ágil</h4>
//               <p className="text-sm text-slate-500">Processo de validação otimizado para respostas mais rápidas.</p>
//             </div>
//             <div className="p-4">
//               <div className="bg-white w-12 h-12 rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4">
//                 <Clock className="w-6 h-6 text-emerald-500" />
//               </div>
//               <h4 className="font-bold text-slate-800 mb-1">Status em Tempo Real</h4>
//               <p className="text-sm text-slate-500">Acompanhe cada etapa da sua análise.</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer Profissional */}
//       <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm py-12">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
//             <div className="col-span-1 md:col-span-1">
//               <div className="flex items-center gap-2 mb-4">
//                 <FileText className="w-6 h-6 text-blue-600" />
//                 <span className="text-xl font-bold text-slate-900">Secretaria Docs</span>
//               </div>
//               <p className="text-sm text-slate-500 leading-relaxed">
//                 Simplificando a gestão e validação de documentos acadêmicos com segurança e agilidade.
//               </p>
//             </div>
//             <div>
//               <h4 className="font-semibold text-slate-900 mb-4">Sistema</h4>
//               <ul className="space-y-2 text-sm text-slate-600">
//                 <li className="hover:text-blue-600 cursor-pointer transition-colors">Como Funciona</li>
//                 <li className="hover:text-blue-600 cursor-pointer transition-colors">Segurança</li>
//                 <li className="hover:text-blue-600 cursor-pointer transition-colors">Suporte</li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-semibold text-slate-900 mb-4">Institucional</h4>
//               <ul className="space-y-2 text-sm text-slate-600">
//                 <li className="hover:text-blue-600 cursor-pointer transition-colors">Sobre</li>
//                 <li className="hover:text-blue-600 cursor-pointer transition-colors">Termos</li>
//                 <li className="hover:text-blue-600 cursor-pointer transition-colors">Privacidade</li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-semibold text-slate-900 mb-4">Contato</h4>
//               <p className="text-sm text-slate-600 mb-2">felipedasilvamattos50@gmail.com</p>
//               <div className="flex gap-4 mt-4">
//                 <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-blue-100 cursor-pointer transition-colors">
//                   <span className="text-xs font-bold text-slate-600">In</span>
//                 </div>
//                 <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-blue-100 cursor-pointer transition-colors">
//                   <span className="text-xs font-bold text-slate-600">Gh</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
//             <p className="text-xs text-slate-400">© 2026 Secretaria Docs. Desenvolvido para o Hackathon 2026.</p>
//             <div className="flex gap-6">
//               <span className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer">Brasil</span>
//               <span className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer">Português (PT-BR)</span>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Lock, User, AlertCircle, ShieldCheck, Zap, Clock, ChevronRight, HelpCircle } from 'lucide-react';
import UserUpload from './UserUpload';
import SecretariaPanel from './SecretariaPanel';

type UserRole = 'selection' | 'user' | 'secretaria';

export default function Home() {
  const [role, setRole] = useState<UserRole>('selection');
  const [userId, setUserId] = useState('');
  const [tempUserId, setTempUserId] = useState('');
  const [secretariaPass, setSecretariaPass] = useState('');
  const [showPassInput, setShowPassInput] = useState(false);
  const [passError, setPassError] = useState(false);

  const handleUserAccess = () => {
    if (tempUserId.trim()) {
      setUserId(tempUserId);
      setRole('user');
    }
  };

  const handleSecretariaAccess = () => {
    if (secretariaPass === 'admin123') {
      setRole('secretaria');
      setPassError(false);
    } else {
      setPassError(true);
    }
  };

  const handleBackToSelection = () => {
    setRole('selection');
    setUserId('');
    setTempUserId('');
    setSecretariaPass('');
    setShowPassInput(false);
    setPassError(false);
  };

  if (role === 'user' && userId) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">Secretaria Docs</h1>
            </div>
            <Button variant="ghost" onClick={handleBackToSelection} className="text-slate-600 hover:text-red-600">Sair</Button>
          </div>
        </header>
        <main className="flex-grow"><UserUpload userId={userId} /></main>
      </div>
    );
  }

  if (role === 'secretaria') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-600 p-1.5 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">Painel Administrativo</h1>
            </div>
            <Button variant="ghost" onClick={handleBackToSelection} className="text-slate-600 hover:text-red-600">Sair do Painel</Button>
          </div>
        </header>
        <main className="flex-grow"><SecretariaPanel /></main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col relative overflow-hidden">
      {/* Elementos de Fundo Decorativos */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-100/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex-grow flex flex-col items-center p-4 py-16 relative z-10">
        <div className="w-full max-w-6xl">
          
          {/* Hero Section */}
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-6xl font-black text-slate-900 tracking-tight mb-6">
              Documentos Digitais,   

              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
                Validação Instantânea.
              </span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              A solução definitiva para instituições de ensino que buscam agilidade na análise de documentos e segurança para seus alunos.
            </p>
          </div>

          {/* Cards de Acesso com Efeito Glass */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            <Card className="group hover:shadow-2xl transition-all duration-500 border border-white/50 bg-white/40 backdrop-blur-xl shadow-xl overflow-hidden">
              <div className="h-2 bg-blue-600 w-0 group-hover:w-full transition-all duration-500" />
              <CardHeader className="text-center pt-8">
                <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200 group-hover:rotate-3 transition-transform">
                  <User className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-slate-800">Sou Aluno</CardTitle>
                <CardDescription className="text-slate-500">Envie seus documentos em segundos</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-4">
                <Input
                  placeholder="Seu CPF "
                  value={tempUserId}
                  onChange={(e) => setTempUserId(e.target.value)}
                  className="h-14 bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-lg"
                />
                <Button onClick={handleUserAccess} disabled={!tempUserId.trim()} className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-lg font-bold shadow-lg shadow-blue-200 group">
                  Acessar Agora <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border border-white/50 bg-white/40 backdrop-blur-xl shadow-xl overflow-hidden">
              <div className="h-2 bg-emerald-600 w-0 group-hover:w-full transition-all duration-500" />
              <CardHeader className="text-center pt-8">
                <div className="bg-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200 group-hover:-rotate-3 transition-transform">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-slate-800">Secretaria</CardTitle>
                <CardDescription className="text-slate-500">Gestão e validação administrativa</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-4">
                {!showPassInput ? (
                  <Button onClick={() => setShowPassInput(true)} className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-lg font-bold shadow-lg shadow-emerald-200">
                    Painel Administrativo
                  </Button>
                ) : (
                  <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
                    <Input
                      type="password"
                      placeholder="Senha de Acesso"
                      value={secretariaPass}
                      onChange={(e) => setSecretariaPass(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSecretariaAccess()}
                      className={`h-14 bg-white/50 ${passError ? 'border-red-500' : 'border-slate-200'}`}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setShowPassInput(false)} className="flex-1 h-12">Voltar</Button>
                      <Button onClick={handleSecretariaAccess} className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700">Entrar</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mb-24">
            <div className="flex items-center justify-center gap-2 mb-8">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              <h2 className="text-3xl font-bold text-slate-900">Dúvidas Frequentes</h2>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="bg-white rounded-xl border border-slate-200 px-4">
                <AccordionTrigger className="text-slate-700 font-semibold hover:no-underline">Quais documentos posso enviar?</AccordionTrigger>
                <AccordionContent className="text-slate-500">
                  Você pode enviar CPF, RG, Comprovante de Residência e Histórico Escolar nos formatos PDF ou Imagem (JPG/PNG).
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="bg-white rounded-xl border border-slate-200 px-4">
                <AccordionTrigger className="text-slate-700 font-semibold hover:no-underline">Quanto tempo leva a análise?</AccordionTrigger>
                <AccordionContent className="text-slate-500">
                  O prazo médio de análise pela nossa secretaria é de até 48 horas úteis após o envio completo.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="bg-white rounded-xl border border-slate-200 px-4">
                <AccordionTrigger className="text-slate-700 font-semibold hover:no-underline">Meus dados estão seguros?</AccordionTrigger>
                <AccordionContent className="text-slate-500">
                  Sim! Utilizamos criptografia de ponta a ponta e seguimos todas as normas da LGPD para garantir sua privacidade.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <FileText className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">Secretaria Docs</span>
          </div>
          <p className="text-slate-500 text-sm mb-8 max-w-md mx-auto">
            A plataforma líder em gestão documental para instituições de ensino modernas.
          </p>
          <div className="flex justify-center gap-8 text-sm text-slate-400 mb-8">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Privacidade</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Termos</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Contato</span>
          </div>
          <p className="text-xs text-slate-400">© 2026 Secretaria Docs. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
