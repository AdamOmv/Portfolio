import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import PublicNavbar from '../components/public/PublicNavbar';
import AnimatedBackground from '../components/public/AnimatedBackground';
import HeroSection from '../components/public/HeroSection';
import ProjectsSection from '../components/public/ProjectsSection';
import AboutSection from '../components/public/AboutSection';
import StackSection from '../components/public/StackSection';
import ContactSection from '../components/public/ContactSection';
import PublicFooter from '../components/public/PublicFooter';

const defaultSettings = {
  hero_name: 'Adam Oumarov',
  hero_tagline: 'Je construis des produits web sur mesure.',
  hero_description: 'Frontend premium, architecture full-stack propre, implementation orientee production.',
  logo_url: '/logo_adomv.png',
  favicon_url: '/logo_adomv.png',
};

export default function PublicHomePage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [projects, setProjects] = useState([]);
  const [stack, setStack] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/settings').then(setSettings),
      api.get('/projects').then(setProjects),
      api.get('/stack').then(setStack),
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const faviconUrl = (settings.favicon_url || '').trim();
    if (!faviconUrl) return;

    const links = Array.from(document.querySelectorAll("link[rel='icon'], link[rel='shortcut icon']"));
    if (!links.length) {
      const created = document.createElement('link');
      created.rel = 'icon';
      created.type = 'image/png';
      created.href = faviconUrl;
      document.head.appendChild(created);
      return;
    }

    links.forEach((link) => {
      link.href = faviconUrl;
    });
  }, [settings.favicon_url]);

  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <div className="relative isolate min-h-screen bg-base text-white">
      <AnimatedBackground />
      <div className="relative z-10">
        <PublicNavbar settings={settings} />
        <HeroSection settings={settings} featuredProjects={featuredProjects} />
        {loading ? (
          <div className="container-main py-16 text-sm text-muted-2">Chargement du portfolio...</div>
        ) : (
          <>          
            <StackSection stack={stack} />
            <ProjectsSection projects={projects} />
            <AboutSection settings={settings} />
            <ContactSection settings={settings} />
          </>
        )}
        <PublicFooter settings={settings} />
      </div>
    </div>
  );
}
