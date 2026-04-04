import { useState, useMemo, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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

const FormField = ({ 
  label, 
  name, 
  type = 'text', 
  required = false, 
  error, 
  value, 
  onChange,
  placeholder = '',
  options = []
}: any) => {
  const handleChange = useCallback((e: any) => {
    let val = e.target.value;
    onChange(name, val);
  }, [name, onChange]);

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
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-black ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
        >
          <option value="">Selecione...</option>
          {options.map((opt: string) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          name={name}
          value={value || ''}
          onChange={handleChange}
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
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-black ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
      )}
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default function Cadastro() {
  const [activeTab, setActiveTab] = useState<FormType>('pf');
  const [pfErrors, setPfErrors] = useState<FormError>({});
  const [pjErrors, setPjErrors] = useState<FormError>({});
  const [pfData, setPfData] = useState<FormData>({});
  const [pjData, setPjData] = useState<FormData>({});
  const [pfSubmitting, setPfSubmitting] = useState(false);
  const [pjSubmitting, setPjSubmitting] = useState(false);
  const [pfSuccess, setPfSuccess] = useState(false);
  const [pjSuccess, setPjSuccess] = useState(false);
  const [pfCidades, setPfCidades] = useState<string[]>([]);
  const [pjCidades, setPjCidades] = useState<string[]>([]);

  const pfRequiredFields = useMemo(() => [
    'dataCadastro', 'nomeCompleto', 'cpf', 'rg', 'dataNascimento', 'nomeMae',
    'telefone', 'email', 'endereco', 'numero', 'bairro', 'cep', 'cidade', 'uf',
    'empresa1', 'nomeContato1', 'telefoneDdd1',
    'documento1'
  ], []);

  const pjRequiredFields = useMemo(() => [
    'dataCadastro', 'contato', 'telefonePJ', 'emailPJ',
    'nomeProprietario1', 'dataNascimentoProprietario1', 'rgProprietario1', 'cpfProprietario1',
    'empresa1', 'nomeContato1', 'telefoneDdd1',
    'ultimaAlteracao', 'cartaoCNPJ', 'comprovante'
  ], []);

  const searchCEP = useCallback(async (cep: string, isFormType: 'pf' | 'pj') => {
    const cleanCEP = cep.replace(/\D/g, '');
    if (cleanCEP.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();

      if (data.erro) {
        console.log('CEP nao encontrado');
        return;
      }

      const updateData = {
        endereco: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        uf: data.uf
      };

      if (isFormType === 'pf') {
        setPfData(prev => ({ ...prev, ...updateData }));
        if (data.uf) {
          setPfCidades(estadosCidades[data.uf] || []);
        }
      } else {
        setPjData(prev => ({ ...prev, ...updateData }));
        if (data.uf) {
          setPjCidades(estadosCidades[data.uf] || []);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  }, []);

  const validatePF = useCallback(() => {
    const errors: FormError = {};
    pfRequiredFields.forEach(field => {
      if (!pfData[field]) {
        errors[field] = 'Campo obrigatório';
      }
    });
    
    const hasReference = pfData.empresa1 || pfData.empresa2 || pfData.empresa3;
    if (!hasReference) {
      errors['referencias'] = 'Pelo menos 1 referência comercial é obrigatória';
    }
    
    setPfErrors(errors);
    return Object.keys(errors).length === 0;
  }, [pfData, pfRequiredFields]);

  const validatePJ = useCallback(() => {
    const errors: FormError = {};
    pjRequiredFields.forEach(field => {
      if (!pjData[field]) {
        errors[field] = 'Campo obrigatório';
      }
    });
    
    const hasReference = pjData.empresa1 || pjData.empresa2 || pjData.empresa3;
    if (!hasReference) {
      errors['referencias'] = 'Pelo menos 1 referência comercial é obrigatória';
    }
    
    setPjErrors(errors);
    return Object.keys(errors).length === 0;
  }, [pjData, pjRequiredFields]);

  const handlePFChange = useCallback((field: string, value: any) => {
    setPfData(prev => ({ ...prev, [field]: value }));
    if (pfErrors[field]) {
      setPfErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (field === 'uf' && value) {
      setPfCidades(estadosCidades[value] || []);
      setPfData(prev => ({ ...prev, cidade: '' }));
    }
    if (field === 'cep' && value.replace(/\D/g, '').length === 8) {
      searchCEP(value, 'pf');
    }
  }, [pfErrors, searchCEP]);

  const handlePJChange = useCallback((field: string, value: any) => {
    setPjData(prev => ({ ...prev, [field]: value }));
    if (pjErrors[field]) {
      setPjErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (field === 'uf' && value) {
      setPjCidades(estadosCidades[value] || []);
      setPjData(prev => ({ ...prev, cidade: '' }));
    }
    if (field === 'cep' && value.replace(/\D/g, '').length === 8) {
      searchCEP(value, 'pj');
    }
  }, [pjErrors, searchCEP]);

  const handlePFSubmit = useCallback(async (e: React.FormEvent) => {
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
  }, [validatePF, pfData]);

  const handlePJSubmit = useCallback(async (e: React.FormEvent) => {
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
  }, [validatePJ, pjData]);

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/5 border border-[oklch(0.15_0_0)] p-8">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FormType)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[oklch(0.1_0_0)] border border-[oklch(0.15_0_0)] mb-8">
              <TabsTrigger value="pf" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-white">
                PESSOA FÍSICA
              </TabsTrigger>
              <TabsTrigger value="pj" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-white">
                PESSOA JURÍDICA
              </TabsTrigger>
            </TabsList>

            {/* ===== PESSOA FÍSICA ===== */}
            <TabsContent value="pf">
              <form onSubmit={handlePFSubmit} className="space-y-6">
                {/* Seção 1: Informações Gerais */}
                <div className="bg-white/0 border-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">1. INFORMAÇÕES GERAIS</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Data do Cadastro" name="dataCadastro" type="date" required value={pfData.dataCadastro} onChange={handlePFChange} error={pfErrors.dataCadastro} />
                    <FormField label="Nome Completo" name="nomeCompleto" required value={pfData.nomeCompleto} onChange={handlePFChange} error={pfErrors.nomeCompleto} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="CPF" name="cpf" required value={pfData.cpf} onChange={handlePFChange} error={pfErrors.cpf} />
                    <FormField label="RG" name="rg" required value={pfData.rg} onChange={handlePFChange} error={pfErrors.rg} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Data de Nascimento" name="dataNascimento" type="date" required value={pfData.dataNascimento} onChange={handlePFChange} error={pfErrors.dataNascimento} placeholder="Ex. xx/xx/xxxx" />
                    <FormField label="Nome da Mãe" name="nomeMae" required value={pfData.nomeMae} onChange={handlePFChange} error={pfErrors.nomeMae} />
                  </div>
                </div>

                {/* Seção 2: Endereço */}
                <div className="bg-white/0 border-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">2. ENDEREÇO</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Telefone (com DDD)" name="telefone" required value={pfData.telefone} onChange={handlePFChange} error={pfErrors.telefone} placeholder="(11) 99999-9999" />
                    <FormField label="E-mail" name="email" type="email" required value={pfData.email} onChange={handlePFChange} error={pfErrors.email} placeholder="seu@email.com" />
                  </div>
                  <FormField label="Rede Social" name="redeSocial" value={pfData.redeSocial} onChange={handlePFChange} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Endereço" name="endereco" required value={pfData.endereco} onChange={handlePFChange} error={pfErrors.endereco} placeholder="Rua, Avenida, etc." />
                    <FormField label="Número" name="numero" required value={pfData.numero} onChange={handlePFChange} error={pfErrors.numero} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Bairro" name="bairro" required value={pfData.bairro} onChange={handlePFChange} error={pfErrors.bairro} />
                    <FormField label="CEP" name="cep" required value={pfData.cep} onChange={handlePFChange} error={pfErrors.cep} placeholder="00000-000" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Cidade" name="cidade" required value={pfData.cidade} onChange={handlePFChange} error={pfErrors.cidade} />
                    <FormField label="UF (Estado)" name="uf" type="select" required value={pfData.uf} onChange={handlePFChange} error={pfErrors.uf} options={estados} />
                  </div>
                </div>

                {/* Seção 3: Informações Adicionais */}
                <div className="bg-white/0 border-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">3. INFORMAÇÕES ADICIONAIS</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Ocupação Profissional (Caso possua)" name="ocupacao" value={pfData.ocupacao} onChange={handlePFChange} />
                    <FormField label="Ramo de Atividade (Caso possua)" name="ramoAtividade" value={pfData.ramoAtividade} onChange={handlePFChange} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Pertence a Alguma Associação (APRO, ABPTV, etc...)" name="associacao" value={pfData.associacao} onChange={handlePFChange} placeholder="Descrição (opcional)" />
                    <FormField label="Qual Associação" name="qualAssociacao" value={pfData.qualAssociacao} onChange={handlePFChange} />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white mb-2">Estudante *</label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => handlePFChange('estudante', 'sim')}
                        className={`px-6 py-2 border-2 font-bold transition-all duration-200 ${
                          pfData.estudante === 'sim'
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-transparent text-white border-white'
                        }`}
                      >
                        Sim
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePFChange('estudante', 'nao')}
                        className={`px-6 py-2 border-2 font-bold transition-all duration-200 ${
                          pfData.estudante === 'nao'
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-transparent text-white border-white'
                        }`}
                      >
                        Não
                      </button>
                    </div>
                  </div>
                  <FormField label="Nome do Pai" name="nomePai" required value={pfData.nomePai} onChange={handlePFChange} error={pfErrors.nomePai} />
                </div>

                {/* Seção 4: Referências Comerciais */}
                <div className="bg-white/0 border-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">4. REFERÊNCIAS COMERCIAIS</h2>
                  <p className="text-white text-sm font-medium mb-4">(Preferência na área audiovisual: Locadoras, fornecedores)</p>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">Referência 1</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField label="Empresa" name="empresa1" required value={pfData.empresa1} onChange={handlePFChange} error={pfErrors.empresa1} />
                      <FormField label="Nome do Contato" name="nomeContato1" required value={pfData.nomeContato1} onChange={handlePFChange} error={pfErrors.nomeContato1} />
                      <FormField label="Telefone com DDD" name="telefoneDdd1" required value={pfData.telefoneDdd1} onChange={handlePFChange} error={pfErrors.telefoneDdd1} />
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">Referência 2</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField label="Empresa" name="empresa2" value={pfData.empresa2} onChange={handlePFChange} />
                      <FormField label="Nome do Contato" name="nomeContato2" value={pfData.nomeContato2} onChange={handlePFChange} />
                      <FormField label="Telefone com DDD" name="telefoneDdd2" value={pfData.telefoneDdd2} onChange={handlePFChange} />
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">Referência 3</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField label="Empresa" name="empresa3" value={pfData.empresa3} onChange={handlePFChange} />
                      <FormField label="Nome do Contato" name="nomeContato3" value={pfData.nomeContato3} onChange={handlePFChange} />
                      <FormField label="Telefone com DDD" name="telefoneDdd3" value={pfData.telefoneDdd3} onChange={handlePFChange} />
                    </div>
                  </div>
                </div>

                {/* Seção 5: Documentos */}
                <div className="bg-white/0 border-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">5. DOCUMENTOS NECESSÁRIOS</h2>
                  <p className="text-white text-sm font-medium mb-4">Serão necessários UP-loads de documentos</p>
                  <FormField label="RG ou CNH" name="documento1" type="file" required value={pfData.documento1} onChange={handlePFChange} error={pfErrors.documento1} />
                  <FormField label="CPF ou CNH" name="documento2" type="file" value={pfData.documento2} onChange={handlePFChange} />
                  <FormField label="Comprovante de Residência" name="documento3" type="file" value={pfData.documento3} onChange={handlePFChange} />
                  <p className="text-gray-400 text-xs mt-2">(Água, luz, internet / Atual / máximo 3 meses)</p>
                </div>

                {/* Seção 6: Formas de Pagamento */}
                <div className="bg-white/0 border-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">6. FORMAS DE PAGAMENTO</h2>
                  <ul className="text-white text-sm space-y-2">
                    <li>• O Pagamento da primeira locação deve ser feito À VISTA, via PIX ou dinheiro.</li>
                    <li>• Pagamentos via cartão de crédito estão sujeitos a taxas das operadoras.</li>
                  </ul>
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
              </form>
            </TabsContent>

            {/* ===== PESSOA JURÍDICA ===== */}
            <TabsContent value="pj">
              <form onSubmit={handlePJSubmit} className="space-y-6">
                {/* Seção 1: Informações Gerais para Faturamento */}
                <div className="bg-white/0 border-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">1. INFORMAÇÕES GERAIS PARA FATURAMENTO</h2>
                  <p className="text-white text-sm font-medium mb-4">Descrição (opcional)</p>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Data do Cadastro" name="dataCadastro" type="date" required value={pjData.dataCadastro} onChange={handlePJChange} error={pjErrors.dataCadastro} />
                    <FormField label="Contato / Nome Completo" name="contato" required value={pjData.contato} onChange={handlePJChange} error={pjErrors.contato} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Telefone (com DDD)" name="telefonePJ" required value={pjData.telefonePJ} onChange={handlePJChange} error={pjErrors.telefonePJ} placeholder="(11) 99999-9999" />
                    <FormField label="E-mail" name="emailPJ" type="email" required value={pjData.emailPJ} onChange={handlePJChange} error={pjErrors.emailPJ} placeholder="seu@email.com" />
                  </div>
                </div>

                {/* Seção 2: Contatos Adicionais */}
                <div className="bg-white/0 border-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">2. CONTATOS ADICIONAIS</h2>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">Contato 1</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField label="Contato/Nome" name="contatoNome1" value={pjData.contatoNome1} onChange={handlePJChange} />
                      <FormField label="Telefone" name="contatoTelefone1" value={pjData.contatoTelefone1} onChange={handlePJChange} />
                      <FormField label="Empresa" name="contatoEmpresa1" value={pjData.contatoEmpresa1} onChange={handlePJChange} />
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">Contato 2</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField label="Contato/Nome" name="contatoNome2" value={pjData.contatoNome2} onChange={handlePJChange} />
                      <FormField label="Telefone" name="contatoTelefone2" value={pjData.contatoTelefone2} onChange={handlePJChange} />
                      <FormField label="Empresa" name="contatoEmpresa2" value={pjData.contatoEmpresa2} onChange={handlePJChange} />
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">Contato 3</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField label="Contato/Nome" name="contatoNome3" value={pjData.contatoNome3} onChange={handlePJChange} />
                      <FormField label="Telefone" name="contatoTelefone3" value={pjData.contatoTelefone3} onChange={handlePJChange} />
                      <FormField label="Empresa" name="contatoEmpresa3" value={pjData.contatoEmpresa3} onChange={handlePJChange} />
                    </div>
                  </div>
                </div>

                {/* Seção 3: Dados dos Proprietários */}
                <div className="bg-white/0 border-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">3. DADOS DO(S) PROPRIETÁRIO(S) DA EMPRESA</h2>
                  <p className="text-white text-sm font-medium mb-4">Descrição (opcional)</p>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">Proprietário 1</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Nome Completo" name="nomeProprietario1" required value={pjData.nomeProprietario1} onChange={handlePJChange} error={pjErrors.nomeProprietario1} />
                      <FormField label="Data de Nascimento" name="dataNascimentoProprietario1" type="date" required value={pjData.dataNascimentoProprietario1} onChange={handlePJChange} error={pjErrors.dataNascimentoProprietario1} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="RG" name="rgProprietario1" required value={pjData.rgProprietario1} onChange={handlePJChange} error={pjErrors.rgProprietario1} />
                      <FormField label="CPF" name="cpfProprietario1" required value={pjData.cpfProprietario1} onChange={handlePJChange} error={pjErrors.cpfProprietario1} />
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">Proprietário 2</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Nome Completo" name="nomeProprietario2" value={pjData.nomeProprietario2} onChange={handlePJChange} />
                      <FormField label="Data de Nascimento" name="dataNascimentoProprietario2" type="date" value={pjData.dataNascimentoProprietario2} onChange={handlePJChange} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="RG" name="rgProprietario2" value={pjData.rgProprietario2} onChange={handlePJChange} />
                      <FormField label="CPF" name="cpfProprietario2" value={pjData.cpfProprietario2} onChange={handlePJChange} />
                    </div>
                  </div>
                </div>

                {/* Seção 4: Referências Comerciais */}
                <div className="bg-white/0 border-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">4. REFERÊNCIAS COMERCIAIS</h2>
                  <p className="text-white text-sm font-medium mb-4">Informações necessárias</p>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">Referência 1</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField label="Empresa" name="empresa1" required value={pjData.empresa1} onChange={handlePJChange} error={pjErrors.empresa1} />
                      <FormField label="Contato/Nome" name="nomeContato1" required value={pjData.nomeContato1} onChange={handlePJChange} error={pjErrors.nomeContato1} />
                      <FormField label="Telefone" name="telefoneDdd1" required value={pjData.telefoneDdd1} onChange={handlePJChange} error={pjErrors.telefoneDdd1} />
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">Referência 2</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField label="Empresa" name="empresa2" value={pjData.empresa2} onChange={handlePJChange} />
                      <FormField label="Contato/Nome" name="nomeContato2" value={pjData.nomeContato2} onChange={handlePJChange} />
                      <FormField label="Telefone" name="telefoneDdd2" value={pjData.telefoneDdd2} onChange={handlePJChange} />
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">Referência 3</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField label="Empresa" name="empresa3" value={pjData.empresa3} onChange={handlePJChange} />
                      <FormField label="Contato/Nome" name="nomeContato3" value={pjData.nomeContato3} onChange={handlePJChange} />
                      <FormField label="Telefone" name="telefoneDdd3" value={pjData.telefoneDdd3} onChange={handlePJChange} />
                    </div>
                  </div>
                </div>

                {/* Seção 5: Endereços para Entregas e Cobranças */}
                <div className="bg-white/0 border-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">5. ENDEREÇOS PARA ENTREGAS E COBRANÇAS</h2>
                  <p className="text-white text-sm font-medium mb-4">(Caso não seja o mesmo)</p>
                  <p className="text-white text-sm font-medium mb-4">Descrição (opcional)</p>
                  
                  <FormField label="Endereço" name="enderecoEntrega" value={pjData.enderecoEntrega} onChange={handlePJChange} />
                  <FormField label="Complemento (Caso possua)" name="complementoEntrega" value={pjData.complementoEntrega} onChange={handlePJChange} />
                  <FormField label="Bairro" name="bairroEntrega" value={pjData.bairroEntrega} onChange={handlePJChange} />
                  <div className="grid grid-cols-3 gap-4">
                    <FormField label="CEP" name="cepEntrega" value={pjData.cepEntrega} onChange={handlePJChange} />
                    <FormField label="Cidade" name="cidadeEntrega" value={pjData.cidadeEntrega} onChange={handlePJChange} />
                    <FormField label="UF (Estado)" name="ufEntrega" value={pjData.ufEntrega} onChange={handlePJChange} />
                  </div>
                </div>

                {/* Seção 6: Documentos */}
                <div className="bg-white/0 border-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">6. DOCUMENTOS NECESSÁRIOS</h2>
                  <p className="text-white text-sm font-medium mb-4">Serão necessários UP-loads de documentos</p>
                  <FormField label="Última Alteração Contratual" name="ultimaAlteracao" type="file" required value={pjData.ultimaAlteracao} onChange={handlePJChange} error={pjErrors.ultimaAlteracao} />
                  <FormField label="Cartão do CNPJ Atualizado" name="cartaoCNPJ" type="file" required value={pjData.cartaoCNPJ} onChange={handlePJChange} error={pjErrors.cartaoCNPJ} />
                  <FormField label="Comprovante de Endereço Recente" name="comprovante" type="file" required value={pjData.comprovante} onChange={handlePJChange} error={pjErrors.comprovante} />
                  <p className="text-gray-400 text-xs mt-2">(Água ou luz ou telefone fixo)</p>
                </div>

                {/* Seção 7: Formas de Pagamento */}
                <div className="bg-white/0 border-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">7. FORMAS DE PAGAMENTO</h2>
                  <ul className="text-white text-sm space-y-2">
                    <li>• O Pagamento da primeira locação deve ser feito À VISTA, via PIX ou dinheiro.</li>
                    <li>• Pagamentos via cartão de crédito estão sujeitos a taxas das operadoras.</li>
                  </ul>
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
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
