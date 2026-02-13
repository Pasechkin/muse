/**
 * Muse Calculator Component v1.0
 * Конфигурируемый калькулятор для печати на холсте и портретов.
 *
 * Использование:
 *   <script src="js/calc.js"></script>
 *   <script>
 *     CalcInit({
 *       type: 'canvas',
 *       showProcessing: true,
 *       showUpload: true
 *     });
 *   </script>
 */
(function () {
  'use strict';

  /* ========== DEFAULT DATA ========== */

  var DEFAULT_FRAMES = [
    { id: 'NONE', name: 'Без багета', cat: 'STUDIO', color: 'transparent', width: 0, style: 'flat' },
    { id: 'ST_BLACK_M', name: 'Черный мат', cat: 'STUDIO', color: '#1a1a1a', width: 12, style: 'flat' },
    { id: 'ST_WHITE_M', name: 'Белый мат', cat: 'STUDIO', color: '#ffffff', width: 12, style: 'flat', border: '#e2e8f0' },
    { id: 'ST_GREY', name: 'Серый графит', cat: 'STUDIO', color: '#475569', width: 12, style: 'flat' },
    { id: 'ST_SILVER_S', name: 'Серебро сатин', cat: 'STUDIO', color: '#cbd5e1', width: 10, style: 'metallic' },
    { id: 'ST_GOLD_S', name: 'Золото сатин', cat: 'STUDIO', color: '#eab308', width: 10, style: 'metallic' },
    { id: 'ST_BLUE_DP', name: 'Синий дип', cat: 'STUDIO', color: '#1e3a8a', width: 15, style: 'flat' },
    { id: 'ST_RED_BR', name: 'Красный кирпич', cat: 'STUDIO', color: '#991b1b', width: 15, style: 'flat' },
    { id: 'ST_BEIGE', name: 'Бежевый', cat: 'STUDIO', color: '#f5f5dc', width: 12, style: 'flat', border: '#d6d3d1' },
    { id: 'ST_ALU_BLK', name: 'Алюм. черный', cat: 'STUDIO', color: '#000', width: 5, style: 'metallic' },
    { id: 'ST_ALU_SIL', name: 'Алюм. серебро', cat: 'STUDIO', color: '#94a3b8', width: 5, style: 'metallic' },
    { id: 'ST_ALU_GLD', name: 'Алюм. золото', cat: 'STUDIO', color: '#ca8a04', width: 5, style: 'metallic' },
    { id: 'ST_WENGE', name: 'Венге', cat: 'STUDIO', color: '#3f2e26', width: 14, style: 'wood' },
    { id: 'ST_OAK_L', name: 'Светлый дуб', cat: 'STUDIO', color: '#d4a373', width: 14, style: 'wood' },
    { id: 'ST_WALNUT', name: 'Орех', cat: 'STUDIO', color: '#5D4037', width: 14, style: 'wood' },
    { id: 'CL_GOLD_ORN', name: 'Золото узор', cat: 'CLASSIC', color: '#d4af37', width: 40, style: 'ornate_gold' },
    { id: 'CL_SILV_ORN', name: 'Серебро узор', cat: 'CLASSIC', color: '#c0c0c0', width: 40, style: 'ornate_silver' },
    { id: 'CL_MAHOGANY', name: 'Махагон', cat: 'CLASSIC', color: '#4a0404', width: 35, style: 'wood_gloss' },
    { id: 'CL_VINT_WHT', name: 'Винтаж белый', cat: 'CLASSIC', color: '#f0f0f0', width: 30, style: 'shabby' },
    { id: 'CL_BRONZE', name: 'Бронза антик', cat: 'CLASSIC', color: '#cd7f32', width: 35, style: 'metallic' },
    { id: 'CL_BLK_GLD', name: 'Черный с золотом', cat: 'CLASSIC', color: '#1a1a1a', width: 45, style: 'ornate_gold_inner' },
    { id: 'CL_ITALY_WD', name: 'Итал. орех', cat: 'CLASSIC', color: '#654321', width: 50, style: 'wood_carved' },
    { id: 'CL_PROVANCE', name: 'Прованс', cat: 'CLASSIC', color: '#e5e7eb', width: 25, style: 'shabby' },
    { id: 'CL_GOLD_LG', name: 'Золото широкое', cat: 'CLASSIC', color: '#ffd700', width: 60, style: 'ornate_gold' },
    { id: 'CL_SILV_LG', name: 'Серебро широкое', cat: 'CLASSIC', color: '#e2e8f0', width: 60, style: 'ornate_silver' },
    { id: 'CL_CHERRY', name: 'Вишня', cat: 'CLASSIC', color: '#722F37', width: 30, style: 'wood' },
    { id: 'CL_PINE', name: 'Сосна лак', cat: 'CLASSIC', color: '#E3C08D', width: 25, style: 'wood' }
  ];

  var DEFAULT_INTERIORS = [
    { id: 'GIRL', name: 'Интерьер', url: 'https://muse.ooo/upload/imgsite/canvas-628-398.webp', top: '18%', right: '18%', origin: 'top right' }
  ];

  var DEFAULT_SIZE_PRESETS = {
    PORTRAIT:  [{ w: 30, h: 40 }, { w: 40, h: 60 }, { w: 50, h: 70 }, { w: 60, h: 90 }],
    LANDSCAPE: [{ w: 40, h: 30 }, { w: 60, h: 40 }, { w: 70, h: 50 }, { w: 90, h: 60 }],
    SQUARE:    [{ w: 40, h: 40 }, { w: 50, h: 50 }, { w: 60, h: 60 }, { w: 70, h: 70 }]
  };

  var MOBILE_SIZE_PRESETS = [
    { w: 20, h: 30 },
    { w: 30, h: 45 },
    { w: 40, h: 50 },
    { w: 50, h: 75 },
    { w: 60, h: 80 },
    { w: 90, h: 120 },
    { w: 30, h: 30 }
  ];

  var DESKTOP_EXTRA_SIZE_PRESETS = [
    { w: 20, h: 30 },
    { w: 30, h: 45 },
    { w: 40, h: 50 },
    { w: 50, h: 75 },
    { w: 60, h: 80 },
    { w: 90, h: 120 },
    { w: 30, h: 30 }
  ];

  var DEFAULT_PRICES = {
    canvasPerSqM: 2500,
    stretcherPerM: 500,
    varnishPerSqM: 800,
    giftWrapFixed: 450,
    noFrameDiscount: 0.8,
    framePerM: 1200,
    gallerySurchargePerM: 300
  };

  /* ========== PUBLIC API ========== */

  window.CalcInit = function (cfg) {
    cfg = cfg || {};

    /* --- Data (overridable via config) --- */
    var FRAMES_DB    = cfg.frames      || DEFAULT_FRAMES;
    var INTERIORS_DB = cfg.interiors   || DEFAULT_INTERIORS;
    var SIZE_PRESETS  = cfg.sizePresets || DEFAULT_SIZE_PRESETS;
    var PRICES        = cfg.prices     || DEFAULT_PRICES;

    /* --- Feature flags --- */
    var showProcessing  = cfg.showProcessing !== false;
    var showUpload      = cfg.showUpload !== false;
    var showFaces       = !!cfg.showFaces;
    var showGel         = !!cfg.showGel;
    var showAcrylic     = !!cfg.showAcrylic;
    var showOil         = !!cfg.showOil;
    var showPotal       = !!cfg.showPotal;
    var showDigitalOnly = !!cfg.showDigitalOnly;
    var showTooltips    = !!cfg.showTooltips;

    /* --- Internal state --- */
    var STATE = {
      w: 20, h: 30, wrap: 'STANDARD', varnish: true, gift: false,
      image: null, frame: 'NONE', orientation: 'PORTRAIT',
      interior: 'GIRL', processing: 0, customSizeMode: false,
      images: []
    };

    var uploaderInstance = null;

    var tempFrameState = 'NONE';
    var getEl = function (id) { return document.getElementById(id); };

    function isMobileViewport() {
      return window.matchMedia('(max-width: 1023px)').matches;
    }

    function getCurrentSizePresetList() {
      if (isMobileViewport()) return MOBILE_SIZE_PRESETS;
      return SIZE_PRESETS[STATE.orientation] || SIZE_PRESETS['PORTRAIT'];
    }

    function isCurrentSizePreset(presetList) {
      return presetList.some(function (preset) {
        return preset.w === STATE.w && preset.h === STATE.h;
      });
    }

    function setCustomSizeInputsVisibility(show) {
      var sizeInputsRow = getEl('size-inputs-row');
      if (!sizeInputsRow) return;
      if (isMobileViewport()) {
        sizeInputsRow.classList.toggle('hidden', !show);
        sizeInputsRow.classList.toggle('flex', !!show);
      } else {
        sizeInputsRow.classList.remove('flex');
        sizeInputsRow.classList.remove('hidden');
        sizeInputsRow.classList.add('lg:flex');
      }
    }

    /* ---------- Feature flag UI ---------- */

    function applyFeatureFlags() {
      toggle('calc-processing-section', showProcessing);
      toggle('calc-upload-section', showUpload);
      toggle('calc-faces-section', showFaces);
      toggle('calc-gel-section', showGel);
      toggle('calc-acrylic-section', showAcrylic);
      toggle('calc-oil-section', showOil);
      toggle('calc-potal-section', showPotal);
      toggle('calc-digital-section', showDigitalOnly);

      function toggle(id, show) {
        var el = getEl(id);
        if (el) el.classList.toggle('hidden', !show);
      }
    }

    /* ---------- Interiors ---------- */

    function renderInteriors() {
      var container = getEl('interiors-list');
      if (!container) return;
      container.innerHTML = '';
      INTERIORS_DB.forEach(function (room) {
        var el = document.createElement('div');
        el.className = 'interior-thumb' + (room.id === STATE.interior ? ' active' : '');
        el.innerHTML = '<img src="' + room.url + '" alt="' + room.name + '" title="' + room.name + '">';
        el.onclick = function () {
          STATE.interior = room.id;
          renderInteriors();
          updateUI(null);
        };
        container.appendChild(el);
      });
    }

    /* ---------- Order form ---------- */

    function initOrderForm() {
      var handleOrder = function (e) {
        e.preventDefault();
        var nameInp = getEl('client-name');
        var phoneInp = getEl('client-phone');
        var isValid = true;

        if (!nameInp.value.trim()) { nameInp.classList.add('error'); isValid = false; }
        else { nameInp.classList.remove('error'); }

        if (!phoneInp.value.trim() || phoneInp.value.length < 16) { phoneInp.classList.add('error'); isValid = false; }
        else { phoneInp.classList.remove('error'); }

        if (!isValid) {
          document.getElementById('order-form-container').scrollIntoView({ behavior: 'smooth' });
          return;
        }

        var orderData = {
          client: {
            name: nameInp.value,
            phone: phoneInp.value,
            email: getEl('client-email').value,
            link: getEl('client-link').value,
            comment: getEl('client-comment').value
          },
          product: {
            width: STATE.w, height: STATE.h, wrap: STATE.wrap,
            frame: STATE.frame, varnish: STATE.varnish, gift: STATE.gift,
            interior: STATE.interior, processing: STATE.processing
          },
          totalPrice: getEl('total-price').textContent
        };

        console.log('Заказ отправлен:', orderData);
        alert('Спасибо! Ваш заказ оформлен. Мы свяжемся с вами в ближайшее время.');
      };

      var btnSubmit = getEl('btn-submit-order');
      if (btnSubmit) btnSubmit.addEventListener('click', handleOrder);

      var btnSticky = getEl('btn-sticky-order');
      if (btnSticky) {
        btnSticky.addEventListener('click', function () {
          document.getElementById('order-form-container').scrollIntoView({ behavior: 'smooth' });
        });
      }
    }

    /* ---------- Frame catalog ---------- */

    function renderFrameCatalog() {
      var studioContainer = getEl('frames-grid-studio');
      var classicContainer = getEl('frames-grid-classic');
      if (!studioContainer || !classicContainer) return;
      studioContainer.innerHTML = '';
      classicContainer.innerHTML = '';

      var aspectRatioStyle = (STATE.w && STATE.h) ? 'aspect-ratio: ' + STATE.w + '/' + STATE.h : 'aspect-ratio: 1/1';

      FRAMES_DB.forEach(function (frame) {
        var el = document.createElement('div');
        el.className = 'frame-option group relative cursor-pointer flex flex-col items-center gap-2 p-2 rounded-xl border-2 border-transparent hover:bg-slate-100 transition';
        el.dataset.id = frame.id;

        var borderStyle = (frame.width > 0 ? '8px' : '0') + ' solid ' + frame.color;
        var styleCSS = '';
        if (frame.id === 'NONE') {
          styleCSS = 'background-color: #f1f5f9; border: 1px dashed #cbd5e1;';
          borderStyle = 'none';
        }

        var noFrameIcon = frame.id === 'NONE'
          ? '<div class="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">' +
              '<div class="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-[2px]">' +
                '<svg class="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"></path></svg>' +
              '</div>' +
            '</div>'
          : '';

        el.innerHTML =
          '<div class="relative w-full rounded-lg shadow-sm overflow-hidden bg-white frame-preview-box" style="' + aspectRatioStyle + '">' +
            '<div class="w-full h-full box-border relative z-10" style="border: ' + borderStyle + '; ' + styleCSS + ' transition: border 0.2s;">' +
              '<div class="w-full h-full bg-cover bg-center frame-image-preview" style="background-color: #f1f5f9;"></div>' +
            '</div>' +
            noFrameIcon +
          '</div>' +
          '<span class="text-[10px] font-bold text-slate-600 text-center leading-tight group-hover:text-primary transition">' + frame.name + '</span>' +
          '<button class="zoom-btn absolute top-3 right-3 w-6 h-6 bg-white/90 rounded-full shadow-md flex items-center justify-center text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary hover:bg-white z-30" title="Смотреть крупно" data-frame-id="' + frame.id + '">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>' +
          '</button>';

        el.addEventListener('click', function (e) {
          if (e.target.closest('.zoom-btn')) return;
          handleFrameClickInModal(frame.id);
        });

        var zoomBtn = el.querySelector('.zoom-btn');
        if (zoomBtn) {
          zoomBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (!STATE.image) { if (uploaderInstance) uploaderInstance.openFilePicker(); return; }
            openLightbox(frame.id);
          });
        }

        if (frame.cat === 'STUDIO' || frame.id === 'NONE') {
          studioContainer.appendChild(el);
        } else {
          classicContainer.appendChild(el);
        }
      });

      updateModalPreviews();
    }

    /* ---------- Main init ---------- */

    function initMain() {
      var els = {
        inpW: getEl('inp-w'),
        inpH: getEl('inp-h'),
        lblW: getEl('lbl-w'),
        lblH: getEl('lbl-h'),
        canvas: getEl('preview-canvas'),
        priceTotal: getEl('total-price'),
        priceOld: getEl('old-price'),
        priceSize: getEl('price-size'),
        priceVarnish: getEl('price-varnish'),
        priceGift: getEl('price-gift'),
        priceFrame: getEl('price-frame'),
        selectedFrameText: getEl('selected-frame-text'),
        stickyTotal: getEl('sticky-total-price'),
        stickyOld: getEl('sticky-old-price'),
        wrapBtns: document.querySelectorAll('.wrap-btn'),
        frameSection: getEl('frame-section'),
        frameModal: getEl('frame-modal'),
        closeFrameModal: getEl('close-frame-modal'),
        cancelFrame: getEl('cancel-frame-selection'),
        applyFrame: getEl('apply-frame-selection'),
        modalUploadBtn: getEl('modal-upload-btn'),
        processingSelect: getEl('processing-select'),
        toggleVarnish: getEl('toggle-varnish'),
        toggleGift: getEl('toggle-gift'),
        badgeWrap: getEl('badge-wrap'),
        badgeProcessing: getEl('badge-processing')
      };

      if (els.toggleVarnish) els.toggleVarnish.checked = STATE.varnish;
      if (els.toggleGift) els.toggleGift.checked = STATE.gift;

      var calcMainLayout = getEl('calc-main-layout');
      var sizeInputsRow = getEl('size-inputs-row');
      var sizeSection = getEl('size-section');
      var previewColumn = getEl('calc-preview-column');

      function isSizeInputFocused() {
        return document.activeElement === els.inpW || document.activeElement === els.inpH;
      }

      function liftCalcToTop(smooth) {
        if (!isMobileViewport()) return;
        var anchor = sizeSection || sizeInputsRow || calcMainLayout || getEl('calc-main-layout');
        if (!anchor) return;
        var targetTop = Math.max(0, anchor.getBoundingClientRect().top + window.scrollY - 12);
        window.scrollTo({ top: targetTop, behavior: smooth ? 'smooth' : 'auto' });
      }

      function setPreviewStickyEditingMode(enabled) {
        if (!previewColumn || !isMobileViewport()) return;
        if (enabled) {
          previewColumn.classList.remove('sticky', 'top-0', 'z-40');
        } else {
          previewColumn.classList.add('sticky', 'top-0', 'z-40');
        }
      }

      function applyKeyboardCompensation() {
        if (!isMobileViewport()) {
          if (calcMainLayout) calcMainLayout.style.paddingBottom = '';
          if (sizeInputsRow) sizeInputsRow.style.transition = '';
          return;
        }

        var kbHeight = 0;
        if (window.visualViewport) {
          kbHeight = Math.max(0, Math.round(window.innerHeight - window.visualViewport.height));
        }

        if (isSizeInputFocused() && kbHeight > 0) {
          if (calcMainLayout) {
            calcMainLayout.style.paddingBottom = 'calc(' + kbHeight + 'px + env(safe-area-inset-bottom))';
          }
          if (sizeInputsRow) sizeInputsRow.style.transition = '';
        } else {
          if (calcMainLayout) calcMainLayout.style.paddingBottom = '';
          if (sizeInputsRow) sizeInputsRow.style.transition = '';
        }
      }

      function onSizeInputFocus() {
        if (!isMobileViewport()) return;
        setPreviewStickyEditingMode(true);
        setTimeout(function () {
          liftCalcToTop(true);
          applyKeyboardCompensation();
        }, 40);
      }

      function onSizeInputBlur() {
        setTimeout(function () {
          if (!isSizeInputFocused()) {
            setPreviewStickyEditingMode(false);
            if (isMobileViewport() && STATE.customSizeMode) {
              setCustomSizeInputsVisibility(true);
            }
            applyKeyboardCompensation();
          }
        }, 80);
      }

      var onDimChange = function () {
        STATE.w = Math.max(20, Math.min(200, parseInt(els.inpW.value) || 0));
        STATE.h = Math.max(20, Math.min(200, parseInt(els.inpH.value) || 0));
        if (isMobileViewport()) STATE.customSizeMode = true;
        renderFrameCatalog();
        updateUI(els);
      };

      if (els.inpW) els.inpW.addEventListener('input', onDimChange);
      if (els.inpH) els.inpH.addEventListener('input', onDimChange);

      if (els.inpW) {
        els.inpW.addEventListener('focus', onSizeInputFocus);
        els.inpW.addEventListener('blur', onSizeInputBlur);
      }
      if (els.inpH) {
        els.inpH.addEventListener('focus', onSizeInputFocus);
        els.inpH.addEventListener('blur', onSizeInputBlur);
      }

      if (els.inpW) {
        els.inpW.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (els.inpH) els.inpH.focus();
          }
        });
      }

      if (els.inpH) {
        els.inpH.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            els.inpH.blur();
          }
        });
      }

      window.addEventListener('resize', function () {
        renderSizePresets();
        if (!isMobileViewport()) {
          setCustomSizeInputsVisibility(true);
          setPreviewStickyEditingMode(false);
        } else if (isSizeInputFocused()) {
          liftCalcToTop(false);
        }
        applyKeyboardCompensation();
      });

      if (window.visualViewport) {
        var onViewportShift = function () {
          if (isSizeInputFocused()) {
            liftCalcToTop(false);
          }
          applyKeyboardCompensation();
        };
        window.visualViewport.addEventListener('resize', onViewportShift);
        window.visualViewport.addEventListener('scroll', onViewportShift);
      }

      var extraTrack = getEl('size-extra-presets-track');

      if (extraTrack) {
        extraTrack.addEventListener('wheel', function (e) {
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            extraTrack.scrollBy({ left: e.deltaY, behavior: 'smooth' });
          }
        }, { passive: false });
      }

      if (els.wrapBtns) {
        els.wrapBtns.forEach(function (btn) {
          btn.addEventListener('click', function () {
            STATE.wrap = btn.dataset.val;
            updateUI(els);
          });
        });
      }

      if (els.toggleVarnish) {
        els.toggleVarnish.addEventListener('change', function (e) {
          STATE.varnish = e.target.checked;
          updateUI(els);
        });
      }

      if (els.toggleGift) {
        els.toggleGift.addEventListener('change', function (e) {
          STATE.gift = e.target.checked;
          updateUI(els);
        });
      }

      if (els.processingSelect) {
        els.processingSelect.addEventListener('change', function (e) {
          STATE.processing = parseInt(e.target.value);
          updateUI(els);
        });
      }

      /* --- MuseUploader integration --- */
      if (typeof MuseUploader === 'function') {
        uploaderInstance = MuseUploader({
          maxFiles: cfg.maxFiles || 20,
          dropZoneSelector: '#uploader-zone',
          thumbnailsSelector: '#uploader-thumbnails',
          fileInputSelector: '#file-upload',
          alertSelector: '#uploader-alert',
          uploadBtnSelector: '#btn-upload-empty',
          statusSelector: '#uploader-status',
          enableDragDrop: true,
          onImagesChange: function (imgs) {
            STATE.images = imgs;
          },
          onActiveImageChange: function (img) {
            if (img) {
              STATE.image = img.dataUrl;
              var ratio = img.width / img.height;
              var newOrientation = 'SQUARE';
              if (ratio > 1.05) newOrientation = 'LANDSCAPE';
              else if (ratio < 0.95) newOrientation = 'PORTRAIT';

              // Swap dimensions if orientation changed
              if (newOrientation !== STATE.orientation) {
                var currentIsLandscape = STATE.w > STATE.h;
                var currentIsPortrait = STATE.h > STATE.w;
                if (newOrientation === 'LANDSCAPE' && currentIsPortrait) {
                  var tmp = STATE.w; STATE.w = STATE.h; STATE.h = tmp;
                } else if (newOrientation === 'PORTRAIT' && currentIsLandscape) {
                  var tmp2 = STATE.w; STATE.w = STATE.h; STATE.h = tmp2;
                } else if (newOrientation === 'SQUARE' && STATE.w !== STATE.h) {
                  var val = Math.max(STATE.w, STATE.h); STATE.w = val; STATE.h = val;
                }
                STATE.orientation = newOrientation;
                getEl('inp-w').value = STATE.w;
                getEl('inp-h').value = STATE.h;
                renderSizePresets();
                renderFrameCatalog();
              }
            } else {
              STATE.image = null;
            }
            updateUI(els);
          }
        });
      }

      if (els.canvas) {
        els.canvas.addEventListener('click', function () {
          if (STATE.image) openLightbox(STATE.frame);
          else if (uploaderInstance) uploaderInstance.openFilePicker();
        });
      }

      if (els.frameSection && els.frameModal) {
        els.frameSection.addEventListener('click', function () {
          els.frameModal.classList.remove('hidden');
          els.frameModal.classList.add('flex');
          tempFrameState = STATE.frame;
          highlightSelectedFrameInModal(tempFrameState);
          updateModalPreviews();
        });

        var closeModal = function () {
          els.frameModal.classList.remove('flex');
          els.frameModal.classList.add('hidden');
          tempFrameState = STATE.frame;
        };

        if (els.closeFrameModal) {
          els.closeFrameModal.addEventListener('click', function (e) {
            e.stopPropagation();
            closeModal();
          });
        }
        if (els.cancelFrame) els.cancelFrame.addEventListener('click', closeModal);

        els.frameModal.addEventListener('click', function (e) {
          if (e.target === els.frameModal) closeModal();
        });

        if (els.modalUploadBtn) {
          els.modalUploadBtn.addEventListener('click', function () {
            if (uploaderInstance) uploaderInstance.openFilePicker();
          });
        }

        if (els.applyFrame) {
          els.applyFrame.addEventListener('click', function () {
            STATE.frame = tempFrameState;
            updateUI(els);
            closeModal();
          });
        }
      }

      updateUI(els);
    }

    /* ---------- Size presets ---------- */

    function renderSizePresets() {
      var container = getEl('size-presets-grid');
      if (!container) return;
      container.innerHTML = '';
      var currentPresets = getCurrentSizePresetList();
      var hasPresetMatch = isCurrentSizePreset(currentPresets);

      currentPresets.forEach(function (preset) {
        var btn = document.createElement('button');
        var isActive = preset.w === STATE.w && preset.h === STATE.h;
        btn.className = isActive
          ? 'size-btn shrink-0 px-3 py-1.5 rounded border border-primary bg-blue-50 text-xs font-bold text-primary transition'
          : 'size-btn shrink-0 px-3 py-1.5 rounded border border-slate-200 bg-slate-100 text-xs font-medium text-slate-700 hover:bg-slate-200 transition';
        btn.textContent = preset.w + '×' + preset.h;
        btn.onclick = function () {
          STATE.w = preset.w;
          STATE.h = preset.h;
          STATE.customSizeMode = false;
          getEl('inp-w').value = STATE.w;
          getEl('inp-h').value = STATE.h;
          setCustomSizeInputsVisibility(false);
          renderFrameCatalog();
          updateUI(null);
          renderSizePresets();
        };
        container.appendChild(btn);
      });

      if (isMobileViewport()) {
        var customBtn = document.createElement('button');
        customBtn.type = 'button';
        var customActive = STATE.customSizeMode || !hasPresetMatch;
        customBtn.className = customActive
          ? 'size-btn shrink-0 px-3 py-1.5 rounded border border-primary bg-blue-50 text-xs font-bold text-primary transition'
          : 'size-btn shrink-0 px-3 py-1.5 rounded border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-100 transition';
        customBtn.textContent = 'Свой размер';
        customBtn.onclick = function () {
          STATE.customSizeMode = true;
          setCustomSizeInputsVisibility(true);
          customBtn.className = 'size-btn shrink-0 px-3 py-1.5 rounded border border-primary bg-blue-50 text-xs font-bold text-primary transition';
          var inpW = getEl('inp-w');
          if (inpW) inpW.focus();
        };
        container.appendChild(customBtn);
        setCustomSizeInputsVisibility(STATE.customSizeMode || !hasPresetMatch);
      } else {
        STATE.customSizeMode = false;
        setCustomSizeInputsVisibility(true);
        renderDesktopSizeScroller();
      }
    }

    function renderDesktopSizeScroller() {
      var track = getEl('size-extra-presets-track');
      if (!track) return;
      track.innerHTML = '';

      var currentPresets = SIZE_PRESETS[STATE.orientation] || SIZE_PRESETS['PORTRAIT'];
      var allPresets = currentPresets.concat(DESKTOP_EXTRA_SIZE_PRESETS);
      var uniquePresets = [];
      allPresets.forEach(function (preset) {
        var exists = uniquePresets.some(function (item) {
          return item.w === preset.w && item.h === preset.h;
        });
        if (!exists) uniquePresets.push(preset);
      });

      uniquePresets.forEach(function (preset) {
        var btn = document.createElement('button');
        btn.type = 'button';
        var isActive = preset.w === STATE.w && preset.h === STATE.h;
        btn.className = isActive
          ? 'size-btn shrink-0 px-3 py-1.5 rounded border border-primary bg-blue-50 text-xs font-bold text-primary transition'
          : 'size-btn shrink-0 px-3 py-1.5 rounded border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-100 transition';
        btn.textContent = preset.w + '×' + preset.h;
        btn.onclick = function () {
          STATE.w = preset.w;
          STATE.h = preset.h;
          getEl('inp-w').value = STATE.w;
          getEl('inp-h').value = STATE.h;
          renderFrameCatalog();
          updateUI(null);
          renderSizePresets();
        };
        track.appendChild(btn);
      });
    }

    /* ---------- Lightbox ---------- */

    function initLightbox() {
      var lightbox = getEl('lightbox');
      var closeBtn = getEl('lightbox-close');
      var closeAction = function () {
        lightbox.style.opacity = '0';
        setTimeout(function () {
          lightbox.classList.add('hidden');
          lightbox.classList.remove('flex');
        }, 300);
      };
      if (closeBtn) {
        closeBtn.onclick = function (e) {
          e.preventDefault();
          e.stopPropagation();
          closeAction();
        };
      }
      if (lightbox) {
        lightbox.onclick = function (e) {
          if (e.target === lightbox) closeAction();
        };
      }
    }

    function openLightbox(frameIdToPreview) {
      var lightbox = getEl('lightbox');
      var content = getEl('lightbox-content');
      if (!lightbox || !content || !STATE.image) return;
      content.innerHTML = '';

      var vpW = window.innerWidth * 0.9;
      var vpH = window.innerHeight * 0.9;
      var ratio = STATE.w / STATE.h;
      var finalW, finalH;
      if (vpW / ratio <= vpH) { finalW = vpW; finalH = vpW / ratio; }
      else { finalH = vpH; finalW = vpH * ratio; }

      var div = document.createElement('div');
      div.style.width = finalW + 'px';
      div.style.height = finalH + 'px';
      div.style.backgroundClip = 'border-box';
      div.style.backgroundOrigin = 'border-box';
      div.style.backgroundImage = 'url(' + STATE.image + ')';
      div.style.backgroundSize = 'cover';
      div.style.backgroundPosition = 'center';
      div.style.boxShadow = '0 20px 50px rgba(0,0,0,0.5)';

      var f = FRAMES_DB.find(function (x) { return x.id === frameIdToPreview; }) || FRAMES_DB[0];
      var scaleFactor = finalW / (STATE.w * 4);
      var sf = Math.max(1, scaleFactor);

      if (frameIdToPreview !== 'NONE') {
        div.style.boxSizing = 'border-box';
        div.style.border = (f.width * sf) + 'px solid ' + f.color;
        div.style.backgroundClip = 'padding-box';
        div.style.backgroundOrigin = 'padding-box';
        if (f.border) div.style.outline = (1 * sf) + 'px solid ' + f.border;
        if (f.style === 'ornate_gold') {
          div.style.borderImage = 'linear-gradient(to bottom right, #bf953f, #fcf6ba, #b38728, #fbf5b7) 1';
          div.style.borderColor = '#d4af37';
        }
      } else if (STATE.wrap === 'NO_FRAME') {
        div.style.boxShadow = 'none';
      }

      content.appendChild(div);
      lightbox.classList.remove('hidden');
      lightbox.classList.add('flex');
      requestAnimationFrame(function () {
        lightbox.style.opacity = '1';
        content.classList.remove('lightbox-enter');
        content.classList.add('lightbox-enter-active');
      });
    }

    /* ---------- Frame selection in modal ---------- */

    function handleFrameClickInModal(frameId) {
      tempFrameState = frameId;
      highlightSelectedFrameInModal(frameId);
      if (!STATE.image && uploaderInstance) { uploaderInstance.openFilePicker(); }
    }

    function highlightSelectedFrameInModal(id) {
      var allOptions = document.querySelectorAll('.frame-option');
      allOptions.forEach(function (opt) {
        if (opt.dataset.id === id) {
          opt.classList.add('border-primary', 'bg-blue-50');
          opt.classList.remove('border-transparent');
        } else {
          opt.classList.remove('border-primary', 'bg-blue-50');
          opt.classList.add('border-transparent');
        }
      });
    }

    function updateModalPreviews() {
      var previews = document.querySelectorAll('.frame-image-preview');
      var cta = getEl('frame-upload-cta');
      if (STATE.image) {
        if (cta) cta.style.display = 'none';
        previews.forEach(function (div) {
          div.style.backgroundImage = 'url(' + STATE.image + ')';
          div.style.backgroundColor = 'transparent';
        });
      } else {
        if (cta) cta.style.display = 'block';
        previews.forEach(function (div) {
          div.style.backgroundImage = 'none';
          div.style.backgroundColor = '#f1f5f9';
        });
      }
    }

    /* ---------- Price calculation ---------- */

    function calculate() {
      var area = (STATE.w * STATE.h) / 10000;
      var perimeter = (STATE.w + STATE.h) * 2 / 100;
      var base = area * PRICES.canvasPerSqM;
      var stretcher = perimeter * PRICES.stretcherPerM;

      if (STATE.wrap === 'NO_FRAME') {
        stretcher = 0;
        base *= PRICES.noFrameDiscount;
      }

      var gallerySurcharge = (STATE.wrap === 'GALLERY') ? perimeter * PRICES.gallerySurchargePerM : 0;

      var varnish = STATE.varnish ? area * PRICES.varnishPerSqM : 0;
      var gift = STATE.gift ? PRICES.giftWrapFixed : 0;

      var currentFrameObj = FRAMES_DB.find(function (f) { return f.id === STATE.frame; }) || FRAMES_DB[0];
      var frameMultiplier = 1;
      if (currentFrameObj.cat === 'CLASSIC') frameMultiplier = 1.5;
      var frameCost = (STATE.frame !== 'NONE') ? (perimeter * PRICES.framePerM * frameMultiplier) : 0;

      var total = Math.ceil(base + stretcher + gallerySurcharge + varnish + gift + frameCost + STATE.processing);

      return {
        total: total,
        sizeCost: Math.ceil(base + stretcher),
        gallerySurcharge: Math.ceil(gallerySurcharge),
        processingCost: STATE.processing,
        varnishCost: Math.ceil(varnish),
        giftCost: Math.ceil(gift),
        frameCost: Math.ceil(frameCost)
      };
    }

    /* ---------- UI update ---------- */

    function updateUI(els) {
      if (!els) {
        els = {
          inpW: getEl('inp-w'), inpH: getEl('inp-h'),
          lblW: getEl('lbl-w'), lblH: getEl('lbl-h'),
          canvas: getEl('preview-canvas'),
          priceTotal: getEl('total-price'), priceOld: getEl('old-price'),
          priceSize: getEl('price-size'), priceVarnish: getEl('price-varnish'),
          priceGift: getEl('price-gift'), priceFrame: getEl('price-frame'),
          selectedFrameText: getEl('selected-frame-text'),
          stickyTotal: getEl('sticky-total-price'),
          stickyOld: getEl('sticky-old-price'),
          wrapBtns: document.querySelectorAll('.wrap-btn'),
          processingSelect: getEl('processing-select'),
          badgeWrap: getEl('badge-wrap'),
          badgeProcessing: getEl('badge-processing')
        };
      }

      /* Interior background */
      var roomData = INTERIORS_DB.find(function (r) { return r.id === STATE.interior; }) || INTERIORS_DB[0];
      var roomBg = document.querySelector('.room-bg');
      if (roomBg) roomBg.style.backgroundImage = "url('" + roomData.url + "')";

      if (els.canvas) {
        els.canvas.style.top = roomData.top;
        els.canvas.style.right = roomData.right;
        els.canvas.style.transformOrigin = roomData.origin;
        els.canvas.style.translate = roomData.translate || '0 0';
        if (STATE.wrap === 'GALLERY') els.canvas.classList.add('gallery-3d');
        else els.canvas.classList.remove('gallery-3d');
      }

      /* Prices */
      var costs = calculate();
      if (els.priceTotal) els.priceTotal.textContent = costs.total.toLocaleString();
      if (els.stickyTotal) els.stickyTotal.textContent = costs.total.toLocaleString() + ' ₽';

      if (els.priceOld) {
        var fakeOldPrice = Math.round(costs.total / 0.8 / 10) * 10;
        els.priceOld.textContent = fakeOldPrice.toLocaleString();
        if (els.stickyOld) els.stickyOld.textContent = fakeOldPrice.toLocaleString() + ' ₽';
      }

      if (els.priceSize) els.priceSize.textContent = costs.sizeCost > 0 ? costs.sizeCost + ' ₽' : '0 ₽';

      if (els.priceVarnish) {
        els.priceVarnish.textContent = costs.varnishCost > 0 ? costs.varnishCost + ' ₽' : '0 ₽';
        els.priceVarnish.className = costs.varnishCost > 0
          ? 'text-xs font-bold text-primary normal-case'
          : 'text-xs font-bold text-slate-500 normal-case';
      }
      if (els.priceGift) {
        els.priceGift.textContent = costs.giftCost > 0 ? costs.giftCost + ' ₽' : '0 ₽';
        els.priceGift.className = costs.giftCost > 0
          ? 'text-xs font-bold text-primary normal-case'
          : 'text-xs font-bold text-slate-500 normal-case';
      }
      if (els.priceFrame) {
        els.priceFrame.textContent = costs.frameCost > 0 ? costs.frameCost + ' ₽' : '0 ₽';
        els.priceFrame.className = costs.frameCost > 0
          ? 'text-xs font-bold text-primary normal-case'
          : 'text-xs font-bold text-slate-500 normal-case';
      }

      /* Wrap badge */
      if (els.badgeWrap) {
        if (costs.gallerySurcharge > 0) {
          els.badgeWrap.textContent = '+' + costs.gallerySurcharge.toLocaleString() + ' ₽';
          els.badgeWrap.className = 'text-primary text-[10px] font-bold bg-blue-50 px-2 py-0.5 rounded';
        } else {
          els.badgeWrap.textContent = 'ВКЛЮЧЕНО';
          els.badgeWrap.className = 'text-primary text-[10px] font-bold bg-blue-50 px-2 py-0.5 rounded';
        }
      }

      /* Processing badge */
      if (els.badgeProcessing) {
        if (costs.processingCost > 0) {
          els.badgeProcessing.textContent = '+' + costs.processingCost.toLocaleString() + ' ₽';
          els.badgeProcessing.className = 'text-primary text-[10px] font-bold bg-blue-50 px-2 py-0.5 rounded';
        } else {
          els.badgeProcessing.textContent = 'ВКЛЮЧЕНО';
          els.badgeProcessing.className = 'text-primary text-[10px] font-bold bg-blue-50 px-2 py-0.5 rounded';
        }
      }

      if (els.selectedFrameText) {
        var f = FRAMES_DB.find(function (x) { return x.id === STATE.frame; });
        els.selectedFrameText.textContent = f ? f.name : 'Без багета';
      }

      /* Wrap buttons */
      if (els.wrapBtns) {
        els.wrapBtns.forEach(function (btn) {
          if (btn.dataset.val === STATE.wrap) {
            btn.className = 'wrap-btn flex-1 py-2 rounded-md text-xs font-bold transition bg-white text-slate-900 shadow-sm border border-slate-100';
          } else {
            btn.className = 'wrap-btn flex-1 py-2 rounded-md text-xs font-medium transition text-slate-700 hover:text-slate-900 hover:bg-slate-200/50';
          }
        });
      }

      /* Size labels */
      if (els.lblW) els.lblW.textContent = STATE.w;
      if (els.lblH) els.lblH.textContent = STATE.h;

      /* Canvas preview */
      if (els.canvas) {
        var factorW = 7.5 / 20;
        var factorH = 17.5 / 30;
        var wPct = STATE.w * factorW;
        var hPct = STATE.h * factorH;
        els.canvas.style.width = wPct + '%';
        els.canvas.style.height = hPct + '%';

        if (STATE.image) els.canvas.classList.add('has-image');
        else els.canvas.classList.remove('has-image');

        var fr = FRAMES_DB.find(function (x) { return x.id === STATE.frame; }) || FRAMES_DB[0];
        if (STATE.frame !== 'NONE') {
          els.canvas.style.border = fr.width + 'px solid ' + fr.color;
          els.canvas.style.backgroundClip = 'padding-box';
          els.canvas.style.backgroundOrigin = 'padding-box';
          if (fr.border) els.canvas.style.outline = '1px solid ' + fr.border;
          if (fr.style === 'ornate_gold') {
            els.canvas.style.borderImage = 'linear-gradient(to bottom right, #bf953f, #fcf6ba, #b38728, #fbf5b7) 1';
            els.canvas.style.borderColor = '#d4af37';
          }
        } else {
          if (STATE.wrap === 'STANDARD') els.canvas.style.border = 'none';
          else if (STATE.wrap === 'NO_FRAME') els.canvas.style.boxShadow = '2px 4px 10px rgba(0,0,0,0.1)';
        }

        if (STATE.image) {
          els.canvas.style.backgroundImage = 'url(' + STATE.image + ')';
          els.canvas.style.backgroundSize = 'cover';
          els.canvas.style.backgroundPosition = 'center';
        } else {
          els.canvas.style.backgroundImage = 'none';
          els.canvas.style.backgroundColor = '#fff';
        }
      }

      updateModalPreviews();
    }

    /* ========== BOOTSTRAP ========== */

    renderFrameCatalog();
    renderInteriors();
    initMain();
    initLightbox();
    renderSizePresets();
    initOrderForm();
    applyFeatureFlags();
  };
})();
