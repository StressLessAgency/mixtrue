import { motion } from 'framer-motion'
import { Music, Headphones, Drum, Mic2, Zap, Star, Heart, Guitar, Waves, Settings } from 'lucide-react'
import type { GenreMode } from '@/types/analysis'
import { cn } from '@/lib/utils'

const genres: { id: GenreMode; label: string; icon: typeof Music; color: string }[] = [
  { id: 'techno', label: 'Techno', icon: Zap, color: '#00E5FF' },
  { id: 'house', label: 'House', icon: Music, color: '#7C3AED' },
  { id: 'drum-and-bass', label: 'Drum & Bass', icon: Drum, color: '#FF2D78' },
  { id: 'hip-hop', label: 'Hip-Hop', icon: Mic2, color: '#FFB800' },
  { id: 'trap', label: 'Trap', icon: Headphones, color: '#FF3B5C' },
  { id: 'pop', label: 'Pop', icon: Star, color: '#00FF9D' },
  { id: 'rnb', label: 'R&B', icon: Heart, color: '#7C3AED' },
  { id: 'rock', label: 'Rock', icon: Guitar, color: '#FF3B5C' },
  { id: 'ambient', label: 'Ambient', icon: Waves, color: '#00E5FF' },
  { id: 'custom', label: 'Custom', icon: Settings, color: '#8896A8' },
]

interface GenreSelectorProps {
  selected: GenreMode | null
  onSelect: (genre: GenreMode) => void
}

export default function GenreSelector({ selected, onSelect }: GenreSelectorProps) {
  return (
    <div>
      <h3 className="font-display font-semibold text-lg text-text-primary mb-2">Select Genre Mode</h3>
      <p className="text-sm text-text-secondary mb-6">
        Genre mode recalibrates all analysis benchmarks to match industry standards for this genre.
      </p>
      <div className="flex flex-wrap gap-3">
        {genres.map((genre) => {
          const isSelected = selected === genre.id
          const Icon = genre.icon
          return (
            <motion.button
              key={genre.id}
              onClick={() => onSelect(genre.id)}
              whileTap={{ scale: 0.97 }}
              animate={{ scale: isSelected ? 1.05 : 1, opacity: isSelected ? 1 : selected ? 0.6 : 0.9 }}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-body border transition-all cursor-pointer',
                isSelected
                  ? 'border-opacity-50'
                  : 'border-border-subtle hover:border-border-accent'
              )}
              style={{
                borderColor: isSelected ? genre.color : undefined,
                backgroundColor: isSelected ? `${genre.color}15` : 'transparent',
                color: isSelected ? genre.color : '#8896A8',
                boxShadow: isSelected ? `0 0 20px ${genre.color}25` : 'none',
              }}
              aria-label={`Select ${genre.label} genre`}
            >
              <Icon className="w-4 h-4" />
              {genre.label}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
