
import clsx from 'clsx';

export default function Card({ children, className, onClick, ...props }) {
    return (
        <div
            onClick={onClick}
            className={clsx(
                "bg-card rounded-2xl p-5 shadow-lg border border-white/5 transition-all duration-200",
                onClick && "cursor-pointer hover:-translate-y-1 hover:shadow-xl",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
