import { Outlet, useLocation } from 'react-router-dom';
import NavSideBar from './SideBar';
import NavBar from './Nav';
import { useEffect, useRef, useState } from 'react';

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const location = useLocation();
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

export default Home;
