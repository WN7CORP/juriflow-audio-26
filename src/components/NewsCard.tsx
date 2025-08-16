
import { Card } from "@/components/ui/card";
import { NewsItem } from "@/pages/Index";
import { PlayCircle, Clock, Video, CheckCircle } from "lucide-react";
import { isYouTubeUrl, getYouTubeThumbnail } from "@/lib/utils";

interface NewsCardProps {
  news: NewsItem;
  isRead?: boolean;
  onClick: () => void;
}

export const NewsCard = ({ news, isRead = false, onClick }: NewsCardProps) => {
  const isVideo = isYouTubeUrl(news.capa);
  const thumbnailUrl = isVideo ? getYouTubeThumbnail(news.capa) : news.capa;

  return (
    <Card 
      className="group overflow-hidden bg-gradient-surface border-border/50 hover:border-primary/30 cursor-pointer transition-all duration-300 hover:shadow-card hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="flex gap-4 p-4">
        {/* Image */}
        <div className="relative flex-shrink-0">
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-surface-elevated">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={news.Titulo}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className="hidden w-full h-full bg-gradient-primary flex items-center justify-center">
              <PlayCircle className="h-8 w-8 text-primary-foreground opacity-60" />
            </div>
            
            {/* Video indicator */}
            {isVideo && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Video className="h-6 w-6 text-white" />
              </div>
            )}
          </div>
          
          {/* Selo de lida - agora abaixo da capa */}
          {isRead && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm whitespace-nowrap">
              <CheckCircle className="h-3 w-3" />
              <span className="font-medium">Lida</span>
            </div>
          )}
          
          {/* Audio indicator */}
          {news.audio && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <PlayCircle className="h-3 w-3 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors pr-2">
              {news.Titulo}
            </h3>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {news["Resumo breve"]}
          </p>
          
          <div className="flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              {news.portal && (
                <span className="font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
                  {news.portal}
                </span>
              )}
              {news.data && (
                <span className="text-muted-foreground">
                  {news.data}
                </span>
              )}
            </div>
            {news.audio && (
              <span className="flex items-center gap-1 text-primary">
                <PlayCircle className="h-3 w-3" />
                Áudio
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
