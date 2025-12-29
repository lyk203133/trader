import React, { useState } from 'react';
import { ArrowLeft, Key } from 'lucide-react';
import { ViewProps } from '../types';
import { InputField, NeonButton } from '../components';
import api from '../services/api';

const ChangePinView: React.FC<ViewProps> = ({ navigate, t }) => {
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handleSave = async () => {
    if (!oldPin || !newPin || !confirmPin) return;
    if (newPin !== confirmPin) return alert(t.security.errorMismatch);
    try {
      const res = await api.post("/user/reset-transaction-password",{
        oldPin: oldPin,
        newPin: newPin,
        confirmPin: confirmPin
      }); 
      if (res.data) {
        alert(t.security.successMsg);
        navigate('security-center');
      }
    } catch (err: any) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="p-4 flex items-center bg-slate-800 shadow-lg z-10">
        <button onClick={() => navigate('security-center')} className="p-2 mr-2">
          <ArrowLeft className="text-white" />
        </button>
        <div>
          <h2 className="text-white font-bold text-lg">{t.security.changePin}</h2>
        </div>
      </div>
      <div className="flex-1 p-5 space-y-6">
        <div className="space-y-4">
          <InputField 
            icon={Key} 
            isSecure={true} 
            label={t.security.oldPin} 
            value={oldPin} 
            onChange={(e) => setOldPin(e.target.value)} 
          />
          <InputField 
            icon={Key} 
            isSecure={true} 
            label={t.security.newPin} 
            subLabel={t.security.pinHint}
            value={newPin} 
            onChange={(e) => setNewPin(e.target.value)} 
          />
          <InputField 
            icon={Key} 
            isSecure={true} 
            label={t.security.confirmPin} 
            value={confirmPin} 
            onChange={(e) => setConfirmPin(e.target.value)} 
          />
        </div>
        <NeonButton variant="blue" fullWidth onClick={handleSave}>{t.common.save}</NeonButton>
      </div>
    </div>
  );
};

export default ChangePinView;

