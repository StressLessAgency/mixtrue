import { useState } from 'react'
import { motion } from 'framer-motion'
import { Music, Headphones, Drum, Mic2, Zap, Heart, ChevronDown } from 'lucide-react'
import type { GenreMode } from '@/types/analysis'
import { cn } from '@/lib/utils'

interface GenreGroup {
  label: string
  icon: typeof Music
  color: string
  genres: { id: GenreMode; label: string }[]
}

const genreGroups: GenreGroup[] = [
  {
    label: 'Techno', icon: Zap, color: '#00E5FF',
    genres: [
      { id: 'techno', label: 'Techno' },
      { id: 'hard-techno', label: 'Hard Techno' },
      { id: 'minimal-techno', label: 'Minimal' },
      { id: 'melodic-techno', label: 'Melodic Techno' },
      { id: 'acid-techno', label: 'Acid' },
      { id: 'industrial-techno', label: 'Industrial' },
      { id: 'dub-techno', label: 'Dub Techno' },
    ],
  },
  {
    label: 'House', icon: Music, color: '#7C3AED',
    genres: [
      { id: 'house', label: 'House' },
      { id: 'deep-house', label: 'Deep House' },
      { id: 'tech-house', label: 'Tech House' },
      { id: 'progressive-house', label: 'Progressive' },
      { id: 'afro-house', label: 'Afro House' },
      { id: 'bass-house', label: 'Bass House' },
      { id: 'electro-house', label: 'Electro House' },
    ],
  },
  {
    label: 'Bass', icon: Drum, color: '#FF2D78',
    genres: [
      { id: 'drum-and-bass', label: 'Drum & Bass' },
      { id: 'liquid-dnb', label: 'Liquid DnB' },
      { id: 'neurofunk', label: 'Neurofunk' },
      { id: 'jungle', label: 'Jungle' },
      { id: 'dubstep', label: 'Dubstep' },
      { id: 'riddim', label: 'Riddim' },
      { id: 'garage', label: 'Garage' },
      { id: 'uk-bass', label: 'UK Bass' },
    ],
  },
  {
    label: 'Hip-Hop', icon: Mic2, color: '#FFB800',
    genres: [
      { id: 'hip-hop', label: 'Hip-Hop' },
      { id: 'boom-bap', label: 'Boom Bap' },
      { id: 'trap', label: 'Trap' },
      { id: 'drill', label: 'Drill' },
      { id: 'lo-fi-hiphop', label: 'Lo-Fi' },
      { id: 'phonk', label: 'Phonk' },
      { id: 'cloud-rap', label: 'Cloud Rap' },
      { id: 'conscious-hiphop', label: 'Conscious' },
    ],
  },
  {
    label: 'Electronic', icon: Headphones, color: '#00FF9D',
    genres: [
      { id: 'trance', label: 'Trance' },
      { id: 'psytrance', label: 'Psytrance' },
      { id: 'hardstyle', label: 'Hardstyle' },
      { id: 'breakbeat', label: 'Breakbeat' },
      { id: 'downtempo', label: 'Downtempo' },
      { id: 'synthwave', label: 'Synthwave' },
      { id: 'jersey-club', label: 'Jersey Club' },
    ],
  },
  {
    label: 'Other', icon: Heart, color: '#8896A8',
    genres: [
      { id: 'ambient', label: 'Ambient' },
      { id: 'pop', label: 'Pop' },
      { id: 'rnb', label: 'R&B' },
      { id: 'rock', label: 'Rock' },
      { id: 'custom', label: 'Custom' },
    ],
  },
]

interface GenreSelectorProps {
  selected: GenreMode | null
  onSelect: (genre: GenreMode) => void
}

function findGroupForGenre(id: GenreMode): GenreGroup | undefined {
  return genreGroups.find((g) => g.genres.some((sg) => sg.id === id))
}

export default function GenreSelector({ selected, onSelect }: GenreSelectorProps) {
  const selectedGroup = selected ? findGroupForGenre(selected) : null
  const [expandedGroup, setExpandedGroup] = useState<string | null>(selectedGroup?.label ?? null)

  const handleGroupClick = (group: GenreGroup) => {
    if (expandedGroup === group.label) {
      setExpandedGroup(null)
    } else {
      setExpandedGroup(group.label)
      // Auto-select the first genre if nothing selected from this group
      if (!group.genres.some((g) => g.id === selected)) {
        onSelect(group.genres[0].id)
      }
    }
  }

  return (
    <div>
      <h3 className="font-display font-semibold text-lg text-text-primary mb-2">Select Genre Mode</h3>
      <p className="text-sm text-text-secondary mb-6">
        Genre mode recalibrates all analysis benchmarks to match industry standards for your subgenre.
      </p>
      <div className="space-y-2">
        {genreGroups.map((group) => {
          const isExpanded = expandedGroup === group.label
          const hasSelection = group.genres.some((g) => g.id === selected)
          const Icon = group.icon

          return (
            <div key={group.label}>
              {/* Group header */}
              <button
                onClick={() => handleGroupClick(group)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body border transition-all cursor-pointer',
                  hasSelection
                    ? 'border-opacity-50'
                    : 'border-border-subtle hover:border-border-accent'
                )}
                style={{
                  borderColor: hasSelection ? `${group.color}50` : undefined,
                  backgroundColor: hasSelection ? `${group.color}08` : 'transparent',
                }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" style={{ color: hasSelection ? group.color : '#5A6A80' }} />
                <span style={{ color: hasSelection ? group.color : '#8896A8' }} className="font-medium">
                  {group.label}
                </span>
                {hasSelection && selected && (
                  <span className="text-xs font-mono ml-1" style={{ color: `${group.color}90` }}>
                    / {group.genres.find((g) => g.id === selected)?.label}
                  </span>
                )}
                <ChevronDown
                  className={cn('w-4 h-4 ml-auto transition-transform', isExpanded && 'rotate-180')}
                  style={{ color: '#5A6A80' }}
                />
              </button>

              {/* Subgenres */}
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-wrap gap-2 px-2 py-3"
                >
                  {group.genres.map((genre) => {
                    const isSelected = selected === genre.id
                    return (
                      <motion.button
                        key={genre.id}
                        onClick={() => onSelect(genre.id)}
                        whileTap={{ scale: 0.97 }}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer',
                          isSelected ? '' : 'border-border-subtle hover:border-border-accent'
                        )}
                        style={{
                          borderColor: isSelected ? group.color : undefined,
                          backgroundColor: isSelected ? `${group.color}15` : 'transparent',
                          color: isSelected ? group.color : '#7888A0',
                          boxShadow: isSelected ? `0 0 16px ${group.color}20` : 'none',
                        }}
                        aria-label={`Select ${genre.label}`}
                      >
                        {genre.label}
                      </motion.button>
                    )
                  })}
                </motion.div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
