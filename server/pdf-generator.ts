import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

export interface FormDataPF {
  dataCadastro: string;
  nomeCompleto: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  nomeMae: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cep: string;
  cidade: string;
  uf: string;
  telefone: string;
  email: string;
  cnhValida?: string;
  empresa1?: string;
  nomeContato1?: string;
  telefoneDdd1?: string;
  empresa2?: string;
  nomeContato2?: string;
  telefoneDdd2?: string;
  empresa3?: string;
  nomeContato3?: string;
  telefoneDdd3?: string;
  redeSocial?: string;
  [key: string]: any;
}

export interface FormDataPJ {
  dataCadastro: string;
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  nomeMae: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cep: string;
  cidade: string;
  uf: string;
  telefone: string;
  email: string;
  razaoSocial: string;
  dataFundacao: string;
  ocupacao: string;
  ramoAtividade: string;
  empresa1?: string;
  nomeContato1?: string;
  telefoneDdd1?: string;
  empresa2?: string;
  nomeContato2?: string;
  telefoneDdd2?: string;
  empresa3?: string;
  nomeContato3?: string;
  telefoneDdd3?: string;
  redeSocial?: string;
  [key: string]: any;
}

const COLORS = {
  primary: '#CC0000',
  dark: '#1a1a1a',
  gray: '#666666',
  lightGray: '#f5f5f5',
};

function addHeader(doc: any) {
  // Background
  doc.rect(0, 0, doc.page.width, 80).fill(COLORS.dark);

  // Logo placeholder (text)
  doc.fontSize(24).font('Helvetica-Bold').fillColor('white').text('LOC 7', 30, 20);
  doc.fontSize(10).font('Helvetica').fillColor(COLORS.primary).text('EQUIPAMENTOS', 30, 48);

  // Title
  doc.fontSize(14).font('Helvetica-Bold').fillColor(COLORS.primary).text('FORMULÁRIO DE CADASTRO', 300, 30);

  // Reset
  doc.fillColor(COLORS.dark);
  doc.y = 100;
}

function addSection(doc: any, title: string) {
  doc.fontSize(12).font('Helvetica-Bold').fillColor(COLORS.primary).text(title, 30, doc.y);
  doc.moveTo(30, doc.y + 5).lineTo(doc.page.width - 30, doc.y + 5).stroke(COLORS.primary);
  doc.y += 20;
}

function addField(doc: any, label: string, value: string, x = 30, width = 250) {
  doc.fontSize(9).font('Helvetica-Bold').fillColor(COLORS.gray).text(label, x, doc.y);
  doc.fontSize(10).font('Helvetica').fillColor(COLORS.dark).text(value || '—', x, doc.y + 15);
  doc.y += 35;
}

function addTwoColumnFields(
  doc: any,
  label1: string,
  value1: string,
  label2: string,
  value2: string
) {
  const y = doc.y;
  addField(doc, label1, value1, 30, 250);
  doc.y = y;
  addField(doc, label2, value2, 310, 250);
}

