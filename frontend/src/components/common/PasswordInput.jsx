import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

const PasswordInput = ({
  value,
  onChange,
  placeholder = 'Password',
  required = true,
  name = 'password',
  id,
  className = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Lock className="w-4 h-4 text-[#736A62] dark:text-[#A69B8F] absolute left-3.5 top-3" />
      <input
        type={showPassword ? 'text' : 'password'}
        name={name}
        id={id}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full bg-[#F8F6F0] dark:bg-[#1C1815] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#26221F] dark:text-[#FAF8F5] placeholder-[#A69B8F] focus:outline-none focus:border-[#8C532B] focus:ring-1 focus:ring-[#8C532B]/30 transition-colors ${className}`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-3 text-[#736A62] hover:text-[#26221F] dark:hover:text-white transition-colors cursor-pointer"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default PasswordInput;
