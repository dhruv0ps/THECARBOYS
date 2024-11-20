import { Outlet } from 'react-router-dom';
import NavSideBar from './SideBar';
import NavBar from './Nav';
import { useEffect, useState } from 'react';

  
const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (window.innerWidth < 700) {
      setIsSidebarOpen(false);
    }
  }, []);

  return (
    <>
         
      <div className="flex-1 relative z-10">
        <NavBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      </div>
      <div className="flex items-start relative overflow-hidden sm:overflow-auto">
        
        <NavSideBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="relative flex-1 h-[calc(100vh-5rem)] overflow-auto pt-5">
          <Outlet />
       
        </div>
      
      </div>
    
    </>
  );
};

export default Home;
