import { Car, Menu, X, User, LogOut, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import api from '@/apiconfig/api';
import { getLocalNotifications, markNotificationRead } from '@/services/fcmService';
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [profileImage, setProfileImage] = useState<string>("");
  
  useEffect(() => {
    // derive login state from stored token or flag
    const token = sessionStorage.getItem('bhada24_token') || localStorage.getItem('bhada24_token');
    const logged = token ? true : localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(!!logged);
    setUserName(localStorage.getItem('userName'));
    setUserPhone(localStorage.getItem('userPhone'));
    try {
      const items = getLocalNotifications();
      setNotifications(items || []);
    } catch (e) {}
    const onUpdate = () => {
      try { setNotifications(getLocalNotifications()); } catch (e) {}
    };
    window.addEventListener('bhada24:notifications-updated', onUpdate as EventListener);

    // Fetch profile image and info from latest API
    const mobile = localStorage.getItem('userPhone') || sessionStorage.getItem('userPhone');
    if (mobile) {
      api.request(`/api/users/find/${mobile}`).then(res => {
        let userInfo = res;
        if (Array.isArray(res?.responseData)) {
          userInfo = res.responseData[0] || {};
        }
        setProfileImage(userInfo.imageUrl || "");
        setUserName(userInfo.name || "User");
        setUserPhone(userInfo.phone || "");
      }).catch(() => setProfileImage(""));
    }

    return () => window.removeEventListener('bhada24:notifications-updated', onUpdate as EventListener);
  }, []);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeService = searchParams.get("service") || "cabs";

  const handleLogout = () => {
    setIsLoggedIn(false);
    // clear storage
    try {
      sessionStorage.removeItem('bhada24_token');
      localStorage.removeItem('bhada24_token');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userName');
      localStorage.removeItem('userPhone');
    } catch (e) {
      // ignore
    }
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl md:text-2xl">
          <Car className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            bhada24
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/?service=cabs" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              activeService === "cabs" ? "text-primary font-semibold" : ""
            }`}
          >
            Cabs
          </Link>
          <Link 
            to="/?service=dj-sound" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              activeService === "dj-sound" ? "text-primary font-semibold" : ""
            }`}
          >
            DJ & Sound
          </Link>
          <Link 
            to="/?service=event" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              activeService === "event" ? "text-primary font-semibold" : ""
            }`}
          >
            Event Management
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {/* Notification bell */}
          <div className="relative">
            <button
              className="relative h-10 w-10 rounded-full p-2"
              onClick={() => {
                // toggle simple dropdown: for now, open profile page notifications
                navigate('/notifications');
              }}
            >
              <Bell className="h-6 w-6" />
              {notifications && notifications.length > 0 && (
                <span className="absolute -top-0 -right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-red-600 rounded-full">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
          </div>
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profileImage || undefined} alt={userName || 'User'} />
                    <AvatarFallback>{(userName && userName[0]) || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userPhone || '—'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/login')}
              className="gap-2"
            >
              <User className="h-4 w-4" />
              Login
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t animate-slide-up">
          <nav className="flex flex-col gap-4 p-4">
            <Link 
              to="/?service=cabs" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                activeService === "cabs" ? "text-primary font-semibold" : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Cabs
            </Link>
            <Link 
              to="/?service=dj-sound" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                activeService === "dj-sound" ? "text-primary font-semibold" : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              DJ & Sound
            </Link>
            <Link 
              to="/?service=event" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                activeService === "event" ? "text-primary font-semibold" : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Event Management
            </Link>
            <div className="flex flex-col gap-3 pt-3 border-t">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 p-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={profileImage || undefined} alt={userName || 'User'} />
                        <AvatarFallback>{(userName && userName[0]) || 'U'}</AvatarFallback>
                      </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{userName || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{userPhone || ''}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/dashboard/profile');
                    }}
                    className="gap-2 w-full justify-start"
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="gap-2 w-full justify-start"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="gap-2 w-full"
                >
                  <User className="h-4 w-4" />
                  Login
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
