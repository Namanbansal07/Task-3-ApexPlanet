const slides = [
  {
    title: "Chase the horizon",
    caption: "Every journey starts with a little wonder.",
    location: "MOUNTAIN AIR",
    alt: "Sunrise shining across a mountain range above the clouds",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=85"
  },
  {
    title: "Find your quiet",
    caption: "Some of the best ideas arrive in the calm.",
    location: "FOREST ESCAPE",
    alt: "Sunlight filtering through a peaceful green forest",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1800&q=85"
  },
  {
    title: "Meet the sea",
    caption: "A little blue sky can make a big difference.",
    location: "COASTAL DAYS",
    alt: "Blue ocean waves meeting a sandy coastline",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1800&q=85"
  },
  {
    title: "Look up",
    caption: "The night sky is full of new perspectives.",
    location: "AFTER HOURS",
    alt: "A star-filled night sky above a quiet landscape",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1800&q=85"
  },
  {
    title: "Wander a little",
    caption: "New places have a way of waking up your imagination.",
    location: "OPEN ROAD",
    alt: "A winding road crossing a green valley toward distant mountains",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1800&q=85"
  }
];

export function initCarousel() {
  const carousel = document.querySelector("#image-carousel");
  const track = document.querySelector("#carousel-track");
  const indicators = document.querySelector("#carousel-indicators");
  if (!carousel || !track || !indicators) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const title = document.querySelector("#slide-title");
  const caption = document.querySelector("#slide-caption");
  const kicker = document.querySelector("#slide-kicker");
  const count = document.querySelector("#slide-count");
  const playButton = document.querySelector("#carousel-play");
  let currentSlide = 0;
  let intervalId = null;
  let userPaused = reducedMotion.matches;
  let isHovered = false;
  let hasFocus = false;

  slides.forEach((slide, index) => {
    const item = document.createElement("div");
    item.className = "carousel-slide";
    item.setAttribute("role", "group");
    item.setAttribute("aria-roledescription", "slide");
    item.setAttribute("aria-label", `${index + 1} of ${slides.length}`);
    const image = document.createElement("img");
    image.src = slide.image;
    image.alt = slide.alt;
    image.loading = index === 0 ? "eager" : "lazy";
    image.addEventListener("error", () => item.classList.add("image-failed"), { once: true });
    item.append(image);
    track.append(item);

    const indicator = document.createElement("button");
    indicator.className = "carousel-indicator";
    indicator.type = "button";
    indicator.setAttribute("aria-label", `Show slide ${index + 1}: ${slide.title}`);
    indicator.addEventListener("click", () => showSlide(index));
    indicators.append(indicator);
  });

  const allSlides = [...track.children];
  const allIndicators = [...indicators.children];

  function updatePlayButton() {
    playButton.disabled = false;
    playButton.setAttribute("aria-pressed", String(!userPaused));
    playButton.setAttribute("aria-label", userPaused
      ? (reducedMotion.matches ? "Play automatic slide advancement (reduced motion is enabled)" : "Play automatic slide advancement")
      : "Pause automatic slide advancement");
    playButton.innerHTML = userPaused ? 'Play <span aria-hidden="true">▶</span>' : 'Pause <span aria-hidden="true">Ⅱ</span>';
  }

  function updateTimer() {
    window.clearInterval(intervalId);
    if (!userPaused && !isHovered && !hasFocus) {
      intervalId = window.setInterval(() => showSlide(currentSlide + 1), 6000);
    }
    updatePlayButton();
  }

  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    title.textContent = slides[currentSlide].title;
    caption.textContent = slides[currentSlide].caption;
    kicker.textContent = slides[currentSlide].location;
    count.textContent = `${String(currentSlide + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    allSlides.forEach((slide, slideIndex) => {
      slide.setAttribute("aria-hidden", String(slideIndex !== currentSlide));
    });
    allIndicators.forEach((indicator, indicatorIndex) => {
      indicator.setAttribute("aria-current", String(indicatorIndex === currentSlide));
    });
  }

  document.querySelector("#previous-slide").addEventListener("click", () => showSlide(currentSlide - 1));
  document.querySelector("#next-slide").addEventListener("click", () => showSlide(currentSlide + 1));
  playButton.addEventListener("click", () => {
    userPaused = !userPaused;
    updateTimer();
  });
  carousel.addEventListener("mouseenter", () => { isHovered = true; updateTimer(); });
  carousel.addEventListener("mouseleave", () => { isHovered = false; updateTimer(); });
  carousel.addEventListener("focusin", () => { hasFocus = true; updateTimer(); });
  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget)) {
      hasFocus = false;
      updateTimer();
    }
  });
  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showSlide(currentSlide - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showSlide(currentSlide + 1);
    }
  });
  const onMotionPreferenceChange = () => {
    if (reducedMotion.matches) userPaused = true;
    updateTimer();
  };
  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", onMotionPreferenceChange);
  } else if (typeof reducedMotion.addListener === "function") {
    reducedMotion.addListener(onMotionPreferenceChange);
  }

  showSlide(0);
  updateTimer();
}
