import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionHeader } from "@/components/SectionHeader";
import { PartnerCard } from "@/components/PartnerCard";

const networks = [
  {
    id: 1,
    name: "Affiliate Network Pro",
    description:
      "Крупнейшая CPA-сеть с офферами в нише гемблинга, дейтинга и финансов. Быстрые выплаты от $50. Персональные условия для топовых вебмастеров.",
    logo: "https://images.unsplash.com/photo-1560472355-536de3962603?w=200",
    rating: 9.2,
  },
  {
    id: 2,
    name: "TrafficHub Partners",
    description:
      "Партнерская программа с эксклюзивными офферами. Персональный менеджер для каждого вебмастера. Работаем со всеми источниками трафика.",
    logo: "https://images.unsplash.com/photo-1560472355-536de3962603?w=200",
    rating: 8.8,
  },
  {
    id: 3,
    name: "CPA Monster",
    description:
      "Более 1000 офферов в 50+ вертикалях. Поддержка 24/7 и мгновенные выплаты на крипту. Бонусы для новых вебмастеров.",
    logo: "https://images.unsplash.com/photo-1560472355-536de3962603?w=200",
    rating: 8.5,
  },
  {
    id: 4,
    name: "GamblePartners",
    description:
      "Специализированная сеть для гемблинг-вертикали. Высокие ставки, быстрые апрувы и еженедельные выплаты.",
    logo: "https://images.unsplash.com/photo-1560472355-536de3962603?w=200",
    rating: 8.3,
  },
  {
    id: 5,
    name: "NutraMax CPA",
    description:
      "Лидер в нутра-вертикали. Офферы на похудение, красоту и здоровье. Работаем с Tier-1, Tier-2 и Tier-3 странами.",
    logo: "https://images.unsplash.com/photo-1560472355-536de3962603?w=200",
    rating: 8.1,
  },
  {
    id: 6,
    name: "Dating Elite",
    description:
      "Премиум офферы в дейтинг-вертикали. Высокая конверсия на взрослых офферах. Минимальный холд.",
    logo: "https://images.unsplash.com/photo-1560472355-536de3962603?w=200",
    rating: 7.9,
  },
];

const Networks = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {/* Page Header */}
      <div className="w-full bg-white border-b border-indigo-100 pt-32 pb-12 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-indigo-50/30 to-slate-50/50" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Рейтинг <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Партнерок</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl font-medium">
            Проверенные CPA-сети с лучшими ставками и быстрыми выплатами. Выбирайте надежных партнеров.
          </p>
        </div>
      </div>

      <main className="w-full flex-1 py-12 px-4 md:px-6 max-w-7xl mx-auto z-10">
        <div className="space-y-6">
          {networks.map((network, i) => (
            <PartnerCard key={network.id} {...network} index={i} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Networks;
