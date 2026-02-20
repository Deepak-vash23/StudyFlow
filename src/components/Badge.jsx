
import clsx from 'clsx';

export default function Badge({ type = 'neutral', children, className }) {
    const styles = {
        success: 'bg-success/20 text-success border-success/20',
        failure: 'bg-error/20 text-error border-error/20',
        warning: 'bg-warning/20 text-warning border-warning/20',
        info: 'bg-info/20 text-info border-info/20',
        neutral: 'bg-secondary text-secondary-text border-white/10',
        low: 'bg-slate-700/50 text-slate-300 border-slate-600/30',
        medium: 'bg-yellow-900/40 text-yellow-200 border-yellow-700/30',
        high: 'bg-orange-900/40 text-orange-200 border-orange-700/30',
        critical: 'bg-red-900/40 text-red-200 border-red-700/30',
    };

    const normalizedType = typeof type === 'string' ? type.toLowerCase() : 'neutral';
    const variant = styles[normalizedType] || styles.neutral;
    return (
        <span
            className={clsx(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                variant,
                className
            )}
        >
            {children}
        </span>
    );
}
