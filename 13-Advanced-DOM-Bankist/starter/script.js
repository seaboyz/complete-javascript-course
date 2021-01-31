
'use strict';

/***********  Elements ***********/
// Modal window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
// sections
const section1 = document.querySelector("#section--1");
// Buttons 
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector(".btn--scroll-to");
const btnsOperationsTab = document.querySelectorAll(".operations__tab");
// Header
const header = document.querySelector(".header");
// Contents
const operationsContents = document.querySelectorAll(".operations__content");
// Nav
const links = document.querySelectorAll;
// slider
const allSides = document.querySelectorAll(".slide");
const slider = document.querySelector(".slider");
const btnSliderLeft =
	document.querySelector(".slider__btn--left");
const btnSliderRight =
	document.querySelector(".slider__btn--right");
const firstSlide =
	allSides[0];
const LastSlide =
	allSides[allSides.length - 1];


/* Event handlers */
function openModal(e)
{
	// keep from jump to the link
	e.preventDefault();
	modal.classList.remove('hidden');
	overlay.classList.remove('hidden');
}

function closeModal()
{
	modal.classList.add('hidden');
	overlay.classList.add('hidden');
};

function smoothScroll(e)
{
	e.preventDefault();
	const id = this.getAttribute("href");
	const target = document.querySelector(`${ id }`);
	target.scrollIntoView({ behavior: "smooth" });
}

function changeNavOpacity(e, opacity)
{
	if (e.target.classList.contains("nav__link"))
	{
		// logo
		e.target
			.closest(".nav")
			.querySelector(".nav__logo")
			.style.opacity = opacity;
		// siblings
		[...e.target.closest(".nav").querySelectorAll(".nav__link")]
			.filter(el => el !== e.target)
			.forEach(el => el.style.opacity = opacity);
	}
}

function changeSiblingsOpacityTo50(e)
{
	changeNavOpacity(e, 0.5);
};

function changeSiblingsOpacityTo100(e)
{
	changeNavOpacity(e, 1);
};

let currentSlide = 0;
const FIRSTSLIDE = 0;
const LASTSLIDE = allSides.length - 1;

function nextSlide()
{
	if (currentSlide === LASTSLIDE) return;
	currentSlide++;
	allSides.forEach((slide, idx) => slide.style.transform = `translateX(${ (idx - currentSlide) * 100 }%)`);
}
function prevSlide()
{
	if (currentSlide === FIRSTSLIDE) return;
	currentSlide--;
	allSides.forEach((slide, idx) => slide.style.transform = `translateX(${ (idx - currentSlide) * 100 }%)`);
}



/* Observers */

const navbarHeight =
	document.querySelector(".nav")
		.getBoundingClientRect()
		.height;
const headerObserver = new IntersectionObserver(
	function stickNav(entries)
	{
		var [entry] = entries;
		if (!entry.isIntersecting)
		{
			document.querySelector(".nav").classList.add("sticky");
		} else
		{
			document.querySelector(".nav").classList.remove("sticky");
		}
	},
	{
		root: null, threshold: 0, rootMargin: `-${ navbarHeight }px`
	});

const sectionObserver = new IntersectionObserver(
	function revealSection([entry], observer)
	{
		if (entry.isIntersecting)
		{
			// make sure only oberve once
			entry.target.classList.remove("section--hidden");
			observer.unobserve(entry.target);
		}
	}, { root: null, threshold: 0.1 }
);

const lazyImgObserver = new IntersectionObserver(
	function loadImg([entry], observer)
	{
		if (entry.isIntersecting)
		{
			entry.target.src = entry.target.dataset.src;
			observer.unobserve(entry.target);
			// remove lazy-img after loading the full size image
			entry.target.addEventListener("load", function ()
			{
				entry.target.classList.remove("lazy-img");
			});

		}
	}, { root: null, threshold: 0 }
);

/***********  Implementation ***********/
// open modal
btnsOpenModal
	.forEach(modal => modal.addEventListener("click", openModal));

// close modal
btnCloseModal
	.addEventListener('click', closeModal);

overlay
	.addEventListener('click', closeModal);

document
	.addEventListener('keydown', function (e)
	{
		if (e.key === 'Escape' && !modal.classList.contains('hidden'))
		{
			closeModal();
		}
	});

// scroll to section1
btnScrollTo
	.addEventListener("click", () => section1.scrollIntoView({ behavior: "smooth" }));

// scroll to each section by clicking each nav links
document.querySelector(".nav__links")
	.addEventListener("click", function (e)
	{
		e.preventDefault();
		if (e.target.classList.contains("nav__link"))
		{
			let id = e.target.getAttribute("href");
			let target = document.querySelector(id);
			target.scrollIntoView({ behavior: "smooth" });
		}
	});;

// show each content by clicking each operation tab
document.querySelector(".operations__tab-container")/* parent el */
	.addEventListener("click", function (e)
	{
		var btnClicked = e.target.closest(".operations__tab");

		if (!btnClicked) return;

		// remove .operations__tab--active from all buttons
		btnsOperationsTab
			.forEach(el => el.classList.remove("operations__tab--active"));

		// add .operations__tab--active to clicked button
		btnClicked.classList.add("operations__tab--active");

		// remove .operations__content--active from all operation contents
		operationsContents
			.forEach(el => el.classList.remove("operations__content--active"));

		// add .operations__content--active to the opertion_content relative to the clicked button
		document.querySelector(`.operations__content--${ btnClicked.dataset.tab }`)
			.classList.add("operations__content--active");



		// let tab = clicked.dataset.tab;

	});

// fade the others when hover one link
document.querySelector(".nav")
	.addEventListener("mouseover", changeSiblingsOpacityTo50);

// resume when hoverout
document.querySelector(".nav")
	.addEventListener("mouseout", changeSiblingsOpacityTo100);

// sticky nav bar
// window.addEventListener("scroll", function (e)
// {

// 	if (section1.getBoundingClientRect().top < 0)
// 	{
// 		document.querySelector(".nav").classList.add("sticky");
// 	} else
// 	{
// 		document.querySelector(".nav").classList.remove("sticky");
// 	}
// });


headerObserver.observe(document.querySelector(".header"));

// reveal section when reach
// hidden all sections

document.querySelectorAll(".section")
	.forEach(section =>
	{
		section.classList.add("section--hidden");
		sectionObserver.observe(section);
	});

// load full size image when scroll
document.querySelectorAll(".features__img")
	.forEach(img => lazyImgObserver.observe(img));

// slider


allSides
	.forEach((slide, idx) =>
		slide.style.transform = `translateX(${ idx * 100 }%)`);

btnSliderLeft
	.addEventListener("click", prevSlide);

btnSliderRight
	.addEventListener("click", nextSlide);
// ********************************






