import { useEffect, useState } from 'react';
import { initializeDatabase } from './db/init';
import { useDisplayName } from './hooks/useDisplayName';
import { WelcomeScreen } from './components/welcome/WelcomeScreen';
import { AppShell } from './components/layout/AppShell';

function App() {
  const { displayName, updateDisplayName } = useDisplayName();
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initializeDatabase().then(() => setDbReady(true));
  }, []);

  if (!dbReady) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <p className="text-slate animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!displayName) {
    return <WelcomeScreen onComplete={updateDisplayName} />;
  }

  return <AppShell displayName={displayName} />;
}

export default App;
