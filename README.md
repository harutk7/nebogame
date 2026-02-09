# Nebogame - Match-3 Puzzle RPG

A recreation of the classic "Heavens" (Небеса) game - a Match-3 Puzzle RPG with strategic combat mechanics.

## Overview

Nebogame combines the addictive match-3 puzzle mechanics with RPG elements including:
- Turn-based combat system
- Character progression
- Spell casting mechanics
- Boss battles
- Elemental gem matching (Fire, Water, Nature, Light, Dark)

## Tech Stack

- **Build Tool:** Vite 5.x
- **Language:** JavaScript ES2022+
- **Package Manager:** npm
- **Testing:** Vitest
- **Linting:** ESLint
- **Formatting:** Prettier
- **Audio:** Howler.js

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/harutk7/nebogame.git
cd nebogame

# Install dependencies
npm install

# Start development server
npm run dev
```

The development server will start at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build
- `npm run test` - Run tests with Vitest
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
nebogame/
├── src/
│   ├── engine/          # Core game engine classes
│   ├── components/      # Game components (grid, gems, etc.)
│   ├── entities/        # Player, Monster, Character classes
│   ├── systems/         # Match3System, CombatSystem, etc.
│   ├── ui/              # UI components and screens
│   ├── assets/          # Images, sprites, textures
│   ├── audio/           # Sound files and audio manager
│   ├── styles/          # CSS files
│   ├── utils/           # Utility functions
│   ├── config/          # Game configuration
│   └── main.js          # Entry point
├── public/              # Static files served directly
├── tests/               # Test files
├── k8s/                 # Kubernetes manifests
└── docs/                # Documentation
```

## Game Features (MVP)

1. **Match-3 Grid:** 8x8 grid with 6 gem types
2. **Combat System:** Turn-based combat with match-3 mechanics
3. **Character Classes:** Warrior, Mage, Archer
4. **Boss Battles:** Multiple bosses with unique mechanics
5. **Spells:** Elemental spells powered by gem matches
6. **Progression:** Level up system and equipment

## Deployment

### Docker

```bash
# Build Docker image
docker build -t nebogame:latest .

# Run container
docker run -p 8080:80 nebogame:latest
```

### Kubernetes

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/
```

## License

MIT License - See LICENSE file for details

## Credits

Inspired by the original "Heavens" (Небеса) game.
