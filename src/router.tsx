import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import PublicLayout from './components/layout/PublicLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';

const Landing = lazy(() => import('./pages/Landing'));
const Catalog = lazy(() => import('./pages/Catalog'));
// ProductDetail is kept on disk (arch § 13.5) but not imported in this version
const ProductModal = lazy(() => import('./components/catalog/ProductModal'));
const Services = lazy(() => import('./pages/Services'));
const Cart = lazy(() => import('./pages/Cart'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Profile = lazy(() => import('./pages/Profile'));
const Orders = lazy(() => import('./pages/Orders'));
const Wishlists = lazy(() => import('./pages/Wishlists'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Blog = lazy(() => import('./pages/Blog'));
const Policies = lazy(() => import('./pages/Policies'));
const Quiz = lazy(() => import('./pages/Quiz'));
const About = lazy(() => import('./pages/About'));

const AccountLayout = lazy(() => import('./components/layout/AccountLayout'));
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./components/admin/AdminProducts'));
const AdminCategories = lazy(() => import('./components/admin/AdminCategories'));
const AdminServices = lazy(() => import('./components/admin/AdminServices'));
const AdminSouvenirs = lazy(() => import('./components/admin/AdminSouvenirs'));
const AdminProposals = lazy(() => import('./components/admin/AdminProposals'));
const AdminTestimonials = lazy(() => import('./components/admin/AdminTestimonials'));
const AdminContent = lazy(() => import('./components/admin/AdminContent'));
const AdminOrders = lazy(() => import('./components/admin/AdminOrders'));
const AdminUsers = lazy(() => import('./components/admin/AdminUsers'));

function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader__spinner" />
    </div>
  );
}

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Landing />} />
          <Route path="catalogo" element={<Catalog />}>
            <Route path=":slug" element={<ProductModal />} />
          </Route>
          {/* ProductDetail kept on disk but removed from routing (arch § 13.5) */}
          <Route path="servicios" element={<Services />} />
          <Route path="blog" element={<Blog />} />
          <Route path="nosotros" element={<About />} />
          <Route path="cuestionario" element={<Quiz />} />
          <Route path="politicas/:type" element={<Policies />} />
          <Route path="auth/login" element={<Login />} />
          <Route path="auth/registro" element={<Signup />} />
          <Route path="auth/recuperar" element={<ForgotPassword />} />
          <Route path="auth/reset" element={<ResetPassword />} />
          <Route path="carrito" element={<Cart />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="cuenta" element={<AccountLayout />}>
            <Route path="perfil" element={<Profile />} />
            <Route path="pedidos" element={<Orders />} />
            <Route path="listas" element={<Wishlists />} />
            <Route path="configuracion" element={<Settings />} />
          </Route>
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="productos" element={<AdminProducts />} />
            <Route path="categorias" element={<AdminCategories />} />
            <Route path="servicios" element={<AdminServices />} />
            <Route path="souvenirs" element={<AdminSouvenirs />} />
            <Route path="propuestas" element={<AdminProposals />} />
            <Route path="testimonios" element={<AdminTestimonials />} />
            <Route path="contenido" element={<AdminContent />} />
            <Route path="pedidos" element={<AdminOrders />} />
            <Route path="usuarios" element={<AdminUsers />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
