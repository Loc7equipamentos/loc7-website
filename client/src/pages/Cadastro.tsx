'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';

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
  options?: string[];
}

const FormField = ({ label, name, type = 'text', required, value, onChange, error, placeholder, options }: FormFieldProps) => {
  const handleChange = useCallback((e: any) => {
    if (type === 'file') {
      onChange(name, e.target.files?.[0]);
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
          className="w-full px-4 py-2 bg-transparent border-2 border-white text-white focus:outline-none focus:border-red-600"
        >
          <option value="">Selecione...</option>
          {options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
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
  const [activeTab, setActiveTab] = useState<'pf' | 'pj'>('pf');
  const [pfData, setPFData] = useState<any>({});
  const [pjData, setPJData] = useState<any>({});
  const [pfErrors, setPFErrors] = useState<any>({});
  const [pjErrors, setPJErrors] = useState<any>({});

  const handlePFChange = useCallback((name: string, value: any) => {
    setPFData((prev: any) => ({ ...prev, [name]: value }));
    if (pfErrors[name]) {
      setPFErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  }, [pfErrors]);

  const handlePJChange = useCallback((name: string, value: any) => {
    setPJData((prev: any) => ({ ...prev, [name]: value }));
    if (pjErrors[name]) {
      setPJErrors((prev: any) => ({ ...prev, [name]: '' }));
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

  const cidadesPF = pfData.uf ? estadosCidades[pfData.uf] || [] : [];
  const cidadesPJ = pjData.uf ? estadosCidades[pjData.uf] || [] : [];

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)] py-12">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-2">CADASTRE-SE</h1>
        <p className="text-gray-400 mb-8">Preencha o formulário abaixo para se cadastrar na Loc 7</p>

        <div className="bg-red-900/20 border-2 border-red-600 p-4 mb-8">
          <p className="text-red-500 font-bold">⚠️ ATENÇÃO!</p>
          <p className="text-white text-sm">O cadastro ocorre em horário comercial: de segunda à sexta-feira, das 09:00 às 17:00 hs. Prazo de aprovação de até 1 hora a partir do recebimento dos dados, junto com os documentos solicitados.</p>
        </div>

        {/* Abas */}
        <div className="flex gap-4 mb-8 border-b-2 border-white/20">
          <button
            onClick={() => setActiveTab('pf')}
            className={`px-6 py-3 font-bold transition-all ${
              activeTab === 'pf'
                ? 'text-white border-b-2 border-red-600'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            PESSOA FÍSICA
          </button>
          <button
            onClick={() => setActiveTab('pj')}
            className={`px-6 py-3 font-bold transition-all ${
              activeTab === 'pj'
                ? 'text-white border-b-2 border-red-600'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            PESSOA JURÍDICA
          </button>
        </div>

        {/* Formulário PF */}
        {activeTab === 'pf' && (
          <form onSubmit={(e) => { e.preventDefault(); alert('Cadastro PF enviado!'); }} className="space-y-8">
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
                <FormField label="UF (Estado)" name="uf" type="select" required value={pfData.uf} onChange={handleStateChangePF} error={pfErrors.uf} options={estados} />
                <FormField label="Cidade" name="cidade" type="select" required value={pfData.cidade} onChange={handlePFChange} error={pfErrors.cidade} options={cidadesPF} />
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
        )}

        {/* Formulário PJ */}
        {activeTab === 'pj' && (
          <form onSubmit={(e) => { e.preventDefault(); alert('Cadastro PJ enviado!'); }} className="space-y-8">
            {/* Seção 1: Informações Gerais para Faturamento */}
            <div className="bg-white/5 border-2 border-white/10 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">1. INFORMAÇÕES GERAIS PARA FATURAMENTO</h2>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Data do Cadastro" name="dataCadastroPJ" type="date" required value={pjData.dataCadastroPJ} onChange={handlePJChange} error={pjErrors.dataCadastroPJ} />
                <FormField label="Contato para Faturamento" name="contatoFaturamento" required value={pjData.contatoFaturamento} onChange={handlePJChange} error={pjErrors.contatoFaturamento} />
                <FormField label="Telefone (com DDD)" name="telefoneFaturamento" required value={pjData.telefoneFaturamento} onChange={handlePJChange} error={pjErrors.telefoneFaturamento} placeholder="(11) 99999-9999" />
                <FormField label="E-mail" name="emailFaturamento" type="email" required value={pjData.emailFaturamento} onChange={handlePJChange} error={pjErrors.emailFaturamento} placeholder="seu@email.com" />
              </div>
            </div>

            {/* Seção 2: Contatos Adicionais */}
            <div className="bg-white/5 border-2 border-white/10 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">2. CONTATOS ADICIONAIS</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-4">Contato 1</h3>
                <div className="grid grid-cols-3 gap-4">
                  <FormField label="Nome" name="nomeContato1PJ" value={pjData.nomeContato1PJ} onChange={handlePJChange} />
                  <FormField label="Telefone" name="telefoneContato1PJ" value={pjData.telefoneContato1PJ} onChange={handlePJChange} />
                  <FormField label="Empresa" name="empresaContato1PJ" value={pjData.empresaContato1PJ} onChange={handlePJChange} />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-4">Contato 2</h3>
                <div className="grid grid-cols-3 gap-4">
                  <FormField label="Nome" name="nomeContato2PJ" value={pjData.nomeContato2PJ} onChange={handlePJChange} />
                  <FormField label="Telefone" name="telefoneContato2PJ" value={pjData.telefoneContato2PJ} onChange={handlePJChange} />
                  <FormField label="Empresa" name="empresaContato2PJ" value={pjData.empresaContato2PJ} onChange={handlePJChange} />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-4">Contato 3</h3>
                <div className="grid grid-cols-3 gap-4">
                  <FormField label="Nome" name="nomeContato3PJ" value={pjData.nomeContato3PJ} onChange={handlePJChange} />
                  <FormField label="Telefone" name="telefoneContato3PJ" value={pjData.telefoneContato3PJ} onChange={handlePJChange} />
                  <FormField label="Empresa" name="empresaContato3PJ" value={pjData.empresaContato3PJ} onChange={handlePJChange} />
                </div>
              </div>
            </div>

            {/* Seção 3: Dados dos Proprietários */}
            <div className="bg-white/5 border-2 border-white/10 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">3. DADOS DOS PROPRIETÁRIOS</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-4">Proprietário 1</h3>
                <div className="grid grid-cols-4 gap-4">
                  <FormField label="Nome" name="nomeProp1" value={pjData.nomeProp1} onChange={handlePJChange} />
                  <FormField label="Data Nascimento" name="dataNascProp1" type="date" value={pjData.dataNascProp1} onChange={handlePJChange} />
                  <FormField label="RG" name="rgProp1" value={pjData.rgProp1} onChange={handlePJChange} />
                  <FormField label="CPF" name="cpfProp1" value={pjData.cpfProp1} onChange={handlePJChange} placeholder="000.000.000-00" />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-4">Proprietário 2</h3>
                <div className="grid grid-cols-4 gap-4">
                  <FormField label="Nome" name="nomeProp2" value={pjData.nomeProp2} onChange={handlePJChange} />
                  <FormField label="Data Nascimento" name="dataNascProp2" type="date" value={pjData.dataNascProp2} onChange={handlePJChange} />
                  <FormField label="RG" name="rgProp2" value={pjData.rgProp2} onChange={handlePJChange} />
                  <FormField label="CPF" name="cpfProp2" value={pjData.cpfProp2} onChange={handlePJChange} placeholder="000.000.000-00" />
                </div>
              </div>
            </div>

            {/* Seção 4: Referências Comerciais */}
            <div className="bg-white/5 border-2 border-white/10 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">4. REFERÊNCIAS COMERCIAIS</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-4">Referência 1</h3>
                <div className="grid grid-cols-3 gap-4">
                  <FormField label="Empresa" name="empresaRef1PJ" value={pjData.empresaRef1PJ} onChange={handlePJChange} />
                  <FormField label="Contato" name="contatoRef1PJ" value={pjData.contatoRef1PJ} onChange={handlePJChange} />
                  <FormField label="Telefone" name="telefoneRef1PJ" value={pjData.telefoneRef1PJ} onChange={handlePJChange} />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-4">Referência 2</h3>
                <div className="grid grid-cols-3 gap-4">
                  <FormField label="Empresa" name="empresaRef2PJ" value={pjData.empresaRef2PJ} onChange={handlePJChange} />
                  <FormField label="Contato" name="contatoRef2PJ" value={pjData.contatoRef2PJ} onChange={handlePJChange} />
                  <FormField label="Telefone" name="telefoneRef2PJ" value={pjData.telefoneRef2PJ} onChange={handlePJChange} />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-4">Referência 3</h3>
                <div className="grid grid-cols-3 gap-4">
                  <FormField label="Empresa" name="empresaRef3PJ" value={pjData.empresaRef3PJ} onChange={handlePJChange} />
                  <FormField label="Contato" name="contatoRef3PJ" value={pjData.contatoRef3PJ} onChange={handlePJChange} />
                  <FormField label="Telefone" name="telefoneRef3PJ" value={pjData.telefoneRef3PJ} onChange={handlePJChange} />
                </div>
              </div>
            </div>

            {/* Seção 5: Endereços para Entregas e Cobranças */}
            <div className="bg-white/5 border-2 border-white/10 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">5. ENDEREÇOS PARA ENTREGAS E COBRANÇAS</h2>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Endereço" name="enderecoEntrega" value={pjData.enderecoEntrega} onChange={handlePJChange} />
                <FormField label="Complemento" name="complementoEntrega" value={pjData.complementoEntrega} onChange={handlePJChange} />
                <FormField label="Bairro" name="bairroEntrega" value={pjData.bairroEntrega} onChange={handlePJChange} />
                <FormField label="CEP" name="cepEntrega" value={pjData.cepEntrega} onChange={handlePJChange} placeholder="00000-000" />
                <FormField label="UF" name="ufEntrega" type="select" value={pjData.ufEntrega} onChange={handleStateChangePJ} options={estados} />
                <FormField label="Cidade" name="cidadeEntrega" type="select" value={pjData.cidadeEntrega} onChange={handlePJChange} options={cidadesPJ} />
              </div>
            </div>

            {/* Seção 6: Documentos */}
            <div className="bg-white/5 border-2 border-white/10 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">6. DOCUMENTOS</h2>
              <FormField label="Última Alteração Contratual" name="documentoAlteracao" type="file" value={pjData.documentoAlteracao} onChange={handlePJChange} />
              <FormField label="Cartão CNPJ" name="documentoCNPJ" type="file" value={pjData.documentoCNPJ} onChange={handlePJChange} />
              <FormField label="Comprovante de Endereço" name="documentoEndereco" type="file" value={pjData.documentoEndereco} onChange={handlePJChange} />
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
        )}
      </div>
    </div>
  );
}
