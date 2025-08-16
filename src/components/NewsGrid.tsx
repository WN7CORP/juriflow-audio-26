import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NewsCard } from "./NewsCard";
import { NewsItem } from "@/pages/Index";
import { Loader2 } from "lucide-react";
import { useReadNews } from "@/hooks/useReadNews";

interface NewsGridProps {
  onNewsClick: (news: NewsItem) => void;
}

export const NewsGrid = ({ onNewsClick }: NewsGridProps) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { isRead } = useReadNews();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await supabase
          .from("NOTICIAS-AUDIO")
          .select("*")
          .order("data", { ascending: false });

        if (error) {
          console.error("Error fetching news:", error);
          return;
        }

        setNews((data || []) as NewsItem[]);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Carregando notícias...</span>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-medium text-foreground mb-2">
          Nenhuma notícia encontrada
        </h3>
        <p className="text-muted-foreground">
          Aguarde novas atualizações jurídicas
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Últimas Notícias Jurídicas
        </h2>
        <p className="text-muted-foreground">
          Mantenha-se atualizado com o mundo jurídico
        </p>
      </div>
      
      <div className="grid gap-4 md:gap-6">
        {news.map((item) => (
          <NewsCard
            key={item.id}
            news={item}
            isRead={isRead(item.id)}
            onClick={() => onNewsClick(item)}
          />
        ))}
      </div>
    </div>
  );
};