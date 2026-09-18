/* Kurtuluş Vinç — WhatsApp formu ve hero video güvencesi */
(function () {
	'use strict';

	var PHONE = '905324663874';

	// Hero videosu: bazı tarayıcılar autoplay'i geciktirir, sessizse tekrar dener.
	document.addEventListener('DOMContentLoaded', function () {
		var v = document.getElementById('hero-video-vinc');
		if (v) {
			v.muted = true;
			v.setAttribute('muted', '');
			var play = function () {
				var p = v.play();
				if (p && typeof p.catch === 'function') { p.catch(function () {}); }
			};
			play();
			document.addEventListener('touchstart', play, { once: true, passive: true });
			document.addEventListener('click', play, { once: true });
		}

		var form = document.getElementById('waForm');
		if (!form) { return; }

		form.addEventListener('submit', function (e) {
			e.preventDefault();
			var name = (document.getElementById('waName') || {}).value || '';
			var place = (document.getElementById('waPlace') || {}).value || '';
			var msg = (document.getElementById('waMessage') || {}).value || '';
			var box = document.getElementById('waFormMessage');

			name = name.trim(); place = place.trim(); msg = msg.trim();

			if (!name || !place || !msg) {
				show(box, 'Lütfen tüm alanları doldurun.', 'error');
				return;
			}

			var text = 'Merhaba, ben ' + name + '. Yer: ' + place + '. İş: ' + msg;
			var url = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(text);
			show(box, 'WhatsApp açılıyor. Açılmazsa 0532 466 38 74 numarasını arayabilirsiniz.', 'success');
			window.open(url, '_blank', 'noopener');
		});
	});

	function show(box, text, type) {
		if (!box) { return; }
		box.textContent = text;
		box.className = 'form-message ' + type;
		box.style.display = 'block';
	}
})();
