import { Header } from "@/components/Header";
import { HeroBanner } from "@/components/HeroBanner";
import { CategoryTabs } from "@/components/CategoryTabs";
import { SectionHeader } from "@/components/SectionHeader";
import { PopularCard } from "@/components/PopularCard";
import { ArticleCard } from "@/components/ArticleCard";
import { BlogCard } from "@/components/BlogCard";
import { PartnerCard } from "@/components/PartnerCard";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Mock data
const popularPosts = [
  {
    id: 1,
    title: "Как запустить сайт под iGaming с нуля: полное руководство по SEO",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800",
    tags: ["гэмблинг", "seo"],
    author: "Команда Affilinko",
  },
  {
    id: 2,
    title: "Драматургия вместо верстки: почему VSL-лендинг работает лучше",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600",
    tags: ["лендинг"],
    author: "Команда Affilinko",
  },
  {
    id: 3,
    title: "Антидетект браузеры: лучшие решения 2025 года",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600",
    tags: ["антидетект"],
    author: "Команда Affilinko",
  },
  {
    id: 4,
    title: "Сплит-тестирование в арбитраже трафика: полный гайд",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
    tags: ["тестирование"],
  },
  {
    id: 5,
    title: "Обмен крипты без риска: 4 легальные схемы",
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=600",
    tags: ["криптовалюта"],
  },
];

const freshArticles = [
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
  {
    id: 9,
    title: "Прокси для арбитража: как выбрать и не потерять деньги",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600",
    tags: ["прокси", "инструменты"],
  },
  {
    id: 10,
    title: "TikTok Ads: полное руководство для арбитражников",
    image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=600",
    tags: ["TikTok", "реклама"],
  },
  {
    id: 11,
    title: "Как масштабировать кампанию без слива бюджета",
    image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=600",
    tags: ["масштабирование"],
  },
  {
    id: 12,
    title: "Лучшие трекеры для арбитража трафика",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600",
    tags: ["трекеры", "софт"],
  },
  {
    id: 13,
    title: "Гео-арбитраж: какие страны выбрать в 2025",
    image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600",
    tags: ["гео", "стратегия"],
  },
];

const blogs = [
  {
    id: 1,
    title: "Мой путь от нуля до $10K в месяц на арбитраже",
    excerpt:
      "Расскажу как начал с нуля, какие ошибки допустил и как в итоге вышел на стабильный доход. Все секреты и подводные камни...",
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
      "История о том, как решился уволиться с работы и полностью посвятить себя арбитражу трафика. Плюсы, минусы и честный расклад...",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600",
    author: {
      name: "Артем Вебмастер",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    },
    tags: ["карьера", "мотивация"],
    views: 8930,
    comments: 156,
  },
];

const partners = [
  {
    id: 1,
    name: "Affiliate Network Pro",
    description:
      "Крупнейшая CPA-сеть с офферами в нише гемблинга, дейтинга и финансов. Быстрые выплаты от $50.",
    logo: "https://images.unsplash.com/photo-1560472355-536de3962603?w=200",
    rating: 9.2,
  },
  {
    id: 2,
    name: "TrafficHub Partners",
    description:
      "Партнерская программа с эксклюзивными офферами. Персональный менеджер для каждого вебмастера.",
    logo: "https://images.unsplash.com/photo-1560472355-536de3962603?w=200",
    rating: 8.8,
  },
  {
    id: 3,
    name: "CPA Monster",
    description:
      "Более 1000 офферов в 50+ вертикалях. Поддержка 24/7 и мгновенные выплаты на крипту.",
    logo: "https://images.unsplash.com/photo-1560472355-536de3962603?w=200",
    rating: 8.5,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <HeroBanner />
      <CategoryTabs />

      <main className="w-full flex-1 pb-12 md:mx-auto z-10 bg-background max-w-page">
        <h1 className="sr-only">Affilinko - интернет-маркетинг, CPA и бизнес</h1>

        {/* Popular Materials */}
        <section className="relative px-3 md:px-6 py-8 md:py-16 overflow-hidden">
          {/* Flow Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full bg-slate-50/50 -z-10" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 blur-[80px] rounded-full pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto relative z-10">
            <SectionHeader icon="🔥" title="Популярные материалы" subtitle="Самое читаемое и обсуждаемое в сообществе прямо сейчас." />
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-4 md:grid-rows-2">
              {popularPosts.map((post, i) => (
                <PopularCard
                  key={post.id}
                  {...post}
                  isLarge={i === 0}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Fresh Articles */}
        <section className="relative px-3 md:px-6 py-8 md:py-16">
          <SectionHeader
            icon="🍏"
            title="Свежие статьи"
            showMore
            moreLink="/posts"
          />
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {freshArticles.map((article, i) => (
              <ArticleCard key={article.id} {...article} index={i} />
            ))}
          </div>
          <Link
            to="/posts"
            className="mt-8 flex md:hidden items-center gap-2 justify-center text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <span>Показать еще</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Author Blogs */}
        <section className="relative px-3 md:px-6 py-12 md:py-20 overflow-hidden bg-slate-50/80">
          {/* Flow Elements */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-500/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <SectionHeader
              icon="✏️"
              title="Авторские блоги"
              showMore
              moreLink="/blogs"
              subtitle="Личный опыт и кейсы от практиков рынка."
            />
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogs.map((blog, i) => (
                <BlogCard key={blog.id} {...blog} index={i} />
              ))}
            </div>
            <Link
              to="/blogs"
              className="mt-8 flex md:hidden items-center gap-2 justify-center text-sm font-bold text-slate-600 hover:text-pink-600 transition-colors"
            >
              <span>Показать еще</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Partner Networks Rating */}
        <section className="relative px-3 md:px-6 py-12 md:py-20 overflow-hidden">
          {/* Flow Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <SectionHeader
              icon="👍"
              title="Рейтинг партнерских сетей"
              showMore
              moreLink="/networks"
              moreText="Все партнерки"
              subtitle="ТОП CPA-сетей с лучшими условиями для вебмастеров."
            />
            <div className="mt-8 space-y-4">
              {partners.map((partner, i) => (
                <PartnerCard key={partner.id} {...partner} index={i} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
