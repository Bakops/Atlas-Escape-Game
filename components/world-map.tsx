"use client"
import { Lock, Unlock } from "lucide-react"

export interface Continent {
  id: string
  name: string
  emoji: string
  position: { x: number; y: number }
  locked: boolean
  completed: boolean
  image: string
}

interface WorldMapProps {
  continents: Continent[]
  onContinentSelect: (continentId: string) => void
}

export function WorldMap({ continents, onContinentSelect }: WorldMapProps) {
  return (
    <div className="relative w-full h-full min-h-[600px] flex items-center justify-center p-8">
      {/* SVG Path connecting continents */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <defs>
          <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="white" opacity="0.3" />
          </pattern>
        </defs>
        {continents.map((continent, index) => {
          if (index === continents.length - 1) return null
          const next = continents[index + 1]
          return (
            <line
              key={`${continent.id}-${next.id}`}
              x1={`${continent.position.x}%`}
              y1={`${continent.position.y}%`}
              x2={`${next.position.x}%`}
              y2={`${next.position.y}%`}
              stroke="white"
              strokeWidth="3"
              strokeDasharray="10,10"
              opacity="0.4"
            />
          )
        })}
      </svg>

      {/* Continent nodes */}
      {continents.map((continent) => (
        <div
          key={continent.id}
          className="absolute transition-all duration-300 hover:scale-110"
          style={{
            left: `${continent.position.x}%`,
            top: `${continent.position.y}%`,
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        >
          <button
            onClick={() => !continent.locked && onContinentSelect(continent.id)}
            disabled={continent.locked}
            className="relative group"
          >
            {/* Continent image circle */}
            <div
              className={`w-32 h-32 rounded-full border-4 overflow-hidden shadow-2xl transition-all ${
                continent.completed
                  ? "border-accent"
                  : continent.locked
                    ? "border-card/50 opacity-50"
                    : "border-card hover:border-accent"
              }`}
            >
              <div className="w-full h-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center text-5xl">
                {continent.emoji}
              </div>
            </div>

            {/* Lock/Unlock icon */}
            <div
              className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                continent.completed ? "bg-accent" : continent.locked ? "bg-card/80" : "bg-card"
              }`}
            >
              {continent.completed ? (
                <Unlock className="w-5 h-5 text-accent-foreground" />
              ) : (
                <Lock className={`w-5 h-5 ${continent.locked ? "text-muted-foreground" : "text-primary"}`} />
              )}
            </div>

            {/* Continent name */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-card font-bold text-lg drop-shadow-lg">{continent.name}</span>
            </div>
          </button>
        </div>
      ))}
    </div>
  )
}
