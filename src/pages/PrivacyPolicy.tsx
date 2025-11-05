import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
          <div className="container px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Privacy Policy</h1>
            <p className="text-lg text-center text-muted-foreground max-w-2xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="py-16 container px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <Card>
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold">1. Introduction</h2>
                <p className="text-muted-foreground">
                  BHADA24 ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
                  explains how we collect, use, disclose, and safeguard your information when you use our 
                  cab booking platform and services.
                </p>
                <p className="text-muted-foreground">
                  By using our services, you agree to the collection and use of information in accordance 
                  with this policy. If you do not agree with our policies and practices, please do not use our services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold">2. Information We Collect</h2>
                <h3 className="text-xl font-semibold mt-4">2.1 Personal Information</h3>
                <p className="text-muted-foreground">We may collect the following personal information:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Name, email address, and phone number</li>
                  <li>Pickup and drop-off locations</li>
                  <li>Payment information (processed securely through third-party payment gateways)</li>
                  <li>Trip history and preferences</li>
                  <li>Profile picture (optional)</li>
                </ul>

                <h3 className="text-xl font-semibold mt-4">2.2 Automatically Collected Information</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Location data (when you use our services)</li>
                  <li>Usage data and analytics</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold">3. How We Use Your Information</h2>
                <p className="text-muted-foreground">We use the collected information for the following purposes:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>To provide and maintain our cab booking services</li>
                  <li>To process your bookings and payments</li>
                  <li>To communicate with you about your trips and account</li>
                  <li>To send notifications about your bookings and updates</li>
                  <li>To improve our services and user experience</li>
                  <li>To detect and prevent fraud or unauthorized access</li>
                  <li>To comply with legal obligations</li>
                  <li>To send promotional offers and marketing communications (with your consent)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold">4. Information Sharing and Disclosure</h2>
                <p className="text-muted-foreground">We may share your information with:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong>Drivers:</strong> To facilitate your bookings and trips</li>
                  <li><strong>Payment Processors:</strong> To process your transactions securely</li>
                  <li><strong>Service Providers:</strong> Who assist us in operating our platform</li>
                  <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  We do not sell your personal information to third parties for marketing purposes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold">5. Data Security</h2>
                <p className="text-muted-foreground">
                  We implement appropriate technical and organizational security measures to protect your 
                  personal information against unauthorized access, alteration, disclosure, or destruction. 
                  However, no method of transmission over the internet is 100% secure.
                </p>
                <p className="text-muted-foreground">
                  We use encryption (SSL/TLS) for data transmission and secure servers for data storage. 
                  Payment information is processed through PCI-DSS compliant payment gateways.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold">6. Your Rights</h2>
                <p className="text-muted-foreground">You have the following rights regarding your personal information:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong>Data Portability:</strong> Request transfer of your data</li>
                  <li><strong>Withdrawal of Consent:</strong> Withdraw consent for data processing</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold">7. Cookies and Tracking</h2>
                <p className="text-muted-foreground">
                  We use cookies and similar tracking technologies to track activity on our platform and 
                  store certain information. You can configure your browser to refuse cookies, but this may 
                  limit your ability to use some features of our services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold">8. Children's Privacy</h2>
                <p className="text-muted-foreground">
                  Our services are not intended for individuals under the age of 18. We do not knowingly 
                  collect personal information from children. If you become aware that a child has provided 
                  us with personal information, please contact us.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold">9. Changes to This Privacy Policy</h2>
                <p className="text-muted-foreground">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by 
                  posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold">10. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <ul className="space-y-2 text-muted-foreground ml-4">
                  <li><strong>Email:</strong> privacy@bhada24.com</li>
                  <li><strong>Phone:</strong> +91 123 456 7890</li>
                  <li><strong>Address:</strong> 123 Main Street, New Delhi, India 110001</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
