// Page loader
window.addEventListener('load', () => {
  const pageLoader = document.getElementById('pageLoader');
  setTimeout(() => {
    pageLoader.classList.add('hidden');
  }, 1500);
});

// Image loading spinner
function setupImageSpinners() {
  const images = document.querySelectorAll('.loading-image');

  images.forEach(img => {
    const container = img.closest('.image-container');
    const spinner = container.querySelector('.image-spinner-overlay');

    if (img.complete && img.naturalHeight !== 0) {
      // Image already loaded
      img.classList.add('loaded');
      spinner.classList.add('hidden');
    } else {
      // Image not loaded yet
      img.addEventListener('load', () => {
        img.classList.add('loaded');
        setTimeout(() => {
          spinner.classList.add('hidden');
        }, 300);
      });

      img.addEventListener('error', () => {
        // Handle error case
        spinner.classList.add('hidden');
        img.classList.add('loaded');
      });
    }
  });
}

// Initialize image spinners when DOM is loaded
document.addEventListener('DOMContentLoaded', setupImageSpinners);

// Mobile menu toggle
function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('active');
}

// Header scroll effect
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (window.scrollY > 100) {
    header.classList.add('header-scrolled');
  } else {
    header.classList.remove('header-scrolled');
  }
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    document.querySelector('.nav-links').classList.remove('active');
  });
});

// Scroll reveal animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      if (entry.target.closest('.stats')) {
        animateCounters();
      }
    }
  });
}, observerOptions);

document.querySelectorAll('.scroll-reveal').forEach(el => {
  observer.observe(el);
});

// Animated counters
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const increment = target / 100;
    let current = 0;

    const updateCounter = () => {
      if (current < target) {
        current += increment;
        counter.textContent = Math.ceil(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };
    updateCounter();
  });
}

// Form submission
function submitForm(event) {
  event.preventDefault();

  const form = event.target;
  const successMessage = document.getElementById('successMessage');
  const submitBtn = form.querySelector('.submit-btn');
  const originalText = submitBtn.textContent;

  submitBtn.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                    <div class="wine-spinner" style="width: 20px; height: 20px;">
                        <div class="wine-glass" style="font-size: 0.8rem;">🍷</div>
                        <div class="spinner-ring" style="border-width: 2px;"></div>
                    </div>
                    <span>Enviando...</span>
                </div>
            `;
  submitBtn.disabled = true;

  setTimeout(() => {
    successMessage.style.display = 'block';
    form.reset();
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;

    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 5000);
  }, 2000);
}

// Add some interactive elements
document.addEventListener('mousemove', (e) => {
  const cards = document.querySelectorAll('.region-card, .stat-card');
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    } else {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    }
  });
});

// Lazy loading for better performance
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.remove('loading-image');
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}