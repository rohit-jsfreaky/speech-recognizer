import { useEffect, useState } from "react";
import Header from "./components/Header";
import { requestPermissions, PermissionError } from "./utils/permissions";
import PermissionStatus from "./components/PermissionStatus";
import Loader from "./components/Loader";
import CameraVideoPlayback from "./components/CameraVideoPlayback";
import { ErrorProvider, useError } from "./context/ErrorContext";
import ErrorBoundary from "./components/ErrorBoundary";

const AppContent = () => {
  const [permissiongranted, setPermissionGranted] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState(true);
  const { setError } = useError();
  
  useEffect(() => {
    async function setup() {
      try {
        const granted = await requestPermissions(setLoading);
        setPermissionGranted(granted.success);
        if (granted.success && granted.stream) {
          setStream(granted.stream);
        }
      } catch (err) {
        if (err instanceof PermissionError) {
          setPermissionGranted(false);
        } else {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      }
    }
    
    setup();
  }, [setError]);

  if (loading) {
    return (
      <div className="h-screen w-screen">
        <Header />
        <div className="flex h-[88%] justify-center items-center p-4">
          <Loader size="lg" color="blue" thickness="normal" />
        </div>
      </div>
    );
  }

  if (!permissiongranted) {
    return (
      <div className="h-screen w-screen">
        <Header />
        <PermissionStatus status={permissiongranted} />
      </div>
    );
  }
  
  return (
    <div className="h-screen w-screen">
      <Header />
      <CameraVideoPlayback stream={stream!} />
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <ErrorProvider>
        <AppContent />
      </ErrorProvider>
    </ErrorBoundary>
  );
};

export default App;
