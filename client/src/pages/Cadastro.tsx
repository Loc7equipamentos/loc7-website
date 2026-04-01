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

// Estados brasileiros e suas cidades
const estadosCidades: { [key: string]: string[] } = {
  'AC': ['Rio Branco', 'Cruzeiro do Sul'],
  'AL': ['Maceió', 'Rio Largo', 'Marechal Deodoro'],
  'AP': ['Macapá', 'Santana'],
  'AM': ['Manaus', 'Itacoatiara', 'Parintins'],
  'BA': ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Ilhéus', 'Jequié'],
  'CE': ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú'],
  'DF': ['Brasília'],
  'ES': ['Vitória', 'Vila Velha', 'Serra', 'Cariacica'],
  'GO': ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde'],
  'MA': ['São Luís', 'Imperatriz', 'Caxias'],
  'MT': ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop'],
  'MS': ['Campo Grande', 'Dourados', 'Três Lagoas'],
  'MG': ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Montes Claros'],
  'PA': ['Belém', 'Ananindeua', 'Santarém', 'Marabá'],
  'PB': ['João Pessoa', 'Campina Grande', 'Santa Rita'],
  'PR': ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel'],
  'PE': ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru'],
  'PI': ['Teresina', 'Parnaíba', 'Picos'],
  'RJ': ['Rio de Janeiro', 'Niterói', 'Duque de Caxias', 'São Gonçalo', 'Nova Iguaçu'],
  'RN': ['Natal', 'Mossoró', 'Parnamirim'],
  'RS': ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Santa Maria', 'Novo Hamburgo'],
  'RO': ['Porto Velho', 'Ji-Paraná', 'Ariquemes'],
  'RR': ['Boa Vista', 'Rorainópolis'],
  'SC': ['Florianópolis', 'Joinville', 'Blumenau', 'Itajaí'],
  'SP': ['São Paulo', 'Campinas', 'Santos', 'Sorocaba', 'Ribeirão Preto', 'Piracicaba'],
  'SE': ['Aracaju', 'Lagarto'],
  'TO': ['Palmas', 'Araguaína']
};

const estados = Object.keys(estadosCidades).sort();

