import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !phone || !password) return toast.error('Fill in all required fields');
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(name, phone, email, password);
      toast.success('OTP sent to your phone!');
      setStep(2);
    } catch (e) {
      toast.error(e.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otp) return toast.error('Enter the OTP code');
    setLoading(true);
    try {
      await verifyOtp(phone, otp);
      toast.success('Account created! Welcome to ZimMarket!');
      navigate('/');
    } catch (e) {
      toast.error(e.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🛒</div>
          <h1 className="text-2xl font-bold text-gray-800">
            {step === 1 ? 'Create Account' : 'Verify Phone'}
          </h1>
          <p className="text-gray-500 mt-1">
            {step === 1 ? 'Join ZimMarket today — it\'s free!' : `Enter the 6-digit code sent to ${phone}`}
          </p>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Tendai Moyo"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+263771234567"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@gmail.com"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold text-lg hover:bg-green-600 disabled:opacity-50 transition"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-green-700 font-semibold hover:underline">Log In</Link>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">6-Digit OTP Code</label>
              <input
                type="number"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="e.g. 123456"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-center text-2xl tracking-widest"
                maxLength={6}
              />
            </div>
            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold text-lg hover:bg-green-600 disabled:opacity-50 transition"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
            <button onClick={() => setStep(1)} className="w-full text-gray-500 text-sm hover:underline">
              Go back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
