import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Phone, Mail, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-md mx-auto space-y-5">
      <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
      <div className="bg-white rounded-2xl shadow p-6 space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <User className="text-green-700" size={32}/>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">Customer</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <Phone className="text-green-600" size={18}/>
            <div>
              <p className="text-xs text-gray-400">Phone</p>
              <p className="font-medium text-gray-800">{user?.phone}</p>
            </div>
          </div>
          {user?.email && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Mail className="text-green-600" size={18}/>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="font-medium text-gray-800">{user.email}</p>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-100 transition"
        >
          <LogOut size={18}/> Log Out
        </button>
      </div>
    </div>
  );
}
