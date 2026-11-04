(function () {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const url = window.HOF_SUPABASE_URL;
  const key = window.HOF_SUPABASE_PUBLISHABLE_KEY;
  const all = document.getElementById('product-grid');
  const fresh = document.getElementById('new-arrivals-grid');

  function msg(el, text) {
    if (el) el.innerHTML = '<p class="status">' + text + '</p>';
  }

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;',
      '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  if (!url || !key || url.includes('PASTE_') || key.includes('PASTE_')) {
    msg(all, 'Catalogue connection will be activated during setup.');
    msg(fresh, 'New arrivals will appear after setup.');
    return;
  }

  if (!window.supabase) {
    msg(all, 'Catalogue connection could not load.');
    return;
  }

  const db = window.supabase.createClient(url, key);

  // Full-screen product gallery
  const viewer = document.createElement('div');
  viewer.id = 'hof-gallery-viewer';
  viewer.innerHTML = `
    <button class="hof-gallery-close" aria-label="Close gallery">&times;</button>
    <button class="hof-gallery-prev" aria-label="Previous photo">&#10094;</button>
    <img class="hof-gallery-main" alt="Product photo">
    <button class="hof-gallery-next" aria-label="Next photo">&#10095;</button>
    <div class="hof-gallery-counter"></div>
  `;
  document.body.appendChild(viewer);

  const galleryStyle = document.createElement('style');
  galleryStyle.textContent = `
    #hof-gallery-viewer {
      display:none; position:fixed; inset:0; z-index:99999;
      background:rgba(0,0,0,.96); align-items:center;
      justify-content:center; touch-action:pan-y;
    }
    #hof-gallery-viewer.active { display:flex; }
    .hof-gallery-main {
      max-width:88%; max-height:82%; object-fit:contain;
      user-select:none; -webkit-user-drag:none;
    }
    .hof-gallery-close,.hof-gallery-prev,.hof-gallery-next {
      position:absolute; border:0; color:white;
      background:rgba(255,255,255,.14); cursor:pointer;
      width:46px; height:46px; border-radius:50%;
      font-size:25px; display:grid; place-items:center;
    }
    .hof-gallery-close { top:20px; right:20px; font-size:32px; }
    .hof-gallery-prev { left:15px; }
    .hof-gallery-next { right:15px; }
    .hof-gallery-counter {
      position:absolute; bottom:22px; color:white;
      font-size:14px; letter-spacing:1px;
    }
    .hof-product-photo {
      display:block; width:100%; padding:0; border:0;
      background:#f5f5f5; cursor:zoom-in;
    }
    .hof-product-photo img {
      display:block; width:100%; height:100%;
      object-fit:cover;
    }
    @media(max-width:600px) {
      .hof-gallery-main { max-width:92%; max-height:75%; }
      .hof-gallery-prev { left:5px; }
      .hof-gallery-next { right:5px; }
    }
  `;
  document.head.appendChild(galleryStyle);

  let galleryImages = [];
  let galleryIndex = 0;
  let touchStartX = 0;

  const mainImage = viewer.querySelector('.hof-gallery-main');
  const counter = viewer.querySelector('.hof-gallery-counter');

  function showImage(index) {
    if (!galleryImages.length) return;

    galleryIndex = (index + galleryImages.length) % galleryImages.length;
    mainImage.src = galleryImages[galleryIndex];
    counter.textContent = (galleryIndex + 1) + ' / ' + galleryImages.length;
  }

  function openGallery(images, index) {
    galleryImages = images;
    showImage(index);
    viewer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeGallery() {
    viewer.classList.remove('active');
    document.body.style.overflow = '';
    mainImage.removeAttribute('src');
  }

  viewer.querySelector('.hof-gallery-close').addEventListener('click', closeGallery);
  viewer.querySelector('.hof-gallery-prev').addEventListener('click', () => showImage(galleryIndex - 1));
  viewer.querySelector('.hof-gallery-next').addEventListener('click', () => showImage(galleryIndex + 1));

  viewer.addEventListener('click', e => {
    if (e.target === viewer) closeGallery();
  });

  document.addEventListener('keydown', e => {
    if (!viewer.classList.contains('active')) return;
    if (e.key === 'Escape') closeGallery();
    if (e.key === 'ArrowRight') showImage(galleryIndex + 1);
    if (e.key === 'ArrowLeft') showImage(galleryIndex - 1);
  });

  viewer.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  viewer.addEventListener('touchend', e => {
    const difference = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(difference) > 45) {
      showImage(galleryIndex + (difference < 0 ? 1 : -1));
    }
  }, { passive: true });

  function getImages(product) {
    let images = product.images || product.image || [];

    if (typeof images === 'string') {
      try {
        images = JSON.parse(images);
      } catch {
        images = [images];
      }
    }

    if (!Array.isArray(images)) images = [images];

    return images.map(image => {
      if (typeof image === 'object' && image !== null) {
        image = image.url || image.path || '';
      }

      if (!image) return '';

      if (/^https?:\/\//i.test(image)) return image;

      return db.storage.from('product-images').getPublicUrl(image).data.publicUrl;
    }).filter(Boolean);
  }

  function render(element, products) {
    if (!element) return;

    if (!products.length) {
      msg(element, 'No products available yet. Please check back soon.');
      return;
    }

    element.innerHTML = products.map((product, productIndex) => {
      const images = getImages(product);
      const firstImage = images[0] || '';

      return `
        <article class="product-card">
          ${firstImage ? `
            <button class="hof-product-photo"
              type="button"
              data-product="${productIndex}"
              aria-label="View photos of ${esc(product.name)}">
              <img loading="lazy" src="${esc(firstImage)}"
                alt="${esc(product.name)}">
            </button>
          ` : ''}
          <div class="product-info">
            <h3>${esc(product.name)}</h3>
            <p>₦${Number(product.price || 0).toLocaleString('en-NG')}
              / ${esc(product.unit || 'yard')}</p>
            <a href="https://wa.me/2348087674813?text=${encodeURIComponent('Hello HOF, I am interested in ' + product.name)}">
              Enquire on WhatsApp
            </a>
          </div>
        </article>
      `;
    }).join('');

    element.querySelectorAll('.hof-product-photo').forEach(button => {
      button.addEventListener('click', () => {
        const product = products[Number(button.dataset.product)];
        const images = getImages(product);
        openGallery(images, 0);
      });
    });
  }

  db.from('products')
    .select('*')
    .eq('is_available', true)
    .order('created_at', { ascending: false })
    .then(({ data, error }) => {
      if (error) throw error;

      const products = data || [];

      render(all, products);
      render(fresh, products.filter(p => p.is_new_arrival === true));
    })
    .catch(error => {
      console.error(error);
      msg(all, 'Please contact HOF on WhatsApp for our current collection.');
      msg(fresh, 'New arrivals are temporarily unavailable.');
    });
})();
