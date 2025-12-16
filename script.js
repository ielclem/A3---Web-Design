document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.querySelector(".families-scroll-wrapper");
  const track   = document.querySelector(".families-scroll-track");
  const thumb   = document.querySelector(".families-scroll-thumb");

  if (!wrapper || !track || !thumb) return;

  // ---- helpers ----
  function getMaxScroll() {
    return Math.max(wrapper.scrollWidth - wrapper.clientWidth, 0);
  }

function updateThumb() {
  const maxScroll = getMaxScroll();

  if (maxScroll <= 0) {
    thumb.style.width = "100%";
    thumb.style.transform = "translateX(0px)";
    return;
  }

  // thumb size is proportional to visible area
  const visibleRatio  = wrapper.clientWidth / wrapper.scrollWidth;
  const thumbWidthPct = Math.max(visibleRatio * 100, 11); // min width
  thumb.style.width   = thumbWidthPct + "%";

  // --- NEW: use pixels instead of % for position ---
  const scrollRatio   = wrapper.scrollLeft / maxScroll;   // 0 → 1
  const trackWidth    = track.clientWidth;
  const thumbWidthPx  = (thumbWidthPct / 100) * trackWidth;
  const maxTranslatePx = trackWidth - thumbWidthPx;       // full travel

  thumb.style.transform = `translateX(${scrollRatio * maxTranslatePx}px)`;
}

  // keep thumb in sync with scroll
  wrapper.addEventListener("scroll", updateThumb);
  window.addEventListener("load", updateThumb);
  window.addEventListener("resize", updateThumb);

  // -----------------------------------
  //  A) Mouse wheel => horizontal scroll
  // -----------------------------------
  wrapper.addEventListener(
    "wheel",
    function (e) {
      // use vertical wheel as horizontal when you're over the cards
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const maxScroll = getMaxScroll();
        if (maxScroll <= 0) return;

      e.preventDefault();

      const SCROLL_SPEED = 3; // 💨 higher = faster; try 2–4
      const nextScroll = wrapper.scrollLeft + e.deltaY * SCROLL_SPEED;

      wrapper.scrollLeft = Math.min(
        maxScroll,
        Math.max(0, nextScroll)
      );
      }
    },
    { passive: false }
  );

  // -----------------------------------
  //  B) Dragging the thumb
  // -----------------------------------
  let isDragging      = false;
  let dragStartX      = 0;
  let dragStartScroll = 0;

  thumb.addEventListener("mousedown", function (e) {
    isDragging      = true;
    dragStartX      = e.clientX;
    dragStartScroll = wrapper.scrollLeft;
    thumb.classList.add("dragging");
    document.body.style.userSelect = "none"; // avoid text selection
  });

  document.addEventListener("mouseup", function () {
    if (!isDragging) return;
    isDragging = false;
    thumb.classList.remove("dragging");
    document.body.style.userSelect = "";
  });

  document.addEventListener("mousemove", function (e) {
    if (!isDragging) return;

    const trackRect = track.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();

    const trackWidth   = trackRect.width;
    const thumbWidth   = thumbRect.width;
    const maxThumbMove = trackWidth - thumbWidth;
    const maxScroll    = getMaxScroll();

    if (maxThumbMove <= 0 || maxScroll <= 0) return;

    const dx           = e.clientX - dragStartX;
    const scrollPerPx  = maxScroll / maxThumbMove;

    wrapper.scrollLeft = Math.min(
      maxScroll,
      Math.max(0, dragStartScroll + dx * scrollPerPx)
    );
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".reel-track");
  const cards = document.querySelectorAll(".reel-card");
  const nextBtn = document.querySelector(".reel-arrow.right");
  const prevBtn = document.querySelector(".reel-arrow.left");

  if (!track || !nextBtn || !prevBtn) {
    console.warn("Carousel elements not found");
    return;
  }

  let scrollIndex = 0;
  const visibleCards = 4;
  const maxIndex = cards.length - visibleCards;
  const cardWidth = cards[0].offsetWidth + 12;

  nextBtn.addEventListener("click", () => {
    if (scrollIndex < maxIndex) {
      scrollIndex++;
      track.style.transform = `translateX(-${scrollIndex * cardWidth}px)`;
    }
  });

  prevBtn.addEventListener("click", () => {
    if (scrollIndex > 0) {
      scrollIndex--;
      track.style.transform = `translateX(-${scrollIndex * cardWidth}px)`;
    }
  });
});


