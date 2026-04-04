import { sendEmail } from './email';
import { generatePDFPF, generatePDFPJ, FormDataPF, FormDataPJ } from './pdf-generator';
import { uploadPDFToS3 } from './s3-storage';
import { notifyAdminNewCadastro, notifyClientCadastroConfirmation } from './notifications-simple';

export async function handleFormSubmissionPF(data: FormDataPF, clientEmail: string): Promise<boolean> {
  try {
    // Gerar PDF
    const pdfBuffer = await generatePDFPF(data);
    const fileName = `Cadastro_PF_${data.cpf.replace(/\D/g, '')}.pdf`;

    // Salvar PDF em S3
    const s3Result = await uploadPDFToS3(
      pdfBuffer,
      fileName,
      'pf',
      clientEmail,
      data.nomeCompleto
    );

    if (s3Result) {
      console.log(`PDF salvo em S3: ${s3Result.url}`);
    }

    // Preparar anexos (documentos do cliente)
    const attachments: Array<{ filename: string; content: Buffer; contentType: string }> = [
      {
        filename: fileName,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ];

    // Email para o cliente (confirmação)
    const clientEmailHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <div style="background-color: #1a1a1a; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">LOC 7</h1>
          <p style="margin: 5px 0; color: #CC0000;">EQUIPAMENTOS</p>
        </div>
        
        <div style="padding: 30px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #CC0000;">Cadastro Recebido com Sucesso!</h2>
          
          <p>Olá <strong>${data.nomeCompleto}</strong>,</p>
          
          <p>Agradecemos por se cadastrar na <strong>Loc 7 Equipamentos</strong>.</p>
          
          <p>Recebemos todos os seus dados e documentos. Nossa equipe irá analisar seu cadastro e entrará em contato em breve.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #CC0000; margin: 20px 0;">
            <p style="margin: 0;"><strong>Dados do Cadastro:</strong></p>
            <p style="margin: 5px 0;">CPF: ${data.cpf}</p>
            <p style="margin: 5px 0;">Email: ${data.email}</p>
            <p style="margin: 5px 0;">Telefone: ${data.telefone}</p>
          </div>
          
          <p>Em caso de dúvidas, entre em contato conosco:</p>
          <p>
            📧 Email: loc7@loc7equipamentos.com.br<br>
            📞 WhatsApp: <a href="https://wa.me/message/WOIONHHSTABQF1" style="color: #CC0000; text-decoration: none;">Falar agora</a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #666; text-align: center;">
            © 2026 Loc 7 Equipamentos. Todos os direitos reservados.
          </p>
        </div>
      </div>
    `;

    const clientEmailSent = await sendEmail({
      to: clientEmail,
      subject: 'Cadastro Recebido - Loc 7 Equipamentos',
      html: clientEmailHtml,
      attachments,
    });

    if (!clientEmailSent) {
      console.error('Erro ao enviar email para cliente');
      return false;
    }

    // Email para admin (formulário completo + documentos)
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <div style="background-color: #1a1a1a; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">LOC 7</h1>
          <p style="margin: 5px 0; color: #CC0000;">EQUIPAMENTOS</p>
        </div>
        
        <div style="padding: 30px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #CC0000;">Novo Cadastro - Pessoa Física</h2>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #CC0000; margin: 20px 0;">
            <p style="margin: 0;"><strong>Informações do Cliente:</strong></p>
            <p style="margin: 5px 0;">Nome: ${data.nomeCompleto}</p>
            <p style="margin: 5px 0;">CPF: ${data.cpf}</p>
            <p style="margin: 5px 0;">Email: ${data.email}</p>
            <p style="margin: 5px 0;">Telefone: ${data.telefone}</p>
            <p style="margin: 5px 0;">Data do Cadastro: ${data.dataCadastro}</p>
          </div>
          
          <p>O formulário completo e os documentos estão anexados a este email.</p>
          
          <p style="font-size: 12px; color: #666; margin-top: 30px;">
            Mensagem automática - Não responda este email
          </p>
        </div>
      </div>
    `;

    const adminEmailPrimary = await sendEmail({
      to: process.env.ADMIN_EMAIL_PRIMARY || 'loc7@loc7equipamentos.com.br',
      cc: process.env.ADMIN_EMAIL_CC,
      subject: `Novo Cadastro PF - ${data.nomeCompleto}`,
      html: adminEmailHtml,
      attachments,
    });

    // Enviar notificações
    if (adminEmailPrimary) {
      const adminPhone = process.env.ADMIN_WHATSAPP_PHONE || '+5511919671611';
      // Notificar admin via WhatsApp
      await notifyAdminNewCadastro('pf', data.nomeCompleto, data.email, data.telefone, adminPhone);
      // Notificar cliente via WhatsApp
      await notifyClientCadastroConfirmation(data.nomeCompleto, data.telefone);
    }

    return adminEmailPrimary;
  } catch (error) {
    console.error('Erro ao processar cadastro PF:', error);
    return false;
  }
}

export async function handleFormSubmissionPJ(data: FormDataPJ, clientEmail: string): Promise<boolean> {
  try {
    // Gerar PDF
    const pdfBuffer = await generatePDFPJ(data);
    const fileName = `Cadastro_PJ_${data.razaoSocial.replace(/\s+/g, '_')}.pdf`;

    // Salvar PDF em S3
    const s3Result = await uploadPDFToS3(
      pdfBuffer,
      fileName,
      'pj',
      clientEmail,
      data.nomeCompleto
    );

    if (s3Result) {
      console.log(`PDF salvo em S3: ${s3Result.url}`);
    }

    // Preparar anexos
    const attachments: Array<{ filename: string; content: Buffer; contentType: string }> = [
      {
        filename: fileName,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ];

    // Email para o cliente (confirmação)
    const clientEmailHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <div style="background-color: #1a1a1a; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">LOC 7</h1>
          <p style="margin: 5px 0; color: #CC0000;">EQUIPAMENTOS</p>
        </div>
        
        <div style="padding: 30px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #CC0000;">Cadastro Recebido com Sucesso!</h2>
          
          <p>Olá <strong>${data.nomeCompleto}</strong>,</p>
          
          <p>Agradecemos por se cadastrar na <strong>Loc 7 Equipamentos</strong>.</p>
          
          <p>Recebemos todos os seus dados e documentos da empresa. Nossa equipe irá analisar seu cadastro e entrará em contato em breve.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #CC0000; margin: 20px 0;">
            <p style="margin: 0;"><strong>Dados do Cadastro:</strong></p>
            <p style="margin: 5px 0;">Empresa: ${data.razaoSocial}</p>
            <p style="margin: 5px 0;">Email: ${data.email}</p>
            <p style="margin: 5px 0;">Telefone: ${data.telefone}</p>
          </div>
          
          <p>Em caso de dúvidas, entre em contato conosco:</p>
          <p>
            📧 Email: loc7@loc7equipamentos.com.br<br>
            📞 WhatsApp: <a href="https://wa.me/message/WOIONHHSTABQF1" style="color: #CC0000; text-decoration: none;">Falar agora</a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #666; text-align: center;">
            © 2026 Loc 7 Equipamentos. Todos os direitos reservados.
          </p>
        </div>
      </div>
    `;

    const clientEmailSent = await sendEmail({
      to: clientEmail,
      subject: 'Cadastro Recebido - Loc 7 Equipamentos',
      html: clientEmailHtml,
      attachments,
    });

    if (!clientEmailSent) {
      console.error('Erro ao enviar email para cliente');
      return false;
    }

    // Email para admin
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <div style="background-color: #1a1a1a; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">LOC 7</h1>
          <p style="margin: 5px 0; color: #CC0000;">EQUIPAMENTOS</p>
        </div>
        
        <div style="padding: 30px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #CC0000;">Novo Cadastro - Pessoa Jurídica</h2>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #CC0000; margin: 20px 0;">
            <p style="margin: 0;"><strong>Informações da Empresa:</strong></p>
            <p style="margin: 5px 0;">Razão Social: ${data.razaoSocial}</p>
            <p style="margin: 5px 0;">Responsável: ${data.nomeCompleto}</p>
            <p style="margin: 5px 0;">Email: ${data.email}</p>
            <p style="margin: 5px 0;">Telefone: ${data.telefone}</p>
            <p style="margin: 5px 0;">Data do Cadastro: ${data.dataCadastro}</p>
          </div>
          
          <p>O formulário completo e os documentos estão anexados a este email.</p>
          
          <p style="font-size: 12px; color: #666; margin-top: 30px;">
            Mensagem automática - Não responda este email
          </p>
        </div>
      </div>
    `;

    const adminEmailPrimary = await sendEmail({
      to: process.env.ADMIN_EMAIL_PRIMARY || 'loc7@loc7equipamentos.com.br',
      cc: process.env.ADMIN_EMAIL_CC,
      subject: `Novo Cadastro PJ - ${data.razaoSocial}`,
      html: adminEmailHtml,
      attachments,
    });

    // Enviar notificações
    if (adminEmailPrimary) {
      const adminPhone = process.env.ADMIN_WHATSAPP_PHONE || '+5511919671611';
      // Notificar admin via WhatsApp
      await notifyAdminNewCadastro('pj', data.nomeCompleto, data.email, data.telefone, adminPhone);
      // Notificar cliente via WhatsApp
      await notifyClientCadastroConfirmation(data.nomeCompleto, data.telefone);
    }

    return adminEmailPrimary;
  } catch (error) {
    console.error('Erro ao processar cadastro PJ:', error);
    return false;
  }
}
