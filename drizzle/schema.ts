import { mysqlTable, varchar, text, datetime, boolean, decimal, int, mysqlEnum } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// ============= TABELA DE CADASTROS PESSOA FÍSICA =============
export const cadastroPF = mysqlTable('cadastro_pf', {
  id: int('id').primaryKey().autoincrement(),
  
  // Seção 1: Informações Gerais
  dataCadastro: datetime('data_cadastro').notNull(),
  nomeCompleto: varchar('nome_completo', { length: 255 }).notNull(),
  cpf: varchar('cpf', { length: 14 }).notNull().unique(),
  rg: varchar('rg', { length: 15 }),
  dataNascimento: datetime('data_nascimento').notNull(),
  nomeMae: varchar('nome_mae', { length: 255 }).notNull(),
  
  // Seção 2: Endereço
  endereco: varchar('endereco', { length: 255 }).notNull(),
  numero: varchar('numero', { length: 20 }).notNull(),
  bairro: varchar('bairro', { length: 100 }).notNull(),
  cep: varchar('cep', { length: 9 }).notNull(),
  uf: varchar('uf', { length: 2 }).notNull(),
  cidade: varchar('cidade', { length: 100 }).notNull(),
  redeSocial: varchar('rede_social', { length: 255 }),
  
  // Seção 3: Contato
  telefone: varchar('telefone', { length: 15 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  
  // Seção 4: Referências Comerciais
  ref1Empresa: varchar('ref1_empresa', { length: 255 }).notNull(),
  ref1Contato: varchar('ref1_contato', { length: 255 }).notNull(),
  ref1Telefone: varchar('ref1_telefone', { length: 15 }).notNull(),
  ref2Empresa: varchar('ref2_empresa', { length: 255 }),
  ref2Contato: varchar('ref2_contato', { length: 255 }),
  ref2Telefone: varchar('ref2_telefone', { length: 15 }),
  ref3Empresa: varchar('ref3_empresa', { length: 255 }),
  ref3Contato: varchar('ref3_contato', { length: 255 }),
  ref3Telefone: varchar('ref3_telefone', { length: 15 }),
  
  // Seção 5: Informações Adicionais
  ocupacao: varchar('ocupacao', { length: 255 }),
  ramo: varchar('ramo', { length: 255 }),
  associacao: varchar('associacao', { length: 255 }),
  qualAssociacao: varchar('qual_associacao', { length: 255 }),
  nomePai: varchar('nome_pai', { length: 255 }),
  estudante: boolean('estudante').notNull(),
  cnhValida: boolean('cnh_valida').notNull(),
  
  // Seção 6: Documentos
  rgCnhUrl: varchar('rg_cnh_url', { length: 500 }),
  cpfCnhUrl: varchar('cpf_cnh_url', { length: 500 }),
  comprovantResidenciaUrl: varchar('comprovant_residencia_url', { length: 500 }),
  
  // Metadados
  criadoEm: datetime('criado_em').notNull(),
  atualizadoEm: datetime('atualizado_em').notNull(),
  status: mysqlEnum('status', ['pendente', 'aprovado', 'rejeitado']).default('pendente'),
});

// ============= TABELA DE CADASTROS PESSOA JURÍDICA =============
export const cadastroPJ = mysqlTable('cadastro_pj', {
  id: int('id').primaryKey().autoincrement(),
  
  // Seção 1: Informações Gerais para Faturamento
  dataCadastro: datetime('data_cadastro').notNull(),
  contato: varchar('contato', { length: 255 }).notNull(),
  telefone: varchar('telefone', { length: 15 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  
  // Seção 2: Contatos Adicionais
  contato1Nome: varchar('contato1_nome', { length: 255 }),
  contato1Telefone: varchar('contato1_telefone', { length: 15 }),
  contato1Empresa: varchar('contato1_empresa', { length: 255 }),
  contato2Nome: varchar('contato2_nome', { length: 255 }),
  contato2Telefone: varchar('contato2_telefone', { length: 15 }),
  contato2Empresa: varchar('contato2_empresa', { length: 255 }),
  contato3Nome: varchar('contato3_nome', { length: 255 }),
  contato3Telefone: varchar('contato3_telefone', { length: 15 }),
  contato3Empresa: varchar('contato3_empresa', { length: 255 }),
  
  // Seção 3: Dados dos Proprietários
  prop1Nome: varchar('prop1_nome', { length: 255 }).notNull(),
  prop1DataNascimento: datetime('prop1_data_nascimento').notNull(),
  prop1Rg: varchar('prop1_rg', { length: 15 }).notNull(),
  prop1Cpf: varchar('prop1_cpf', { length: 14 }).notNull(),
  prop2Nome: varchar('prop2_nome', { length: 255 }),
  prop2DataNascimento: datetime('prop2_data_nascimento'),
  prop2Rg: varchar('prop2_rg', { length: 15 }),
  prop2Cpf: varchar('prop2_cpf', { length: 14 }),
  
  // Seção 4: Referências Comerciais
  ref1Empresa: varchar('ref1_empresa', { length: 255 }).notNull(),
  ref1Contato: varchar('ref1_contato', { length: 255 }).notNull(),
  ref1Telefone: varchar('ref1_telefone', { length: 15 }).notNull(),
  ref2Empresa: varchar('ref2_empresa', { length: 255 }),
  ref2Contato: varchar('ref2_contato', { length: 255 }),
  ref2Telefone: varchar('ref2_telefone', { length: 15 }),
  ref3Empresa: varchar('ref3_empresa', { length: 255 }),
  ref3Contato: varchar('ref3_contato', { length: 255 }),
  ref3Telefone: varchar('ref3_telefone', { length: 15 }),
  
  // Seção 5: Endereços para Entregas e Cobranças
  endereco: varchar('endereco', { length: 255 }).notNull(),
  complemento: varchar('complemento', { length: 255 }),
  bairro: varchar('bairro', { length: 100 }).notNull(),
  cep: varchar('cep', { length: 9 }).notNull(),
  cidade: varchar('cidade', { length: 100 }).notNull(),
  uf: varchar('uf', { length: 2 }).notNull(),
  
  // Seção 6: Documentos
  ultimaAlteracaoUrl: varchar('ultima_alteracao_url', { length: 500 }),
  cartaoCnpjUrl: varchar('cartao_cnpj_url', { length: 500 }),
  comprovanteEnderecoUrl: varchar('comprovante_endereco_url', { length: 500 }),
  
  // Metadados
  criadoEm: datetime('criado_em').notNull(),
  atualizadoEm: datetime('atualizado_em').notNull(),
  status: mysqlEnum('status', ['pendente', 'aprovado', 'rejeitado']).default('pendente'),
});

// ============= RELAÇÕES =============
export const cadastroPFRelations = relations(cadastroPF, ({ many }) => ({
  // Adicionar relações conforme necessário
}));

export const cadastroPJRelations = relations(cadastroPJ, ({ many }) => ({
  // Adicionar relações conforme necessário
}));
