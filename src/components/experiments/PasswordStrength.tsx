/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   PASSWORD STRENGTH - Interactive password analyzer  ###
   ###   Tests password strength & generates secure ones    ###
   ###   Last Updated: 28-12-2024                           ###
   ########################################################### */

'use client';

import { useState, useCallback, useEffect } from 'react';

/* ###########################################################
   ###   1. Type Definitions                                ###
   ########################################################### */

interface Checks {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

/* ###########################################################
   ###   2. Component                                       ###
   ########################################################### */

export default function PasswordStrength() {
  /* ###########################################################
     ###   State & Refs                                       ###
     ########################################################### */

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [score, setScore] = useState(0);
  const [checks, setChecks] = useState<Checks>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const [crackTime, setCrackTime] = useState('-');
  const [toast, setToast] = useState<{ message: string; color: string } | null>(null);

  /* ###########################################################
     ###   Helper Functions                                  ###
     ########################################################### */

  // Format crack time in human-readable format
  const formatTime = (seconds: number): string => {
    if (seconds < 1) return 'Instant';
    if (seconds < 60) return Math.round(seconds) + ' seconds';
    if (seconds < 3600) return Math.round(seconds / 60) + ' minutes';
    if (seconds < 86400) return Math.round(seconds / 3600) + ' hours';
    if (seconds < 2592000) return Math.round(seconds / 86400) + ' days';
    if (seconds < 31536000) return Math.round(seconds / 2592000) + ' months';
    if (seconds < 31536000000) return Math.round(seconds / 31536000) + ' years';
    if (seconds < 31536000000000) return Math.round(seconds / 31536000000) + 'k years';
    if (seconds < 31536000000000000) return Math.round(seconds / 31536000000000) + 'M years';
    return 'Billions of years';
  };

  // Calculate time to crack password based on character space and length
  const calculateCrackTime = useCallback((pwd: string): string => {
    if (!pwd) return '-';

    let charSpace = 0;
    if (/[a-z]/.test(pwd)) charSpace += 26;
    if (/[A-Z]/.test(pwd)) charSpace += 26;
    if (/[0-9]/.test(pwd)) charSpace += 10;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)) charSpace += 32;

    const combinations = Math.pow(charSpace, pwd.length);
    const attemptsPerSecond = 1e9;
    const seconds = combinations / (2 * attemptsPerSecond);

    return formatTime(seconds);
  }, []);

  // Analyze password strength and update checks
  const analyzePassword = useCallback(
    (pwd: string) => {
      if (!pwd) {
        setScore(0);
        setChecks({
          length: false,
          uppercase: false,
          lowercase: false,
          number: false,
          special: false,
        });
        setCrackTime('-');
        return;
      }

      const hasLength = pwd.length >= 8;
      const hasUppercase = /[A-Z]/.test(pwd);
      const hasLowercase = /[a-z]/.test(pwd);
      const hasNumber = /[0-9]/.test(pwd);
      const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd);

      setChecks({
        length: hasLength,
        uppercase: hasUppercase,
        lowercase: hasLowercase,
        number: hasNumber,
        special: hasSpecial,
      });

      let newScore = 0;
      if (hasLength) newScore += 20;
      if (hasUppercase) newScore += 20;
      if (hasLowercase) newScore += 20;
      if (hasNumber) newScore += 20;
      if (hasSpecial) newScore += 20;
      if (pwd.length >= 12) newScore += 10;
      if (pwd.length >= 16) newScore += 10;

      setScore(Math.min(newScore, 100));
      setCrackTime(calculateCrackTime(pwd));
    },
    [calculateCrackTime]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Derived state from user input
    analyzePassword(password);
  }, [password, analyzePassword]);

  // Get strength level and color based on score
  const getStrengthInfo = () => {
    if (score < 20) return { level: 'Weak', color: '#ff4444', gradient: 'from-red-500 to-red-400' };
    if (score < 40) return { level: 'Fair', color: '#ff9800', gradient: 'from-orange-500 to-orange-400' };
    if (score < 60) return { level: 'Good', color: '#ffd93d', gradient: 'from-yellow-500 to-yellow-400' };
    if (score < 80) return { level: 'Strong', color: '#8bc34a', gradient: 'from-lime-500 to-lime-400' };
    return { level: 'Excellent', color: '#4caf50', gradient: 'from-green-500 to-green-400' };
  };

  // Generate secure random password
  const generatePassword = () => {
    const length = 16;
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const allChars = uppercase + lowercase + numbers + special;

    let pwd = '';
    pwd += uppercase[Math.floor(Math.random() * uppercase.length)];
    pwd += lowercase[Math.floor(Math.random() * lowercase.length)];
    pwd += numbers[Math.floor(Math.random() * numbers.length)];
    pwd += special[Math.floor(Math.random() * special.length)];

    for (let i = pwd.length; i < length; i++) {
      pwd += allChars[Math.floor(Math.random() * allChars.length)];
    }

    pwd = pwd
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');

    setPassword(pwd);
    setShowPassword(true);
  };

  // Copy password to clipboard
  const copyToClipboard = async () => {
    if (!password) {
      setToast({ message: 'No password to copy!', color: '#ff9800' });
      return;
    }

    try {
      await navigator.clipboard.writeText(password);
      setToast({ message: 'Copied to clipboard!', color: '#4caf50' });
    } catch {
      setToast({ message: 'Failed to copy!', color: '#ff4444' });
    }
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  /* ###########################################################
     ###   Render Data                                       ###
     ########################################################### */

  const strengthInfo = getStrengthInfo();

  const checklistItems = [
    { key: 'length', label: 'At least 8 characters', valid: checks.length },
    { key: 'uppercase', label: 'Contains uppercase letter', valid: checks.uppercase },
    { key: 'lowercase', label: 'Contains lowercase letter', valid: checks.lowercase },
    { key: 'number', label: 'Contains number', valid: checks.number },
    { key: 'special', label: 'Contains special character', valid: checks.special },
  ];

  return (
    <div
      className="w-full max-w-md mx-auto rounded-xl p-6 sm:p-8"
      style={{
        background: '#0f1419',
        border: '1px solid #2a2a3e',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
      }}
    >
      <h2 className="text-2xl font-semibold text-center text-white mb-2">Password Strength</h2>
      <p className="text-center text-white/50 text-sm mb-6">Test and generate secure passwords</p>

      {/* Input */}
      <div className="relative mb-5">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password..."
          autoComplete="off"
          className="w-full px-4 py-3 pr-12 rounded-lg bg-[#1a1f2e] border-2 border-[#2a2a3e] text-white outline-none focus:border-blue-400 transition"
        />
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-blue-400 transition"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>

      {/* Strength Meter */}
      <div className="mb-5">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-white/70">Strength:</span>
          <span className="font-semibold" style={{ color: password ? strengthInfo.color : '#888' }}>
            {password ? strengthInfo.level : '-'}
          </span>
        </div>
        <div className="h-2.5 bg-[#1a1f2e] rounded-full border border-[#2a2a3e] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-400 bg-gradient-to-r ${strengthInfo.gradient}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Crack Time */}
      <div className="p-3 bg-[#1a1f2e] rounded-lg border border-[#2a2a3e] text-center text-sm mb-5">
        <span className="text-white/70">Estimated crack time: </span>
        <span className="font-semibold text-blue-400">{crackTime}</span>
      </div>

      {/* Checklist */}
      <div className="mb-6">
        <div className="font-semibold text-white mb-3">Requirements</div>
        <div className="space-y-2">
          {checklistItems.map((item) => (
            <div
              key={item.key}
              className={`flex items-center p-2.5 rounded-lg border transition ${
                item.valid
                  ? 'bg-green-500/10 border-green-500 opacity-100'
                  : 'bg-[#1a1f2e] border-[#2a2a3e] opacity-60'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 transition ${
                  item.valid ? 'bg-green-500 border-green-500 text-white' : 'border-white/30'
                }`}
              >
                {item.valid && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-white/80">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={generatePassword}
          className="py-3 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 hover:-translate-y-0.5 transition"
        >
          Generate
        </button>
        <button
          onClick={copyToClipboard}
          className="py-3 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90 hover:-translate-y-0.5 transition"
        >
          Copy
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 px-5 py-3 rounded-lg text-white shadow-lg z-50 animate-fade-in"
          style={{ background: toast.color }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
