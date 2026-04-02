const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const TILE_SIZE = 48;

const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1], 
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// 50 CÂU HỎI (Rút gọn mẫu, bạn có thể copy thêm)
const questionBank = [
    // --- NHÓM 1: IN DỮ LIỆU (PRINT) ---
    { m: "In ra chuỗi 'Hello'", r: /print\s*\(\s*['"]Hello['"]\s*\)/, h: "Sử dụng hàm print('Hello')", w: "Nhà thông thái: 'Bạn cần hàm print và nội dung nằm trong ngoặc nháy nhé!'" },
    { m: "In ra số 2026", r: /print\s*\(\s*2026\s*\)/, h: "print(2026)", w: "Số thì không cần dấu nháy đâu em!" },
    { m: "In giá trị của biến x", r: /print\s*\(\s*x\s*\)/, h: "print(x)", w: "Nhà thông thái: 'In biến thì chỉ cần bỏ tên biến vào ngoặc thôi.'" },
    { m: "In nhiều giá trị: 'A' và 'B'", r: /print\s*\(\s*['"]A['"]\s*,\s*['"]B['"]\s*\)/, h: "print('A', 'B')", w: "Dùng dấu phẩy để in nhiều thứ cùng lúc nhé." },

    // --- NHÓM 2: BIẾN VÀ GÁN (VARIABLES) ---
    { m: "Tạo biến x có giá trị 5", r: /\bx\s*=\s*5\b/, h: "x = 5", w: "Dùng dấu = để gán giá trị cho biến." },
    { m: "Tạo biến y có giá trị 20", r: /\by\s*=\s*20\b/, h: "y = 20", w: "Tên biến bên trái, giá trị bên phải." },
    { m: "Gán giá trị biến y cho x", r: /\bx\s*=\s*y\b/, h: "x = y", w: "Lệnh này sẽ copy giá trị từ y sang x." },
    { m: "Tạo biến name là 'Python'", r: /name\s*=\s*['"]Python['"]/, h: "name = 'Python'", w: "Chuỗi ký tự bắt buộc phải có dấu nháy." },

    // --- NHÓM 3: TOÁN TỬ (OPERATORS) ---
    { m: "Thực hiện phép cộng 2 + 3", r: /2\s*\+\s*3/, h: "2 + 3", w: "Dùng dấu + thông thường thôi." },
    { m: "Thực hiện phép trừ 5 - 2", r: /5\s*-\s*2/, h: "5 - 2", w: "Toán tử trừ là dấu gạch ngang -." },
    { m: "Thực hiện phép nhân 4 nhân 3", r: /4\s*\*\s*3/, h: "Sử dụng dấu *", w: "Lưu ý: Trong lập trình nhân là dấu sao *." },
    { m: "Thực hiện phép chia 10 cho 2", r: /10\s*\/\s*2/, h: "Sử dụng dấu /", w: "Phép chia dùng dấu xuyệt phải /." },
    { m: "Chia lấy phần nguyên 10 cho 3", r: /10\s*\/\/\s*3/, h: "Sử dụng dấu //", w: "Dùng hai dấu // để lấy phần nguyên (ví dụ 10//3 được 3)." },
    { m: "Chia lấy phần dư 10 cho 3", r: /10\s*%\s*3/, h: "Sử dụng dấu %", w: "Dấu % giúp lấy phần dư của phép chia." },
    { m: "Tính lũy thừa 2 mũ 3", r: /2\s*\*\*\s*3/, h: "Sử dụng dấu **", w: "Dùng hai dấu sao ** để tính số mũ nhé." },

    // --- NHÓM 4: CHUỖI (STRINGS) ---
    { m: "Tạo một chuỗi tên 'python'", r: /['"]python['"]/, h: "Bao quanh bởi dấu nháy", w: "Chuỗi có thể dùng nháy đơn hoặc nháy kép." },
    { m: "Nối chuỗi 'abc' và 'def'", r: /['"]abc['"]\s*\+\s*['"]def['"]/, h: "'abc' + 'def'", w: "Dùng dấu + để dính các chuỗi lại với nhau." },
    { m: "Đếm số ký tự trong chuỗi 'code'", r: /len\s*\(\s*['"]code['"]\s*\)/, h: "len('code')", w: "len là viết tắt của length (độ dài)." },
    { m: "Lặp lại chuỗi 'Hi' 3 lần", r: /['"]Hi['"]\s*\*\s*3/, h: "'Hi' * 3", w: "Dấu * với chuỗi sẽ làm nó lặp lại." },
    { m: "Viết hoa chuỗi s", r: /s\.upper\s*\(\s*\)/, h: "s.upper()", w: "Hàm .upper() sẽ biến tất cả thành chữ hoa." },

    // --- NHÓM 5: NHẬP DỮ LIỆU (INPUT) ---
    { m: "Hàm nhập dữ liệu từ phím", r: /input\s*\(\s*\)/, h: "Sử dụng input()", w: "Hàm này dùng để nhận tương tác từ người dùng." },
    { m: "Gán x bằng dữ liệu nhập vào", r: /\bx\s*=\s*input\s*\(\s*\)/, h: "x = input()", w: "Nhà thông thái: 'Đừng quên cặp ngoặc đơn sau input nhé!'" },
    { m: "Nhập kèm lời mời 'Nhập tên:'", r: /input\s*\(\s*['"]Nhập tên:['"]\s*\)/, h: "input('Nhập tên:')", w: "Bạn có thể đưa lời mời vào trong hàm input." },

    // --- NHÓM 6: SO SÁNH (COMPARISON) ---
    { m: "Kiểm tra x có bằng 5 không", r: /\bx\s*==\s*5\b/, h: "Dùng dấu ==", w: "Một dấu = là gán, hai dấu == là so sánh bằng." },
    { m: "Kiểm tra x có khác 10 không", r: /\bx\s*!=\s*10\b/, h: "Dùng dấu !=", w: "Dấu chấm than và dấu bằng có nghĩa là 'không bằng'." },
    { m: "Kiểm tra x lớn hơn 3", r: /\bx\s*>\s*3\b/, h: "x > 3", w: "Dùng toán tử so sánh lớn hơn >." },
    { m: "Kiểm tra x nhỏ hơn hoặc bằng 7", r: /\bx\s*<=\s*7\b/, h: "x <= 7", w: "Dấu nhỏ hơn viết trước, dấu bằng viết sau." },

    // --- NHÓM 7: ĐIỀU KIỆN (IF-ELSE) ---
    { m: "Cấu trúc if cơ bản", r: /if\s+.+:/, h: "if điều_kiện:", w: "Nhà thông thái: 'Dấu hai chấm ở cuối dòng if là bắt buộc!'" },
    { m: "Nếu x bằng 5 thì...", r: /if\s+x\s*==\s*5\s*:/, h: "if x == 5:", w: "Đừng quên hai dấu bằng và dấu hai chấm nhé." },
    { m: "Kiểm tra nếu x dương (x > 0)", r: /if\s+x\s*>\s*0\s*:/, h: "if x > 0:", w: "Điều kiện nằm giữa if và dấu hai chấm." },

    // --- NHÓM 8: VÒNG LẶP (LOOPS) ---
    { m: "Tạo dãy số từ 0 đến 4", r: /range\s*\(\s*5\s*\)/, h: "range(5)", w: "Hàm range(n) tạo dãy từ 0 đến n-1." },
    { m: "Vòng lặp for lặp 10 lần", r: /for\s+\w+\s+in\s+range\s*\(\s*10\s*\)\s*:/, h: "for i in range(10):", w: "Cấu trúc vòng lặp for cần dấu hai chấm." },
    { m: "Vòng lặp while x nhỏ hơn 5", r: /while\s+x\s*<\s*5\s*:/, h: "while x < 5:", w: "While sẽ lặp chừng nào điều kiện còn đúng." },

    // --- NHÓM 9: DANH SÁCH (LIST) ---
    { m: "Tạo một list rỗng tên a", r: /\ba\s*=\s*\[\s*\]/, h: "a = []", w: "Dùng ngoặc vuông [] để tạo danh sách." },
    { m: "Tạo list có 3 số: 1, 2, 3", r: /\[\s*1\s*,\s*2\s*,\s*3\s*\]/, h: "[1, 2, 3]", w: "Các phần tử ngăn cách nhau bởi dấu phẩy." },
    { m: "Thêm số 10 vào cuối list a", r: /a\.append\s*\(\s*10\s*\)/, h: "a.append(10)", w: "Hàm .append() dùng để thêm phần tử vào list." },
    { m: "Xóa hết các phần tử trong list a", r: /a\.clear\s*\(\s*\)/, h: "a.clear()", w: "Clear sẽ làm sạch danh sách của bạn." },
    { m: "Lấy phần tử đầu tiên của list a", r: /a\s*\[\s*0\s*\]/, h: "a[0]", w: "Trong Python, vị trí đầu tiên là số 0." },

    // --- NHÓM 10: HÀM VÀ KIỂU DỮ LIỆU ---
    { m: "Định nghĩa hàm tên 'hello'", r: /def\s+hello\s*\(\s*\)\s*:/, h: "def hello():", w: "Dùng từ khóa def để tạo hàm mới." },
    { m: "Gọi thực thi hàm hello()", r: /hello\s*\(\s*\)/, h: "hello()", w: "Viết tên hàm kèm cặp ngoặc để chạy nó." },
    { m: "Ép kiểu x sang số nguyên", r: /int\s*\(\s*x\s*\)/, h: "int(x)", w: "Hàm int() giúp chuyển đổi sang kiểu số nguyên." },
    { m: "Ép kiểu x sang số thực", r: /float\s*\(\s*x\s*\)/, h: "float(x)", w: "Hàm float() dùng cho số thập phân." },
    { m: "Ép kiểu x sang chuỗi", r: /str\s*\(\s*x\s*\)/, h: "str(x)", w: "Hàm str() biến mọi thứ thành chữ." },

    // --- NHÓM 11: LOGIC VÀ KHÁC ---
    { m: "Viết một dòng ghi chú (comment)", r: /#.+/, h: "Dùng dấu #", w: "Bất cứ thứ gì sau dấu # sẽ không bị máy tính chạy." },
    { m: "Giá trị Đúng trong Logic", r: /\bTrue\b/, h: "True", w: "Lưu ý: Python viết hoa chữ T trong True." },
    { m: "Giá trị Sai trong Logic", r: /\bFalse\b/, h: "False", w: "Lưu ý: Python viết hoa chữ F trong False." },
    { m: "Kiểm tra kiểu dữ liệu của x", r: /type\s*\(\s*x\s*\)/, h: "type(x)", w: "Hàm type giúp bạn biết x là số hay chuỗi." },
    { m: "Thoát vòng lặp lập tức", r: /\bbreak\b/, h: "break", w: "Dùng lệnh break để dừng vòng lặp ngay chưa cần xong." }
];
let currentIdx = 0;
let playerPos = { x: 1, y: 1 };
let canMove = false;
let hearts = 5;
let helps = { hint: false, wise: false, call: false };
let gameQuestions = questionBank.sort(() => Math.random() - 0.5);
const gifts = ["10.000 VND 💸", "May mắn lần sau 🧊", "Ra chơi sớm 5 phút 🏃‍♂️"].sort(() => Math.random() - 0.5);

function startGame() {
    document.getElementById('intro-modal').classList.add('hidden');
    updateUI();
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Vẽ bản đồ
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            let x = c * TILE_SIZE, y = r * TILE_SIZE;
            if (map[r][c] === 1) {
                ctx.fillStyle = "#161b22";
                ctx.roundRect(x+3, y+3, TILE_SIZE-6, TILE_SIZE-6, 8);
                ctx.fill();
            } else if (map[r][c] === 2) {
                ctx.font = "30px Arial";
                ctx.fillText("💎", x + 8, y + 35);
            }
        }
    }

    // Vẽ nhân vật đẹp hơn
    const px = playerPos.x * TILE_SIZE, py = playerPos.y * TILE_SIZE;
    // Hiệu ứng bóng neon
    ctx.save();
    ctx.shadowBlur = 30;
    ctx.shadowColor = "#00fff7";
    ctx.beginPath();
    ctx.arc(px + 24, py + 24, 20, 0, Math.PI * 2);
    ctx.fillStyle = "#2ecc71";
    ctx.fill();
    ctx.shadowBlur = 0;
    // Viền ngoài neon
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#00fff7";
    ctx.stroke();
    // Mắt
    ctx.beginPath();
    ctx.arc(px + 17, py + 20, 3, 0, Math.PI * 2);
    ctx.arc(px + 31, py + 20, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px + 17, py + 20, 1.2, 0, Math.PI * 2);
    ctx.arc(px + 31, py + 20, 1.2, 0, Math.PI * 2);
    ctx.fillStyle = "#00fff7";
    ctx.fill();

    // Miệng cười động
    ctx.save();
    ctx.beginPath();
    // Tạo hiệu ứng miệng cười/mím bằng cách thay đổi góc cung tròn theo thời gian
    const t = Date.now() / 400; // tốc độ chuyển động
    // Giá trị dao động từ 0 (mím) đến 1 (cười)
    const smile = 0.5 + 0.5 * Math.sin(t);
    // Di chuyển miệng lên gần mắt hơn (py + 28)
    const mouthY = py + 28;
    // Góc mở miệng: cười rộng hơn khi smile lớn
    const startAngle = 0.25 * Math.PI + 0.15 * Math.PI * (1 - smile);
    const endAngle = 0.75 * Math.PI - 0.15 * Math.PI * (1 - smile);
    ctx.arc(px + 24, mouthY, 7, startAngle, endAngle, false);
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = "#fff";
    ctx.stroke();
    ctx.restore();
    ctx.restore();

    // Vẽ logo ở góc trên canvas
    if (window.logoImg && window.logoImg.complete) {
        ctx.save();
        ctx.globalAlpha = 0.92;
        ctx.drawImage(window.logoImg, canvas.width - 90, 10, 80, 80);
        ctx.restore();
    }

    if (map[playerPos.y][playerPos.x] === 2) document.getElementById('gift-overlay').classList.remove('hidden');
    requestAnimationFrame(draw);
}

// Tải logo.png vào window.logoImg
window.logoImg = new window.Image();
window.logoImg.src = 'logo.png';

document.getElementById('check-btn').addEventListener('click', () => {
    const code = document.getElementById('code-input').value.trim();
    const container = document.querySelector('.game-container');

    if (gameQuestions[currentIdx].r.test(code)) {
        canMove = true;
        document.getElementById('input-zone').classList.add('hidden');
        document.getElementById('controls').classList.remove('hidden');
        document.getElementById('console-out').innerText = ">>> Chính xác! Hãy di chuyển.";
        document.getElementById('console-out').style.color = "#2ecc71";
    } else {
        hearts--;
        updateHearts();
        container.classList.add('shake');
        setTimeout(() => container.classList.remove('shake'), 300);
        
        if (hearts <= 0) {
            alert("💔 HẾT TIM RỒI! Bạn bị loại. Hãy thử lại từ đầu nhé.");
            location.reload();
        } else {
            const hint = gameQuestions[currentIdx].h ? `\nGợi ý: ${gameQuestions[currentIdx].h}` : "";
            document.getElementById('console-out').innerText = `>>> Sai rồi! Bạn mất 1 ❤️. Còn ${hearts} tim. ${hint}`;
            document.getElementById('console-out').style.color = "#ff4757";
        }
    }
});

function updateHearts() {
    document.getElementById('heart-container').innerText = "❤️".repeat(hearts);
}

function useHelp(type) {
    if (helps[type]) return;
    helps[type] = true;
    document.getElementById(`help-${type}`).classList.add('used');
    const q = gameQuestions[currentIdx];
    if (type === 'hint') document.getElementById('console-out').innerText = "💡 Gợi ý: " + q.h;
    else if (type === 'wise') alert("🧙 Thông thái: " + q.w);
    else if (type === 'call') {
        document.getElementById('call-modal').classList.remove('hidden');
    }
}

// Xử lý form gọi điện
document.addEventListener('DOMContentLoaded', function() {
    var callForm = document.getElementById('call-form');
    if (callForm) {
        callForm.onsubmit = function(e) {
            e.preventDefault();
            document.getElementById('call-modal').classList.add('hidden');
            document.getElementById('call-result-modal').classList.remove('hidden');
        };
    }
});

function closeCallResult() {
    document.getElementById('call-result-modal').classList.add('hidden');
}

function movePlayer(dx, dy) {
    if (!canMove) return;
    let nX = playerPos.x + dx, nY = playerPos.y + dy;
    if (map[nY][nX] !== 1) {
        playerPos.x = nX; playerPos.y = nY;
        canMove = false; currentIdx++;
        if (currentIdx >= gameQuestions.length) gameQuestions = gameQuestions.sort(() => Math.random() - 0.5);
        updateUI();
    }
}

function openGift(i) {
    document.getElementById('card-zone').classList.add('hidden');
    document.getElementById('gift-result').classList.remove('hidden');
    document.getElementById('reward-text').innerText = "PHẦN QUÀ: " + gifts[i];
}

function updateUI() {
    document.getElementById('lvl-num').innerText = currentIdx + 1;
    document.getElementById('mission-text').innerText = gameQuestions[currentIdx].m;
    document.getElementById('code-input').value = "";
    document.getElementById('input-zone').classList.remove('hidden');
    document.getElementById('controls').classList.add('hidden');
}