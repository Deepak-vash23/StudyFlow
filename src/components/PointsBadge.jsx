/**
 * PointsBadge.jsx
 * Displays total focus points and level badge based on thresholds.
 */

const LEVELS = [
    { min: 1000, label: 'Focus Master', emoji: '🏆', color: '#F59E0B' },
    { min: 500, label: 'Tree', emoji: '🌳', color: '#22C55E' },
    { min: 100, label: 'Plant', emoji: '🌿', color: '#34D399' },
    { min: 0, label: 'Seed', emoji: '🌱', color: '#6EE7B7' },
];

const getLevel = (points) => LEVELS.find((l) => points >= l.min) ?? LEVELS[LEVELS.length - 1];

const getNextLevel = (points) => {
    const thresholds = [100, 500, 1000];
    return thresholds.find((t) => points < t) ?? null;
};

const PointsBadge = ({ points }) => {
    const level = getLevel(points);
    const nextThreshold = getNextLevel(points);
    const currentLevelMin = LEVELS.find(l => l.min <= points && (!LEVELS[LEVELS.indexOf(level) - 1] || points < LEVELS[LEVELS.indexOf(level) - 1].min))?.min ?? 0;
    const progressToNext = nextThreshold
        ? ((points - currentLevelMin) / (nextThreshold - currentLevelMin)) * 100
        : 100;

    return (
        <div className="w-full max-w-sm bg-card border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">Focus Points</span>
                <span className="text-gray-400 text-sm">{level.emoji} {level.label}</span>
            </div>

            <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold" style={{ color: level.color, lineHeight: 1 }}>{points}</span>
                <span className="text-gray-500 text-sm">pts</span>
            </div>

            {nextThreshold && (
                <div>
                    <div className="flex justify-between mb-1.5">
                        <span className="text-xs text-gray-500">To next level</span>
                        <span className="text-xs text-gray-500">{nextThreshold - points} pts away</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(progressToNext, 100)}%`, background: level.color }}
                        />
                    </div>
                </div>
            )}
            {!nextThreshold && (
                <div className="text-xs font-semibold" style={{ color: level.color }}>✦ Max level reached!</div>
            )}
        </div>
    );
};

export default PointsBadge;
