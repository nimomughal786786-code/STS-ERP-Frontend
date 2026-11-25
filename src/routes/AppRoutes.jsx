import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/Overview/Dashboard/dashboard";
import BusinessIntelligence from "../pages/Overview/Business/businesintellegence";
import Orders from "../pages/Sales/Orders/order";
import Quotes from "../pages/Sales/Quotes/quotes";
import Invoices from "../pages/Sales/Invoice/invoice";
import CRM from "../pages/Sales/CRM-leads/crm";
import Products from "../pages/catalogue/Products/product";
import ProductHistory from "../pages/catalogue/Products/ProductHistory";
import Inventory from "../pages/catalogue/Inventory/inventory";
import PriceMonitor from "../pages/catalogue/PriceMonitor/pricemonitor";
import ReviewsView from "../pages/catalogue/Reviews/reviews";
import Accounting from "../pages/Finance/Accounting/accounting";
import Expenses from "../pages/Finance/Expenses/expenses";
import Employees from "../pages/HR/Employess/empoyes";
import Attendance from "../pages/HR/Attendence/attendence";
import Settings from "../pages/Setting/setting";
import AppLayout from "./Applayouts";
function AppRoutes({ user }) {



  // =========================================
  // CENTRAL NOTIFICATIONS
  // =========================================

  const [notifications, setNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);

  // Add a new notification
  const addNotification = (notification) => {
    setNotifications((previous) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        ...notification,
        createdAt: new Date().toISOString(),
      },
      ...previous,
    ]);
  };

  // Mark all notifications as read
  const markAllNotificationsRead = () => {
    setReadNotifications(
      notifications.map((notification) => notification.id)
    );
  };

  // Mark one notification as read
  const markNotificationRead = (id) => {
    setReadNotifications((previous) =>
      previous.includes(id)
        ? previous
        : [...previous, id]
    );
  };
  const [orders, setOrders] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const [leads, setLeads] = useState([]);
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("sts_products");
    return saved ? JSON.parse(saved) : [];
  }); const [priceUpdates, setPriceUpdates] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [expenses, setExpenses] = useState([]);

  return (
    <Routes>


      <Route element={<AppLayout />}>



        <Route
          path="/dashboard"
          element={
            <Dashboard
              user={user}
              orders={orders}
              leads={leads}
              products={products}
              priceUpdates={priceUpdates}
              employees={employees}
              reviews={reviews}
              expenses={expenses}
              notifications={notifications}
              readNotifications={readNotifications}
              markAllNotificationsRead={markAllNotificationsRead}
              markNotificationRead={markNotificationRead}
            />
          }
        />

        <Route
          path="/business-intelligence"
          element={
            <BusinessIntelligence
              user={user}
              orders={orders}
              customers={customers}
              leads={leads}
              expenses={expenses}
              products={products}
              notifications={notifications}
              readNotifications={readNotifications}
              markAllNotificationsRead={markAllNotificationsRead}
              markNotificationRead={markNotificationRead}
            />
          }
        />

        <Route
          path="/orders"
          element={
            <Orders
              user={user}
              orders={orders}
              onOrdersChange={setOrders}
              customers={customers}
              onCustomersChange={setCustomers}
              employees={employees}
              notifications={notifications}
              readNotifications={readNotifications}
              addNotification={addNotification}
              markAllNotificationsRead={markAllNotificationsRead}
            />
          }
        />

        <Route
          path="/quotes"
          element={
            <Quotes
              user={user}
              quotes={quotes}
              onQuotesChange={setQuotes}
              notifications={notifications}
              readNotifications={readNotifications}
              addNotification={addNotification}
              markAllNotificationsRead={markAllNotificationsRead}
            />
          }
        />

        <Route
          path="/invoice"
          element={
            <Invoices
              invoices={invoices}
              onInvoicesChange={setInvoices}
              notifications={notifications}
              readNotifications={readNotifications}
              addNotification={addNotification}
              markAllNotificationsRead={markAllNotificationsRead}
            />
          }
        />

        <Route
          path="/crm&leads"
          element={
            <CRM
              user={user}
              quotes={quotes}
              onQuotesChange={setQuotes}
              orders={orders}
              customers={customers}
              onCustomersChange={setCustomers}
              leads={leads}
              onLeadsChange={setLeads}
              notifications={notifications}
              readNotifications={readNotifications}
              addNotification={addNotification}
              markAllNotificationsRead={markAllNotificationsRead}
              markNotificationRead={markNotificationRead}
            />
          }
        />

        <Route
          path="/products"
          element={
            <Products
              notifications={notifications}
              readNotifications={readNotifications}
              addNotification={addNotification}
              markAllNotificationsRead={markAllNotificationsRead}
            />
          }
        />
        <Route path="/products/:id/history" element={<ProductHistory />} />

        <Route
          path="/inventory"
          element={
            <Inventory
              products={products}
              onProductsChange={setProducts}
              notifications={notifications}
              readNotifications={readNotifications}
              addNotification={addNotification}
              markAllNotificationsRead={markAllNotificationsRead}
            />
          }
        />

        <Route
          path="/pricemonitor"
          element={
            <PriceMonitor
              priceUpdates={priceUpdates}
              onPriceUpdatesChange={setPriceUpdates}
              notifications={notifications}
              readNotifications={readNotifications}
              addNotification={addNotification}
              markAllNotificationsRead={markAllNotificationsRead}
            />
          }
        />

        <Route
          path="/reviews"
          element={
            <ReviewsView
              notifications={notifications}
              readNotifications={readNotifications}
              addNotification={addNotification}
              markAllNotificationsRead={markAllNotificationsRead}
            />
          }
        />

        <Route
          path="/expenses"
          element={
            <Expenses
              expenses={expenses}
              onExpensesChange={setExpenses}
              notifications={notifications}
              readNotifications={readNotifications}
              addNotification={addNotification}
              markAllNotificationsRead={markAllNotificationsRead}
              markNotificationRead={markNotificationRead}
            />
          }
        />

        <Route
          path="/accounting"
          element={
            <Accounting
              invoices={invoices}
              expenses={expenses}
              notifications={notifications}
              readNotifications={readNotifications}
              markAllNotificationsRead={markAllNotificationsRead}
              markNotificationRead={markNotificationRead}
              orders={orders}
            />
          }
        />

        <Route
          path="/employee"
          element={
            <Employees
              employees={employees}
              orders={orders}
              onEmployeesChange={setEmployees}
              notifications={notifications}
              readNotifications={readNotifications}
              addNotification={addNotification}
              markAllNotificationsRead={markAllNotificationsRead}
              markNotificationRead={markNotificationRead}
            />
          }
        />

        <Route
          path="/attendence"
          element={
            <Attendance
              employees={employees}
              attendance={attendance}
              onAttendanceChange={setAttendance}
              notifications={notifications}
              readNotifications={readNotifications}
              markAllNotificationsRead={markAllNotificationsRead}
              markNotificationRead={markNotificationRead}
            />
          }
        />

        <Route path="/setting" element={

          <Settings
            notifications={notifications}
            readNotifications={readNotifications}
            markAllNotificationsRead={markAllNotificationsRead}
            markNotificationRead={markNotificationRead}
          />
        } />

      </Route>
      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />

    </Routes>
  );
}

export default AppRoutes;