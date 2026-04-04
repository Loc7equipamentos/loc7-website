import nodemailer from 'nodemailer';

// Configurar transportador SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostgator.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // TLS
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASSWORD || '',
  },
});

export interface EmailOptions {
  to: string;
  cc?: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const mailOptions = {
      from: `${process.env.SMTP_FROM_NAME || 'Loc 7 Equipamentos'} <${process.env.SMTP_USER}>`,
      to: options.to,
      cc: options.cc,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments || [],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return false;
  }
}

export function getTransporter() {
  return transporter;
}

export async function testEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log('Conexão SMTP verificada com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao verificar conexão SMTP:', error);
    return false;
  }
}