export function generatePDFPF(data: FormDataPF): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      addHeader(doc);

      // Dados Pessoais
      addSection(doc, 'DADOS PESSOAIS');
      addTwoColumnFields(doc, 'Nome Completo', data.nomeCompleto, 'Data de Cadastro', data.dataCadastro);
      addTwoColumnFields(doc, 'CPF', data.cpf, 'RG', data.rg);
      addTwoColumnFields(doc, 'Data de Nascimento', data.dataNascimento, 'Nome da Mãe', data.nomeMae);

      // Endereço
      addSection(doc, 'ENDEREÇO');
      addField(doc, 'Logradouro', data.endereco);
      addTwoColumnFields(doc, 'Número', data.numero, 'Complemento', data.complemento || '—');
      addTwoColumnFields(doc, 'Bairro', data.bairro, 'CEP', data.cep);
      addTwoColumnFields(doc, 'Cidade', data.cidade, 'UF', data.uf);

      // Contato
      addSection(doc, 'CONTATO');
      addTwoColumnFields(doc, 'Telefone', data.telefone, 'Email', data.email);
      if (data.cnhValida) {
        addField(doc, 'CNH Válida', data.cnhValida);
      }

      // Referências Comerciais
      addSection(doc, 'REFERÊNCIAS COMERCIAIS');
      if (data.empresa1) {
        addField(doc, 'Empresa 1', data.empresa1);
        addTwoColumnFields(doc, 'Contato', data.nomeContato1 || '—', 'Telefone', data.telefoneDdd1 || '—');
      }
      if (data.empresa2) {
        addField(doc, 'Empresa 2', data.empresa2);
        addTwoColumnFields(doc, 'Contato', data.nomeContato2 || '—', 'Telefone', data.telefoneDdd2 || '—');
      }
      if (data.empresa3) {
        addField(doc, 'Empresa 3', data.empresa3);
        addTwoColumnFields(doc, 'Contato', data.nomeContato3 || '—', 'Telefone', data.telefoneDdd3 || '—');
      }

      // Redes Sociais
      if (data.redeSocial) {
        addSection(doc, 'REDES SOCIAIS');
        addField(doc, 'Perfil', data.redeSocial);
      }

      // Footer
      doc.fontSize(8).fillColor(COLORS.gray).text('Documento gerado automaticamente', 30, doc.page.height - 30);
      doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 30, doc.page.height - 20);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export function generatePDFPJ(data: FormDataPJ): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      addHeader(doc);

      // Dados Pessoais
      addSection(doc, 'DADOS PESSOAIS DO RESPONSÁVEL');
      addTwoColumnFields(doc, 'Nome Completo', data.nomeCompleto, 'Data de Cadastro', data.dataCadastro);
      addTwoColumnFields(doc, 'CPF', data.cpf, 'Data de Nascimento', data.dataNascimento);
      addField(doc, 'Nome da Mãe', data.nomeMae);

      // Dados da Empresa
      addSection(doc, 'DADOS DA EMPRESA');
      addField(doc, 'Razão Social', data.razaoSocial);
      addTwoColumnFields(doc, 'Data de Fundação', data.dataFundacao, 'Ocupação', data.ocupacao);
      addField(doc, 'Ramo de Atividade', data.ramoAtividade);

      // Endereço
      addSection(doc, 'ENDEREÇO');
      addField(doc, 'Logradouro', data.endereco);
      addTwoColumnFields(doc, 'Número', data.numero, 'Complemento', data.complemento || '—');
      addTwoColumnFields(doc, 'Bairro', data.bairro, 'CEP', data.cep);
      addTwoColumnFields(doc, 'Cidade', data.cidade, 'UF', data.uf);

      // Contato
      addSection(doc, 'CONTATO');
      addTwoColumnFields(doc, 'Telefone', data.telefone, 'Email', data.email);

      // Referências Comerciais
      addSection(doc, 'REFERÊNCIAS COMERCIAIS');
      if (data.empresa1) {
        addField(doc, 'Empresa 1', data.empresa1);
        addTwoColumnFields(doc, 'Contato', data.nomeContato1 || '—', 'Telefone', data.telefoneDdd1 || '—');
      }
      if (data.empresa2) {
        addField(doc, 'Empresa 2', data.empresa2);
        addTwoColumnFields(doc, 'Contato', data.nomeContato2 || '—', 'Telefone', data.telefoneDdd2 || '—');
      }
      if (data.empresa3) {
        addField(doc, 'Empresa 3', data.empresa3);
        addTwoColumnFields(doc, 'Contato', data.nomeContato3 || '—', 'Telefone', data.telefoneDdd3 || '—');
      }

      // Redes Sociais
      if (data.redeSocial) {
        addSection(doc, 'REDES SOCIAIS');
        addField(doc, 'Perfil', data.redeSocial);
      }

      // Footer
      doc.fontSize(8).fillColor(COLORS.gray).text('Documento gerado automaticamente', 30, doc.page.height - 30);
      doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 30, doc.page.height - 20);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
