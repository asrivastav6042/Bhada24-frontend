import { useState, useEffect, useRef } from "react";
import { User, Phone, Mail, MapPin, Image as ImageIcon, UploadCloud } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateProfile, getProfileByMobile } from '@/services/userService';
import api from '@/apiconfig/api';

const MyProfile = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProfileImage = async () => {
    const mobile = localStorage.getItem('userPhone') || sessionStorage.getItem('userPhone');
    if (!mobile) return;
    try {
      const res = await api.request(`/api/users/find/${mobile}`, 'GET');
      let imgUrl = "";
      if (Array.isArray(res?.responseData)) {
        imgUrl = res.responseData[0]?.imageUrl || "";
      } else if (res?.imageUrl) {
        imgUrl = res.imageUrl;
      } else if (typeof res === 'string' && res.startsWith('data:image')) {
        imgUrl = res;
      }
      setProfileImage(imgUrl);
      if (imgUrl) localStorage.setItem('profileImageUrl', imgUrl);
    } catch (e) {
      setProfileImage("");
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const mobile = localStorage.getItem('userPhone') || sessionStorage.getItem('userPhone');
        if (!mobile) return;
  const res = await api.request(`/api/users/find/${mobile}`, 'GET', undefined, { Accept: 'application/json' });
        console.log('API response:', res);
        let userInfo: any = {};
        if (Array.isArray(res?.responseData) && res.responseData.length > 0) {
          userInfo = res.responseData[0];
        }
        console.log('Extracted userInfo:', userInfo);
        setName(userInfo.name || "");
        setEmail(userInfo.email || "");
        setAddress(userInfo.address || "");
        setPhone(userInfo.phone || "");
        setGender(userInfo.gender || "");
        setDateOfBirth(userInfo.dateOfBirth || "");
        setProfileImage(userInfo.imageUrl || "");
        localStorage.setItem('profileImageUrl', userInfo.imageUrl || "");
      } catch (err) {
        console.error('Profile fetch error:', err);
        setName("");
        setEmail("");
        setAddress("");
        setPhone("");
        setGender("");
        setDateOfBirth("");
        setProfileImage("");
      }
    };
    fetchUserProfile();
  }, []);

  const handleSaveProfile = async () => {
    // Validate and update user profile
    if (!name || name.trim().length < 3) {
      toast.error('Name must be at least 3 characters');
      return;
    }
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    if (!userId) {
      toast.error('User ID missing. Please re-login.');
      return;
    }
    const now = new Date().toISOString();
    // Always use uploadedImageUrl if a new image was uploaded
  let imageUrl = uploadedImageUrl || localStorage.getItem('profileImageUrl') || '';
    const payload = {
      userId,
      id: userId,
      name,
      email,
      address,
      phone,
      role: 'USER',
      verified: true,
      imageUrl,
      gender,
      dateOfBirth,
      createdAt: now,
      updatedAt: now,
      userStatus: 'ACTIVE',
    };
    try {
      await updateProfile(payload);
      try { localStorage.setItem('userName', name); } catch (e) {}
      try { localStorage.setItem('userEmail', email); } catch (e) {}
      try { localStorage.setItem('userAddress', address); } catch (e) {}
      try { localStorage.setItem('userGender', gender); } catch (e) {}
      try { localStorage.setItem('userDob', dateOfBirth); } catch (e) {}
      if (imageUrl) {
        try { localStorage.setItem('profileImageUrl', imageUrl); } catch (e) {}
      }
      setUploadedImageUrl(""); // Clear after update
      // Fetch backend image to sync UI
      await fetchProfileImage();
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Profile update failed', err);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  // Handle image upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    if (!userId) {
      toast.error('User ID missing. Please re-login.');
      return;
    }
    setImageUploading(true);
    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setProfileImage(previewUrl);
    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const fullBase64 = reader.result as string;
        let base64 = fullBase64;
        const commaIdx = fullBase64.indexOf(',');
        if (commaIdx !== -1) {
          base64 = fullBase64.substring(commaIdx + 1);
        }
        // Upload and get response
        const res = await api.uploadBase64Image({ userId, base64Image: base64 });
        let imageUrl = "";
        if (typeof res?.responseData === 'string') {
          imageUrl = res.responseData;
        } else if (Array.isArray(res?.responseData)) {
          imageUrl = res.responseData[0]?.imageUrl || "";
        } else if (res?.imageUrl) {
          imageUrl = res.imageUrl;
        }
        setUploadedImageUrl(imageUrl);
        setProfileImage(imageUrl); // Show actual uploaded image, not blob
        toast.success('Profile image uploaded!');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-4 overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-32 h-32 object-cover rounded-full border"
                  />
                ) : (
                  <User className="w-16 h-16 text-primary" />
                )}
              </div>
              <Button
                variant="outline"
                className="mb-2 flex items-center gap-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={imageUploading}
              >
                <UploadCloud className="w-4 h-4" />
                {imageUploading ? "Uploading..." : "Change Image"}
              </Button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <h3 className="text-xl font-semibold">{name}</h3>
              <p className="text-sm text-muted-foreground">{phone}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="flex gap-2">
                <User className="h-5 w-5 text-muted-foreground mt-2" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <Phone className="h-5 w-5 text-muted-foreground mt-2" />
                <Input id="phone" value={phone} disabled />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex gap-2">
                <Mail className="h-5 w-5 text-muted-foreground mt-2" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <div className="flex gap-2 items-center">
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="input px-3 py-2 rounded-md border"
                >
                  <option value="">Select</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="flex gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-2" />
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                />
              </div>
            </div>

            <Button
              onClick={handleSaveProfile}
              className="w-full"
            >
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyProfile;
