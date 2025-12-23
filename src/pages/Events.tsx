import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionHeader } from "@/components/SectionHeader";
import { motion } from "framer-motion";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const events = [
  {
    id: 1,
    name: "Affiliate World Dubai 2025",
    date: "26-27 февраля 2025",
    location: "Дубай, ОАЭ",
    description:
      "Крупнейшая конференция по аффилиат-маркетингу в мире. Нетворкинг, спикеры и эксклюзивные офферы.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    url: "#",
  },
  {
    id: 2,
    name: "TES Affiliate Conferences",
    date: "15-17 марта 2025",
    location: "Прага, Чехия",
    description:
      "Конференция для профессионалов в affiliate-индустрии. Фокус на нетворкинге и закрытых сделках.",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800",
    url: "#",
  },
  {
    id: 3,
    name: "Affiliate Summit Europe",
    date: "10-11 апреля 2025",
    location: "Барселона, Испания",
    description:
      "Европейская конференция с фокусом на performance marketing и инновационные решения.",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800",
    url: "#",
  },
  {
    id: 4,
    name: "MAC Affiliate Conference",
    date: "5-6 мая 2025",
    location: "Москва, Россия",
    description:
      "Главная конференция по арбитражу трафика в СНГ. Доклады, мастер-классы и afterparty.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
    url: "#",
  },
];

const Events = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {/* Page Header */}
      <div className="w-full bg-white border-b border-indigo-100 pt-32 pb-12 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-blue-50/30 to-slate-50/50" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Конференции и <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Ивенты</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl font-medium">
            Календарь главных событий индустрии. Встречайтесь с партнерами, узнавайте новое и отдыхайте.
          </p>
        </div>
      </div>

      <main className="w-full flex-1 py-12 px-4 md:px-6 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {events.map((event, i) => (
            <motion.article
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl bg-white border border-indigo-50 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300"
            >
              <div
                className="h-56 bg-cover bg-center relative transform group-hover:scale-105 transition-transform duration-700 ease-out"
                style={{ backgroundImage: `url(${event.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

                {/* Overlay Info */}
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-indigo-200 transition-colors">
                    {event.name}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm font-medium text-white/90">
                    <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      <Calendar className="w-4 h-4" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-slate-600 leading-relaxed mb-6">
                  {event.description}
                </p>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200" asChild>
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    Подробнее
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Events;
