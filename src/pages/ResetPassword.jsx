import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);

        try {
            const response = await fetch(`/api/auth/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            setMessage('Password reset successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] bg-primary-900/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-[400px]">
                <div
                    className="bg-card py-10 px-10 rounded-[50px] text-center"
                    style={{
                        boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                >
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center text-primary-400"
                            style={{
                                background: 'var(--bg-card)',
                                boxShadow: 'inset 6px 6px 10px 0 rgba(0, 0, 0, 0.6), inset -6px -6px 10px 0 rgba(255, 255, 255, 0.05)'
                            }}>
                            <Lock className="w-8 h-8" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-100 mb-2 tracking-wide">
                        Set Password
                    </h2>
                    <p className="text-gray-400 text-sm mb-8">
                        Create a strong password
                    </p>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-2xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}
                        {message && (
                            <div className="bg-success/10 border border-success/20 text-success px-4 py-3 rounded-2xl flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <span className="text-sm font-medium">{message}</span>
                            </div>
                        )}

                        <div className="space-y-5">
                            <div>
                                <label htmlFor="password" className="sr-only">New Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-6 py-4 rounded-[50px] bg-card text-gray-100 placeholder-gray-500 focus:outline-none transition-all"
                                    style={{
                                        boxShadow: 'inset 6px 6px 10px 0 rgba(0, 0, 0, 0.6), inset -6px -6px 10px 0 rgba(255, 255, 255, 0.05)'
                                    }}
                                    placeholder="New Password"
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="sr-only">Confirm New Password</label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-6 py-4 rounded-[50px] bg-card text-gray-100 placeholder-gray-500 focus:outline-none transition-all"
                                    style={{
                                        boxShadow: 'inset 6px 6px 10px 0 rgba(0, 0, 0, 0.6), inset -6px -6px 10px 0 rgba(255, 255, 255, 0.05)'
                                    }}
                                    placeholder="Confirm Password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 px-6 rounded-[50px] font-semibold text-white bg-primary-600 hover:-translate-y-0.5 active:translate-y-0.5 transition-all text-base"
                            style={{
                                boxShadow: '6px 6px 10px rgba(0, 0, 0, 0.4), -6px -6px 10px rgba(255, 255, 255, 0.05)'
                            }}
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>

                    </form>
                </div>
            </div >
        </div >
    );
}
