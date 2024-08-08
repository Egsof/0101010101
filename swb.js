        const responses = {
            "halo": "iya halo",
            "apa kabar": "baik, terima kasih! Kamu?",
            "siapa namamu": "saya bot tanpa nama",
            "terima kasih": "sama-sama!",
            "selamat pagi": "selamat pagi! Semoga harimu menyenangkan",
            "selamat malam": "selamat malam! Semoga tidurmu nyenyak",
            // Add more responses if needed
        };

        let currentMath = null;
        let countdownInterval = null;

        const modes = {
            noob: [-3, 3, -3, 3, '+-', 15000, 10],
            easy: [-10, 10, -10, 10, '*/+-', 20000, 40],
            medium: [-40, 40, -20, 20, '*/+-', 40000, 150],
            hard: [-100, 100, -70, 70, '*/+-', 60000, 350],
            extreme: [-999999, 999999, -999999, 999999, '*/', 99999, 9999],
            impossible: [-99999999999, 99999999999, -99999999999, 999999999999, '*/', 30000, 35000],
            impossible2: [-999999999999999, 999999999999999, -999, 999, '/', 30000, 50000]
        };

        const operators = {
            '+': '+',
            '-': '-',
            '*': '×',
            '/': '÷'
        };

        function genMath(mode) {
            let [a1, a2, b1, b2, ops, time, bonus] = modes[mode];
            let a = randomInt(a1, a2);
            let b = randomInt(b1, b2);
            let op = pickRandom([...ops]);
            let result = (new Function(`return ${a} ${op.replace('/', '*')} ${b < 0 ? `(${b})` : b}`))();
            if (op == '/') [a, result] = [result, a];
            return {
                str: `${a} ${operators[op]} ${b}`,
                mode,
                time,
                bonus,
                result
            };
        }

        function randomInt(from, to) {
            if (from > to) [from, to] = [to, from];
            from = Math.floor(from);
            to = Math.floor(to);
            return Math.floor((to - from) * Math.random() + from);
        }

        function pickRandom(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }

        function startMathGame() {
            const modesList = ['noob', 'easy', 'medium', 'hard'];
            const mode = pickRandom(modesList);
            currentMath = genMath(mode);

            const chatBox = document.getElementById('chatBox');
            const questionMessage = document.createElement('div');
            questionMessage.className = 'message bot';
            questionMessage.innerHTML = `Berapa hasil dari <b>${currentMath.str}</b>?`;
            chatBox.appendChild(questionMessage);

            chatBox.scrollTop = chatBox.scrollHeight;

            // Start countdown
            let timeLeft = currentMath.time / 1000;
            const timeoutMessageContainer = document.getElementById('timeoutMessageContainer');
            timeoutMessageContainer.innerHTML = `Timeout : ${timeLeft}s`;
            timeoutMessageContainer.style.display = 'block';

            countdownInterval = setInterval(() => {
                timeLeft -= 1;
                timeoutMessageContainer.innerText = `Timeout : ${timeLeft}s`;
                if (timeLeft <= 0) {
                    clearInterval(countdownInterval);
                    handleTimeout();
                }
            }, 1000);
        }

        function handleTimeout() {
            const chatBox = document.getElementById('chatBox');
            const timeoutMessageContainer = document.getElementById('timeoutMessageContainer');
            const timeoutMessage = document.createElement('div');
            timeoutMessage.className = 'message bot';
            timeoutMessage.innerText = `Waktu habis! Jawaban : ${currentMath.result}`;
            chatBox.appendChild(timeoutMessage);
            chatBox.scrollTop = chatBox.scrollHeight;
            timeoutMessageContainer.style.display = 'none'; // Hide timeout message after showing
            currentMath = null;
        }

function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.toLowerCase().trim();
    if (message === '') return;

    const chatBox = document.getElementById('chatBox');
    const userMessage = document.createElement('div');
    userMessage.className = 'message user';
    userMessage.innerText = message;
    chatBox.appendChild(userMessage);

    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    // Show typing indicator and reply
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = '<span></span><span></span><span></span> Bot is typing...';
    chatBox.appendChild(typingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {
        chatBox.removeChild(typingIndicator);

        const replyMessage = document.createElement('div');
        replyMessage.className = 'message bot';

        if (currentMath) {
            if (message === currentMath.result.toString()) {
                replyMessage.innerText = "Jawaban benar!";
                currentMath = null; // End the game after correct answer
                clearInterval(countdownInterval);
                document.getElementById('timeoutMessageContainer').style.display = 'none'; // Hide timeout message
            } else if (message === 'nyerah') {
                replyMessage.innerText = `Kamu menyerah! Jawaban yang benar adalah ${currentMath.result}`;
                currentMath = null; // End the game when user surrenders
                clearInterval(countdownInterval);
                document.getElementById('timeoutMessageContainer').style.display = 'none'; // Hide timeout message
            } else {
                replyMessage.innerText = "Jawaban salah, coba lagi!";
            }
        } else {
            const mathCommands = ['.math', 'mulai', 'Mulai', 'start', 'Start', 'go', 'Go'];
            if (mathCommands.includes(message)) {
                startMathGame();
            } else {
                replyMessage.innerText = getReply(message);
            }
        }

        chatBox.appendChild(replyMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 1500);
}
     
        function getReply(message) {
            for (let key in responses) {
                if (message.includes(key)) {
                    return responses[key];
                }
            }
            return "Halo, untuk cara bermain silakan ketik: mulai";
        }

        // Initialize math game on .math command
        document.addEventListener('DOMContentLoaded', () => {
            const input = document.getElementById('messageInput');
            input.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    sendMessage();
                    event.preventDefault();
                }
            });
        });