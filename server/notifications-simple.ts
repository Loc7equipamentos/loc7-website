/**
 * Serviço de Notificações Simples
 * Gera links WhatsApp pré-preenchidos sem necessidade de API
 */

export interface WhatsAppLink {
  url: string;
  message: string;
}

/**
 * Gerar link WhatsApp pré-preenchido
 */
export function generateWhatsAppLink(phoneNumber: string, message: string): WhatsAppLink {
  // Remover caracteres especiais do número
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  // Codificar mensagem para URL
  const encodedMessage = encodeURIComponent(message);
  
  // Gerar URL
  const url = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  
  return {
    url,
    message,
  };
}

/**
 * Notificar admin sobre novo cadastro
 */
export function generateAdminNotificationLink(
  tipo: 'pf' | 'pj',
  nome: string,
  email: string,
  telefone: string,
  adminPhone: string
): WhatsAppLink {
  const message = `📋 Novo Cadastro ${tipo === 'pf' ? 'PF' : 'PJ'}

Nome: ${nome}
Email: ${email}
Telefone: ${telefone}

Acesse o painel admin para mais detalhes.
https://seu-dominio.com/admin`;

  return generateWhatsAppLink(adminPhone, message);
}

/**
 * Notificar cliente sobre confirmação de cadastro
 */
export function generateClientNotificationLink(
  nome: string,
  clientPhone: string
): WhatsAppLink {
  const message = `✅ Cadastro Recebido!

Olá ${nome}!

Recebemos seu cadastro com sucesso na Loc 7 Equipamentos.

Nossa equipe irá analisar seus dados e entrará em contato em breve.

Obrigado!`;

  return generateWhatsAppLink(clientPhone, message);
}

/**
 * Gerar HTML com botão WhatsApp
 */
export function generateWhatsAppButton(
  phoneNumber: string,
  message: string,
  buttonText: string = 'Abrir WhatsApp'
): string {
  const link = generateWhatsAppLink(phoneNumber, message);
  
  return `
    <a href="${link.url}" 
       target="_blank" 
       rel="noopener noreferrer"
       style="display: inline-block; padding: 12px 24px; background-color: #25D366; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">
      ${buttonText}
    </a>
  `;
}

/**
 * Enviar notificação (simula envio, na verdade gera link)
 */
export async function sendWhatsAppNotification(
  phoneNumber: string,
  title: string,
  message: string
): Promise<boolean> {
  try {
    const fullMessage = `${title}\n\n${message}`;
    const link = generateWhatsAppLink(phoneNumber, fullMessage);
    
    console.log(`Link WhatsApp gerado: ${link.url}`);
    return true;
  } catch (error) {
    console.error('Erro ao gerar link WhatsApp:', error);
    return false;
  }
}

/**
 * Notificar admin sobre novo cadastro
 */
export async function notifyAdminNewCadastro(
  tipo: 'pf' | 'pj',
  nome: string,
  email: string,
  telefone: string,
  adminPhone: string
): Promise<WhatsAppLink> {
  return generateAdminNotificationLink(tipo, nome, email, telefone, adminPhone);
}

/**
 * Notificar cliente sobre confirmação
 */
export async function notifyClientCadastroConfirmation(
  nome: string,
  clientPhone: string
): Promise<WhatsAppLink> {
  return generateClientNotificationLink(nome, clientPhone);
}
