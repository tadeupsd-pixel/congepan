'use client';

import { useState } from 'react';

interface VideoItem {
  url: string | null;
  title: string;
  description: string;
  visible: boolean;
  index: number;
}

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function VideoEmbed({ url }: { url: string }) {
  const ytId = getYouTubeId(url);
  if (ytId) {
    return (
      <iframe
        className="video-iframe"
        src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
        title="Vídeo"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return (
      <iframe
        className="video-iframe"
        src={`https://player.vimeo.com/video/${vimeoMatch[1]}?title=0&byline=0`}
        title="Vídeo"
        allowFullScreen
      />
    );
  }
  // Link direto (mp4 etc)
  return (
    <video className="video-iframe" controls playsInline>
      <source src={url} />
    </video>
  );
}

export function VideoSection({ videos }: { videos: VideoItem[] }) {
  const visible = videos.filter((v) => v.visible);
  if (visible.length === 0) return null;

  return (
    <div className="video-section-list">
      {visible.map((video, i) => (
        <div
          key={video.index}
          className={`video-row${i % 2 === 1 ? ' video-row-reverse' : ''}`}
        >
          <div className="video-embed-wrap">
            {video.url ? (
              <VideoEmbed url={video.url} />
            ) : (
              <div className="video-placeholder">
                <span className="video-placeholder-icon">🎬</span>
                <span>Vídeo em breve</span>
              </div>
            )}
          </div>
          <div className="video-copy">
            <div className="video-badge">
              {video.index === 1 ? '🏢' : video.index === 2 ? '💬' : '🌟'}
            </div>
            <h3 className="video-title">{video.title}</h3>
            <p className="video-desc">{video.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
