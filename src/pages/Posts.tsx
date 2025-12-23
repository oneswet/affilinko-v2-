import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionHeader } from "@/components/SectionHeader";
import { ArticleCard } from "@/components/ArticleCard";

const posts = [
  {
    id: 1,
    title: "Как запустить сайт под iGaming с нуля: полное руководство по SEO",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800",
    tags: ["гэмблинг", "seo"],
  },
  {
    id: 2,
    title: "Драматургия вместо верстки: почему VSL-лендинг работает лучше",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600",
    tags: ["лендинг", "конверсия"],
  },
  {
    id: 3,
    title: "Антидетект браузеры: лучшие решения 2025 года",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600",
    tags: ["антидетект", "инструменты"],
  },
  {
    id: 4,
    title: "Сплит-тестирование в арбитраже трафика: полный гайд",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
    tags: ["тестирование", "оптимизация"],
  },
  {
    id: 5,
    title: "Обмен крипты без риска: 4 легальные схемы",
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=600",
    tags: ["криптовалюта", "финансы"],
  },
  {
    id: 6,
    title: "Топ-10 CPA сетей для новичков в 2025 году",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600",
    tags: ["CPA", "новичкам"],
  },
  {
    id: 7,
    title: "Facebook Ads в 2025: что изменилось и как адаптироваться",
    image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600",
    tags: ["Facebook", "таргет"],
  },
  {
    id: 8,
    title: "Нутра вертикаль: как заработать на БАДах",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600",
    tags: ["нутра", "вертикали"],
  },
];

const Posts = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="w-full flex-1 py-8 md:py-12 px-3 md:px-6 max-w-page mx-auto">
        <SectionHeader icon="📰" title="Все статьи" />
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {posts.map((post, i) => (
            <ArticleCard key={post.id} {...post} index={i} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Posts;
