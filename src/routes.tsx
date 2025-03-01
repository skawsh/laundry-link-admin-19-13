import { Main } from "@/components/layout/Main"
import { Shell } from "@/components/layout/Shell"
import { createRouteGroup } from "@tanstack/react-router"

import { AccountPage } from "@/pages/account"
import { AnalyticsPage } from "@/pages/analytics"
import { AuthenticationPage } from "@/pages/authentication"
import { DashboardPage } from "@/pages/dashboard"
import { ExamplesPage } from "@/pages/examples"
import { HomePage } from "@/pages/home"
import { PaymentsPage } from "@/pages/payments"
import { SettingsPage } from "@/pages/settings"
import OrderDetails from "@/pages/OrderDetails";
import DriverOrders from "@/pages/DriverOrders";

export const rootRoute = createRouteGroup({
  path: "/",
})

export const examplesRoute = rootRoute.createRoute({
  path: "examples",
  element: <ExamplesPage />,
})

export const publicRoutes = createRouteGroup([
  rootRoute.createRoute({
    path: "/",
    element: <HomePage />,
  }),
  rootRoute.createRoute({
    path: "authentication",
    element: <AuthenticationPage />,
  }),
])

export const privateRoutes = createRouteGroup([
  rootRoute.createRoute({
    path: "dashboard",
    element: (
      <Shell>
        <Main>
          <DashboardPage />
        </Main>
      </Shell>
    ),
  }),
  rootRoute.createRoute({
    path: "account",
    element: (
      <Shell>
        <Main>
          <AccountPage />
        </Main>
      </Shell>
    ),
  }),
  rootRoute.createRoute({
    path: "payments",
    element: (
      <Shell>
        <Main>
          <PaymentsPage />
        </Main>
      </Shell>
    ),
  }),
  rootRoute.createRoute({
    path: "analytics",
    element: (
      <Shell>
        <Main>
          <AnalyticsPage />
        </Main>
      </Shell>
    ),
  }),
  rootRoute.createRoute({
    path: "settings",
    element: (
      <Shell>
        <Main>
          <SettingsPage />
        </Main>
      </Shell>
    ),
  }),
  
  {
    path: "/driver-orders",
    element: <DriverOrders />,
  },
  {
    path: "/order-details/:orderId",
    element: <OrderDetails />,
  },
  
])

export const routes = [
  ...publicRoutes.getRoutes(),
  ...privateRoutes.getRoutes(),
  ...examplesRoute.getRoutes(),
]
