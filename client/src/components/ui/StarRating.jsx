import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';

export default function StarRating({ value = 0, onChange, readOnly = false }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="inline-flex items-center gap-1">
      {stars.map((star) => {
        const isFilled = star <= Math.round(value);
        const StarComponent = isFilled ? StarSolid : StarOutline;

        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(star)}
            className={`p-0.5 ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <StarComponent className="size-5" />
          </button>
        );
      })}
      {readOnly && <span className="text-muted ml-1 font-medium">{Number(value).toFixed(1)}</span>}
    </div>
  );
}
