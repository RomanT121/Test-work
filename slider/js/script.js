const sliderline = document.querySelector('.slider__line');
const slides = document.querySelectorAll('.slider__item');
const btnleft = document.querySelector('.slider__btn_left');
const btnright = document.querySelector('.slider__btn_right');
const dots = document.querySelectorAll('.dots__item');
const slideWidth = slides[0].offsetWidth;
const firstIndex = 1;
const lastIndex = slides.length;
let controlsIsActive, animationDuration = null;
let currentIndex, currentPosition = null;

function setDotActive(newIndex, prevIndex) {
  if (prevIndex) {
    const prevDot = document.querySelector(`[data-dot-index="${prevIndex}"]`);
    prevDot.classList.remove('dots__item_active');
  }
  const curDot = document.querySelector(`[data-dot-index="${newIndex}"]`);
  curDot.classList.add('dots__item_active');
}

function animateSlide(index, callback) {
  const prevPosition = currentPosition;
  const newPosition = -1 * index * slideWidth;
  const diffPosition = newPosition - prevPosition;
  const startTime = Date.now();

  const timer = setInterval(() => {
    const currentTime = Date.now();
    let timeFraction = (currentTime - startTime) / animationDuration;
    let progress, position = null;

    if (timeFraction >= 1) {
      timeFraction = 1;
      clearInterval(timer);
    }

    progress = 1 - Math.pow(1 - timeFraction, 2);
    position = prevPosition + diffPosition * progress;
    sliderline.style.transform = `translateX(${position}px)`;

    if (timeFraction === 1) {
      callback.call();
    }
  }, 16);
}

function setSlide(index) {
  currentIndex = index;
  currentPosition = -1 * currentIndex * slideWidth;
  sliderline.style.transform = `translateX(${currentPosition}px)`;
}

function changeSlide(index) {
  let newIndex = null;

  if (index > lastIndex) {
    newIndex = firstIndex;
  } 
  else if (index < firstIndex) {
    newIndex = lastIndex;
  } 
  else {
    newIndex = index;
  }

  controlsIsActive = false;
  setDotActive(newIndex, currentIndex);

  animateSlide(index, () => {
    setSlide(newIndex);
    controlsIsActive = true;
  });
}

function onNextSlide() {;
  if (controlsIsActive) {
    changeSlide(currentIndex + 1);
  }
}

function onPrevSlide() {
  if (controlsIsActive) {
    changeSlide(currentIndex - 1);
  }
}

function handleDotClick(event) {
  if (controlsIsActive) {
    const newIndex = Number(event.target.dataset.dotIndex);
    changeSlide(newIndex);
  }
}

function addListeners() {
  btnright.addEventListener('click', onNextSlide);
  btnleft.addEventListener('click', onPrevSlide);
  dots.forEach((dot) => dot.addEventListener('click', handleDotClick));
}

function initSlider() {
  const firstSlideClone = slides[0].cloneNode(true);
  const lastSlideClone = slides[slides.length - 1].cloneNode(true);

  sliderline.prepend(lastSlideClone);
  sliderline.append(firstSlideClone);

  animationDuration = 600;
  controlsIsActive = true;

  setSlide(firstIndex);
  setDotActive(firstIndex);
  addListeners();
}

window.onload = () => initSlider();

