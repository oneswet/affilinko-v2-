import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionHeader } from "@/components/SectionHeader";
import { BlogCard } from "@/components/BlogCard";

const blogs = [
  {
    id: 1,
    title: "Мой путь от нуля до $10K в месяц на арбитраже",
    excerpt:
      "Расскажу как начал с нуля, какие ошибки допустил и как в итоге вышел на стабильный доход. Все секреты и подводные камни арбитража трафика.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600",
    author: {
      name: "Максим Арбитражник",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    },
    tags: ["личный опыт", "кейс"],
    views: 15420,
    comments: 234,
  },
  {
    id: 2,
    title: "Почему я ушел из офиса ради арбитража",
    excerpt:
      "История о том, как решился уволиться с работы и полностью посвятить себя арбитражу трафика. Плюсы, минусы и честный расклад.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600",
    author: {
      name: "Артем Вебмастер",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    },
    tags: ["карьера", "мотивация"],
    views: 8930,
    comments: 156,
  },
  {
    id: 3,
    title: "Как я потерял $5000 на первой кампании и что понял",
    excerpt:
      "Честный рассказ о моем провале и уроках, которые я извлек. Надеюсь, мой опыт поможет вам избежать этих ошибок.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600",
    author: {
      name: "Дмитрий Аффилейт",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    },
    tags: ["ошибки", "опыт"],
    views: 12300,
    comments: 189,
  },
  {
    id: 4,
    title: "Работа с командой: как найти надежных людей",
    excerpt:
      "Делюсь опытом построения команды для арбитража. Где искать людей, как проверять и как выстраивать процессы.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600",
    author: {
      name: "Андрей Лидер",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    },
    tags: ["команда", "менеджмент"],
    views: 6540,
    comments: 98,
  },
];

const Blogs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {/* Page Header */}
      <div className="w-full bg-white border-b border-indigo-100 pt-32 pb-12 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-purple-50/30 to-slate-50/50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Авторские <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">Блоги</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl font-medium">
            Личный опыт, мнения и инсайды от практиков рынка. Читайте тех, кто делает результат.
          </p>
        </div>
      </div>

      <main className="w-full flex-1 py-12 px-4 md:px-6 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {blogs.map((blog, i) => (
            <BlogCard key={blog.id} {...blog} index={i} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blogs;
