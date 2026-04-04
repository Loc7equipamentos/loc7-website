/**
 * Serviço de Auditoria - Log de Alterações
 */

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  entity: 'cadastro' | 'admin' | 'sistema';
  entityId: string;
  adminEmail: string;
  changes: Record<string, { before: any; after: any }>;
  details: string;
}

// Simulado - em produção, usar banco de dados
const auditLogs: AuditLog[] = [];

/**
 * Registrar ação no log de auditoria
 */
export function logAuditAction(
  action: string,
  entity: 'cadastro' | 'admin' | 'sistema',
  entityId: string,
  adminEmail: string,
  changes?: Record<string, { before: any; after: any }>,
  details?: string
): AuditLog {
  const log: AuditLog = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    action,
    entity,
    entityId,
    adminEmail,
    changes: changes || {},
    details: details || '',
  };

  auditLogs.push(log);

  // Manter apenas últimos 1000 logs em memória
  if (auditLogs.length > 1000) {
    auditLogs.shift();
  }

  console.log(`[AUDIT] ${action} - ${entity}:${entityId} por ${adminEmail}`);

  return log;
}

/**
 * Obter logs de auditoria
 */
export function getAuditLogs(
  filters?: {
    entity?: 'cadastro' | 'admin' | 'sistema';
    entityId?: string;
    adminEmail?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
  }
): AuditLog[] {
  let results = [...auditLogs];

  if (filters) {
    if (filters.entity) {
      results = results.filter(l => l.entity === filters.entity);
    }
    if (filters.entityId) {
      results = results.filter(l => l.entityId === filters.entityId);
    }
    if (filters.adminEmail) {
      results = results.filter(l => l.adminEmail === filters.adminEmail);
    }
    if (filters.action) {
      results = results.filter(l => l.action === filters.action);
    }
    if (filters.startDate) {
      results = results.filter(l => new Date(l.timestamp) >= filters.startDate!);
    }
    if (filters.endDate) {
      results = results.filter(l => new Date(l.timestamp) <= filters.endDate!);
    }
  }

  // Ordenar por data decrescente
  return results.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

/**
 * Obter histórico de um cadastro específico
 */
export function getCadastroHistory(cadastroId: string): AuditLog[] {
  return getAuditLogs({ entity: 'cadastro', entityId: cadastroId });
}

/**
 * Obter logs por período
 */
export function getAuditLogsByPeriod(startDate: Date, endDate: Date): AuditLog[] {
  return getAuditLogs({ startDate, endDate });
}

/**
 * Limpar logs antigos (manutenção)
 */
export function clearOldLogs(daysToKeep: number = 90): number {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const initialLength = auditLogs.length;
  
  for (let i = auditLogs.length - 1; i >= 0; i--) {
    if (new Date(auditLogs[i].timestamp) < cutoffDate) {
      auditLogs.splice(i, 1);
    }
  }

  const deletedCount = initialLength - auditLogs.length;
  console.log(`[AUDIT] Limpeza: ${deletedCount} logs antigos removidos`);

  return deletedCount;
}

/**
 * Gerar relatório de auditoria
 */
export function generateAuditReport(startDate: Date, endDate: Date) {
  const logs = getAuditLogsByPeriod(startDate, endDate);

  const report = {
    period: {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    },
    totalActions: logs.length,
    byAction: {} as Record<string, number>,
    byEntity: {} as Record<string, number>,
    byAdmin: {} as Record<string, number>,
  };

  logs.forEach(log => {
    // Contar por ação
    report.byAction[log.action] = (report.byAction[log.action] || 0) + 1;

    // Contar por entidade
    report.byEntity[log.entity] = (report.byEntity[log.entity] || 0) + 1;

    // Contar por admin
    report.byAdmin[log.adminEmail] = (report.byAdmin[log.adminEmail] || 0) + 1;
  });

  return report;
}
