import { useState } from 'react';
import { Save, Loader } from 'lucide-react';

interface RentalRegistration {
  id: string;
  registration_type: 'pf' | 'pj';
  full_name: string;
  company_name: string | null;
  phone: string;
  email: string;
  internal_status: 'received' | 'analyzing' | 'pending' | 'approved' | 'rejected' | 'blocked';
  public_status: 'processing' | 'approved';
  risk_level: 'normal' | 'attention' | 'danger' | 'blacklist';
  internal_notes: string | null;
  created_at: string;
}

interface CadastroRowProps {
  registration: RentalRegistration;
  onSave: (id: string, internalStatus: string, riskLevel: string, internalNotes: string) => void;
  isSaving: boolean;
  canEdit: boolean;
  canAddNotes: boolean;
}

export default function CadastroRow({
  registration,
  onSave,
  isSaving,
  canEdit,
  canAddNotes,
}: CadastroRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [internalStatus, setInternalStatus] = useState(registration.internal_status);
  const [riskLevel, setRiskLevel] = useState(registration.risk_level);
  const [internalNotes, setInternalNotes] = useState(registration.internal_notes || '');
  const [noteError, setNoteError] = useState('');

  const displayName =
    registration.registration_type === 'pf'
      ? registration.full_name
      : registration.company_name || registration.full_name;

  const typeLabel = registration.registration_type === 'pf' ? 'PF' : 'PJ';

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'normal':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'attention':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'danger':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'blacklist':
        return 'bg-gray-900 text-white border-gray-800';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleSave = () => {
    if ((riskLevel === 'danger' || riskLevel === 'blacklist') && !internalNotes.trim()) {
      setNoteError('Nota obrigatória para este nível de risco');
      return;
    }

    setNoteError('');
    onSave(registration.id, internalStatus, riskLevel, internalNotes);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-2">
            <p className="text-sm font-medium text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-600">{registration.email}</p>
          </div>

          <div className="col-span-1">
            <span className="text-sm text-gray-700">{typeLabel}</span>
          </div>

          <div className="col-span-1">
            <span className="text-sm text-gray-700">{registration.phone}</span>
          </div>

          <div className="col-span-1">
            <select
              value={internalStatus}
              onChange={(e) => setInternalStatus(e.target.value)}
              disabled={!canEdit}
              className="w-full px-2 py-1 text-sm border rounded bg-white"
            >
              <option value="received">Recebido</option>
              <option value="analyzing">Analisando</option>
              <option value="pending">Pendente</option>
              <option value="approved">Aprovado</option>
              <option value="rejected">Rejeitado</option>
              <option value="blocked">Bloqueado</option>
            </select>
          </div>

          <div className="col-span-1">
            <span className={`px-2 py-1 text-xs border rounded ${getStatusColor(
              internalStatus === 'approved' ? 'approved' : 'processing'
            )}`}>
              {internalStatus === 'approved' ? 'Aprovado' : 'Processando'}
            </span>
          </div>

          <div className="col-span-1">
            <select
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value)}
              disabled={!canEdit}
              className="w-full px-2 py-1 text-sm border rounded bg-white"
            >
              <option value="normal">Normal</option>
              <option value="attention">Atenção</option>
              <option value="danger">Perigo</option>
              <option value="blacklist">Bloqueado</option>
            </select>
          </div>

          <div className="col-span-1">
            <span className="text-sm">
              {new Date(registration.created_at).toLocaleDateString('pt-BR')}
            </span>
          </div>

          <div className="col-span-3 flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving || !canEdit}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
            >
              {isSaving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            </button>

            <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-sm border rounded">
              Cancelar
            </button>
          </div>
        </div>

        {canAddNotes && (
          <textarea
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            className="w-full mt-2 p-2 border rounded"
            placeholder="Nota interna..."
          />
        )}

        {noteError && <p className="text-red-600 text-xs mt-1">{noteError}</p>}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 p-4 border-b">
      <div className="col-span-2">{displayName}</div>
      <div className="col-span-1">{typeLabel}</div>
      <div className="col-span-1">{registration.phone}</div>
      <div className="col-span-1">{registration.internal_status}</div>
      <div className="col-span-1">{registration.public_status}</div>
      <div className="col-span-1">{registration.risk_level}</div>
      <div className="col-span-1">
        {new Date(registration.created_at).toLocaleDateString('pt-BR')}
      </div>
      <div className="col-span-3">
        {canEdit && (
          <button onClick={() => setIsEditing(true)} className="text-blue-600 text-sm">
            Editar
          </button>
        )}
      </div>
    </div>
  );
}
