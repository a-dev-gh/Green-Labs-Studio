import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import BottomNav from './BottomNav';
import WhatsAppBubble from '../ui/WhatsAppBubble';

export default function PublicLayout() {
  return (
    <div className="public-layout">
      <Navbar />
      <main className="public-layout__main">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
      <WhatsAppBubble />
    </div>
  );
}