export default function Cadastro() {
  const [activeTab, setActiveTab] = useState<FormType>('pf');
  const [pfErrors, setPfErrors] = useState<FormError>({});
  const [pjErrors, setPjErrors] = useState<FormError>({});
  const [pfData, setPfData] = useState<FormData>({});
  const [pjData, setPjData] = useState<FormData>({});
  const [pfSubmitting, setPfSubmitting] = useState(false);
  const [pjSubmitting, setPjSubmitting] = useState(false);
  const [socialDialogOpen, setSocialDialogOpen] = useState(false);
  const [socialDialogOpenPJ, setSocialDialogOpenPJ] = useState(false);
  const [pfSuccess, setPfSuccess] = useState(false);
  const [pjSuccess, setPjSuccess] = useState(false);
  const [pfCidades, setPfCidades] = useState<string[]>([]);
  const [pjCidades, setPjCidades] = useState<string[]>([]);

  const pfRequiredFields = ['dataCadastro', 'nomeCompleto', 'cpf', 'dataNascimento', 'nomeMae', 'endereco', 'numero', 'bairro', 'cep', 'cidade', 'uf', 'telefone', 'email', 'empresa1', 'nomeContato1', 'telefoneDdd1', 'rg', 'cnhValida', 'redeSocial', 'documento1'];

  const pjRequiredFields = ['dataCadastro', 'nomeCompleto', 'cpf', 'dataNascimento', 'nomeMae', 'endereco', 'numero', 'bairro', 'cep', 'cidade', 'uf', 'telefone', 'email', 'empresa1', 'nomeContato1', 'telefoneDdd1', 'razaoSocial', 'dataFundacao', 'ocupacao', 'ramoAtividade', 'redeSocial', 'documento1'];

  const formatMask = (value: string, mask: string): string => {
    const digits = value.replace(/\D/g, '');
    let formatted = '';
    let digitIndex = 0;

    for (let i = 0; i < mask.length && digitIndex < digits.length; i++) {
      if (mask[i] === '9') {
        formatted += digits[digitIndex];
        digitIndex++;
      } else {
        formatted += mask[i];
      }
    }

    return formatted.substring(0, mask.length);
  };

  const getMask = (fieldName: string): string | undefined => {
    if (fieldName === 'cpf') return '999.999.999-99';
    if (fieldName === 'cnpj') return '99.999.999/9999-99';
    if (fieldName === 'telefone' || fieldName === 'telefoneDdd' || fieldName === 'telefoneDdd1') return '(99) 99999-9999';
    if (fieldName === 'cep') return '99999-999';
    return undefined;
  };

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
    if (field === 'uf' && value) {
      setPfCidades(estadosCidades[value] || []);
      setPfData(prev => ({ ...prev, cidade: '' }));
    }
  };

  const handlePJChange = (field: string, value: any) => {
    setPjData({ ...pjData, [field]: value });
    if (pjErrors[field]) {
      setPjErrors({ ...pjErrors, [field]: '' });
    }
    if (field === 'uf' && value) {
      setPjCidades(estadosCidades[value] || []);
      setPjData(prev => ({ ...prev, cidade: '' }));
    }
  };

  const handlePFSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePF()) {
      setPfSubmitting(true);
      setTimeout(() => {
        console.log('PF Data:', pfData);
        setPfSuccess(true);
        setPfSubmitting(false);
        setPfData({});
        setTimeout(() => setPfSuccess(false), 5000);
      }, 1000);
    }
  };

  const handlePJSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePJ()) {
      setPjSubmitting(true);
      setTimeout(() => {
        console.log('PJ Data:', pjData);
        setPjSuccess(true);
        setPjSubmitting(false);
        setPjData({});
        setTimeout(() => setPjSuccess(false), 5000);
      }, 1000);
    }
  };

  const getMask2 = (fieldName: string): string | undefined => {
    if (fieldName === 'cpf') return '999.999.999-99';
    if (fieldName === 'cnpj') return '99.999.999/9999-99';
    if (fieldName === 'telefone' || fieldName === 'telefoneDdd') return '(99) 99999-9999';
    if (fieldName === 'cep') return '99999-999';
    return undefined;
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
  }: any) => {
    const mask = getMask2(name);
    return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-white mb-1">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      {type === 'select' ? (
        <select
          name={name}
          value={value || ''}
          onChange={(e) => onChange(name, e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-black ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
        >
          <option value="">Selecione...</option>
          {placeholder && placeholder.map((opt: string) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
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
      ) : mask ? (
        <input
          type="text"
          name={name}
          value={value || ''}
          onChange={(e) => {
            const rawValue = e.target.value;
            const digits = rawValue.replace(/\D/g, '');
            const formatted = formatMask(digits, mask);
            onChange(name, formatted);
          }}
          placeholder={placeholder}
          maxLength={mask.length}
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
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-16">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">CADASTRE-SE</h1>
          <p className="text-white">Preencha o formulário abaixo para se cadastrar na Loc 7</p>
        </div>

        <div className="mb-6 border border-red-400 rounded-md p-4 bg-transparent">
          <p className="text-white text-sm">
            <span className="text-red-600 font-bold">⚠️ ATENÇÃO!</span> O cadastro ocorre em horário comercial: de segunda à sexta-feira, das 09:00 às 17:00 hs. Prazo de aprovação de até 1 hora a partir do recebimento dos dados, junto com os documentos solicitados.
          </p>
        </div>

        <div className="mb-6 border border-red-400 rounded-md p-4 bg-transparent">
          <p className="text-white text-sm">
            <span className="text-red-600 font-bold">*</span> Indica uma pergunta obrigatória
          </p>
        </div>

        <Card className="bg-white/0 border-0">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as FormType)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 gap-4 bg-transparent mb-6">
              <TabsTrigger 
                value="pf" 
                className={`border-2 border-white font-bold text-lg transition-all duration-200 hover:bg-white/10 ${
                  activeTab === 'pf' 
                    ? 'bg-black text-white' 
                    : 'bg-transparent text-black'
                }`}
              >
                Pessoa Física
              </TabsTrigger>
              <TabsTrigger 
                value="pj" 
                className={`border-2 border-white font-bold text-lg transition-all duration-200 hover:bg-white/10 ${
                  activeTab === 'pj' 
                    ? 'bg-black text-white' 
                    : 'bg-transparent text-black'
                }`}
              >
                Pessoa Jurídica
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pf">
              <form onSubmit={handlePFSubmit} className="space-y-6">
                <div className="bg-white/0 border-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">1. INFORMAÇÕES GERAIS</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Data do Cadastro" name="dataCadastro" type="date" required value={pfData.dataCadastro} onChange={handlePFChange} error={pfErrors.dataCadastro} />
                    <FormField label="Nome Completo" name="nomeCompleto" required value={pfData.nomeCompleto} onChange={handlePFChange} error={pfErrors.nomeCompleto} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="CPF" name="cpf" required value={pfData.cpf} onChange={handlePFChange} error={pfErrors.cpf} />
                    <FormField label="RG" name="rg" value={pfData.rg} onChange={handlePFChange} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Data de Nascimento" name="dataNascimento" type="date" required value={pfData.dataNascimento} onChange={handlePFChange} error={pfErrors.dataNascimento} />
                    <FormField label="Nome da Mãe" name="nomeMae" required value={pfData.nomeMae} onChange={handlePFChange} error={pfErrors.nomeMae} />
                  </div>
                </div>

                <div className="bg-white/0 border-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">2. ENDEREÇO</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Endereço" name="endereco" required value={pfData.endereco} onChange={handlePFChange} error={pfErrors.endereco} placeholder="Rua, Avenida, etc." />
                    <FormField label="Número" name="numero" required value={pfData.numero} onChange={handlePFChange} error={pfErrors.numero} placeholder="Número" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Bairro" name="bairro" required value={pfData.bairro} onChange={handlePFChange} error={pfErrors.bairro} placeholder="Bairro" />
                    <FormField label="CEP" name="cep" required value={pfData.cep} onChange={handlePFChange} error={pfErrors.cep} placeholder="00000-000" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="UF (Estado)" name="uf" type="select" required value={pfData.uf} onChange={handlePFChange} error={pfErrors.uf} placeholder={estados} />
                    <FormField label="Cidade" name="cidade" type="select" required value={pfData.cidade} onChange={handlePFChange} error={pfErrors.cidade} placeholder={pfCidades} />
                  </div>
                  <FormField label="Rede Social" name="redeSocial" required value={pfData.redeSocial} onChange={handlePFChange} error={pfErrors.redeSocial} placeholder="(Opcional)" />
                </div>

                <div className="bg-white/0 border-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">3. CONTATO</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Telefone (com DDD)" name="telefone" required value={pfData.telefone} onChange={handlePFChange} error={pfErrors.telefone} placeholder="(11) 99999-9999" />
                    <FormField label="E-mail" name="email" type="email" required value={pfData.email} onChange={handlePFChange} error={pfErrors.email} placeholder="seu@email.com" />
                  </div>
                </div>

                <div className="bg-white/0 border-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">4. REFERÊNCIAS COMERCIAIS</h2>
                  <p className="text-white text-sm font-medium mb-4">(Preferência na área audiovisual: Locadoras, fornecedores)</p>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">Referência 1</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField label="Empresa" name="empresa1" required value={pfData.empresa1} onChange={handlePFChange} error={pfErrors.empresa1} />
                      <FormField label="Nome do Contato" name="nomeContato1" required value={pfData.nomeContato1} onChange={handlePFChange} error={pfErrors.nomeContato1} />
                      <FormField label="Telefone (com DDD)" name="telefoneDdd1" required value={pfData.telefoneDdd1} onChange={handlePFChange} error={pfErrors.telefoneDdd1} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Nome da Mãe" name="nomeMaeRef" value={pfData.nomeMaeRef} onChange={handlePFChange} />
                    <FormField label="Nome do Pai" name="nomePaiRef" value={pfData.nomePaiRef} onChange={handlePFChange} />
                  </div>
                </div>

                <div className="bg-white/0 border-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">5. INFORMAÇÕES ADICIONAIS</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Ocupação Profissional" name="ocupacao" value={pfData.ocupacao} onChange={handlePFChange} placeholder="(Opcional)" />
                    <FormField label="Ramo de Atividade" name="ramoAtividade" value={pfData.ramoAtividade} onChange={handlePFChange} placeholder="(Opcional)" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Pertence a alguma associação (ABPRO ABPTV, etc.)" name="pertenceAssociacao" value={pfData.pertenceAssociacao} onChange={handlePFChange} placeholder="(Opcional)" />
                    <FormField label="Qual Associação" name="qualAssociacao" value={pfData.qualAssociacao} onChange={handlePFChange} placeholder="(Opcional)" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white mb-2">
                      Estudante
                      <span className="text-red-600 ml-1">*</span>
                    </label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => handlePFChange('estudante', 'sim')}
                        className={`px-6 py-2 border-2 font-bold transition-all duration-200 ${
                          pfData.estudante === 'sim'
                            ? 'bg-black text-white border-black'
                            : 'bg-transparent text-black border-black'
                        }`}
                      >
                        Sim
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePFChange('estudante', 'nao')}
                        className={`px-6 py-2 border-2 font-bold transition-all duration-200 ${
                          pfData.estudante === 'nao'
                            ? 'bg-black text-white border-black'
                            : 'bg-transparent text-black border-black'
                        }`}
                      >
                        Não
                      </button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white mb-2">
                      CNH Válida
                      <span className="text-red-600 ml-1">*</span>
                    </label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => handlePFChange('cnhValida', 'sim')}
                        className={`px-6 py-2 border-2 font-bold transition-all duration-200 ${
                          pfData.cnhValida === 'sim'
                            ? 'bg-black text-white border-black'
                            : 'bg-transparent text-black border-black'
                        }`}
                      >
                        Sim
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePFChange('cnhValida', 'nao')}
                        className={`px-6 py-2 border-2 font-bold transition-all duration-200 ${
                          pfData.cnhValida === 'nao'
                            ? 'bg-black text-white border-black'
                            : 'bg-transparent text-black border-black'
                        }`}
                      >
                        Não
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white/0 border-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">6. DOCUMENTOS NECESSÁRIOS</h2>
                  <p className="text-white text-sm font-medium mb-4">Serão necessários UP-loads de documentos</p>
                  <FormField label="RG ou CNH" name="documento1" type="file" required value={pfData.documento1} onChange={handlePFChange} error={pfErrors.documento1} />
                  <FormField label="CPF ou CNH" name="documento2" type="file" value={pfData.documento2} onChange={handlePFChange} />
                  <FormField label="Comprovante de Residência" name="documento3" type="file" value={pfData.documento3} onChange={handlePFChange} />
                  <p className="text-gray-400 text-xs mt-2">(Água, luz, internet/ Atual / máximo 3 meses)</p>
                </div>

                <Button type="submit" disabled={pfSubmitting} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md">
                  {pfSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    'ENVIAR CADASTRO'
                  )}
                </Button>

                {pfSuccess && (
                  <div className="border-2 border-green-500 rounded-md p-6 bg-green-50/10">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl text-green-400">✓</div>
                      <div>
                        <h3 className="text-xl font-bold text-green-400 mb-2">Cadastro Enviado com Sucesso!</h3>
                        <p className="text-white text-sm">Seu cadastro foi recebido. Você receberá um e-mail de confirmação em breve.</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border border-green-300 rounded-md p-3 bg-transparent">
                  <p className="text-white text-xs">
                    <span className="font-bold">Pagamento:</span> O Pagamento da primeira locação deve ser feito À VISTA, via PIX ou dinheiro. Pagamentos via cartão de crédito estão sujeitos a taxas das operadoras.
                  </p>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="pj">
              <form onSubmit={handlePJSubmit} className="space-y-6">
                <div className="bg-white/0 border-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">1. INFORMAÇÕES GERAIS</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Data do Cadastro" name="dataCadastro" type="date" required value={pjData.dataCadastro} onChange={handlePJChange} error={pjErrors.dataCadastro} />
                    <FormField label="Nome Completo" name="nomeCompleto" required value={pjData.nomeCompleto} onChange={handlePJChange} error={pjErrors.nomeCompleto} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="CPF" name="cpf" required value={pjData.cpf} onChange={handlePJChange} error={pjErrors.cpf} />
                    <FormField label="RG" name="rg" value={pjData.rg} onChange={handlePJChange} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Data de Nascimento" name="dataNascimento" type="date" required value={pjData.dataNascimento} onChange={handlePJChange} error={pjErrors.dataNascimento} />
                    <FormField label="Nome da Mãe" name="nomeMae" required value={pjData.nomeMae} onChange={handlePJChange} error={pjErrors.nomeMae} />
                  </div>
                </div>

                <div className="bg-white/0 border-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">2. ENDEREÇO</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Endereço" name="endereco" required value={pjData.endereco} onChange={handlePJChange} error={pjErrors.endereco} placeholder="Rua, Avenida, etc." />
                    <FormField label="Número" name="numero" required value={pjData.numero} onChange={handlePJChange} error={pjErrors.numero} placeholder="Número" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Bairro" name="bairro" required value={pjData.bairro} onChange={handlePJChange} error={pjErrors.bairro} placeholder="Bairro" />
                    <FormField label="CEP" name="cep" required value={pjData.cep} onChange={handlePJChange} error={pjErrors.cep} placeholder="00000-000" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="UF (Estado)" name="uf" type="select" required value={pjData.uf} onChange={handlePJChange} error={pjErrors.uf} placeholder={estados} />
                    <FormField label="Cidade" name="cidade" type="select" required value={pjData.cidade} onChange={handlePJChange} error={pjErrors.cidade} placeholder={pjCidades} />
                  </div>
                  <FormField label="Rede Social" name="redeSocial" required value={pjData.redeSocial} onChange={handlePJChange} error={pjErrors.redeSocial} placeholder="(Opcional)" />
                </div>

                <div className="bg-white/0 border-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">3. CONTATO</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Telefone (com DDD)" name="telefone" required value={pjData.telefone} onChange={handlePJChange} error={pjErrors.telefone} placeholder="(11) 99999-9999" />
                    <FormField label="E-mail" name="email" type="email" required value={pjData.email} onChange={handlePJChange} error={pjErrors.email} placeholder="seu@email.com" />
                  </div>
                </div>

                <div className="bg-white/0 border-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">4. REFERÊNCIAS COMERCIAIS</h2>
                  <p className="text-white text-sm font-medium mb-4">(Preferência na área audiovisual: Locadoras, fornecedores)</p>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">Referência 1</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField label="Empresa" name="empresa1" required value={pjData.empresa1} onChange={handlePJChange} error={pjErrors.empresa1} />
                      <FormField label="Nome do Contato" name="nomeContato1" required value={pjData.nomeContato1} onChange={handlePJChange} error={pjErrors.nomeContato1} />
                      <FormField label="Telefone (com DDD)" name="telefoneDdd1" required value={pjData.telefoneDdd1} onChange={handlePJChange} error={pjErrors.telefoneDdd1} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Nome da Mãe" name="nomeMaeRef" value={pjData.nomeMaeRef} onChange={handlePJChange} />
                    <FormField label="Nome do Pai" name="nomePaiRef" value={pjData.nomePaiRef} onChange={handlePJChange} />
                  </div>
                </div>

                <div className="bg-white/0 border-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">5. INFORMAÇÕES DA EMPRESA</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Razão Social" name="razaoSocial" required value={pjData.razaoSocial} onChange={handlePJChange} error={pjErrors.razaoSocial} />
                    <FormField label="Data de Fundação" name="dataFundacao" type="date" required value={pjData.dataFundacao} onChange={handlePJChange} error={pjErrors.dataFundacao} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Ocupação Profissional" name="ocupacao" required value={pjData.ocupacao} onChange={handlePJChange} error={pjErrors.ocupacao} />
                    <FormField label="Ramo de Atividade" name="ramoAtividade" required value={pjData.ramoAtividade} onChange={handlePJChange} error={pjErrors.ramoAtividade} />
                  </div>
                </div>

                <div className="bg-white/0 border-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">6. DOCUMENTOS NECESSÁRIOS</h2>
                  <p className="text-white text-sm font-medium mb-4">Serão necessários UP-loads de documentos</p>
                  <FormField label="Última Alteração Contratual" name="documento1" type="file" required value={pjData.documento1} onChange={handlePJChange} error={pjErrors.documento1} />
                  <FormField label="Cartão CNPJ" name="documento2" type="file" value={pjData.documento2} onChange={handlePJChange} />
                  <FormField label="Comprovante de Residência" name="documento3" type="file" value={pjData.documento3} onChange={handlePJChange} />
                  <p className="text-gray-400 text-xs mt-2">(Água, luz, internet/ Atual / máximo 3 meses)</p>
                </div>

                <Button type="submit" disabled={pjSubmitting} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md">
                  {pjSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    'ENVIAR CADASTRO'
                  )}
                </Button>

                {pjSuccess && (
                  <div className="border-2 border-green-500 rounded-md p-6 bg-green-50/10">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl text-green-400">✓</div>
                      <div>
                        <h3 className="text-xl font-bold text-green-400 mb-2">Cadastro Enviado com Sucesso!</h3>
                        <p className="text-white text-sm">Seu cadastro foi recebido. Você receberá um e-mail de confirmação em breve.</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border border-green-300 rounded-md p-3 bg-transparent">
                  <p className="text-white text-xs">
                    <span className="font-bold">Pagamento:</span> O Pagamento da primeira locação deve ser feito À VISTA, via PIX ou dinheiro. Pagamentos via cartão de crédito estão sujeitos a taxas das operadoras.
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
