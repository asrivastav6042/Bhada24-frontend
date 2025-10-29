import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { startPhoneLogin, verifyOtpAndLogin } from "@/services/authService";
import type { ConfirmationResult } from "@/services/firebaseOtpService";
import Header from "@/components/Header";

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const confirmationRef = useRef<ConfirmationResult | null>(null);

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    if (loading) return; // prevent double sends

    setLoading(true);
    try {
      const phoneWithCode = `+91${phoneNumber.replace(/\D/g, '').slice(-10)}`;
      // Reset any previous OTP attempt state when sending again
      confirmationRef.current = null;
      const confirmation = await startPhoneLogin(phoneWithCode, 'recaptcha-container');
      confirmationRef.current = confirmation as ConfirmationResult;
      setStep('otp');
      toast.success('OTP sent successfully!');
    } catch (err: any) {
      console.error('sendOtp error', err);
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

    if (loading) return; // prevent double verify

    setLoading(true);
    try {
      const phonePlain = phoneNumber.replace(/\D/g, '').slice(-10);
      const { user, token } = await verifyOtpAndLogin(confirmationRef.current, otp, phonePlain);
      // Clear the confirmation result after successful verification to avoid reuse
      confirmationRef.current = null;
      // persist login state
      try { localStorage.setItem('isLoggedIn', 'true'); } catch (e) {}
      try { localStorage.setItem('userPhone', phonePlain); } catch (e) {}
      try { sessionStorage.setItem('userPhone', phonePlain); } catch (e) {}
      try { localStorage.setItem('userName', (user && (user as any).name) || ''); } catch (e) {}
      try { sessionStorage.setItem('userName', (user && (user as any).name) || ''); } catch (e) {}
      // persist userId defensively if returned
      let uid = (user && ((user as any).userId || (user as any).id || (user as any).user_id || (user as any)._id)) || null;
      if (!uid) {
        // If userId missing, fetch user info by phone
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
      navigate('/dashboard');
    } catch (err: any) {
      console.error('verifyOtp error', err);
      const msg = err?.code === 'auth/invalid-verification-code' || err?.message?.includes('INVALID_CODE')
        ? 'Invalid OTP. Please try again.'
        : err?.code === 'auth/code-expired'
        ? 'OTP expired. Please resend and try again.'
        : 'OTP verification failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.info("Google login coming soon!");
  };

  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 gradient-hero">
        <Card className="w-full max-w-md animate-fade-in">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (step === "otp") {
                    setStep("phone");
                    setOtp("");
                  } else {
                    navigate("/");
                  }
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
            <CardTitle className="text-2xl">Welcome Back!</CardTitle>
            <CardDescription>
              {step === "phone"
                ? "Login to book your next ride"
                : "Enter the OTP sent to your phone"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {step === "phone" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      maxLength={10}
                    />
                  </div>
                </div>

                <Button
                  className="w-full gradient-hero gap-2"
                  size="lg"
                  onClick={handleSendOTP}
                  disabled={loading}
                >
                  <Phone className="h-4 w-4" />
                  {loading ? "Sending OTP..." : "Send OTP"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full gap-2"
                  size="lg"
                  onClick={handleGoogleLogin}
                >
                  <Mail className="h-4 w-4" />
                  Login with Google
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

                <Button
                  className="w-full gradient-hero"
                  size="lg"
                  onClick={handleVerifyOTP}
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={handleSendOTP}
                  disabled={loading}
                >
                  Resend OTP
                </Button>
              </>
            )}
          </CardContent>
        </Card>
        {/* Firebase reCAPTCHA container (required by Firebase phone auth) */}
        <div id="recaptcha-container" />
      </div>
    </>
  );
};

export default Login;
