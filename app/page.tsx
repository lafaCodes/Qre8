import { QRGenerator } from "@/components/qr-generator";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  return (
    <>
      <QRGenerator />
      <Toaster position="bottom-center" richColors />
    </>
  );
}
