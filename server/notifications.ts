import twilio from 'twilio';

// Configurar Twilio para WhatsApp
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+55XXXXXXXXXX';

export interface NotificationOptions {
  type: 'whatsapp' | 'push' | 'email';
  recipient: string; // Telefone para WhatsApp, token para push
  title: string;
  message: string;
  data?: Record<string, any>;
}

/**
 * Enviar notificação via WhatsApp
 */
export async function sendWhatsAppNotification(
  phoneNumber: string,
  title: string,
  message: string
): Promise<boolean> {
  try {
    // Validar número de telefone
    if (!phoneNumber.startsWith('+55')) {
      console.error('Número de telefone inválido:', phoneNumber);
      return false;
    }

    const fullMessage = `${title}\n\n${message}`;

    const result = await twilioClient.messages.create({
      from: TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${phoneNumber}`,
      body: fullMessage,
    });

    console.log(`WhatsApp enviado: ${result.sid}`);
    return true;
  } catch (error) {
    console.error('Erro ao enviar WhatsApp:', error);
    return false;
  }
}

/**
 * Notificar admin sobre novo cadastro via WhatsApp
 */
export async function notifyAdminNewCadastro(
  tipo: 'pf' | 'pj',
  nome: string,
  email: string,
  telefone: string
): Promise<boolean> {
  try {
    const adminPhone = process.env.ADMIN_WHATSAPP_PHONE || '+5511999999999';

    const title = `📋 Novo Cadastro ${tipo === 'pf' ? 'PF' : 'PJ'}`;
    const message = `
Nome: ${nome}
Email: ${email}
Telefone: ${telefone}

Acesse o painel admin para mais detalhes.
    `.trim();

    return await sendWhatsAppNotification(adminPhone, title, message);
  } catch (error) {
    console.error('Erro ao notificar admin:', error);
    return false;
  }
}

/**
 * Notificar cliente sobre confirmação de cadastro
 */
export async function notifyClientCadastroConfirmation(
  nome: string,
  telefone: string,
  tipo: 'pf' | 'pj'
): Promise<boolean> {
  try {
    const title = '✅ Cadastro Recebido!';
    const message = `
Olá ${nome}!

Recebemos seu cadastro com sucesso na Loc 7 Equipamentos.

Nossa equipe irá analisar seus dados e entrará em contato em breve.

Obrigado!
    `.trim();

    return await sendWhatsAppNotification(telefone, title, message);
  } catch (error) {
    console.error('Erro ao notificar cliente:', error);
    return false;
  }
}

/**
 * Enviar notificação genérica
 */
export async function sendNotification(options: NotificationOptions): Promise<boolean> {
  try {
    switch (options.type) {
      case 'whatsapp':
        return await sendWhatsAppNotification(
          options.recipient,
          options.title,
          options.message
        );

      case 'push':
        // TODO: Implementar notificações push
        console.log('Push notification:', options);
        return true;

      case 'email':
        // Usar o serviço de email existente
        console.log('Email notification:', options);
        return true;

      default:
        return false;
    }
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    return false;
  }
}

/**
 * Verificar conexão com Twilio
 */
export async function testTwilioConnection(): Promise<boolean> {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      console.warn('Credenciais Twilio não configuradas');
      return false;
    }

    const account = await twilioClient.api.accounts.list({ limit: 1 });
    console.log('Conexão Twilio verificada com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao verificar conexão Twilio:', error);
    return false;
  }
}
