interface YouTubeEmbedProps {
  videoId: string;
}

function parseYouTubeUrl(url: string): string {
  const rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/;
  if (url.match(rx)) {
    const match = url.match(rx);
    return match ? match[1] : url.slice(-11);
  }
  return url.slice(-11);
}

export default function YouTubeEmbed({ videoId: rawVideoId }: YouTubeEmbedProps) {
  const videoId = rawVideoId.startsWith('https://') ? parseYouTubeUrl(rawVideoId) : rawVideoId;

  const srcdoc = `
    <style>
      body, .youtubeembed {
        width: 100%;
        height: 100%;
        margin: 0;
        position: absolute;
        display: flex;
        justify-content: center;
        object-fit: cover;
      }
    </style>
    <a
      href='https://www.youtube.com/embed/${videoId}?autoplay=1'
      class='youtubeembed'
    >
      <img
        src='https://img.youtube.com/vi/${videoId}/sddefault.jpg'
        class='youtubeembed'
        alt='YouTube video thumbnail'
      />
      <svg version='1.1' viewBox='0 0 68 48' width='68px' style='position: relative;'>
        <path d='M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z' fill='#f00'></path>
        <path d='M 45,24 27,14 27,34' fill='#fff'></path>
      </svg>
    </a>
  `;

  return (
    <div className="my-6">
      <iframe
        className="w-full object-contain"
        srcDoc={srcdoc}
        title={`YouTube video ${videoId}`}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        frameBorder="0"
        width="600"
        height="400"
        allowFullScreen
        aria-hidden="true"
      />
    </div>
  );
}