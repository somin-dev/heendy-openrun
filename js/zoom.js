(function () {
  // 이미지 확대
  var box = document.querySelector('[data-zoom-box]');
  if (box) {
    var img = box.querySelector('img');
    var cap = box.querySelector('.zoom-caption');

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-zoom]');
      if (btn) {
        img.src = btn.getAttribute('data-src');
        img.alt = cap.textContent = btn.getAttribute('data-caption') || '';
        box.hidden = false;
        document.body.style.overflow = 'hidden';
        return;
      }
      if (!box.hidden && (e.target === box || e.target.closest('.zoom-close'))) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !box.hidden) close();
    });

    function close() {
      box.hidden = true;
      document.body.style.overflow = '';
    }
  }

  // 스크롤 화살표 (주소 뒤에 #fr-intro 안 붙게)
  var scrollBtn = document.querySelector('.hero-scroll');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', function (e) {
      var target = document.getElementById('fr-intro');
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  }
})();
