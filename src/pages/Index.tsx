import { useState } from "react";
import { NewsGrid } from "@/components/NewsGrid";
import { NewsDetail } from "@/components/NewsDetail";
import { Header } from "@/components/Header";
import { useReadNews } from "@/hooks/useReadNews";

export interface NewsItem {
  id: number;
  Titulo: string;
  "Resumo breve": string;
  capa: string;
  audio: string;
  fonte: string;
  portal: string;
  data: string;
}

const Index = () => {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const { markAsRead } = useReadNews();

  const handleNewsClick = (news: NewsItem) => {
    markAsRead(news.id);
    setSelectedNews(news);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {selectedNews ? (
          <NewsDetail 
            news={selectedNews} 
            onBack={() => setSelectedNews(null)} 
          />
        ) : (
          <NewsGrid onNewsClick={handleNewsClick} />
        )}
      </main>
    </div>
  );
};

export default Index;