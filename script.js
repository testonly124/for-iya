const audio = document.getElementById("myAudio");
const playIcon = document.getElementById("mainPlayIcon");
const songTitle = document.getElementById("currentSongTitle");
const playerContainer = document.querySelector(".music-floater");
const playerBar = document.getElementById("playerBar");

let currentPlayingKey = null;

const songs = {
  aboutyou:         { url: "myAudio/About%20You.mp3", title: "About You - The 1975" },
  iminlovewithyou:  { url: "myAudio/I'm%20in%20love%20with%20you.mp3", title: "I'm in love with you - The 1975" },
  somethingaboutyou: { url: "myAudio/Something%20About%20You.mp3", title: "Something About You - Eyesdress & Drent May" }
};

const CORRECT_PASSWORD = "password";

const wrongMessages = [
  "Nope",
  "Wrong answer, cutie",
  "Uh-uh, think harder",
  "That's a no from me",
  "Access denied. Try harder, my love.",
];

/* ---------------- PASSWORD ---------------- */

function checkPassword() {
  const input = document.getElementById("secretInput");
  const errorText = document.getElementById("passwordError");
  const value = input.value.trim().toLowerCase();

  if (value === CORRECT_PASSWORD) {
    errorText.innerText = "";
    input.classList.remove("shake");
    enterWebsite();
  } else {
    const randomMsg = wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
    errorText.innerText = randomMsg;
    input.value = "";
    input.focus();

    input.classList.remove("shake");
    void input.offsetWidth; // restart the animation on repeated wrong guesses
    input.classList.add("shake");
  }
}

document.getElementById("secretInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkPassword();
});

/* ---------------- AUDIO ---------------- */

// The UI always follows the real audio state
function syncUI() {
  const playing = !audio.paused && !audio.ended;
  const song = songs[currentPlayingKey];
  if (song) songTitle.innerText = song.title;

  playIcon.classList.toggle("fa-pause", playing);
  playIcon.classList.toggle("fa-play", !playing);
  playerContainer.classList.toggle("music-playing", playing);
  playerBar.classList.toggle("show-player", !!currentPlayingKey);

  document.querySelectorAll(".track-item").forEach((item) => {
    const isActive = playing && item.id === `track-${currentPlayingKey}`;
    item.classList.toggle("playing", isActive);
    const icon = item.querySelector(".track-icon i");
    if (icon) {
      icon.classList.toggle("fa-pause", isActive);
      icon.classList.toggle("fa-play", !isActive);
    }
  });
}

audio.addEventListener("play", syncUI);
audio.addEventListener("pause", syncUI);
audio.addEventListener("ended", syncUI);
audio.addEventListener("error", () => {
  if (!audio.getAttribute("src")) return;
  const file = decodeURIComponent(audio.src.split("/").pop());
  console.error("Audio failed to load:", audio.src, audio.error);
  songTitle.innerText = "Can't load: " + file;
  playerBar.classList.add("show-player");
});

function loadSong(key) {
  currentPlayingKey = key;
  audio.src = songs[key].url;
  audio.load();
}

function playSong(key) {
  if (!songs[key]) return;

  if (currentPlayingKey !== key) {
    loadSong(key);
    audio.play().catch((err) => console.error("Play failed:", err));
  } else if (audio.paused) {
    audio.play().catch((err) => console.error("Play failed:", err));
  } else {
    audio.pause();
  }
}

function toggleMusic() {
  // Nothing chosen yet: start the first song
  if (!currentPlayingKey) {
    playSong("aboutyou");
    return;
  }
  if (audio.paused) {
    audio.play().catch((err) => console.error("Play failed:", err));
  } else {
    audio.pause();
  }
}

function enterWebsite() {
  const welcome = document.getElementById("welcomeScreen");
  const main = document.getElementById("mainContent");

  // No music yet: it only starts when a song is clicked in the list.
  audio.volume = 0.5;

  welcome.style.opacity = "0";
  setTimeout(() => {
    welcome.style.display = "none";
    main.classList.add("show-content");
  }, 800);
}

/* ---------------- TIMER ---------------- */

const startDate = new Date("2026-06-30T00:00:00").getTime();

function updateTimer() {
  const now = new Date().getTime();
  const distance = now - startDate;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerText = days < 10 ? "0" + days : days;
  document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
  document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
  document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;
}
setInterval(updateTimer, 1000);

/* ---------------- SCROLL REVEAL ---------------- */

window.addEventListener("scroll", reveal);
function reveal() {
  const reveals = document.querySelectorAll(".reveal");
  for (let i = 0; i < reveals.length; i++) {
    const windowHeight = window.innerHeight;
    const elementTop = reveals[i].getBoundingClientRect().top;
    const elementVisible = 100;
    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    }
  }
}

/* ---------------- EXTRAS ---------------- */

function createHeartShower() {
  const container = document.body;
  const colors = ["#ec4899", "#8b5cf6", "#d946ef", "#a855f7"];

  for (let i = 0; i < 30; i++) {
    const heart = document.createElement("div");
    heart.classList.add("floating-flower");

    heart.innerHTML = '<i class="fas fa-heart"></i>';

    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    heart.style.color = randomColor;

    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (Math.random() * 20 + 15) + "px";
    heart.style.animationDuration = (Math.random() * 3 + 3) + "s";
    heart.style.animationDelay = Math.random() + "s";

    container.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 6000);
  }

  if (navigator.vibrate) {
    navigator.vibrate(100);
  }
}

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}
