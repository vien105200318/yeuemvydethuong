const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
const questionSection = document.getElementById('questionSection');
const resultSection = document.getElementById('resultSection');
const loveAudio = document.getElementById('loveAudio');

let noClickCount = 0;
const heartTypes = ['💖', '❤️', '💕', '💗', '💓', '💘', '💝', '💞'];

// Bắt đầu hiệu ứng trái tim rơi ngay khi trang load
createBackgroundHearts();

// Khi click vào nút "Không"
btnNo.addEventListener('click', () => {
    noClickCount++;
    
    // Giảm kích thước nút "Không"
    const currentSize = parseFloat(window.getComputedStyle(btnNo).fontSize);
    btnNo.style.fontSize = (currentSize - 3) + 'px';
    btnNo.style.padding = (15 - noClickCount * 2) + 'px ' + (30 - noClickCount * 3) + 'px';
    
    // Tăng kích thước nút "Có"
    const currentYesSize = parseFloat(window.getComputedStyle(btnYes).fontSize);
    btnYes.style.fontSize = (currentYesSize + 3) + 'px';
    btnYes.style.padding = (15 + noClickCount * 2) + 'px ' + (30 + noClickCount * 3) + 'px';
    
    // Di chuyển nút "Không" ngẫu nhiên
    const container = document.querySelector('.button-container');
    const containerRect = container.getBoundingClientRect();
    
    // Tạo vị trí ngẫu nhiên
    const randomX = Math.random() * 100 - 50;
    const randomY = Math.random() * 100 - 50;
    
    btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;
    
    // Nếu nút quá nhỏ, ẩn nó
    if (noClickCount >= 5) {
        btnNo.style.opacity = '0';
        btnNo.style.pointerEvents = 'none';
    }
});

// Khi click vào nút "Có"
btnYes.addEventListener('click', () => {
    // Ẩn phần câu hỏi
    questionSection.style.display = 'none';
    
    // Hiển thị phần kết quả
    resultSection.classList.add('active');
    
    // Phát nhạc
    loveAudio.play().catch(error => {
        console.log('Không thể phát nhạc tự động:', error);
    });
    
    // Tạo hiệu ứng tim 2D bay
    createFloatingHearts();
    
    // Kích hoạt hiệu ứng trái tim 3D mạnh mẽ
    if (window.intensifyHearts) {
        window.intensifyHearts();
    }
});

// Tạo hiệu ứng trái tim rơi từ nền (chạy liên tục)
function createBackgroundHearts() {
    setInterval(() => {
        createHeart(false);
    }, 300);
}

// Tạo hiệu ứng trái tim rơi mạnh mẽ khi bấm "Có"
function createFloatingHearts() {
    // Tạo burst của nhiều trái tim cùng lúc
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createHeart(true);
        }, i * 100);
    }
    
    // Tiếp tục tạo trái tim liên tục với tần suất cao hơn
    const interval = setInterval(() => {
        createHeart(true);
    }, 200);
    
    // Dừng sau 10 giây và quay về chế độ bình thường
    setTimeout(() => {
        clearInterval(interval);
    }, 10000);
}

// Hàm tạo một trái tim rơi
function createHeart(isIntense) {
    const heart = document.createElement('div');
    const randomHeart = heartTypes[Math.floor(Math.random() * heartTypes.length)];
    heart.innerHTML = randomHeart;
    heart.className = 'falling-heart';
    
    // Kích thước ngẫu nhiên
    const size = isIntense ? Math.random() * 40 + 30 : Math.random() * 25 + 15;
    heart.style.fontSize = size + 'px';
    
    // Vị trí ngang ngẫu nhiên
    heart.style.left = Math.random() * 100 + '%';
    
    // Thời gian rơi ngẫu nhiên
    const duration = isIntense ? Math.random() * 3 + 3 : Math.random() * 4 + 4;
    heart.style.animationDuration = duration + 's';
    
    // Delay ngẫu nhiên
    heart.style.animationDelay = Math.random() * 0.5 + 's';
    
    // Độ lệch ngang ngẫu nhiên
    const drift = (Math.random() - 0.5) * 100;
    heart.style.setProperty('--drift', drift + 'px');
    
    document.body.appendChild(heart);
    
    // Xóa sau khi animation kết thúc
    setTimeout(() => {
        heart.remove();
    }, (duration + 0.5) * 1000);
}

// Thêm CSS cho hiệu ứng trái tim rơi
const style = document.createElement('style');
style.textContent = `
    .falling-heart {
        position: fixed;
        top: -50px;
        z-index: 9999;
        pointer-events: none;
        animation: fall linear forwards;
        filter: drop-shadow(0 0 5px rgba(255, 105, 180, 0.5));
    }
    
    @keyframes fall {
        0% {
            top: -10%;
            opacity: 0;
            transform: translateX(0) rotate(0deg) scale(0);
        }
        10% {
            opacity: 1;
            transform: translateX(0) rotate(45deg) scale(1);
        }
        50% {
            transform: translateX(var(--drift)) rotate(180deg) scale(1);
        }
        100% {
            top: 110%;
            opacity: 0;
            transform: translateX(calc(var(--drift) * 1.5)) rotate(360deg) scale(0.5);
        }
    }
    
    @keyframes floatHeart {
        0% {
            bottom: -10%;
            opacity: 0;
            transform: translateX(0) rotate(0deg);
        }
        25% {
            opacity: 1;
        }
        75% {
            opacity: 1;
        }
        100% {
            bottom: 110%;
            opacity: 0;
            transform: translateX(100px) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);