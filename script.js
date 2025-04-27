let musicPlaying = false;

document.addEventListener('contextmenu', e => e.preventDefault());
// Функция для создания искр (эффект блеска)
function createSparkle(container) {
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    
    const size = Math.random() * 3 + 1;
    const delay = Math.random() * 5;
    
    sparkle.style.left = `${posX}%`;
    sparkle.style.top = `${posY}%`;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.animationDelay = `${delay}s`;
    
    if (container) {
        const sparklesContainer = container.querySelector('.sparkles') || container;
        sparklesContainer.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparklesContainer.contains(sparkle)) {
                sparklesContainer.removeChild(sparkle);
                createSparkle(container);
            }
        }, (delay + 2) * 1000);
    }
}

// Функция для проверки совместимости браузера
function checkBrowserCompatibility() {
    const audio = document.createElement('audio');
    if (!audio.canPlayType) {
        console.error('Ваш браузер не поддерживает аудио элемент. Воспроизведение музыки будет отключено.');
        return false;
    }
    
    const canPlayMP3 = audio.canPlayType('audio/mpeg') || audio.canPlayType('audio/mp3');
    if (canPlayMP3 === '') {
        console.error('Ваш браузер не поддерживает формат MP3. Попробуйте использовать другой браузер.');
        return false;
    }
    
    console.log('Браузер полностью совместим с требованиями сайта.');
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    // Глобальный флаг для контроля начала воспроизведения
    window.musicStartedPlaying = false;
    
    const isBrowserCompatible = checkBrowserCompatibility();
    if (!isBrowserCompatible) {
        alert('Ваш браузер может не поддерживать некоторые функции сайта. Для наилучшего опыта используйте Chrome, Firefox или Safari последних версий.');
    }
    
    // Вступительный экран
    const entryScreen = document.querySelector('.entry-screen');
    const entryContent = document.querySelector('.entry-content');
    
    document.body.style.overflow = 'hidden';
    
    const audio = document.getElementById('background-music');
    if (audio) {
        audio.volume = 0.7; 
        audio.load(); 

        audio.addEventListener('canplaythrough', () => {
            console.log('Аудио загружено и готово к воспроизведению');
        });
        
        audio.addEventListener('error', (e) => {
            console.error('Ошибка загрузки аудио:', e);
            

            let errorMessage = 'Неизвестная ошибка';
            switch (audio.error.code) {
                case 1:
                    errorMessage = 'Процесс загрузки прерван пользователем';
                    break;
                case 2:
                    errorMessage = 'Ошибка сети при загрузке аудио';
                    break;
                case 3:
                    errorMessage = 'Ошибка декодирования аудио файла';
                    break;
                case 4:
                    errorMessage = 'Аудио файл не найден или недоступен';
                    break;
            }
            
            console.error('Детали ошибки аудио:', errorMessage);
            
            console.error('Проверьте, что файл music.mp3 существует в корневой папке сайта');
            
            const playerTitle = document.querySelector('.player-title span');
            if (playerTitle) {
                playerTitle.textContent = 'Ошибка загрузки аудио';
                playerTitle.style.color = 'red';
            }
        });
    } else {
        console.error('Аудио-элемент не найден!');
    }
    
    entryContent.addEventListener('click', () => {
        enterWebsite();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !entryScreen.classList.contains('hidden')) {
            console.log('Нажата клавиша Enter на вступительном экране');
            enterWebsite();
        }
    });
    
    function enterWebsite() {
        entryScreen.classList.add('hidden');
        
        const flash = document.createElement('div');
        flash.classList.add('entry-flash');
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.remove();
        }, 1000);
        
        setTimeout(() => {
            entryScreen.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            initializeWebsiteAnimations();
            
            const playerTitle = document.querySelector('.player-title span');
            if (playerTitle) {
                playerTitle.textContent = 'Нажмите ▶ для запуска музыки';
            }
        }, 500);
    }
    
    // Функции инициализации анимаций и эффектов сайта
    function initializeWebsiteAnimations() {
        // Эффекты для курсора
        const cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');
        document.body.appendChild(cursor);
    
        const cursorTrail = document.createElement('div');
        cursorTrail.classList.add('cursor-trail');
        document.body.appendChild(cursorTrail);
        
        const cursorGlow = document.createElement('div');
        cursorGlow.classList.add('cursor-glow');
        document.body.appendChild(cursorGlow);
    
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
                cursorGlow.style.left = e.clientX + 'px';
                cursorGlow.style.top = e.clientY + 'px';
            });
            
            // Эффект отставания
            setTimeout(() => {
                cursorTrail.style.left = e.clientX + 'px';
                cursorTrail.style.top = e.clientY + 'px';
            }, 80);
        });
        
        // Эффект клика
        document.addEventListener('mousedown', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
            cursor.style.opacity = '0.8';
            
            const clickEffect = document.createElement('div');
            clickEffect.classList.add('click-effect');
            clickEffect.style.left = cursor.style.left;
            clickEffect.style.top = cursor.style.top;
            document.body.appendChild(clickEffect);
            
            setTimeout(() => {
                clickEffect.remove();
            }, 700);
        });
        
        document.addEventListener('mouseup', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.opacity = '1';
        });
        
        // Эффект наведения для элементов
        const interactiveElements = document.querySelectorAll('a, button, input, .copy-btn, .link-card');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
                cursorTrail.classList.add('cursor-hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
                cursorTrail.classList.remove('cursor-hover');
            });
        });
        
        if ('ontouchstart' in window) {
            cursor.style.display = 'none';
            cursorTrail.style.display = 'none';
            document.body.style.cursor = 'auto';
        }
    
        // Дополнительные искры
        const card = document.querySelector('.card');
        
        for (let i = 0; i < 15; i++) {
            createSparkle(card);
        }
    
        // Эффект глитча при наведении на имя пользователя
        const glitchText = document.querySelector('.glitch');
        
        if (glitchText) {
            glitchText.addEventListener('mouseover', () => {
                glitchText.classList.add('intensify-glitch');
            });
            
            glitchText.addEventListener('mouseout', () => {
                glitchText.classList.remove('intensify-glitch');
            });
        }
    
        const avatar = document.querySelector('.avatar');
        
        if (avatar) {
            setInterval(() => {
                avatar.classList.add('pulse');
                
                setTimeout(() => {
                    avatar.classList.remove('pulse');
                }, 1000);
            }, 3000);
        }
    
        const links = document.querySelectorAll('.link-card');
        
        links.forEach((link, index) => {
            setTimeout(() => {
                link.classList.add('fade-in');
            }, 300 + (index * 150));
        });
    
        const copyButtons = document.querySelectorAll('.copy-btn');
        
        copyButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                const textToCopy = button.getAttribute('data-copy-text');
                const statusElement = button.querySelector('.copy-status');
                
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        statusElement.textContent = 'copied!';
                        button.classList.add('copied');
                        
                        setTimeout(() => {
                            statusElement.textContent = 'click to copy';
                            button.classList.remove('copied');
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Не удалось скопировать: ', err);
                        statusElement.textContent = 'error!';
                        
                        setTimeout(() => {
                            statusElement.textContent = 'click to copy';
                        }, 2000);
                    });
            });
        });
    
        // Счетчик уникальных просмотров
        updateVisitorsCounter();
    
        // Управление музыкальным плеером
        initMusicPlayer();
        
        // Добавляем анимированный фон с частицами
        createParticleBackground();
    }
    
    // Функция для обновления счетчика просмотров - заглушка
    function updateVisitorsCounter() {
        console.log('Обновление счетчика просмотров');
        
        const counter = document.getElementById('visitors-count');
        
        if (counter) {
            console.log('Счетчик найден:', counter);
            // Генерируем случайное число от 500 до 1500
            const randomViews = Math.floor(Math.random() * 1000) + 500;
            counter.textContent = randomViews;
            console.log('Установлено значение счетчика:', randomViews);
        } else {
            console.warn('Элемент счетчика просмотров не найден на странице');
        }
    }
    
    // Инициализация музыкального плеера
    function initMusicPlayer() {
        const playerHeader = document.querySelector('.player-header');
        const playerPanel = document.querySelector('.music-player-panel');
        const musicToggle = document.getElementById('music-toggle');
        const playPauseBtn = document.getElementById('play-pause-btn');
        const audio = document.getElementById('background-music');
        const volumeSlider = document.getElementById('volume-slider');
        const volumeBar = document.querySelector('.volume-bar');
        const progressBar = document.querySelector('.progress-current');
        const progressContainer = document.querySelector('.progress-bar-container');
        const currentTimeEl = document.querySelector('.current-time');
        const totalTimeEl = document.querySelector('.total-time');
        const repeatBtn = document.getElementById('repeat-btn');
        const volumeBtn = document.getElementById('volume-btn');
        const playerTitle = document.querySelector('.player-title span');
        const reloadBtn = document.getElementById('reload-btn');
        
        if (playerTitle) {
            playerTitle.textContent = 'Music Player (Остановлен)';
        }
        
        if (!audio) {
            console.error('Аудио-элемент не найден при инициализации плеера');
            if (playerTitle) {
                playerTitle.textContent = 'Music Player (Ошибка)';
                playerTitle.style.color = 'red';
            }
            return;
        }
        
        if (currentTimeEl) currentTimeEl.textContent = '00:00';
        if (totalTimeEl) totalTimeEl.textContent = '00:00';
        
        if (progressBar) progressBar.style.width = '0%';
        
        console.log('Инициализация музыкального плеера');
        audio.load();
        
        audio.loop = true;
        
        audio.volume = volumeSlider ? (volumeSlider.value / 100) : 0.7;
        updateVolumeBar();
        
        setTimeout(() => {
            if (playerPanel) playerPanel.style.opacity = '1';
        }, 500);
        
        if (playerHeader) {
            playerHeader.addEventListener('click', (e) => {
                if (e.target.closest('.player-toggle-btn')) return;
                
                playerPanel.classList.toggle('expanded');
            });
        }
        
        function updateVolumeBar() {
            if (volumeBar && volumeSlider) {
                volumeBar.style.width = volumeSlider.value + '%';
            }
        }
        
        // Обновление времени и прогресса
        audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
                const currentTime = audio.currentTime;
                const duration = audio.duration;
                
                const progressPercent = (currentTime / duration) * 100;
                if (progressBar) progressBar.style.width = `${progressPercent}%`;
                
                const currentMinutes = Math.floor(currentTime / 60);
                const currentSeconds = Math.floor(currentTime) % 60;
                const durationMinutes = Math.floor(duration / 60);
                const durationSeconds = Math.floor(duration) % 60;
                
                if (currentTimeEl) currentTimeEl.textContent = `${currentMinutes.toString().padStart(2, '0')}:${currentSeconds.toString().padStart(2, '0')}`;
                if (totalTimeEl) totalTimeEl.textContent = `${durationMinutes.toString().padStart(2, '0')}:${durationSeconds.toString().padStart(2, '0')}`;
            }
        });
        
        // Обработчик изменения громкости
        if (volumeSlider) {
            volumeSlider.addEventListener('input', () => {
                audio.volume = volumeSlider.value / 100;
                updateVolumeBar();
            });
        }
        
        if (progressContainer) {
            progressContainer.addEventListener('click', (e) => {
                const progressContainerWidth = progressContainer.clientWidth;
                const clickPosition = e.offsetX;
                const seekTime = (clickPosition / progressContainerWidth) * audio.duration;
                
                if (!isNaN(seekTime)) {
                    audio.currentTime = seekTime;
                }
            });
        }
        
        // Функция воспроизведения музыки
        function playMusic() {
            if (!audio) return;
            
            try {
                const playPromise = audio.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('Музыка успешно воспроизводится');
                        
                        if (musicToggle) musicToggle.classList.add('playing');
                        if (playPauseBtn) playPauseBtn.classList.add('playing');
                        if (playPauseBtn && playPauseBtn.querySelector('i')) 
                            playPauseBtn.querySelector('i').className = 'fas fa-pause';
                        
                        if (playerTitle) {
                            playerTitle.textContent = 'Music Player (Играет)';
                            playerTitle.style.color = '';
                        }
                        
                        musicPlaying = true;
                    }).catch(err => {
                        console.error('Ошибка воспроизведения:', err);
                        
                        if (err.name === 'NotAllowedError') {
                            alert('Для воспроизведения музыки требуется взаимодействие пользователя');
                        }
                    });
                }
            } catch (e) {
                console.error('Ошибка воспроизведения:', e);
            }
        }
        
        // Функция паузы музыки
        function pauseMusic() {
            if (!audio) return;
            
            audio.pause();
            
            if (musicToggle) musicToggle.classList.remove('playing');
            if (playPauseBtn) playPauseBtn.classList.remove('playing');
            if (playPauseBtn && playPauseBtn.querySelector('i')) 
                playPauseBtn.querySelector('i').className = 'fas fa-play';
            
            if (playerTitle) {
                playerTitle.textContent = 'Music Player (Пауза)';
                playerTitle.style.color = '';
            }
            
            musicPlaying = false;
        }
        
        // Обработчики кнопок
        if (musicToggle) {
            musicToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                
                if (musicPlaying) {
                    pauseMusic();
                } else {
                    playMusic();
                }
            });
        }
        
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                if (musicPlaying) {
                    pauseMusic();
                } else {
                    playMusic();
                }
            });
        }
        
        // Обработчик кнопки повтора
        if (repeatBtn) {
            repeatBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                audio.loop = !audio.loop;
                repeatBtn.classList.toggle('active', audio.loop);
            });
            
            repeatBtn.classList.toggle('active', audio.loop);
        }
        
        // Обработчик кнопки громкости
        if (volumeBtn) {
            volumeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                if (audio.volume > 0) {
                    volumeBtn.dataset.prevVolume = audio.volume;
                    audio.volume = 0;
                    
                    if (volumeSlider) volumeSlider.value = 0;
                    volumeBtn.querySelector('i').className = 'fas fa-volume-mute';
                } else {
                    const prevVolume = parseFloat(volumeBtn.dataset.prevVolume || 0.7);
                    audio.volume = prevVolume;
                    
                    if (volumeSlider) volumeSlider.value = prevVolume * 100;
                    volumeBtn.querySelector('i').className = 'fas fa-volume-up';
                }
                
                updateVolumeBar();
            });
        }
        
        // Обработчик кнопки перезагрузки
        if (reloadBtn) {
            reloadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                console.log('Перезагрузка аудио');
                
                const wasPlaying = !audio.paused;
                
                audio.currentTime = 0;
                audio.load();
                
                if (progressBar) progressBar.style.width = '0%';
                if (currentTimeEl) currentTimeEl.textContent = '00:00';
                
                if (wasPlaying) {
                    audio.play()
                        .then(() => {
                            console.log('Аудио успешно перезагружено и воспроизводится');
                        })
                        .catch(err => {
                            console.error('Ошибка воспроизведения после перезагрузки:', err);
                        });
                } else {
                    console.log('Аудио перезагружено в режиме паузы');
                }
                
                const icon = reloadBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-spin');
                    setTimeout(() => {
                        icon.classList.remove('fa-spin');
                    }, 1000);
                }
                
                if (playerTitle) {
                    const originalText = playerTitle.textContent;
                    playerTitle.textContent = 'Music Player (Перезагрузка...)';
                    
                    setTimeout(() => {
                        playerTitle.textContent = originalText;
                    }, 1500);
                }
            });
        }
    }
    
    // Функция для создания анимированного фона с частицами
    function createParticleBackground() {
        const particleContainer = document.createElement('div');
        particleContainer.classList.add('particle-background');
        document.body.appendChild(particleContainer);
        
        for (let i = 0; i < 25; i++) {
            const particle = document.createElement('div');
            particle.classList.add('bg-particle');
            
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            
            const size = Math.random() * 5 + 2;
            
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 10;
            
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
            
            particleContainer.appendChild(particle);
        }
    }
});