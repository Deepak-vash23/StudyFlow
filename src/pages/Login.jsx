import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { BookOpen, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate(from, { replace: true });
        } else {
            setError(result.error || 'Login failed. Please try again.');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 bg-background font-sans">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary-900/20 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 w-full max-w-[400px]"> {/* Adjusted width to match reference roughly */}
                <div
                    className="bg-card py-10 px-10 rounded-[50px] text-center"
                    style={{
                        boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                >
                    <div className="flex justify-center mb-6">
                        {/* Icon - keeping existing logic but styling to match theme */}
                        <div className="w-16 h-16 rounded-full flex items-center justify-center text-primary-400"
                            style={{
                                background: 'var(--bg-card)', // Conceptual, using transparent or specific
                                boxShadow: 'inset 6px 6px 10px 0 rgba(0, 0, 0, 0.6), inset -6px -6px 10px 0 rgba(255, 255, 255, 0.05)'
                            }}>
                            <BookOpen className="w-8 h-8" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-100 mb-8 tracking-wide">
                        Welcome Back
                    </h2>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-2xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}

                        <div className="space-y-5">
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
                                    placeholder="Username or Email"
                                />
                            </div>

                            <div className="relative">
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-6 py-4 rounded-[50px] bg-card text-gray-100 placeholder-gray-500 focus:outline-none transition-all pr-12"
                                    style={{
                                        boxShadow: 'inset 6px 6px 10px 0 rgba(0, 0, 0, 0.6), inset -6px -6px 10px 0 rgba(255, 255, 255, 0.05)'
                                    }}
                                    placeholder="Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="text-right">
                            <Link to="/forgot-password" className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 px-6 rounded-[50px] font-semibold text-white bg-primary-600 hover:-translate-y-0.5 active:translate-y-0.5 transition-all text-base"
                            style={{
                                boxShadow: '6px 6px 10px rgba(0, 0, 0, 0.4), -6px -6px 10px rgba(255, 255, 255, 0.05)'
                            }}
                        >
                            {loading ? 'Signing in...' : 'Login'}
                        </button>

                        <div className="mt-8 pt-4">
                            <p className="text-gray-400 text-sm mb-4">Or login with</p>
                            {/* Placeholder for social icons if needed, or just the signup link */}
                            <div className="flex justify-center gap-4 mb-6">
                                {/* Example Social Buttons matching reference structure */}
                                <button type="button" className="w-12 h-12 rounded-full flex items-center justify-center text-gray-300 hover:text-primary-400 hover:-translate-y-1 transition-all"
                                    style={{
                                        background: 'var(--bg-card)',
                                        boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.05)'
                                    }}>
                                    G
                                </button>
                                <button type="button" className="w-12 h-12 rounded-full flex items-center justify-center text-gray-300 hover:text-primary-400 hover:-translate-y-1 transition-all"
                                    style={{
                                        background: 'var(--bg-card)',
                                        boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.05)'
                                    }}>
                                    f
                                </button>
                            </div>

                            <Link to="/signup" className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors block">
                                Create an account
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
