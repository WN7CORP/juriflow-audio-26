
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, ExternalLink, Volume2, Video } from "lucide-react";
import { NewsItem } from "@/pages/Index";
import { isYouTubeUrl, extractYouTubeId, getYouTubeThumbnail } from "@/lib/utils";
import { YouTubePlayer } from "./YouTubePlayer";

interface NewsDetailProps {
  news: NewsItem;
  onBack: () => void;
}

export const NewsDetail = ({ news, onBack }: NewsDetailProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [audioStartedAfterVideo, setAudioStartedAfterVideo] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const isVideo = isYouTubeUrl(news.capa);
  const videoId = isVideo ? extractYouTubeId(news.capa) : null;
  const thumbnailUrl = isVideo ? getYouTubeThumbnail(news.capa) : news.capa;

  // Reset audio state when component mounts or news changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setShowVideo(false);
    setVideoEnded(false);
    setAudioStartedAfterVideo(false);
    setAudioLoaded(false);
  }, [news.id]);

  const resetAudioState = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setAudioStartedAfterVideo(false);
  };

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Stop video if it's playing
        if (showVideo) {
          setShowVideo(false);
        }
        
        // Ensure audio is loaded
        if (!audioLoaded) {
          audioRef.current.load();
        }
        
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Erro ao reproduzir áudio:', error);
      // Reset audio element if there's an error
      if (audioRef.current) {
        audioRef.current.load();
        setAudioLoaded(false);
      }
      setIsPlaying(false);
    }
  };

  const handleVideoClick = () => {
    if (isVideo) {
      // Reset audio completely before showing video
      resetAudioState();
      setShowVideo(true);
      setVideoEnded(false);
    }
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setShowVideo(false);
    
    // Auto-play audio after video ends with a longer delay
    if (news.audio && audioRef.current) {
      setTimeout(async () => {
        try {
          if (audioRef.current) {
            // Ensure audio is properly loaded
            audioRef.current.load();
            await audioRef.current.play();
            setIsPlaying(true);
            setAudioStartedAfterVideo(true);
          }
        } catch (error) {
          console.error('Erro ao reproduzir áudio após vídeo:', error);
        }
      }, 1000);
    }
  };

  const handleVideoStart = () => {
    // Ensure audio is completely stopped when video starts
    resetAudioState();
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && !audioRef.current.paused) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setAudioLoaded(true);
    }
  };

  const handleAudioCanPlay = () => {
    setAudioLoaded(true);
  };

  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    console.error('Erro no áudio:', e);
    setIsPlaying(false);
    setAudioLoaded(false);
    // Try to reload the audio
    if (audioRef.current) {
      audioRef.current.load();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && audioLoaded) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const openSource = () => {
    if (news.fonte) {
      window.open(news.fonte, '_blank');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="hover:bg-surface-elevated bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/30"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>

      {/* Featured Image/Video */}
      <Card className="overflow-hidden bg-gradient-surface border-border/50">
        {showVideo && videoId ? (
          <div className="aspect-video">
            <YouTubePlayer
              videoId={videoId}
              onVideoEnd={handleVideoEnd}
              onVideoStart={handleVideoStart}
            />
          </div>
        ) : thumbnailUrl ? (
          <div className="relative cursor-pointer" onClick={handleVideoClick}>
            <img
              src={thumbnailUrl}
              alt={news.Titulo}
              className="w-full h-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            {isVideo && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center hover:bg-black/40 transition-colors">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                  <Play className="h-12 w-12 text-white ml-1" />
                </div>
              </div>
            )}
            {videoEnded && (
              <div className="absolute top-4 right-4 bg-green-500/80 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-medium">
                Vídeo assistido ✓
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-64 bg-gradient-primary flex items-center justify-center">
            <Volume2 className="h-12 w-12 text-primary-foreground opacity-60" />
          </div>
        )}
      </Card>

      {/* Title and Meta */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          {news.Titulo}
        </h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {news.portal && (
            <span className="font-medium">{news.portal}</span>
          )}
          {news.data && (
            <span>{news.data}</span>
          )}
        </div>
      </div>

      {/* Audio Player */}
      {news.audio && (
        <Card className={`p-6 bg-gradient-surface border-border/50 ${audioStartedAfterVideo ? 'ring-2 ring-primary/50' : ''}`}>
          <div className="flex items-center gap-4">
            <Button
              onClick={togglePlay}
              size="lg"
              disabled={!audioLoaded}
              className="flex-shrink-0 w-12 h-12 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>
            
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>
                  {audioStartedAfterVideo ? "🎧 Reproduzindo após vídeo" : "Áudio da notícia"}
                  {!audioLoaded && " (Carregando...)"}
                </span>
                <span>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              
              <div
                className="w-full h-2 bg-surface-elevated rounded-full cursor-pointer"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{
                    width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%',
                  }}
                />
              </div>
            </div>
          </div>

          <audio
            ref={audioRef}
            src={news.audio}
            preload="metadata"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onCanPlay={handleAudioCanPlay}
            onError={handleAudioError}
            onEnded={() => {
              setIsPlaying(false);
              setAudioStartedAfterVideo(false);
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </Card>
      )}

      {/* Content */}
      <Card className="p-6 bg-gradient-surface border-border/50">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Resumo da Notícia
        </h2>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {news["Resumo breve"]}
        </p>
      </Card>

      {/* Source Link */}
      {news.fonte && (
        <Card className="p-6 bg-gradient-surface border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground mb-1">
                Fonte Original
              </h3>
              <p className="text-sm text-muted-foreground">
                Leia a notícia completa na fonte original
              </p>
            </div>
            <Button
              onClick={openSource}
              variant="outline"
              className="border-primary/20 hover:bg-primary/10 hover:border-primary/40"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Abrir Fonte
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
