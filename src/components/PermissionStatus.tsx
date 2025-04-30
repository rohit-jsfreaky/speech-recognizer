import { ShieldAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PermissionStatus = ({ status }: { status: boolean }) => {
  return (
    <div className="flex h-[88%] justify-center items-center p-4">
      {!status && (
        <Alert
          variant="destructive"
          className="w-full max-w-md border-red-200 bg-red-50 dark:bg-red-950/30"
        >
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle>Permission Required</AlertTitle>
          <AlertDescription className="flex flex-col space-y-4">
            <p>
              Camera and microphone access is needed for this application to
              function properly. Please enable it from browser settings.
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default PermissionStatus;
