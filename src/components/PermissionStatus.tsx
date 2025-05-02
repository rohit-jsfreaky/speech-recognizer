import { ShieldAlert, Camera, Mic } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { useEffect } from "react";

const PermissionStatus = ({
  status,
  error,
}: {
  status: boolean;
  error: string | null;
}) => {
  useEffect(() => {
    if (error) {
      console.log("Error occurred:", error);
    }
  }, [error]);
  return (
    <div className="flex h-[88%] justify-center items-center p-4">
      {!status && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Alert
            variant="destructive"
            className="w-full max-w-md border-red-200 bg-white dark:bg-slate-900 shadow-xl rounded-xl overflow-hidden"
          >
            <div className=" p-4 -mx-4 -mt-4 mb-4 flex items-center">
              <ShieldAlert className="h-6 w-6 text-white mr-2" />
              <AlertTitle className="text-white text-lg">
                Permissions Required
              </AlertTitle>
            </div>

            <AlertDescription className="flex flex-col space-y-6">
              <p className="text-slate-700 dark:text-slate-300">
               {
               error ? error :
               "Camera and microphone access is needed for this application to function properly. Please enable them in your browser settings."}
              </p>

              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                    <Camera className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      Camera Access
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Required for video streaming
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                    <Mic className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      Microphone Access
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Required for speech recognition
                    </p>
                  </div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </div>
  );
};

export default PermissionStatus;
