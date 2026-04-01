import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type FormType = 'pf' | 'pj';

interface FormError {
  [key: string]: string;
}

interface FormData {
  [key: string]: any;
}

export default function Cadastro() {
  const [activeTab, setActiveTab] = useState<FormType>('pf');
  const [pfErrors, setPfErrors] = useState<FormError>({});
  const [pjErrors, setPjErrors] = useState<FormError>({});
  const [pfData, setPfData] = useState<FormData>({});
  const [pjData, setPjData] = useState<FormData>({});
  const [pfSubmitting, setPfSubmitting] = useState(false);
  const [pjSubmitting, setPjSubmitting] = useState(false);

  // Campos obrigatórios PF
  const pfRequiredFields = [
    'dataCadastro', 'nomeCompleto', 'cpf', 'rg', 'dataNascimento',
    'nomeMae', 'endereco', 'numero', 'bairro', 'cep', 'cidade', 'uf',
    'telefone', 'email', 'empresa1', 'contato1', 'telefone1',
    'estudante', 'nomePai', 'rgCnh', 'cpfCnh', 'comprovante'
  ];

  // Campos obrigatórios PJ
  const pjRequiredFields = [
    'dataCadastro', 'contato', 'telefone', 'email', 'endereco',
    'bairro', 'cep', 'cidade', 'uf', 'nomeCompleto1',
    'dataNascimento1', 'rg1', 'cpf1', 'empresa1', 'contatoEmpresa1',
    'telefoneEmpresa1', 'razaoSocial', 'dataFundacao', 'ocupacao',
    'ramoAtividade', 'ultimaAlteracao', 'cartaoCnpj', 'comprovante'
  ];

  const validatePF = () => {
    const errors: FormError = {};
    pfRequiredFields.forEach(field => {
      if (!pfData[field]) {
        errors[field] = 'Campo obrigatório';
      }
    });
    setPfErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePJ = () => {
    const errors: FormError = {};
    pjRequiredFields.forEach(field => {
      if (!pjData[field]) {
        errors[field] = 'Campo obrigatório';
      }
    });
    setPjErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePFChange = (field: string, value: any) => {
    setPfData({ ...pfData, [field]: value });
    if (pfErrors[field]) {
      setPfErrors({ ...pfErrors, [field]: '' });
    }
  };

  const handlePJChange = (field: string, value: any) => {
    setPjData({ ...pjData, [field]: value });
    if (pjErrors[field]) {
      setPjErrors({ ...pjErrors, [field]: '' });
    }
  };

  const handlePFSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePF()) {
      setPfSubmitting(true);
      // Simular envio
      setTimeout(() => {
        console.log('PF Data:', pfData);
        alert('Cadastro PF enviado com sucesso!');
        setPfSubmitting(false);
        setPfData({});
      }, 1000);
    }
  };

  const handlePJSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePJ()) {
      setPjSubmitting(true);
      // Simular envio
      setTimeout(() => {
        console.log('PJ Data:', pjData);
        alert('Cadastro PJ enviado com sucesso!');
        setPjSubmitting(false);
        setPjData({});
      }, 1000);
    }
  };

  const FormField = ({ 
    label, 
    name, 
    type = 'text', 
    required = false, 
    error, 
    value, 
    onChange,
    placeholder = ''
  }: any) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-white mb-1">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value || ''}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          rows={4}
        />
      ) : type === 'file' ? (
        <input
          type="file"
          name={name}
          onChange={(e) => onChange(name, e.target.files?.[0])}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          accept=".pdf,.jpg,.jpeg,.png"
        />
      ) : type === 'date' ? (
        <input
          type="date"
          name={name}
          value={value || ''}
          onChange={(e) => onChange(name, e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
      ) : type === 'radio' ? (
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name={name}
              value="sim"
              checked={value === 'sim'}
              onChange={(e) => onChange(name, e.target.value)}
              className="mr-2"
            />
            Sim
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name={name}
              value="nao"
              checked={value === 'nao'}
              onChange={(e) => onChange(name, e.target.value)}
              className="mr-2"
            />
            Não
          </label>
        </div>
      ) : (
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
      )}
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-black pt-32 pb-16">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">CADASTRE-SE</h1>
          <p className="text-white">Preencha o formulário abaixo para se cadastrar na Loc 7</p>
        </div>

        {/* Informações Importantes */}
        <div className="mb-8 space-y-4">
          <div className="bg-transparent border border-red-500 rounded-lg p-4">
            <h3 className="font-bold text-red-400 mb-2">⚠️ ATENÇÃO!</h3>
            <p className="text-white text-sm">
              O cadastro ocorre em horário comercial: <strong>de segunda à sexta-feira, das 09:00 às 17:00 hs</strong>. Prazo de aprovação de até <strong>1 hora</strong> a partir do recebimento dos dados, junto com os documentos solicitados.
            </p>
          </div>
          <div className="bg-transparent border border-red-500 rounded-lg p-4">
            <p className="text-white text-sm">
              <strong>*</strong> Indica uma pergunta obrigatória
            </p>
          </div>
        </div>

        <Card className="bg-transparent border-transparent p-8">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FormType)}>
            <TabsList className="grid w-full grid-cols-2 bg-transparent mb-8 gap-4">
              <TabsTrigger value="pf" className="!data-[state=active]:bg-black !data-[state=active]:text-white !data-[state=active]:border-2 !data-[state=active]:border-black !data-[state=inactive]:bg-transparent !data-[state=inactive]:border-2 !data-[state=inactive]:border-white !data-[state=inactive]:text-white !font-bold text-lg hover:bg-white/10 hover:border-white transition-all duration-200">
                Pessoa Física
              </TabsTrigger>
              <TabsTrigger value="pj" className="!data-[state=active]:bg-black !data-[state=active]:text-white !data-[state=active]:border-2 !data-[state=active]:border-black !data-[state=inactive]:bg-transparent !data-[state=inactive]:border-2 !data-[state=inactive]:border-white !data-[state=inactive]:text-white !font-bold text-lg hover:bg-white/10 hover:border-white transition-all duration-200">
                Pessoa Jurídica
              </TabsTrigger>
            </TabsList>

            {/* FORMULÁRIO PF */}
            <TabsContent value="pf">
              <form onSubmit={handlePFSubmit}>
                {/* Seção 1: Informações Gerais */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-300">
                    1. INFORMAÇÕES GERAIS
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Data do Cadastro"
                      name="dataCadastro"
                      type="date"
                      required
                      error={pfErrors.dataCadastro}
                      value={pfData.dataCadastro}
                      onChange={handlePFChange}
                    />
                    <FormField
                      label="Nome Completo"
                      name="nomeCompleto"
                      required
                      error={pfErrors.nomeCompleto}
                      value={pfData.nomeCompleto}
                      onChange={handlePFChange}
                      placeholder="Digite seu nome completo"
                    />
                    <FormField
                      label="CPF"
                      name="cpf"
                      required
                      error={pfErrors.cpf}
                      value={pfData.cpf}
                      onChange={handlePFChange}
                      placeholder="000.000.000-00"
                    />
                    <FormField
                      label="RG"
                      name="rg"
                      required
                      error={pfErrors.rg}
                      value={pfData.rg}
                      onChange={handlePFChange}
                      placeholder="Digite seu RG"
                    />
                    <FormField
                      label="Data de Nascimento"
                      name="dataNascimento"
                      type="date"
                      required
                      error={pfErrors.dataNascimento}
                      value={pfData.dataNascimento}
                      onChange={handlePFChange}
                    />
                    <FormField
                      label="Nome da Mãe"
                      name="nomeMae"
                      required
                      error={pfErrors.nomeMae}
                      value={pfData.nomeMae}
                      onChange={handlePFChange}
                      placeholder="Digite o nome da mãe"
                    />
                  </div>
                </div>

                {/* Seção 2: Endereço */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-300">
                    2. ENDEREÇO
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Endereço"
                      name="endereco"
                      required
                      error={pfErrors.endereco}
                      value={pfData.endereco}
                      onChange={handlePFChange}
                      placeholder="Rua, Avenida, etc."
                    />
                    <FormField
                      label="Número"
                      name="numero"
                      required
                      error={pfErrors.numero}
                      value={pfData.numero}
                      onChange={handlePFChange}
                      placeholder="Número"
                    />
                    <FormField
                      label="Bairro"
                      name="bairro"
                      required
                      error={pfErrors.bairro}
                      value={pfData.bairro}
                      onChange={handlePFChange}
                      placeholder="Bairro"
                    />
                    <FormField
                      label="CEP"
                      name="cep"
                      required
                      error={pfErrors.cep}
                      value={pfData.cep}
                      onChange={handlePFChange}
                      placeholder="00000-000"
                    />
                    <FormField
                      label="Cidade"
                      name="cidade"
                      required
                      error={pfErrors.cidade}
                      value={pfData.cidade}
                      onChange={handlePFChange}
                      placeholder="Cidade"
                    />
                    <FormField
                      label="UF (Estado)"
                      name="uf"
                      required
                      error={pfErrors.uf}
                      value={pfData.uf}
                      onChange={handlePFChange}
                      placeholder="SP"
                    />
                    <FormField
                      label="Rede Social"
                      name="redeSocial"
                      error={pfErrors.redeSocial}
                      value={pfData.redeSocial}
                      onChange={handlePFChange}
                      placeholder="(Opcional)"
                    />
                  </div>
                </div>

                {/* Seção 3: Contato */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-300">
                    3. CONTATO
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Telefone (com DDD)"
                      name="telefone"
                      required
                      error={pfErrors.telefone}
                      value={pfData.telefone}
                      onChange={handlePFChange}
                      placeholder="(11) 99999-9999"
                    />
                    <FormField
                      label="E-mail"
                      name="email"
                      type="email"
                      required
                      error={pfErrors.email}
                      value={pfData.email}
                      onChange={handlePFChange}
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                {/* Seção 4: Referências Comerciais */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-300">
                    4. REFERÊNCIAS COMERCIAIS
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">(Preferência na área audiovisual: Locadoras, fornecedores)</p>
                  
                  {/* Referência 1 */}
                  <div className="bg-transparent p-4 rounded-md mb-4">
                    <h3 className="text-white font-semibold mb-3">Referência 1</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        label="Empresa"
                        name="empresa1"
                        required
                        error={pfErrors.empresa1}
                        value={pfData.empresa1}
                        onChange={handlePFChange}
                      />
                      <FormField
                        label="Nome do Contato"
                        name="nomeContato1"
                        required
                        error={pfErrors.nomeContato1}
                        value={pfData.nomeContato1}
                        onChange={handlePFChange}
                      />
                      <FormField
                        label="Telefone (com DDD)"
                        name="telefone1"
                        required
                        error={pfErrors.telefone1}
                        value={pfData.telefone1}
                        onChange={handlePFChange}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Nome da Mãe"
                      name="nomeMae"
                      required
                      error={pfErrors.nomeMae}
                      value={pfData.nomeMae}
                      onChange={handlePFChange}
                    />
                    <FormField
                      label="Nome do Pai"
                      name="nomePai"
                      required
                      error={pfErrors.nomePai}
                      value={pfData.nomePai}
                      onChange={handlePFChange}
                    />
                  </div>

                  {/* Referência 2 */}
                  <div className="bg-transparent p-4 rounded-md mb-4">
                    <h3 className="text-white font-semibold mb-3">Referência 2 (Opcional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        label="Empresa"
                        name="empresa2"
                        error={pfErrors.empresa2}
                        value={pfData.empresa2}
                        onChange={handlePFChange}
                      />
                      <FormField
                        label="Nome do Contato"
                        name="contato2"
                        error={pfErrors.contato2}
                        value={pfData.contato2}
                        onChange={handlePFChange}
                      />
                      <FormField
                        label="Telefone (com DDD)"
                        name="telefone2"
                        error={pfErrors.telefone2}
                        value={pfData.telefone2}
                        onChange={handlePFChange}
                      />
                    </div>
                  </div>

                  {/* Referência 3 */}
                  <div className="bg-transparent p-4 rounded-md">
                    <h3 className="text-white font-semibold mb-3">Referência 3 (Opcional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        label="Empresa"
                        name="empresa3"
                        error={pfErrors.empresa3}
                        value={pfData.empresa3}
                        onChange={handlePFChange}
                      />
                      <FormField
                        label="Nome do Contato"
                        name="contato3"
                        error={pfErrors.contato3}
                        value={pfData.contato3}
                        onChange={handlePFChange}
                      />
                      <FormField
                        label="Telefone (com DDD)"
                        name="telefone3"
                        error={pfErrors.telefone3}
                        value={pfData.telefone3}
                        onChange={handlePFChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Seção 5: Informações Adicionais */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-300">
                    5. INFORMAÇÕES ADICIONAIS
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Ocupação Profissional"
                      name="ocupacao"
                      error={pfErrors.ocupacao}
                      value={pfData.ocupacao}
                      onChange={handlePFChange}
                      placeholder="(Opcional)"
                    />
                    <FormField
                      label="Ramo de Atividade"
                      name="ramoAtividade"
                      error={pfErrors.ramoAtividade}
                      value={pfData.ramoAtividade}
                      onChange={handlePFChange}
                      placeholder="(Opcional)"
                    />
                    <FormField
                      label="Pertence a alguma associação (APRO, ABPTV, etc.)"
                      name="associacao"
                      error={pfErrors.associacao}
                      value={pfData.associacao}
                      onChange={handlePFChange}
                      placeholder="(Opcional)"
                    />
                    <FormField
                      label="Qual Associação"
                      name="qualAssociacao"
                      error={pfErrors.qualAssociacao}
                      value={pfData.qualAssociacao}
                      onChange={handlePFChange}
                      placeholder="(Opcional)"                    />
                  </div>
                  <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-white mb-3">
                        Estudante
                        <span className="text-red-600 ml-1">*</span>
                      </label>
                      <div className="flex gap-6">
                        <button
                          type="button"
                          onClick={() => handlePFChange("estudante", "sim")}
                          className={`px-6 py-2 rounded border-2 font-semibold transition ${
                            pfData.estudante === "sim"
                              ? "bg-black text-white border-black"
                              : "bg-transparent text-white border-white/50"
                          }`}
                        >
                          Sim
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePFChange("estudante", "nao")}
                          className={`px-6 py-2 rounded border-2 font-semibold transition ${
                            pfData.estudante === "nao"
                              ? "bg-black text-white border-black"
                              : "bg-transparent text-white border-white/50"
                          }`}
                        >
                          Não
                        </button>
                      </div>
                      {pfErrors.estudante && <span className="text-red-600 text-sm">{pfErrors.estudante}</span>}
                    </div>
                </div>

                {/* Seção 6: Documentos */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-300">
                    6. DOCUMENTOS NECESSÁRIOS
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">Serão necessários UP-loads de documentos</p>
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      label="RG ou CNH"
                      name="rgCnh"
                      type="file"
                      required
                      error={pfErrors.rgCnh}
                      value={pfData.rgCnh}
                      onChange={handlePFChange}
                    />
                    <FormField
                      label="CPF ou CNH"
                      name="cpfCnh"
                      type="file"
                      required
                      error={pfErrors.cpfCnh}
                      value={pfData.cpfCnh}
                      onChange={handlePFChange}
                    />
                    <FormField
                      label="Comprovante de Residência"
                      name="comprovante"
                      type="file"
                      required
                      error={pfErrors.comprovante}
                      value={pfData.comprovante}
                      onChange={handlePFChange}
                    />
                    <p className="text-gray-400 text-xs">(Água, luz, internet) Atual / máximo 3 meses</p>
                  </div>
                </div>

                {/* Botão Enviar */}
                <div className="flex gap-4 mb-8">
                  <Button
                    type="submit"
                    disabled={pfSubmitting}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md"
                  >
                    {pfSubmitting ? 'Enviando...' : 'ENVIAR CADASTRO'}
                  </Button>
                </div>

                {/* Caixa de Pagamento */}
                <div className="mb-8 bg-transparent border border-green-300 rounded-lg p-3">
                  <p className="text-white text-xs">
                    <strong>Pagamento:</strong> O pagamento da primeira locação deve ser feito <strong>À VISTA, via PIX ou dinheiro</strong>. Pagamentos via cartão de crédito estão sujeitos a taxas das operadoras.
                  </p>
                </div>
              </form>
            </TabsContent>

            {/* FORMULÁRIO PJ */}
            <TabsContent value="pj">
              <form onSubmit={handlePJSubmit}>
                {/* Seção 1: Informações Gerais */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-300">
                    1. INFORMAÇÕES GERAIS PARA FATURAMENTO
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Data do Cadastro"
                      name="dataCadastro"
                      type="date"
                      required
                      error={pjErrors.dataCadastro}
                      value={pjData.dataCadastro}
                      onChange={handlePJChange}
                    />
                    <FormField
                      label="Contato / Nome Completo"
                      name="contato"
                      required
                      error={pjErrors.contato}
                      value={pjData.contato}
                      onChange={handlePJChange}
                      placeholder="Digite o nome completo"
                    />
                    <FormField
                      label="Telefone (com DDD)"
                      name="telefone"
                      required
                      error={pjErrors.telefone}
                      value={pjData.telefone}
                      onChange={handlePJChange}
                      placeholder="(11) 99999-9999"
                    />
                    <FormField
                      label="E-mail"
                      name="email"
                      type="email"
                      required
                      error={pjErrors.email}
                      value={pjData.email}
                      onChange={handlePJChange}
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                {/* Seção 2: Endereço */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-300">
                    2. ENDEREÇOS PARA ENTREGAS E COBRANÇAS
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Endereço"
                      name="endereco"
                      required
                      error={pjErrors.endereco}
                      value={pjData.endereco}
                      onChange={handlePJChange}
                      placeholder="Rua, Avenida, etc."
                    />
                    <FormField
                      label="Complemento"
                      name="complemento"
                      error={pjErrors.complemento}
                      value={pjData.complemento}
                      onChange={handlePJChange}
                      placeholder="(Opcional)"
                    />
                    <FormField
                      label="Bairro"
                      name="bairro"
                      required
                      error={pjErrors.bairro}
                      value={pjData.bairro}
                      onChange={handlePJChange}
                      placeholder="Bairro"
                    />
                    <FormField
                      label="CEP"
                      name="cep"
                      required
                      error={pjErrors.cep}
                      value={pjData.cep}
                      onChange={handlePJChange}
                      placeholder="00000-000"
                    />
                    <FormField
                      label="Cidade"
                      name="cidade"
                      required
                      error={pjErrors.cidade}
                      value={pjData.cidade}
                      onChange={handlePJChange}
                      placeholder="Cidade"
                    />
                    <FormField
                      label="UF (Estado)"
                      name="uf"
                      required
                      error={pjErrors.uf}
                      value={pjData.uf}
                      onChange={handlePJChange}
                      placeholder="SP"
                    />
                    <FormField
                      label="Site"
                      name="site"
                      error={pjErrors.site}
                      value={pjData.site}
                      onChange={handlePJChange}
                      placeholder="(Opcional)"
                    />
                    <FormField
                      label="Rede Social"
                      name="redeSocial"
                      error={pjErrors.redeSocial}
                      value={pjData.redeSocial}
                      onChange={handlePJChange}
                      placeholder="(Opcional)"
                    />
                  </div>
                </div>

                {/* Seção 3: Proprietários */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-300">
                    3. DADOS DO(S) PROPRIETÁRIO(S) DA EMPRESA
                  </h2>
                  
                  {/* Proprietário 1 */}
                  <div className="bg-transparent p-4 rounded-md mb-4">
                    <h3 className="text-white font-semibold mb-3">Proprietário 1</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Nome Completo"
                        name="nomeCompleto1"
                        required
                        error={pjErrors.nomeCompleto1}
                        value={pjData.nomeCompleto1}
                        onChange={handlePJChange}
                      />
                      <FormField
                        label="Data de Nascimento"
                        name="dataNascimento1"
                        type="date"
                        required
                        error={pjErrors.dataNascimento1}
                        value={pjData.dataNascimento1}
                        onChange={handlePJChange}
                      />
                      <FormField
                        label="RG"
                        name="rg1"
                        required
                        error={pjErrors.rg1}
                        value={pjData.rg1}
                        onChange={handlePJChange}
                      />
                      <FormField
                        label="CPF"
                        name="cpf1"
                        required
                        error={pjErrors.cpf1}
                        value={pjData.cpf1}
                        onChange={handlePJChange}
                      />
                    </div>
                  </div>

                  {/* Proprietário 2 */}
                  <div className="bg-transparent p-4 rounded-md">
                    <h3 className="text-white font-semibold mb-3">Proprietário 2 (Opcional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Nome Completo"
                        name="nomeCompleto2"
                        error={pjErrors.nomeCompleto2}
                        value={pjData.nomeCompleto2}
                        onChange={handlePJChange}
                      />
                      <FormField
                        label="Data de Nascimento"
                        name="dataNascimento2"
                        type="date"
                        error={pjErrors.dataNascimento2}
                        value={pjData.dataNascimento2}
                        onChange={handlePJChange}
                      />
                      <FormField
                        label="RG"
                        name="rg2"
                        error={pjErrors.rg2}
                        value={pjData.rg2}
                        onChange={handlePJChange}
                      />
                      <FormField
                        label="CPF"
                        name="cpf2"
                        error={pjErrors.cpf2}
                        value={pjData.cpf2}
                        onChange={handlePJChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Seção 4: Referências Comerciais */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-300">
                    4. REFERÊNCIAS COMERCIAIS
                  </h2>
                  
                  {/* Referência 1 */}
                  <div className="bg-transparent p-4 rounded-md mb-4">
                    <h3 className="text-white font-semibold mb-3">Referência 1</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        label="Empresa"
                        name="empresa1"
                        required
                        error={pjErrors.empresa1}
                        value={pjData.empresa1}
                        onChange={handlePJChange}
                      />
                      <FormField
                        label="Nome do Contato"
                        name="contatoEmpresa1"
                        required
                        error={pjErrors.contatoEmpresa1}
                        value={pjData.contatoEmpresa1}
                        onChange={handlePJChange}
                      />
                      <FormField
                        label="Telefone"
                        name="telefoneEmpresa1"
                        required
                        error={pjErrors.telefoneEmpresa1}
                        value={pjData.telefoneEmpresa1}
                        onChange={handlePJChange}
                      />
                    </div>
                  </div>

                  {/* Referência 2 */}
                  <div className="bg-transparent p-4 rounded-md">
                    <h3 className="text-white font-semibold mb-3">Referência 2 (Opcional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        label="Empresa"
                        name="empresa2"
                        error={pjErrors.empresa2}
                        value={pjData.empresa2}
                        onChange={handlePJChange}
                      />
                      <FormField
                        label="Nome do Contato"
                        name="contatoEmpresa2"
                        error={pjErrors.contatoEmpresa2}
                        value={pjData.contatoEmpresa2}
                        onChange={handlePJChange}
                      />
                      <FormField
                        label="Telefone"
                        name="telefoneEmpresa2"
                        error={pjErrors.telefoneEmpresa2}
                        value={pjData.telefoneEmpresa2}
                        onChange={handlePJChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Seção 5: Informações da Empresa */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-300">
                    5. INFORMAÇÕES DA EMPRESA
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Razão Social"
                      name="razaoSocial"
                      required
                      error={pjErrors.razaoSocial}
                      value={pjData.razaoSocial}
                      onChange={handlePJChange}
                    />
                    <FormField
                      label="Nome Fantasia"
                      name="nomeFantasia"
                      error={pjErrors.nomeFantasia}
                      value={pjData.nomeFantasia}
                      onChange={handlePJChange}
                      placeholder="(Opcional)"
                    />
                    <FormField
                      label="Inscrição Municipal"
                      name="inscricaoMunicipal"
                      error={pjErrors.inscricaoMunicipal}
                      value={pjData.inscricaoMunicipal}
                      onChange={handlePJChange}
                      placeholder="(Opcional)"
                    />
                    <FormField
                      label="Inscrição Estadual"
                      name="inscricaoEstadual"
                      error={pjErrors.inscricaoEstadual}
                      value={pjData.inscricaoEstadual}
                      onChange={handlePJChange}
                      placeholder="(Opcional)"
                    />
                    <FormField
                      label="Data de Fundação"
                      name="dataFundacao"
                      type="date"
                      required
                      error={pjErrors.dataFundacao}
                      value={pjData.dataFundacao}
                      onChange={handlePJChange}
                    />
                    <FormField
                      label="Ocupação Profissional"
                      name="ocupacao"
                      required
                      error={pjErrors.ocupacao}
                      value={pjData.ocupacao}
                      onChange={handlePJChange}
                    />
                    <FormField
                      label="Ramo de Atividade"
                      name="ramoAtividade"
                      required
                      error={pjErrors.ramoAtividade}
                      value={pjData.ramoAtividade}
                      onChange={handlePJChange}
                    />
                  </div>
                </div>

                {/* Seção 6: Documentos */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-300">
                    6. DOCUMENTOS NECESSÁRIOS
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">Serão necessários UP-loads de documentos</p>
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      label="Última Alteração Contratual"
                      name="ultimaAlteracao"
                      type="file"
                      required
                      error={pjErrors.ultimaAlteracao}
                      value={pjData.ultimaAlteracao}
                      onChange={handlePJChange}
                    />
                    <FormField
                      label="Cartão do CNPJ Atualizado"
                      name="cartaoCnpj"
                      type="file"
                      required
                      error={pjErrors.cartaoCnpj}
                      value={pjData.cartaoCnpj}
                      onChange={handlePJChange}
                    />
                    <FormField
                      label="Comprovante de Endereço Recente"
                      name="comprovante"
                      type="file"
                      required
                      error={pjErrors.comprovante}
                      value={pjData.comprovante}
                      onChange={handlePJChange}
                    />
                    <p className="text-gray-400 text-xs">(Água ou luz ou telefone fixo) Atual / máximo 3 meses</p>
                  </div>
                </div>

                {/* Botão Enviar */}
                <div className="flex gap-4 mb-8">
                  <Button
                    type="submit"
                    disabled={pjSubmitting}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md"
                  >
                    {pjSubmitting ? 'Enviando...' : 'ENVIAR CADASTRO'}
                  </Button>
                </div>

                {/* Caixa de Pagamento */}
                <div className="mb-8 bg-transparent border border-green-300 rounded-lg p-3">
                  <p className="text-white text-xs">
                    <strong>Pagamento:</strong> O pagamento da primeira locação deve ser feito <strong>À VISTA, via PIX ou dinheiro</strong>. Pagamentos via cartão de crédito estão sujeitos a taxas das operadoras.
                  </p>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
