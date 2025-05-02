

export class PermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PermissionError';
  }
}

export const requestPermissions = async (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setLoading(true);
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new PermissionError('Media devices not supported in this browser');
    }
    
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    
    console.log("Permissions granted");
    return {
      success: true,
      stream: stream,
    };
  } catch (err) {
    console.error("Permission denied:", err);
    
    if (err instanceof DOMException && err.name === 'NotAllowedError') {
      throw new PermissionError('Camera and microphone access was denied. Please enable them and try again.');
    } else if (err instanceof DOMException && err.name === 'NotFoundError') {
      throw new PermissionError('No camera or microphone found on your device.');
    } else {
      throw new PermissionError('An error occurred while requesting media permissions.');
    }
  } finally {
    setLoading(false);
  }
};
