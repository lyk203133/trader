import React, { useState } from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { ViewProps } from '../types';
import { InputField, NeonButton } from '../components';
import api from '../services/api';

const ChangePasswordView: React.FC<ViewProps> = ({ navigate, t }) => {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleSave = async () => {
    if (!oldPass || !newPass || !confirmPass) return;
    if (newPass !== confirmPass) return alert(t.security.errorMismatch);
    try {
      const res = await api.post("/user/reset-password",{
        oldPass: oldPass,
        newPass: newPass,
        confirmPass: confirmPass
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
          <h2 className="text-white font-bold text-lg">{t.security.changePass}</h2>
        </div>
      </div>
      <div className="flex-1 p-5 space-y-6">
        <div className="space-y-4">
          <InputField 
            icon={Lock} 
            isSecure={true} 
            label={t.security.oldPass} 
            value={oldPass} 
            onChange={(e) => setOldPass(e.target.value)} 
          />
          <InputField 
            icon={Lock} 
            isSecure={true} 
            label={t.security.newPass} 
            subLabel={t.security.passHint}
            value={newPass} 
            onChange={(e) => setNewPass(e.target.value)} 
          />
          <InputField 
            icon={Lock} 
            isSecure={true} 
            label={t.security.confirmPass} 
            value={confirmPass} 
            onChange={(e) => setConfirmPass(e.target.value)} 
          />
        </div>
        <NeonButton fullWidth onClick={handleSave}>{t.common.save}</NeonButton>
      </div>
    </div>
  );
};

export default ChangePasswordView;

