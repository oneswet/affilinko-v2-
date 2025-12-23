import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionHeader } from "@/components/SectionHeader";
import { PopularCard } from "@/components/PopularCard";

const cases = [
  {
    id: 1,
    title: "Кейс: $50,000 на гемблинге за месяц с ROI 150%",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800",
    tags: ["гэмблинг", "кейс"],
    author: "Максим К.",
  },
  {
    id: 2,
    title: "Как я заработал $15,000 на дейтинге в Tier-1 странах",
    image: "https://images.unsplash.com/photo-1516589091380-5d8e87df6999?w=600",
    tags: ["дейтинг", "кейс"],
    author: "Артем В.",
  },
  {
    id: 3,
    title: "Нутра оффер: от $100 до $5,000 в день за 2 месяца",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600",
    tags: ["нутра", "кейс"],
    author: "Денис Л.",
  },
  {
    id: 4,
    title: "Финансовые офферы: $30,000 профита на микрозаймах",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600",
    tags: ["финансы", "кейс"],
    author: "Алексей М.",
  },
  {
    id: 5,
    title: "TikTok Ads кейс: $8,000 за неделю на товарке",
    image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=600",
    tags: ["TikTok", "товарка"],
    author: "Игорь С.",
  },
  {
    id: 6,
    title: "Push-уведомления: как я вышел на $3,000/день",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600",
    tags: ["push", "кейс"],
    author: "Владимир Н.",
  },
];

const Cases = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {/* Page Header */}
      <div className="w-full bg-white border-b border-indigo-100 pt-32 pb-12 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-slate-50/50" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Реальные <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Кейсы</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl font-medium">
            Истории успеха, связки и цифры. Изучайте опыт топовых арбитражников и повторяйте их результаты.
          </p>
        </div>
      </div>

      <main className="w-full flex-1 py-12 px-4 md:px-6 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((caseItem, i) => (
            <PopularCard key={caseItem.id} {...caseItem} index={i} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cases;
