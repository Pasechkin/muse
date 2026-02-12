/**
 * Muse Universal Image Uploader v1.0
 * Универсальный загрузчик изображений для всех страниц проекта.
 *
 * Использование:
 *   <script src="js/uploader.js"></script>
 *   <script>
 *     var uploader = MuseUploader({
 *       maxFiles: 20,
 *       dropZoneSelector: '#uploader-zone',
 *       onImagesChange: function(images) { ... },
 *       onActiveImageChange: function(image) { ... }
 *     });
 *   </script>
 */
(function () {
  'use strict';

  /* ========== DEFAULT CONFIG ========== */

  var DEFAULTS = {
    maxFiles: 20,
    maxSizeMB: 10,
    acceptTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    acceptExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    dropZoneSelector: '#uploader-zone',
    thumbnailsSelector: '#uploader-thumbnails',
    fileInputSelector: '#file-upload',
    alertSelector: '#uploader-alert',
    addBtnSelector: '#uploader-add-btn',
    uploadBtnSelector: '#btn-upload-empty',
    statusSelector: '#uploader-status',
    enableDragDrop: true,
    batchSize: 5,
    alertDuration: 4000,
    onImagesChange: null,
    onActiveImageChange: null
  };

  /* ========== UTILITIES ========== */

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Б';
    var k = 1024;
    var sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  function pluralize(count, one, few, many) {
    var mod10 = count % 10;
    var mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
    return many;
  }

  var idCounter = 0;
  function generateId() {
    return 'img_' + Date.now() + '_' + (++idCounter);
  }

  /* ========== MAIN CONSTRUCTOR ========== */

  window.MuseUploader = function (userConfig) {
    var cfg = {};
    var key;
    for (key in DEFAULTS) {
      if (DEFAULTS.hasOwnProperty(key)) {
        cfg[key] = (userConfig && userConfig[key] !== undefined) ? userConfig[key] : DEFAULTS[key];
      }
    }

    /* --- Internal state --- */
    var images = [];
    var activeImageId = null;
    var pendingRemoveId = null;
    var dragCounter = 0;
    var alertTimer = null;
    var destroyed = false;
    var eventCleanups = [];

    /* --- DOM refs (resolved lazily to work with defer) --- */
    var _els = {};
    function el(name) {
      if (_els[name] === undefined) {
        var sel = cfg[name + 'Selector'];
        _els[name] = sel ? document.querySelector(sel) : null;
      }
      return _els[name];
    }
    // Shorthand getters
    function dropZone() { return el('dropZone'); }
    function thumbnails() { return el('thumbnails'); }
    function fileInput() { return el('fileInput'); }
    function alertEl() { return el('alert'); }
    function addBtn() { return el('addBtn'); }
    function uploadBtn() { return el('uploadBtn'); }
    function statusEl() { return el('status'); }

    /* ========== VALIDATION ========== */

    var maxSizeBytes = cfg.maxSizeMB * 1024 * 1024;

    function validateFile(file) {
      // MIME check
      var validMime = false;
      for (var i = 0; i < cfg.acceptTypes.length; i++) {
        if (file.type === cfg.acceptTypes[i]) { validMime = true; break; }
      }
      if (!validMime && !file.type.match(/^image\//)) {
        return { ok: false, msg: 'Файл «' + escapeHtml(file.name) + '» — неподдерживаемый формат. Допустимы: JPEG, PNG, GIF, WebP' };
      }

      // Extension check
      var ext = file.name.toLowerCase().match(/\.[^.]+$/);
      ext = ext ? ext[0] : '';
      var validExt = false;
      for (var j = 0; j < cfg.acceptExtensions.length; j++) {
        if (ext === cfg.acceptExtensions[j]) { validExt = true; break; }
      }
      if (!validExt) {
        return { ok: false, msg: 'Файл «' + escapeHtml(file.name) + '» — недопустимое расширение (' + escapeHtml(ext) + ')' };
      }

      // Size check
      if (file.size > maxSizeBytes) {
        return { ok: false, msg: 'Файл «' + escapeHtml(file.name) + '» слишком большой (' + formatFileSize(file.size) + '). Максимум ' + cfg.maxSizeMB + ' МБ' };
      }

      return { ok: true };
    }

    function canAddMore(count) {
      if (images.length + count > cfg.maxFiles) {
        return { ok: false, msg: 'Можно загрузить максимум ' + cfg.maxFiles + ' ' + pluralize(cfg.maxFiles, 'фото', 'фотографии', 'фотографий') + '. Сейчас загружено: ' + images.length };
      }
      return { ok: true };
    }

    /* ========== ALERT SYSTEM ========== */

    function showAlert(message, type) {
      var container = alertEl();
      if (!container) return;

      if (alertTimer) { clearTimeout(alertTimer); alertTimer = null; }

      var typeClass = 'uploader-alert-' + (type || 'error');
      container.className = 'uploader-alert ' + typeClass;
      container.innerHTML = '<span>' + message + '</span>' +
        '<button type="button" class="uploader-alert-close" aria-label="Закрыть">&times;</button>';
      container.style.display = 'flex';

      var closeBtn = container.querySelector('.uploader-alert-close');
      if (closeBtn) {
        closeBtn.onclick = function () { hideAlert(); };
      }

      alertTimer = setTimeout(function () { hideAlert(); }, cfg.alertDuration);
    }

    function hideAlert() {
      var container = alertEl();
      if (!container) return;
      container.style.display = 'none';
      container.innerHTML = '';
      if (alertTimer) { clearTimeout(alertTimer); alertTimer = null; }
    }

    /* ========== SCREEN READER ANNOUNCEMENTS ========== */

    function announce(text) {
      var s = statusEl();
      if (s) s.textContent = text;
    }

    /* ========== IMAGE LOADING ========== */

    function loadImage(file, callback) {
      var reader = new FileReader();
      reader.onload = function (evt) {
        var img = new Image();
        img.onload = function () {
          var imgObj = {
            id: generateId(),
            dataUrl: evt.target.result,
            name: file.name,
            size: file.size,
            type: file.type,
            width: img.naturalWidth,
            height: img.naturalHeight
          };
          images.push(imgObj);

          // First image becomes active
          if (images.length === 1) {
            activeImageId = imgObj.id;
          }

          if (callback) callback(imgObj);
        };
        img.onerror = function () {
          showAlert('Ошибка чтения файла «' + escapeHtml(file.name) + '»', 'error');
          if (callback) callback(null);
        };
        img.src = evt.target.result;
      };
      reader.onerror = function () {
        showAlert('Ошибка чтения файла «' + escapeHtml(file.name) + '»', 'error');
        if (callback) callback(null);
      };
      reader.readAsDataURL(file);
    }

    /* ========== ADD FILES (with batch processing) ========== */

    function addFiles(fileList) {
      if (!fileList || fileList.length === 0) return;
      var filesArr = [];
      for (var i = 0; i < fileList.length; i++) { filesArr.push(fileList[i]); }

      // Check total limit
      var limitCheck = canAddMore(filesArr.length);
      if (!limitCheck.ok) {
        showAlert(limitCheck.msg, 'warning');
        // Trim to available slots
        var available = cfg.maxFiles - images.length;
        if (available <= 0) return;
        filesArr = filesArr.slice(0, available);
      }

      // Validate all files first
      var validFiles = [];
      for (var v = 0; v < filesArr.length; v++) {
        var result = validateFile(filesArr[v]);
        if (!result.ok) {
          showAlert(result.msg, 'error');
        } else {
          validFiles.push(filesArr[v]);
        }
      }

      if (validFiles.length === 0) return;

      // Batch process
      var processed = 0;
      var total = validFiles.length;

      function processBatch(start) {
        var end = Math.min(start + cfg.batchSize, total);
        for (var b = start; b < end; b++) {
          (function (idx) {
            loadImage(validFiles[idx], function () {
              processed++;
              if (processed === total) {
                onLoadComplete(total);
              } else if (processed % cfg.batchSize === 0) {
                // Re-render after each batch for visual feedback
                renderThumbnails();
                notifyChange();
              }
            });
          })(b);
        }
        if (end < total) {
          setTimeout(function () { processBatch(end); }, 50);
        }
      }

      processBatch(0);
    }

    function onLoadComplete(count) {
      renderThumbnails();
      updateUploadBtn();
      notifyChange();
      notifyActiveChange();
      announce('Загружено ' + count + ' ' + pluralize(count, 'фото', 'фотографии', 'фотографий'));
      if (count > 0) {
        showAlert('Загружено ' + count + ' ' + pluralize(count, 'фото', 'фотографии', 'фотографий'), 'success');
      }
    }

    /* ========== REMOVE IMAGE ========== */

    function removeImage(id) {
      var removedName = '';
      var removedIdx = -1;
      images = images.filter(function (img, idx) {
        if (img.id === id) {
          removedName = img.name;
          removedIdx = idx;
          return false;
        }
        return true;
      });

      // Update active
      if (activeImageId === id) {
        if (images.length > 0) {
          // Pick neighbor or first
          var newIdx = Math.min(removedIdx, images.length - 1);
          activeImageId = images[newIdx].id;
        } else {
          activeImageId = null;
        }
        notifyActiveChange();
      }

      renderThumbnails();
      updateUploadBtn();
      notifyChange();
      announce('Удалено фото ' + escapeHtml(removedName));
      pendingRemoveId = null;
    }

    /* ========== SET ACTIVE ========== */

    function setActiveImage(id) {
      var found = false;
      for (var i = 0; i < images.length; i++) {
        if (images[i].id === id) { found = true; break; }
      }
      if (!found) return;
      activeImageId = id;
      renderThumbnails();
      notifyActiveChange();
    }

    function getActiveImage() {
      if (!activeImageId) return null;
      for (var i = 0; i < images.length; i++) {
        if (images[i].id === activeImageId) return images[i];
      }
      return null;
    }

    /* ========== CLEAR ALL ========== */

    function clearAll() {
      images = [];
      activeImageId = null;
      pendingRemoveId = null;
      if (fileInput()) fileInput().value = '';
      renderThumbnails();
      updateUploadBtn();
      notifyChange();
      notifyActiveChange();
      announce('Все фото удалены');
    }

    /* ========== CALLBACKS ========== */

    function notifyChange() {
      if (cfg.onImagesChange) {
        cfg.onImagesChange(images.slice());
      }
    }

    function notifyActiveChange() {
      if (cfg.onActiveImageChange) {
        cfg.onActiveImageChange(getActiveImage());
      }
    }

    /* ========== RENDER THUMBNAILS ========== */

    function renderThumbnails() {
      var container = thumbnails();
      if (!container) return;

      if (images.length === 0) {
        container.innerHTML = '';
        container.style.display = 'none';
        return;
      }

      container.style.display = 'flex';
      var html = '';
      for (var i = 0; i < images.length; i++) {
        var img = images[i];
        var isActive = (img.id === activeImageId);
        var isPendingRemove = (img.id === pendingRemoveId);
        html +=
          '<div class="uploader-thumb-wrap' + (isActive ? ' uploader-thumb-active' : '') + '" ' +
              'role="option" aria-selected="' + isActive + '" tabindex="0" ' +
              'data-img-id="' + img.id + '" ' +
              'aria-label="' + escapeHtml(img.name) + '">' +
            '<img src="' + img.dataUrl + '" class="uploader-thumb" alt="' + escapeHtml(img.name) + '" draggable="false">' +
            '<button type="button" class="uploader-thumb-remove' + (isPendingRemove ? ' uploader-thumb-remove-armed' : '') + '" data-img-id="' + img.id + '" ' +
              'aria-label="' + (isPendingRemove ? 'Подтвердить удаление ' : 'Удалить ') + escapeHtml(img.name) + '" tabindex="0">' +
              '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>' +
            '</button>' +
          '</div>';
      }

      // «+» button if more can be added
      if (images.length < cfg.maxFiles) {
        html +=
          '<button type="button" class="uploader-add-btn" id="uploader-add-btn" ' +
            'aria-label="Добавить ещё фото" tabindex="0">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>' +
          '</button>';
      }

      container.innerHTML = html;

      // Bind thumbnail events
      bindThumbnailEvents(container);
    }

    function bindThumbnailEvents(container) {
      // Click on thumb → set active
      var thumbWraps = container.querySelectorAll('.uploader-thumb-wrap');
      for (var i = 0; i < thumbWraps.length; i++) {
        (function (wrap) {
          wrap.addEventListener('click', function (e) {
            if (e.target.closest('.uploader-thumb-remove')) return;
            if (pendingRemoveId) pendingRemoveId = null;
            setActiveImage(wrap.dataset.imgId);
          });
          wrap.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (e.target.closest('.uploader-thumb-remove')) return;
              if (pendingRemoveId) pendingRemoveId = null;
              setActiveImage(wrap.dataset.imgId);
            }
          });
        })(thumbWraps[i]);
      }

      // Click on remove buttons
      var removeBtns = container.querySelectorAll('.uploader-thumb-remove');
      for (var r = 0; r < removeBtns.length; r++) {
        (function (btn) {
          btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var id = btn.dataset.imgId;
            if (pendingRemoveId !== id) {
              pendingRemoveId = id;
              renderThumbnails();
              announce('Нажмите ещё раз, чтобы удалить фото');
              return;
            }
            removeImage(id);
          });
          btn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              var id = btn.dataset.imgId;
              if (pendingRemoveId !== id) {
                pendingRemoveId = id;
                renderThumbnails();
                announce('Нажмите ещё раз, чтобы удалить фото');
                return;
              }
              removeImage(id);
            }
          });
        })(removeBtns[r]);
      }

      // «+» add button
      var addButton = container.querySelector('.uploader-add-btn');
      if (addButton) {
        addButton.addEventListener('click', function () {
          if (pendingRemoveId) {
            pendingRemoveId = null;
            renderThumbnails();
          }
          if (fileInput()) fileInput().click();
        });
      }
    }

    /* ========== UPLOAD BUTTON STATE ========== */

    function updateUploadBtn() {
      var btn = uploadBtn();
      if (!btn) return;

      if (images.length > 0) {
        // Change text to "Добавить ещё" when images exist
        var span = btn.querySelector('span');
        if (span) span.textContent = 'Добавить ещё фото';
      } else {
        var span2 = btn.querySelector('span');
        if (span2) span2.textContent = 'Загрузить фото';
      }
    }

    /* ========== DRAG & DROP ========== */

    function initDragDrop() {
      if (!cfg.enableDragDrop) return;
      var zone = dropZone();
      if (!zone) return;

      function onDragEnter(e) {
        e.preventDefault();
        e.stopPropagation();
        dragCounter++;
        if (e.dataTransfer && e.dataTransfer.types && e.dataTransfer.types.indexOf('Files') !== -1) {
          zone.classList.add('uploader-drag-active');
        }
      }

      function onDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
      }

      function onDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        dragCounter--;
        if (dragCounter <= 0) {
          dragCounter = 0;
          zone.classList.remove('uploader-drag-active');
        }
      }

      function onDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        dragCounter = 0;
        zone.classList.remove('uploader-drag-active');
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          addFiles(e.dataTransfer.files);
        }
      }

      zone.addEventListener('dragenter', onDragEnter);
      zone.addEventListener('dragover', onDragOver);
      zone.addEventListener('dragleave', onDragLeave);
      zone.addEventListener('drop', onDrop);

      eventCleanups.push(function () {
        zone.removeEventListener('dragenter', onDragEnter);
        zone.removeEventListener('dragover', onDragOver);
        zone.removeEventListener('dragleave', onDragLeave);
        zone.removeEventListener('drop', onDrop);
      });
    }

    /* ========== FILE INPUT EVENTS ========== */

    function initFileInput() {
      var input = fileInput();
      if (!input) return;

      // Ensure multiple attribute is set
      if (cfg.maxFiles > 1) {
        input.setAttribute('multiple', '');
      }

      function onChange(e) {
        if (e.target.files && e.target.files.length > 0) {
          addFiles(e.target.files);
        }
        // Reset so same file can be re-selected
        e.target.value = '';
      }

      input.addEventListener('change', onChange);

      eventCleanups.push(function () {
        input.removeEventListener('change', onChange);
      });

      // Upload button click → trigger input
      var btn = uploadBtn();
      if (btn) {
        function onBtnClick() { input.click(); }
        btn.addEventListener('click', onBtnClick);
        eventCleanups.push(function () {
          btn.removeEventListener('click', onBtnClick);
        });
      }
    }

    /* ========== DESTROY ========== */

    function destroy() {
      if (destroyed) return;
      destroyed = true;
      for (var i = 0; i < eventCleanups.length; i++) {
        eventCleanups[i]();
      }
      eventCleanups = [];
      images = [];
      activeImageId = null;
      _els = {};
    }

    /* ========== INIT ========== */

    function init() {
      initFileInput();
      initDragDrop();
      renderThumbnails();
      updateUploadBtn();
    }

    init();

    /* ========== PUBLIC API ========== */

    return {
      addFiles: addFiles,
      removeImage: removeImage,
      getImages: function () { return images.slice(); },
      getActiveImage: getActiveImage,
      setActiveImage: setActiveImage,
      clear: clearAll,
      destroy: destroy,
      showAlert: showAlert,
      hideAlert: hideAlert,
      /** Allow external code to trigger file input */
      openFilePicker: function () {
        if (fileInput()) fileInput().click();
      },
      /** Get count */
      getCount: function () { return images.length; }
    };
  };
})();
