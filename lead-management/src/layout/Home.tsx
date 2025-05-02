import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import NavSideBar from './SideBar';
import NavBar from './Nav';
import { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { authStore } from '../store/authStore';

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (window.innerWidth < 700) {
      setIsSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [location]);

  useEffect(() => {
    const validateAuth = async () => {
      try {
        setIsLoading(true);

        if (authStore.user) {
          setIsLoading(false);
          return;
        }

        const token = localStorage.getItem("authToken");

        if (!token) {
          navigate("/login");
          return;
        }

        await authStore.getCurrentUser();

        if (!authStore.user) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userId");
          navigate("/login");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    validateAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 relative z-10">
        <NavBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      </div>
      <div className="flex items-start relative overflow-hidden sm:overflow-auto">
        <NavSideBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        {/* Add ref to track scroll container */}
        <div
          ref={contentRef}
          className="relative flex-1 h-[calc(100vh-5rem)] overflow-auto pt-5"
        >
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default observer(Home);
