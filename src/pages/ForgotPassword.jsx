import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            setMessage('Password reset link sent to your email.');
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
                <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] bg-primary-900/20 rounded-full blur-[120px]" />
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
                            <Mail className="w-8 h-8" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-100 mb-2 tracking-wide">
                        Reset Password
                    </h2>
                    <p className="text-gray-400 text-sm mb-8">
                        Enter your mail to receive reset link
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
                                <span className="text-sm font-medium">{message}</span>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-6 py-4 rounded-[50px] bg-card text-gray-100 placeholder-gray-500 focus:outline-none transition-all"
                                style={{
                                    boxShadow: 'inset 6px 6px 10px 0 rgba(0, 0, 0, 0.6), inset -6px -6px 10px 0 rgba(255, 255, 255, 0.05)'
                                }}
                                placeholder="Email Address"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 px-6 rounded-[50px] font-semibold text-white bg-primary-600 hover:-translate-y-0.5 active:translate-y-0.5 transition-all text-base"
                            style={{
                                boxShadow: '6px 6px 10px rgba(0, 0, 0, 0.4), -6px -6px 10px rgba(255, 255, 255, 0.05)'
                            }}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>

                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-card text-gray-500">
                                    Or
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-center">
                            <Link to="/login" className="flex items-center text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}
