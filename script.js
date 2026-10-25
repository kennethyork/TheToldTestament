const list = document.getElementById("video-list");
document.getElementById("year").textContent = new Date().getFullYear();

function toSeconds(timestamp) {
  return timestamp.split(":").reduce((total, part) => total * 60 + Number(part), 0);
}

function embedUrl(id, start = 0) {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&start=${start}`;
}

// Swap the thumbnail for the real player only when clicked, so the page loads fast.
function play(player, id, start) {
  player.innerHTML = `<iframe src="${embedUrl(id, start)}" title="YouTube video player"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen></iframe>`;
}

for (const video of VIDEOS) {
  const published = Boolean(video.youtubeId);
  const card = document.createElement("article");
  card.className = "video-card";

  const player = document.createElement("div");
  player.className = "player";
  player.innerHTML = `
    <img src="${video.thumbnail || `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}"
      alt="" loading="lazy">
    ${published
      ? `<button class="play" aria-label="Play ${video.title}"></button>`
      : `<span class="badge">Coming soon</span>`}`;
  if (published) {
    player.querySelector(".play").addEventListener("click", () => play(player, video.youtubeId, 0));
  }

  const info = document.createElement("div");
  info.className = "video-info";
  info.innerHTML = `<h3></h3><p></p>`;
  info.querySelector("h3").textContent = video.title;
  info.querySelector("p").textContent = video.description;

  if (video.chapters?.length) {
    const chapters = document.createElement("ol");
    chapters.className = "chapters";
    for (const [time, name] of video.chapters) {
      const item = document.createElement("li");
      const el = document.createElement(published ? "button" : "span");
      el.innerHTML = `<time></time> <span></span>`;
      el.querySelector("time").textContent = time;
      el.querySelector("span").textContent = name;
      if (published) {
        el.addEventListener("click", () => {
          play(player, video.youtubeId, toSeconds(time));
          player.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      }
      item.append(el);
      chapters.append(item);
    }
    info.append(chapters);
  }

  card.append(player, info);
  list.append(card);
}
