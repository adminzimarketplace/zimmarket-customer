import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [step, setStep]       = useState(1);
  const [name, setName]       = useState('');
  const [phone, setPhone]     = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp]         = useState('');
  const [otpChannel, setOtpChannel] = useState('sms'); // 'email' or 'sms'
  const [loading, setLoading] = useState(false);
  const { register, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !phone || !password) return toast.error('Fill in all required fields');
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const result = await register(name, phone, email, password);
      setOtpChannel(result.otpChannel || 'sms');
      toast.success(
        result.otpChannel === 'email'
          ? `OTP sent to ${email}`
          : `OTP sent to ${phone}`
      );
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

  const handleResend = async () => {
    try {
      const { default: api } = await import('../utils/api');
      await api.post('/auth/otp/resend', { phone });
      toast.success('New OTP sent!');
    } catch {
      toast.error('Failed to resend');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🛒</div>
          <h1 className="text-2xl font-bold text-gray-800">
            {step === 1 ? 'Create Account' : 'Verify Your Account'}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {step === 1
              ? "Join ZimMarket today — it's free!"
              : otpChannel === 'email'
                ? `Enter the 6-digit code sent to ${email}`
                : `Enter the 6-digit code sent to ${phone}`}
          </p>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Tendai Moyo"
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+263771234567"
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
                <span className="ml-2 text-xs font-normal text-green-600 bg-green-50 px-2 py-0.5 rounded-full">OTP sent here if provided</span>
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@gmail.com"
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"/>
              <p className="text-xs text-gray-400 mt-1">
                {email ? '✉️ OTP will be sent to your email' : '📱 OTP will be sent via SMS to your phone'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters"
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"/>
            </div>
            <button onClick={handleRegister} disabled={loading}
              className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-600 disabled:opacity-50 transition">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-green-700 font-semibold hover:underline">Log In</Link>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* OTP channel indicator */}
            <div className={`rounded-xl p-4 text-center ${otpChannel === 'email' ? 'bg-blue-50 border border-blue-200' : 'bg-green-50 border border-green-200'}`}>
              <div className="text-3xl mb-1">{otpChannel === 'email' ? '✉️' : '📱'}</div>
              <p className="text-sm font-medium text-gray-700">
                {otpChannel === 'email' ? `Code sent to ${email}` : `Code sent to ${phone}`}
              </p>
              <p className="text-xs text-gray-400 mt-1">Check your {otpChannel === 'email' ? 'inbox (and spam folder)' : 'SMS messages'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">6-Digit Code</label>
              <input
                type="number"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="123456"
                maxLength={6}
                className="w-full border rounded-xl px-4 py-3 text-center text-3xl tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button onClick={handleVerify} disabled={loading}
              className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-600 disabled:opacity-50 transition">
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>

            <div className="flex items-center justify-between text-sm">
              <button onClick={() => setStep(1)} className="text-gray-400 hover:underline">← Go back</button>
              <button onClick={handleResend} className="text-green-700 hover:underline font-medium">Resend code</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
