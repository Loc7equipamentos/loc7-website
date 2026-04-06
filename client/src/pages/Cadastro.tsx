'use client';

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

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  value: any;
  onChange: (name: string, value: any) => void;
  error?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

const FormField = ({ label, name, type = 'text', required, value, onChange, error, placeholder, options }: FormFieldProps) => {
  const handleChange = useCallback((e: any) => {
    if (type === 'file') {
      onChange(name, e.target.files?.[0]);
    } else if (type === 'select') {
      onChange(name, e.target.value);
    } else {
      onChange(name, e.target.value);
    }
  }, [name, onChange, type]);

  if (type === 'select') {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-white mb-2">
          {label} {required && '*'}
        </label>
        <select
          value={value || ''}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-transparent border-2 border-white text-white placeholder-gray-400 focus:outline-none focus:border-red-600"
        >
          <option value="">Selecione...</option>
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-white mb-2">
        {label} {required && '*'}
      </label>
      <input
        type={type}
        value={type === 'file' ? '' : (value || '')}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 bg-transparent border-2 border-white text-white placeholder-gray-400 focus:outline-none focus:border-red-600"
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default function Cadastro() {
  const [activeTab, setActiveTab] = useState<FormType>('pf');
  const [pfData, setPFData] = useState<FormData>({});
  const [pjData, setPJData] = useState<FormData>({});
  const [pfErrors, setPFErrors] = useState<FormError>({});
  const [pjErrors, setPJErrors] = useState<FormError>({});

  const handlePFChange = useCallback((name: string, value: any) => {
    setPFData(prev => ({ ...prev, [name]: value }));
    if (pfErrors[name]) {
      setPFErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [pfErrors]);

  const handlePJChange = useCallback((name: string, value: any) => {
    setPJData(prev => ({ ...prev, [name]: value }));
    if (pjErrors[name]) {
      setPJErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [pjErrors]);

  const handleStateChangePF = useCallback((state: string) => {
    handlePFChange('uf', state);
    handlePFChange('cidade', '');
  }, [handlePFChange]);

  const handleStateChangePJ = useCallback((state: string) => {
    handlePJChange('uf', state);
    handlePJChange('cidade', '');
  }, [handlePJChange]);

  const cidades = useMemo(() => {
    return pfData.uf ? estadosCidades[pfData.uf] || [] : [];
  }, [pfData.uf]);

  const cidadesPJ = useMemo(() => {
    return pjData.uf ? estadosCidades[pjData.uf] || [] : [];
  }, [pjData.uf]);

  const validatePF = useCallback(() => {
    const errors: FormError = {};
    if (!pfData.dataCadastro) errors.dataCadastro = 'Data obrigatória';
    if (!pfData.nomeCompleto) errors.nomeCompleto = 'Nome obrigatório';
    if (!pfData.cpf) errors.cpf = 'CPF obrigatório';
    if (!pfData.dataNascimento) errors.dataNascimento = 'Data obrigatória';
    if (!pfData.nomeMae) errors.nomeMae = 'Nome da Mãe obrigatório';
    if (!pfData.endereco) errors.endereco = 'Endereço obrigatório';
    if (!pfData.numero) errors.numero = 'Número obrigatório';
    if (!pfData.bairro) errors.bairro = 'Bairro obrigatório';
    if (!pfData.cep) errors.cep = 'CEP obrigatório';
    if (!pfData.uf) errors.uf = 'Estado obrigatório';
    if (!pfData.cidade) errors.cidade = 'Cidade obrigatória';
    if (!pfData.telefone) errors.telefone = 'Telefone obrigatório';
    if (!pfData.email) errors.email = 'Email obrigatório';
    if (!pfData.estudante) errors.estudante = 'Resposta obrigatória';
    if (!pfData.cnhValida) errors.cnhValida = 'Resposta obrigatória';
    if (!pfData.empresa1) errors.empresa1 = 'Empresa obrigatória';
    if (!pfData.nomeContato1) errors.nomeContato1 = 'Contato obrigatório';
    if (!pfData.telefoneDdd1) errors.telefoneDdd1 = 'Telefone obrigatório';
    setPFErrors(errors);
    return Object.keys(errors).length === 0;
  }, [pfData]);

  const handleSubmitPF = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (validatePF()) {
      alert('Cadastro PF enviado com sucesso!');
    }
  }, [validatePF]);

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)] py-12">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-2">CADASTRE-SE</h1>
        <p className="text-gray-400 mb-8">Preencha o formulário abaixo para se cadastrar na Loc 7</p>

        <div className="bg-red-900/20 border-2 border-red-600 p-4 mb-8">
          <p className="text-red-500 font-bold">⚠️ ATENÇÃO!</p>
          <p className="text-white text-sm">O cadastro ocorre em horário comercial: de segunda à sexta-feira, das 09:00 às 17:00 hs. Prazo de aprovação de até 1 hora a partir do recebimento dos dados, junto com os documentos solicitados.</p>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as FormType)}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="pf" className="text-white">Pessoa Física</TabsTrigger>
            <TabsTrigger value="pj" className="text-white">Pessoa Jurídica</TabsTrigger>
          </TabsList>

          <TabsContent value="pf">
            <form onSubmit={handleSubmitPF} className="space-y-8">
              {/* Seção 1: Informações Gerais */}
              <div className="bg-white/5 border-2 border-white/10 p-6">
                <h2 className="text-2xl font-bold text-white mb-6">1. INFORMAÇÕES GERAIS</h2>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Data do Cadastro" name="dataCadastro" type="date" required value={pfData.dataCadastro} onChange={handlePFChange} error={pfErrors.dataCadastro} />
                  <FormField label="Nome Completo" name="nomeCompleto" required value={pfData.nomeCompleto} onChange={handlePFChange} error={pfErrors.nomeCompleto} />
                  <FormField label="CPF" name="cpf" required value={pfData.cpf} onChange={handlePFChange} error={pfErrors.cpf} placeholder="000.000.000-00" />
                  <FormField label="RG" name="rg" value={pfData.rg} onChange={handlePFChange} />
                  <FormField label="Data de Nascimento" name="dataNascimento" type="date" required value={pfData.dataNascimento} onChange={handlePFChange} error={pfErrors.dataNascimento} />
                  <FormField label="Nome da Mãe" name="nomeMae" required value={pfData.nomeMae} onChange={handlePFChange} error={pfErrors.nomeMae} />
                </div>
              </div>

              {/* Seção 2: Endereço */}
              <div className="bg-white/5 border-2 border-white/10 p-6">
                <h2 className="text-2xl font-bold text-white mb-6">2. ENDEREÇO</h2>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Endereço" name="endereco" required value={pfData.endereco} onChange={handlePFChange} error={pfErrors.endereco} />
                  <FormField label="Número" name="numero" required value={pfData.numero} onChange={handlePFChange} error={pfErrors.numero} />
                  <FormField label="Bairro" name="bairro" required value={pfData.bairro} onChange={handlePFChange} error={pfErrors.bairro} />
                  <FormField label="CEP" name="cep" required value={pfData.cep} onChange={handlePFChange} error={pfErrors.cep} placeholder="00000-000" />
                  <FormField label="UF (Estado)" name="uf" type="select" required value={pfData.uf} onChange={handleStateChangePF} error={pfErrors.uf} options={estados.map(e => ({ value: e, label: e }))} />
                  <FormField label="Cidade" name="cidade" type="select" required value={pfData.cidade} onChange={handlePFChange} error={pfErrors.cidade} options={cidades.map(c => ({ value: c, label: c }))} />
                </div>
                <FormField label="Rede Social" name="redeSocial" value={pfData.redeSocial} onChange={handlePFChange} placeholder="(Opcional)" />
              </div>

              {/* Seção 3: Contato */}
              <div className="bg-white/5 border-2 border-white/10 p-6">
                <h2 className="text-2xl font-bold text-white mb-6">3. CONTATO</h2>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Telefone (com DDD)" name="telefone" required value={pfData.telefone} onChange={handlePFChange} error={pfErrors.telefone} placeholder="(11) 99999-9999" />
                  <FormField label="E-mail" name="email" type="email" required value={pfData.email} onChange={handlePFChange} error={pfErrors.email} placeholder="seu@email.com" />
                </div>
              </div>

              {/* Seção 4: Referências Comerciais */}
              <div className="bg-white/5 border-2 border-white/10 p-6">
                <h2 className="text-2xl font-bold text-white mb-6">4. REFERÊNCIAS COMERCIAIS</h2>
                <p className="text-gray-400 text-sm mb-6">(Preferência na área audiovisual: Locadoras, fornecedores)</p>
                
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-4">Referência 1</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <FormField label="Empresa" name="empresa1" required value={pfData.empresa1} onChange={handlePFChange} error={pfErrors.empresa1} />
                    <FormField label="Nome do Contato" name="nomeContato1" required value={pfData.nomeContato1} onChange={handlePFChange} error={pfErrors.nomeContato1} />
                    <FormField label="Telefone (com DDD)" name="telefoneDdd1" required value={pfData.telefoneDdd1} onChange={handlePFChange} error={pfErrors.telefoneDdd1} />
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-4">Referência 2</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <FormField label="Empresa" name="empresa2" value={pfData.empresa2} onChange={handlePFChange} />
                    <FormField label="Nome do Contato" name="nomeContato2" value={pfData.nomeContato2} onChange={handlePFChange} />
                    <FormField label="Telefone (com DDD)" name="telefoneDdd2" value={pfData.telefoneDdd2} onChange={handlePFChange} />
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-4">Referência 3</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <FormField label="Empresa" name="empresa3" value={pfData.empresa3} onChange={handlePFChange} />
                    <FormField label="Nome do Contato" name="nomeContato3" value={pfData.nomeContato3} onChange={handlePFChange} />
                    <FormField label="Telefone (com DDD)" name="telefoneDdd3" value={pfData.telefoneDdd3} onChange={handlePFChange} />
                  </div>
                </div>
              </div>

              {/* Seção 5: Informações Adicionais */}
              <div className="bg-white/5 border-2 border-white/10 p-6">
                <h2 className="text-2xl font-bold text-white mb-6">5. INFORMAÇÕES ADICIONAIS</h2>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Ocupação Profissional" name="ocupacao" value={pfData.ocupacao} onChange={handlePFChange} />
                  <FormField label="Ramo de Atividade" name="ramoAtividade" value={pfData.ramoAtividade} onChange={handlePFChange} />
                  <FormField label="Pertence a Alguma Associação" name="associacao" value={pfData.associacao} onChange={handlePFChange} />
                  <FormField label="Qual Associação" name="qualAssociacao" value={pfData.qualAssociacao} onChange={handlePFChange} />
                  <FormField label="Nome da Mãe" name="nomeMae2" value={pfData.nomeMae2} onChange={handlePFChange} />
                  <FormField label="Nome do Pai" name="nomePai" value={pfData.nomePai} onChange={handlePFChange} />
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-white mb-3">Estudante *</label>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => handlePFChange('estudante', 'sim')} className={`px-6 py-2 border-2 font-bold ${pfData.estudante === 'sim' ? 'bg-red-600 border-red-600' : 'border-white'} text-white`}>Sim</button>
                    <button type="button" onClick={() => handlePFChange('estudante', 'nao')} className={`px-6 py-2 border-2 font-bold ${pfData.estudante === 'nao' ? 'bg-red-600 border-red-600' : 'border-white'} text-white`}>Não</button>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-white mb-3">CNH Válida *</label>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => handlePFChange('cnhValida', 'sim')} className={`px-6 py-2 border-2 font-bold ${pfData.cnhValida === 'sim' ? 'bg-red-600 border-red-600' : 'border-white'} text-white`}>Sim</button>
                    <button type="button" onClick={() => handlePFChange('cnhValida', 'nao')} className={`px-6 py-2 border-2 font-bold ${pfData.cnhValida === 'nao' ? 'bg-red-600 border-red-600' : 'border-white'} text-white`}>Não</button>
                  </div>
                </div>
              </div>

              {/* Seção 6: Documentos */}
              <div className="bg-white/5 border-2 border-white/10 p-6">
                <h2 className="text-2xl font-bold text-white mb-6">6. DOCUMENTOS NECESSÁRIOS</h2>
                <p className="text-gray-400 text-sm mb-6">Serão necessários UP-loads de documentos</p>
                <FormField label="RG ou CNH" name="documento1" type="file" required value={pfData.documento1} onChange={handlePFChange} error={pfErrors.documento1} />
                <FormField label="CPF ou CNH" name="documento2" type="file" value={pfData.documento2} onChange={handlePFChange} />
                <FormField label="Comprovante de Residência" name="documento3" type="file" value={pfData.documento3} onChange={handlePFChange} />
                <p className="text-gray-500 text-xs">(Água, luz, internet / Atual / máximo 3 meses)</p>
              </div>

              {/* Seção 7: Formas de Pagamento */}
              <div className="bg-white/5 border-2 border-white/10 p-6">
                <h2 className="text-2xl font-bold text-white mb-6">7. FORMAS DE PAGAMENTO</h2>
                <ul className="text-white text-sm space-y-2">
                  <li>• O Pagamento da primeira locação deve ser feito À VISTA, via PIX ou dinheiro.</li>
                  <li>• Pagamentos via cartão de crédito estão sujeitos a taxas das operadoras.</li>
                </ul>
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3">ENVIAR CADASTRO</Button>
            </form>
          </TabsContent>

          <TabsContent value="pj">
            <div className="text-white text-center py-12">
              <p>Formulário de Pessoa Jurídica em desenvolvimento</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
