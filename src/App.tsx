import { useEffect, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { AlgorithmsSection } from './components/AlgorithmsSection';
import { ArchitectureSection } from './components/ArchitectureSection';
import { DashboardSection } from './components/DashboardSection';
import { EncryptionLabSection } from './components/EncryptionLabSection';
import { HeroSection } from './components/HeroSection';
import { IntrusionDetectionSection } from './components/IntrusionDetectionSection';
import { RbacSection } from './components/RbacSection';
import { SecureRoutingSection } from './components/SecureRoutingSection';
import { SecurityLogsSection } from './components/SecurityLogsSection';
import { NAV_ITEMS, SidebarNav } from './components/SidebarNav';
import { TopologySection } from './components/TopologySection';
import type { AlgorithmInfo } from './types/security';

export function App() {
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [idsScanSignal, setIdsScanSignal] = useState<number>(0);
  const [ospfSignal, setOspfSignal] = useState<number>(0);

  const navigateToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAlgorithmDemo = (algoId: AlgorithmInfo['id']) => {
    switch (algoId) {
      case 'aes':
      case 'sha256':
        navigateToSection('encryption-lab');
        break;
      case 'dijkstra':
        navigateToSection('secure-routing');
        break;
      case 'ospf':
        setOspfSignal((n) => n + 1);
        navigateToSection('secure-routing');
        break;
      case 'ids':
        setIdsScanSignal((n) => n + 1);
        navigateToSection('intrusion-detection');
        break;
      case 'rbac':
        navigateToSection('rbac');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.id);
    const observers: IntersectionObserver[] = [];

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
          break;
        }
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: '-20% 0px -65% 0px',
      threshold: 0.05,
    });

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    }
    observers.push(observer);

    return () => {
      for (const obs of observers) {
        obs.disconnect();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#07111F] soc-bg-grid text-slate-100 flex flex-col lg:flex-row">
      <SidebarNav activeSection={activeSection} onNavigate={navigateToSection} />

      <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <div className="mx-auto max-w-7xl space-y-14 sm:space-y-16">
          <HeroSection onNavigate={navigateToSection} />
          <DashboardSection />
          <TopologySection />
          <AlgorithmsSection onDemoAction={handleAlgorithmDemo} />
          <EncryptionLabSection />
          <IntrusionDetectionSection externalScanSignal={idsScanSignal} />
          <SecureRoutingSection ospfHighlightSignal={ospfSignal} />
          <RbacSection />
          <SecurityLogsSection />
          <ArchitectureSection />
          <AboutSection />
        </div>
      </main>
    </div>
  );
}

export default App;

