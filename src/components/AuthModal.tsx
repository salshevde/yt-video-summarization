import React, { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSignInEmailPasswordless, useSignInEmailPassword } from '@nhost/react'
import { nhost } from '../lib/nhost';
interface AuthModalProps {
  onClose: () => void;
}

export function AuthModal({ onClose }: AuthModalProps) {

  const [loading, setLoading] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');

  const [isLogin, setIsLogin] = useState(true);

  const { signInEmailPasswordless } = useSignInEmailPasswordless()
  const { signInEmailPassword} = useSignInEmailPassword()


  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // Nhost login
        const { error } = await nhost.auth.signIn({
          email:email,
          password:password,
        });
        if (error) throw error;
        toast.success('Successfully logged in!');
      } else {
        // Nhost sign-up
        const { error } = await nhost.auth.signUp({
          email:email,
          password:password,
        });
        if (error) throw error;
        toast.success('Account created! Please check your email.');
      }
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold mb-6">
          {isLogin ? 'Welcome Back' : 'Create Account'}
          {}
        </h2>
        
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
