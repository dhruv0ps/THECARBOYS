import React from 'react';
import { Provider } from 'mobx-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authStore } from './store/authStore.ts';
import LeadForm from './features/Leads/LeadForm';
import AddNewCarForm from './features/Cars/CarFrom';
import UserForm from './features/User/UserForm';
import Home from './layout/Home';
import ListOfLeads from './features/Leads/ListOfLeads';
import CarList from './features/Cars/CarView';
import UserTable from './features/User/ListUser';
import LoginPage from './features/User/Login';
import ProtectedRoute from './ProtectedRoute';
import LeadCategoryModal from './features/Leads/LeadCategoryModal';
import InactiveLeads from './features/Leads/InActiveLeads';
import Dashboard from './features/Dashboard/Dashboard';

const stores = { authStore };

// Admin-only protected route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const checkAdmin = async () => {
      try {
        if (!authStore.user) {
          await authStore.getCurrentUser();
        }
        
        setIsAdmin(authStore.user?.email?.includes('admin') || false);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    };
    
    checkAdmin();
  }, []);

  if (isAdmin === null) {
    return null;
  }

  return isAdmin ? <>{children}</> : <Navigate to="/" />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/leads/add",
        element: (
          <ProtectedRoute>
            <LeadForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "/leads/add/:id",
        element: (
          <ProtectedRoute>
            <LeadForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "/inventory/add",
        element: (
          <ProtectedRoute>
            <AddNewCarForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "/inventory/add/:id",
        element: (
          <ProtectedRoute>
            <AddNewCarForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "/leads/category",
        element: (
          <ProtectedRoute>
            <LeadCategoryModal />
          </ProtectedRoute>
        ),
      },
      {
        path: "/leads/archive",
        element: (
          <ProtectedRoute>
            <InactiveLeads />
          </ProtectedRoute>
        ),
      },
      {
        path: "/users/add",
        element: (
          <ProtectedRoute>
            <AdminRoute>
              <UserForm />
            </AdminRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "/users/:id",
        element: (
          <ProtectedRoute>
            <AdminRoute>
              <UserForm />
            </AdminRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "/leads/view",
        element: (
          <ProtectedRoute>
            <ListOfLeads />
          </ProtectedRoute>
        ),
      },
      {
        path: "/leads/view/:model",
        element: (
          <ProtectedRoute>
            <ListOfLeads />
          </ProtectedRoute>
        ),
      },
      {
        path: "/inventory/view",
        element: (
          <ProtectedRoute>
            <CarList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/users/view",
        element: (
          <ProtectedRoute>
            <AdminRoute>
              <UserTable />
            </AdminRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <div>Page Not Found</div>,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

function App() {
  return (
    <Provider {...stores}>
      <DndProvider backend={HTML5Backend}>
        <>
          {/* ToastContainer for global notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <RouterProvider router={router} />
        </>
      </DndProvider>
    </Provider>
  );
}

export default App;