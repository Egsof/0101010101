    <script>
        let recognition;
        let voices = [];
        const languageSelect = document.getElementById('languageSelect');
        const voiceSelect = document.getElementById('voiceSelect');
        const recordButton = document.getElementById('recordButton');
        const outputText = document.getElementById('outputText');
        const recordStatus = document.getElementById('recordStatus');

        // Fungsi inisialisasi voices
        function populateVoiceList() {
            voices = window.speechSynthesis.getVoices();
            voiceSelect.innerHTML = '<option value="">Pilih Suara</option>';

            // Filter voices berdasarkan bahasa yang dipilih
            const selectedLang = languageSelect.value;
            const languageVoices = voices.filter(voice => 
                voice.lang.startsWith(selectedLang.split('-')[0])
            );

            // Pisahkan suara berdasarkan gender
            const femaleVoices = languageVoices.filter(voice => 
                voice.name.toLowerCase().includes('female') || 
                voice.name.toLowerCase().includes('wanita')
            );
            const maleVoices = languageVoices.filter(voice => 
                voice.name.toLowerCase().includes('male') || 
                voice.name.toLowerCase().includes('pria')
            );

            // Tambahkan opsi suara
            [
                ...femaleVoices.map(voice => ({ 
                    name: `👩 ${voice.name}`, 
                    index: voices.indexOf(voice) 
                })),
                ...maleVoices.map(voice => ({ 
                    name: `👨 ${voice.name}`, 
                    index: voices.indexOf(voice) 
                })),
                ...languageVoices.filter(voice => 
                    !voice.name.toLowerCase().includes('female') && 
                    !voice.name.toLowerCase().includes('male') &&
                    !voice.name.toLowerCase().includes('wanita') &&
                    !voice.name.toLowerCase().includes('pria')
                ).map(voice => ({ 
                    name: `🎙️ ${voice.name}`, 
                    index: voices.indexOf(voice) 
                }))
            ].forEach(voice => {
                const option = document.createElement('option');
                option.textContent = voice.name;
                option.setAttribute('data-index', voice.index);
                voiceSelect.appendChild(option);
            });
        }

        // Muat daftar suara saat halaman dimuat dan saat bahasa berubah
        speechSynthesis.addEventListener('voiceschanged', populateVoiceList);
        languageSelect.addEventListener('change', () => {
            populateVoiceList();
            
            // Update bahasa rekognisi
            if (recognition) {
                recognition.lang = languageSelect.value;
            }
        });
        populateVoiceList();

        // Fungsi Teks ke Audio dengan pilihan suara
        function playText() {
            const text = document.getElementById('textInput').value;
            const selectedVoiceIndex = voiceSelect.selectedOptions[0]?.getAttribute('data-index');

            if (!text) {
                alert('Silakan masukkan teks terlebih dahulu');
                return;
            }

            const speech = new SpeechSynthesisUtterance(text);
            
            if (selectedVoiceIndex !== null) {
                speech.voice = voices[selectedVoiceIndex];
            } else {
                speech.lang = languageSelect.value;
            }

            speech.rate = 1.0;  // Kecepatan normal
            speech.pitch = 1.0; // Nada normal

            window.speechSynthesis.speak(speech);
        }

        // Fungsi jeda dan berhenti berbicara
        function stopSpeech() {
            window.speechSynthesis.cancel();
        }

        // Fungsi Speech Recognition
        function startSpeechRecognition() {
            if (!('webkitSpeechRecognition' in window)) {
                alert("Maaf, browser Anda tidak mendukung fitur Speech-to-Text.");
                return;
            }

            recognition = new webkitSpeechRecognition();
            recognition.lang = languageSelect.value;
            recognition.interimResults = false;
            recognition.continuous = false;

            recordButton.classList.add('recording-animation', 'bg-red-500');
            recordButton.innerHTML = '<i class="ri-mic-fill mr-2"></i> Sedang Merekam';
            recordButton.disabled = true;
            recordStatus.textContent = 'Sedang mendengarkan...';

            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                outputText.textContent = transcript;
                recordStatus.textContent = 'Rekaman berhasil';
            };

            recognition.onerror = function(event) {
                outputText.textContent = "Error: " + event.error;
                recordStatus.textContent = 'Rekaman gagal';
            };

            recognition.onend = function() {
                recordButton.classList.remove('recording-animation', 'bg-red-500');
                recordButton.innerHTML = '<i class="ri-mic-fill mr-2"></i> Rekam Audio';
                recordButton.disabled = false;
                recordStatus.textContent = '';
            };

            recognition.start();
        }

        // Fungsi untuk menghentikan Speech Recognition
        function stopSpeechRecognition() {
            if (recognition) {
                recognition.stop();
                recordButton.disabled = false;
                recordButton.classList.remove('recording-animation', 'bg-red-500');
                recordButton.innerHTML = '<i class="ri-mic-fill mr-2"></i> Rekam Audio';
            }
        }

        // Event Listener untuk tombol rekaman
        recordButton.addEventListener('mousedown', startSpeechRecognition);
        recordButton.addEventListener('mouseup', stopSpeechRecognition);
        recordButton.addEventListener('mouseleave', stopSpeechRecognition);
    </script>
