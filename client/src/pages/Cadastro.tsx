import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

type FormType = 'pf' | 'pj';

interface FormData {
  [key: string]: any;
}

export default function Cadastro() {
  const [activeTab, setActiveTab] = useState<FormType>('pf');
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // tRPC mutation para criar registro
  const createRegistration = trpc.registrations.create.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setSuccessMessage(data.message);
        setFormData({});
        setErrors({});
        
        // Redirecionar para WhatsApp após 2 segundos
        setTimeout(() => {
          const whatsappMessage = encodeURIComponent(
            `Olá! Meu cadastro foi realizado com sucesso. Nome: ${formData.fullName}, Email: ${formData.email}`
          );
          window.open(
            `https://wa.me/message/WOIONHHSTABQF1?text=${whatsappMessage}`,
            '_blank'
          );
        }, 2000);
      } else {
        setErrorMessage(data.message);
      }
    },
    onError: (error) => {
      setErrorMessage('Erro ao salvar cadastro. Tente novamente.');
      console.error('Registration error:', error);
    },
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName?.trim()) newErrors.fullName = 'Nome completo é obrigatório';
    if (!formData.email?.trim()) newErrors.email = 'Email é obrigatório';
    if (!formData.phone?.trim()) newErrors.phone = 'Telefone é obrigatório';
    
    if (activeTab === 'pf') {
      if (!formData.cpf?.trim()) newErrors.cpf = 'CPF é obrigatório';
    } else {
      if (!formData.cnpj?.trim()) newErrors.cnpj = 'CNPJ é obrigatório';
      if (!formData.companyName?.trim()) newErrors.companyName = 'Razão social é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const type: 'pessoa_fisica' | 'pessoa_juridica' = activeTab === 'pf' ? 'pessoa_fisica' : 'pessoa_juridica';
    const payload = {
      type: type,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      question: formData.question || '',
      ...(activeTab === 'pf' && {
        cpf: formData.cpf,
        rg: formData.rg,
        birthDate: formData.birthDate,
        motherName: formData.motherName,
      }),
      ...(activeTab === 'pj' && {
        cnpj: formData.cnpj,
        companyName: formData.companyName,
      }),
    }

    createRegistration.mutate(payload);
  };

  const FormField = ({ label, name, type = 'text', required = false, placeholder = '' }: any) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-white mb-2">
        {label}
        {required && <span className="text-[oklch(1_0.4_25)] ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name] || ''}
        onChange={(e) => handleInputChange(name, e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-2 bg-[oklch(0.12_0_0)] border rounded-lg text-white placeholder-[oklch(0.4_0_0)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.45_0.25_25)] transition-all ${
          errors[name] ? 'border-red-500' : 'border-[oklch(0.2_0_0)]'
        }`}
      />
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)] py-20">
      <div className="container max-w-2xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            CADASTRE-SE
          </h1>
          <p className="text-[oklch(0.6_0_0)] text-lg">
            Preencha seus dados para receber orçamentos personalizados
          </p>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-500 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-green-400 font-medium">{successMessage}</p>
              <p className="text-green-300 text-sm mt-1">Redirecionando para WhatsApp...</p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-red-400">{errorMessage}</p>
          </div>
        )}

        {/* Form Card */}
        <Card className="bg-[oklch(0.1_0_0)] border-[oklch(0.2_0_0)] p-8">
          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-[oklch(0.2_0_0)]">
            <button
              onClick={() => {
                setActiveTab('pf');
                setErrors({});
              }}
              className={`pb-4 px-4 font-display font-semibold text-sm uppercase tracking-wider transition-all ${
                activeTab === 'pf'
                  ? 'text-[oklch(0.45_0.25_25)] border-b-2 border-[oklch(0.45_0.25_25)]'
                  : 'text-[oklch(0.5_0_0)] hover:text-white'
              }`}
            >
              Pessoa Física
            </button>
            <button
              onClick={() => {
                setActiveTab('pj');
                setErrors({});
              }}
              className={`pb-4 px-4 font-display font-semibold text-sm uppercase tracking-wider transition-all ${
                activeTab === 'pj'
                  ? 'text-[oklch(0.45_0.25_25)] border-b-2 border-[oklch(0.45_0.25_25)]'
                  : 'text-[oklch(0.5_0_0)] hover:text-white'
              }`}
            >
              Pessoa Jurídica
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormField
                label="Nome Completo"
                name="fullName"
                required
                placeholder="Seu nome completo"
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                required
                placeholder="seu@email.com"
              />
              <FormField
                label="Telefone"
                name="phone"
                type="tel"
                required
                placeholder="(11) 99999-9999"
              />
            </div>

            {/* Pessoa Física Fields */}
            {activeTab === 'pf' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FormField
                  label="CPF"
                  name="cpf"
                  required
                  placeholder="000.000.000-00"
                />
                <FormField
                  label="RG"
                  name="rg"
                  placeholder="00.000.000-0"
                />
                <FormField
                  label="Data de Nascimento"
                  name="birthDate"
                  type="date"
                />
                <FormField
                  label="Nome da Mãe"
                  name="motherName"
                  placeholder="Nome completo da mãe"
                />
              </div>
            )}

            {/* Pessoa Jurídica Fields */}
            {activeTab === 'pj' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FormField
                  label="CNPJ"
                  name="cnpj"
                  required
                  placeholder="00.000.000/0000-00"
                />
                <FormField
                  label="Razão Social"
                  name="companyName"
                  required
                  placeholder="Nome da empresa"
                />
              </div>
            )}

            {/* Question */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-2">
                Mensagem ou Dúvida
              </label>
              <textarea
                name="question"
                value={formData.question || ''}
                onChange={(e) => handleInputChange('question', e.target.value)}
                placeholder="Descreva sua necessidade ou dúvida..."
                rows={4}
                className="w-full px-4 py-2 bg-[oklch(0.12_0_0)] border border-[oklch(0.2_0_0)] rounded-lg text-white placeholder-[oklch(0.4_0_0)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.45_0.25_25)] transition-all"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={createRegistration.isPending}
              className="w-full loc7-btn-primary py-3 text-base font-semibold flex items-center justify-center gap-2"
            >
              {createRegistration.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'ENVIAR CADASTRO'
              )}
            </Button>

            {/* Privacy Note */}
            <p className="text-[oklch(0.4_0_0)] text-xs text-center mt-4">
              Seus dados serão utilizados apenas para contato sobre orçamentos e propostas comerciais.
            </p>
          </form>
        </Card>

        {/* WhatsApp CTA */}
        <div className="mt-12 text-center">
          <p className="text-[oklch(0.6_0_0)] mb-4">Prefere falar direto?</p>
          <a
            href="https://wa.me/message/WOIONHHSTABQF1?text=Olá! Gostaria de solicitar um orçamento."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 loc7-btn-primary px-8 py-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Falar agora no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
