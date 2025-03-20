import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'mobx-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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
            <UserForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "/users/:id",
        element: (
          <ProtectedRoute>
            <UserForm />
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
            <UserTable />
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
  );
}

// Render the app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider {...stores}>
      <DndProvider backend={HTML5Backend}>
        <App />
      </DndProvider>
    </Provider>
  </React.StrictMode>
);
export default App;