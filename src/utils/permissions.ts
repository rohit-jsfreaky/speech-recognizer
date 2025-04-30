export const requestPermissions = async (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setLoading(true);
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
    return {
      success: false,
    };
  } finally {
    setLoading(false);
  }
};
