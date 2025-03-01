
import { RouteObject } from 'react-router-dom';
import NotFound from './pages/NotFound';

const routes: RouteObject[] = [
  {
    path: '*',
    element: <NotFound />
  }
];

export default routes;
