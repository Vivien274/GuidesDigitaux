'use client';

import React from 'react';

interface VideoPlayerProps {
  url: string;
  poster?: string;
}

export default function VideoPlayer({ url, poster }: VideoPlayerProps) {
  if (!url) {
    return (
      <div className="w-full aspect-video bg-slate-900 flex items-center justify-center text-slate-400 text-xs font-bold">
        Aucune vidéo disponible pour ce cours
      </div>
    );
  }

  // YouTube URL Converter
  const getYouTubeEmbedUrl = (rawUrl: string): string | null => {
    try {
      let videoId = '';
      if (rawUrl.includes('youtube.com/embed/')) {
        videoId = rawUrl.split('youtube.com/embed/')[1]?.split('?')[0];
      } else if (rawUrl.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(rawUrl.split('?')[1]);
        videoId = urlParams.get('v') || '';
      } else if (rawUrl.includes('youtu.be/')) {
        videoId = rawUrl.split('youtu.be/')[1]?.split('?')[0] || '';
      }

      if (videoId) {
        // Paramètres stricts pour masquer le logo, les recommandations et supprimer les mentions YouTube
        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&playsinline=1&controls=1&fs=1&color=white`;
      }
    } catch (e) {
      console.error('Error parsing YouTube URL', e);
    }
    return null;
  };

  // Vimeo URL Converter
  const getVimeoEmbedUrl = (rawUrl: string): string | null => {
    try {
      if (rawUrl.includes('player.vimeo.com/video/')) {
        return rawUrl;
      }
      if (rawUrl.includes('vimeo.com/')) {
        const id = rawUrl.split('vimeo.com/')[1]?.split('?')[0];
        if (id) return `https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0`;
      }
    } catch (e) {
      console.error('Error parsing Vimeo URL', e);
    }
    return null;
  };

  const youtubeUrl = getYouTubeEmbedUrl(url);
  const vimeoUrl = getVimeoEmbedUrl(url);

  // If YouTube link
  if (youtubeUrl) {
    return (
      <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-xl border border-slate-800 relative group">
        <iframe
          src={youtubeUrl}
          title="Lecteur Vidéo Formation"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    );
  }

  // If Vimeo link
  if (vimeoUrl) {
    return (
      <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-xl border border-slate-800">
        <iframe
          src={vimeoUrl}
          title="Lecteur Vidéo Vimeo"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    );
  }

  // Standard HTML5 MP4 / Direct Video
  return (
    <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-xl border border-slate-800 relative">
      <video
        key={url}
        controls
        controlsList="nodownload"
        className="w-full h-full object-cover"
        poster={poster || "https://www.guides-digitaux.com/wp-content/uploads/2026/02/un-artisan-createur-devant-son-PC-en-train-dajouter-ses-produits-dnas-saboutique-en-ligne.-accoude-a-son-etabli-dans-son-atelier.-lumiere-naturelle.webp"}
      >
        <source src={url} type="video/mp4" />
        Votre navigateur ne supporte pas la lecture vidéo.
      </video>
    </div>
  );
}
