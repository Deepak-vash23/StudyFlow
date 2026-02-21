/**
 * ProgressRing.jsx
 * SVG circular progress ring with smooth strokeDashoffset animation.
 */
const ProgressRing = ({ radius = 140, strokeWidth = 10, progress, isComplete, isPaused }) => {
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const strokeDashoffset = circumference * (1 - progress);

    const ringColor = isComplete
        ? '#22C55E'
        : isPaused
            ? '#F59E0B'
            : '#22C55E';

    return (
        <svg
            height={radius * 2}
            width={radius * 2}
            className="rotate-[-90deg]"
            aria-hidden="true"
        >
            <circle
                stroke="rgba(148, 163, 184, 0.1)"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
            <circle
                stroke={ringColor}
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                style={{
                    transition: 'stroke-dashoffset 0.8s ease, stroke 0.3s ease',
                    filter: isComplete ? `drop-shadow(0 0 8px ${ringColor})` : 'none',
                }}
            />
        </svg>
    );
};

export default ProgressRing;
