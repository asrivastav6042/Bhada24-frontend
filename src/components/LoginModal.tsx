import { useState, useRef } from "react";
import { Phone, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { startPhoneLogin, verifyOtpAndLogin } from "@/services/authService";
import type { ConfirmationResult } from "@/services/firebaseOtpService";

const LoginModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const confirmationRef = useRef<ConfirmationResult | null>(null);

  if (!open) return null;

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      const phoneWithCode = `+91${phoneNumber.replace(/\D/g, '').slice(-10)}`;
      confirmationRef.current = null;
      const confirmation = await startPhoneLogin(phoneWithCode, 'recaptcha-container');
      confirmationRef.current = confirmation as ConfirmationResult;
      setStep('otp');
      toast.success('OTP sent successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    if (!confirmationRef.current) {
      toast.error('No OTP request found. Please request OTP again.');
      setStep('phone');
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      const phonePlain = phoneNumber.replace(/\D/g, '').slice(-10);
      const { user, token } = await verifyOtpAndLogin(confirmationRef.current, otp, phonePlain);
      confirmationRef.current = null;
      try { localStorage.setItem('isLoggedIn', 'true'); } catch (e) {}
      try { localStorage.setItem('userPhone', phonePlain); } catch (e) {}
      try { sessionStorage.setItem('userPhone', phonePlain); } catch (e) {}
      try { localStorage.setItem('userName', (user && (user as any).name) || ''); } catch (e) {}
      try { sessionStorage.setItem('userName', (user && (user as any).name) || ''); } catch (e) {}
      let uid = (user && ((user as any).userId || (user as any).id || (user as any).user_id || (user as any)._id)) || null;
      if (!uid) {
        try {
          const api = await import('@/apiconfig/api');
          const userInfoResp = await api.default.request(`/api/users/find/${phonePlain}`);
          let userInfo = userInfoResp;
          if (Array.isArray(userInfoResp?.responseData)) {
            userInfo = userInfoResp.responseData[0] || {};
          }
          uid = userInfo?.userId || userInfo?.id || userInfo?.user_id || userInfo?._id || null;
        } catch (e) {}
      }
      if (uid) {
        try { localStorage.setItem('userId', String(uid)); } catch (e) {}
        try { sessionStorage.setItem('userId', String(uid)); } catch (e) {}
      }
      toast.success('Login successful!');
      onClose();
      window.location.reload();
    } catch (err: any) {
      toast.error('OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative animate-fade-in">
        <button className="absolute top-2 right-2 text-xl" onClick={onClose}>&times;</button>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            {step === "phone" ? "Login to book your next ride" : "Enter the OTP sent to your phone"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === "phone" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  maxLength={10}
                />
              </div>
              <Button className="w-full" size="lg" onClick={handleSendOTP} disabled={loading}>
                <Phone className="h-4 w-4" />
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <Label htmlFor="otp" className="text-center block">Enter OTP</Label>
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  OTP sent to +91 {phoneNumber}
                </p>
              </div>
              <Button className="w-full" size="lg" onClick={handleVerifyOTP} disabled={loading}>
                {loading ? "Verifying..." : "Verify & Login"}
              </Button>
              <Button variant="ghost" className="w-full" onClick={handleSendOTP} disabled={loading}>
                Resend OTP
              </Button>
            </>
          )}
        </CardContent>
        <div id="recaptcha-container" />
      </div>
    </div>
  );
};

export default LoginModal;
