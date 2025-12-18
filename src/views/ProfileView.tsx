import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, ChevronRight, FileText, CreditCard, Shield, 
  User, LogOut, Users, Crown, Camera, Edit3, Check, X, 
  ZoomIn, Move, Save
} from 'lucide-react';
import { ViewProps } from '../types';
import { NeonButton, LanguageSwitcher } from '../components';

const ProfileView: React.FC<ViewProps> = ({ navigate, t, lang, setLang, userInfo, setUserInfo }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userInfo?.nickname || 'Player_99');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  interface MenuItemProps {
    icon: React.ElementType;
    label: string;
    onClick: () => void;
    sub?: string;
  }

  const MenuItem: React.FC<MenuItemProps> = ({ icon: Icon, label, onClick, sub }) => (
    <div onClick={onClick} className="flex items-center justify-between p-4 border-b border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer">
      <div className="flex items-center">
        <div className="p-2 bg-slate-800 rounded-lg mr-3 text-emerald-500">
          <Icon size={20} />
        </div>
        <div>
          <div className="text-white text-sm font-bold">{label}</div>
          {sub && <div className="text-[10px] text-slate-500">{sub}</div>}
        </div>
      </div>
      <ChevronRight size={16} className="text-slate-600" />
    </div>
  );

  const handleNameSave = () => {
    setUserInfo(prev => ({ ...prev, nickname: tempName }));
    setIsEditingName(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setShowAvatarModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarConfirm = () => {
    setUserInfo(prev => ({ ...prev, avatar: selectedImage }));
    setShowAvatarModal(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 relative">
      <div className="p-6 bg-slate-800 pb-10 rounded-b-[2rem] shadow-lg mb-4">
        <div className="flex justify-between items-start">
          <button onClick={() => navigate('dashboard')}>
            <ArrowLeft className="text-white" />
          </button>
          <LanguageSwitcher currentLang={lang} setLang={setLang} />
        </div>
        
        {/* Avatar Section */}
        <div className="flex flex-col items-center mt-[-20px]">
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <div className="w-24 h-24 rounded-full border-4 border-slate-900 p-1 bg-gradient-to-tr from-emerald-500 to-slate-700 shadow-xl overflow-hidden relative">
              {userInfo?.avatar ? (
                <img src={userInfo.avatar} alt="avatar" className="w-full h-full rounded-full object-cover bg-slate-900" />
              ) : (
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" className="rounded-full bg-slate-900 w-full h-full" />
              )}
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={24} />
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept="image/*" />
          </div>

          {/* Nickname Section */}
          <div className="mt-3 flex items-center justify-center gap-2 h-8">
            {isEditingName ? (
              <div className="flex items-center bg-slate-900 rounded-full px-2 border border-emerald-500 animate-in fade-in zoom-in duration-200">
                <input 
                  type="text" 
                  value={tempName} 
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-transparent text-white text-sm font-bold w-32 outline-none text-center"
                  autoFocus
                />
                <button onClick={handleNameSave} className="p-1 text-emerald-400 hover:text-white">
                  <Check size={16}/>
                </button>
                <button onClick={() => setIsEditingName(false)} className="p-1 text-rose-400 hover:text-white">
                  <X size={16}/>
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-white">{userInfo?.nickname || 'Player_99'}</h2>
                <button onClick={() => setIsEditingName(true)} className="text-slate-500 hover:text-emerald-400 transition-colors">
                  <Edit3 size={16} />
                </button>
              </>
            )}
          </div>
          <p className="text-slate-400 text-xs mt-1">UID: 88392010</p>
        </div>

        <div className="flex justify-around mt-6">
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-white">128</div>
            <div className="text-[10px] text-slate-500 uppercase">{t.profile.totalOrders}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-emerald-400">99%</div>
            <div className="text-[10px] text-slate-500 uppercase">{t.profile.rate}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-white">Level 3</div>
            <div className="text-[10px] text-slate-500 uppercase">{t.profile.level}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="mx-4 bg-slate-900 rounded-xl overflow-hidden mb-4">
          <p className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.profile.groupTrans}</p>
          <MenuItem icon={FileText} label={t.profile.record} onClick={() => navigate('transaction-history')} />
          <MenuItem icon={CreditCard} label={t.profile.account} onClick={() => navigate('payment-account')} />
        </div>
        
        <div className="mx-4 bg-slate-900 rounded-xl overflow-hidden mb-4">
          <p className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Member Center</p>
          <MenuItem icon={Users} label={t.profile.referral} onClick={() => navigate('referral-center')} />
          <MenuItem icon={Crown} label={t.profile.membership} onClick={() => navigate('membership')} />
        </div>

        <div className="mx-4 bg-slate-900 rounded-xl overflow-hidden">
          <p className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.profile.groupSys}</p>
          <MenuItem icon={Shield} label={t.profile.security} onClick={() => navigate('security-center')} />
          <MenuItem icon={User} label={t.profile.service} onClick={() => navigate('customer-service')} />
          <div className="p-4 mt-4">
            <NeonButton variant="outline" fullWidth onClick={() => navigate('login')}>
              <LogOut size={16} className="mr-2" />
              {t.profile.logout}
            </NeonButton>
          </div>
        </div>
      </div>

      {/* Avatar Crop Modal */}
      {showAvatarModal && (
        <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-200">
          <div className="w-full max-w-xs bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <span className="text-white font-bold">{t.profile.cropTitle}</span>
              <button onClick={() => setShowAvatarModal(false)}>
                <X className="text-slate-400 hover:text-white" />
              </button>
            </div>
            <div className="h-64 bg-black relative overflow-hidden flex items-center justify-center">
              {selectedImage && (
                <img src={selectedImage} alt="crop preview" className="max-w-none w-full opacity-80" />
              )}
              <div className="absolute inset-0 border-[100px] border-black/60 rounded-full pointer-events-none"></div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 rounded-full border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]"></div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded text-[10px] text-white flex items-center">
                <Move size={12} className="mr-1" /> Drag to move
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <ZoomIn size={16} className="text-slate-400" />
                <input type="range" min="1" max="3" step="0.1" defaultValue="1" className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
              </div>
              <NeonButton fullWidth onClick={handleAvatarConfirm}>
                <Save size={16} className="mr-2" /> {t.common.confirm}
              </NeonButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;

