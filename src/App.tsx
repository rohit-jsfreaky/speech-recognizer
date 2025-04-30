import { useEffect, useState } from "react";
import Header from "./components/Header";
import { requestPermissions } from "./utils/permissions";
import PermissionStatus from "./components/PermissionStatus";
import Loader from "./components/Loader";
import CameraVideoPlayback from "./components/CameraVideoPlayback";
const App = () => {
  const [permissiongranted, setPermissionGranted] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    requestPermissions(setLoading).then((granted) => {
      setPermissionGranted(granted.success);
      if (granted.success && granted.stream) {
        setStream(granted.stream);
      }
    });
  }, []);

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

export default App;
