
import { RouteObject } from 'react-router-dom';
import NotFound from './pages/NotFound';
import DriverProfile from './pages/DriverProfile';

const routes: RouteObject[] = [
  {
    path: '/driver-profile/:id',
    element: <DriverProfile />
  },
  {
    path: '*',
    element: <NotFound />
  }
];

export default routes;
