import { useState } from 'react';
import { useGameStore } from './store/gameStore';
import { MainMenu } from './screens/MainMenu';
import { CharacterCreation } from './screens/CharacterCreation';
import { GameScreen } from './screens/GameScreen';

type View = 'menu' | 'create';

function App() {
  const [view, setView] = useState<View>('menu');
  const activeCareerId = useGameStore((s) => s.activeCareerId);
  const careers = useGameStore((s) => s.careers);
  const exitToMenu = useGameStore((s) => s.exitToMenu);

  const activeCareer = careers.find((c) => c.id === activeCareerId);

  if (activeCareer) {
    return (
      <GameScreen
        career={activeCareer}
        onOpenMenu={() => {
          exitToMenu();
          setView('menu');
        }}
        onRestart={() => {
          exitToMenu();
          setView('create');
        }}
      />
    );
  }

  if (view === 'create') {
    return <CharacterCreation onCancel={() => setView('menu')} onCreated={() => setView('menu')} />;
  }

  return <MainMenu onNewCareer={() => setView('create')} />;
}

export default App;
