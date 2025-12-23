import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionHeader } from "@/components/SectionHeader";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

const services = [
  {
    id: 1,
    name: "AdsPower",
    category: "Антидетект браузеры",
    description: "Лучший антидетект браузер для мультиаккаунтинга",
    icon: "🌐",
    url: "#",
  },
  {
    id: 2,
    name: "Keitaro",
    category: "Трекеры",
    description: "Профессиональный трекер для арбитража трафика",
    icon: "📊",
    url: "#",
  },
  {
    id: 3,
    name: "ProxyBros",
    category: "Прокси",
    description: "Приватные резидентные и мобильные прокси",
    icon: "🔒",
    url: "#",
  },
  {
    id: 4,
    name: "Spy.House",
    category: "Spy-сервисы",
    description: "Spy-сервис для анализа рекламы конкурентов",
    icon: "🔍",
    url: "#",
  },
  {
    id: 5,
    name: "CreoGen",
    category: "Креативы",
    description: "Генератор креативов с AI для рекламных кампаний",
    icon: "🎨",
    url: "#",
  },
  {
    id: 6,
    name: "LandingPro",
    category: "Конструкторы",
    description: "Быстрый конструктор лендингов без кода",
    icon: "🏗️",
    url: "#",
  },
];

const Services = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {/* Page Header */}
      <div className="w-full bg-white border-b border-indigo-100 pt-32 pb-12 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-pink-50/30 to-slate-50/50" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Полезные <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">Сервисы</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl font-medium">
            Инструменты, которые экономят время и увеличивают профит. Антидетекты, трекеры, спаи и многое другое.
          </p>
        </div>
      </div>

      <main className="w-full flex-1 py-12 px-4 md:px-6 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <motion.article
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group p-6 bg-white rounded-2xl border border-indigo-50 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity text-8xl leading-none select-none pointer-events-none grayscale">
                {service.icon}
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl shadow-inner shadow-indigo-100">
                    {service.icon}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-bold uppercase tracking-wider text-slate-600">
                    {service.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-2">
                  {service.name}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">
                  {service.description}
                </p>

                <a
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 font-bold text-sm transition-all group/btn"
                >
                  Перейти на сайт
                  <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
