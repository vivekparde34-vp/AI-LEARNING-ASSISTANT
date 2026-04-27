import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { User, Lock, Save, Eye, EyeOff } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [pwdForm, setPwdForm] = useState({ current: '', new: '', confirm: '' });
  const [showPwds, setShowPwds] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await authAPI.updateProfile({ name });
      updateUser(res.data);
      toast.success('Profile updated');
    } catch { toast.error('Failed to update profile'); }
    finally { setSavingProfile(false); }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (pwdForm.new !== pwdForm.confirm) return toast.error('Passwords do not match');
    if (pwdForm.new.length < 6) return toast.error('Password must be at least 6 characters');
    setSavingPwd(true);
    try {
      await authAPI.updatePassword({ currentPassword: pwdForm.current, newPassword: pwdForm.new });
      toast.success('Password updated');
      setPwdForm({ current: '', new: '', confirm: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update password'); }
    finally { setSavingPwd(false); }
  };

  const toggleShow = (field) => setShowPwds(p => ({ ...p, [field]: !p[field] }));

  return (
    <div className="p-6 lg:p-8 max-w-lg space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl text-slate-100">Profile</h1>
        <p className="text-slate-400 mt-1">Manage your account settings</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-primary-600/20 rounded-2xl flex items-center justify-center">
          <span className="font-display text-2xl text-primary-400">{user?.name?.[0]?.toUpperCase()}</span>
        </div>
        <div>
          <p className="font-medium text-slate-200">{user?.name}</p>
          <p className="text-sm text-slate-400">{user?.email}</p>
        </div>
      </div>

      {/* Profile form */}
      <div className="card p-6">
        <h2 className="font-display text-lg text-slate-100 mb-5 flex items-center gap-2"><User size={18} className="text-primary-400" /> Personal Info</h2>
        <form onSubmit={saveProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="input" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
            <input type="email" value={user?.email} className="input opacity-50 cursor-not-allowed" disabled />
            <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
          </div>
          <button type="submit" disabled={savingProfile} className="btn-primary flex items-center gap-2">
            {savingProfile ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
        </form>
      </div>

      {/* Password form */}
      <div className="card p-6">
        <h2 className="font-display text-lg text-slate-100 mb-5 flex items-center gap-2"><Lock size={18} className="text-orange-400" /> Change Password</h2>
        <form onSubmit={savePassword} className="space-y-4">
          {[
            { key: 'current', label: 'Current Password' },
            { key: 'new', label: 'New Password' },
            { key: 'confirm', label: 'Confirm New Password' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
              <div className="relative">
                <input type={showPwds[key] ? 'text' : 'password'} value={pwdForm[key]}
                  onChange={e => setPwdForm(p => ({ ...p, [key]: e.target.value }))}
                  className="input pr-10" placeholder="••••••••" required />
                <button type="button" onClick={() => toggleShow(key)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPwds[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          ))}
          <button type="submit" disabled={savingPwd} className="btn-primary flex items-center gap-2">
            {savingPwd ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Lock size={16} />}
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
