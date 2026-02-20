import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);

        const result = await register(name, email, password);

        if (result.success) {
            navigate('/login');
        } else {
            setError(result.error || 'Failed to create an account');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 bg-background font-sans">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-primary-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[100px]" />
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
                            <UserPlus className="w-8 h-8" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-100 mb-2 tracking-wide">
                        Join Us
                    </h2>
                    <p className="text-gray-400 text-sm mb-8">
                        Start your productivity journey
                    </p>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-2xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}

                        <div className="space-y-5">
                            <div>
                                <label htmlFor="name" className="sr-only">Full Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-6 py-4 rounded-[50px] bg-card text-gray-100 placeholder-gray-500 focus:outline-none transition-all"
                                    style={{
                                        boxShadow: 'inset 6px 6px 10px 0 rgba(0, 0, 0, 0.6), inset -6px -6px 10px 0 rgba(255, 255, 255, 0.05)'
                                    }}
                                    placeholder="Full Name"
                                />
                            </div>

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

                            <div className="relative">
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
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
                            <div className="relative">
                                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-6 py-4 rounded-[50px] bg-card text-gray-100 placeholder-gray-500 focus:outline-none transition-all pr-12"
                                    style={{
                                        boxShadow: 'inset 6px 6px 10px 0 rgba(0, 0, 0, 0.6), inset -6px -6px 10px 0 rgba(255, 255, 255, 0.05)'
                                    }}
                                    placeholder="Confirm Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
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
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>

                        <div className="mt-8 pt-4">
                            <Link to="/login" className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors block">
                                Already have an account? Sign in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
