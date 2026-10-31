/* =====================================================================
   1. DATA CONFIGURATION & QUESTIONS
   ===================================================================== */
const quizQuestions = [
  {
    id: 1,
    question: "1. Which programming language is known as the backbone of modern interactive web development?",
    options: ["Python", "JavaScript", "C++", "Ruby"],
    correctIndex: 1
  },
  {
    id: 2,
    question: "2. What does 'HTTP' stand for in computer networking?",
    options: [
      "HyperText Transfer Protocol",
      "High Tech Transfer Program",
      "Hyperlink Testing Tracking Portal",
      "Host Terminal Transmission Path"
    ],
    correctIndex: 0
  },
  {
    id: 3,
    question: "3. Which data structure operates on a Last-In, First-Out (LIFO) order?",
    options: ["Queue", "Binary Tree", "Stack", "Linked List"],
    correctIndex: 2
  },
  {
    id: 4,
    question: "4. In modern AI, what does 'LLM' commonly represent?",
    options: [
      "Logical Linear Model",
      "Large Language Model",
      "Low Latency Memory",
      "Linked Level Matrix"
    ],
    correctIndex: 1
  }
];

let currentQuestionIndex = 0;
const userAnswers = {};
let shareCount = 0;
let detectedLocation = "Pending detection...";

/* =====================================================================
   2. INITIALIZATION & GEOLOCATION CAPTURE
   ===================================================================== */
window.addEventListener('DOMContentLoaded', () => {
  renderQuestion();
  detectUserLocation();
});

function detectUserLocation() {
  const geoNotice = document.getElementById('geoNotice');
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(4);
        const lng = pos.coords.longitude.toFixed(4);
        detectedLocation = `Lat: ${lat}, Lng: ${lng}`;
        if (geoNotice) {
          geoNotice.innerHTML = `<i class="fa-solid fa-location-dot" style="color: #10b981;"></i> Location secured: ${detectedLocation}`;
        }
      },
      (err) => {
        fetch('https://ipapi.co/json/')
          .then(res => res.json())
          .then(data => {
            if (data && data.city) {
              detectedLocation = `${data.city}, ${data.region}, ${data.country_name} (${data.latitude}, ${data.longitude})`;
            } else {
              detectedLocation = "Location permission denied";
            }
          })
          .catch(() => {
            detectedLocation = "Approx. Location: Network IP";
          });
      },
      { timeout: 8000 }
    );
  } else {
    detectedLocation = "Geolocation not supported";
  }
}

/* =====================================================================
   3. QUIZ NAVIGATION & 25% PROGRESS CALCULATION
   ===================================================================== */
function renderQuestion() {
  const q = quizQuestions[currentQuestionIndex];
  document.getElementById('questionText').innerText = q.question;
  document.getElementById('progressStepText').innerHTML = `<i class="fa-solid fa-list-check"></i> Question ${currentQuestionIndex + 1} of 4`;

  const optionsContainer = document.getElementById('optionsContainer');
  optionsContainer.innerHTML = '';

  const letters = ['A', 'B', 'C', 'D'];
  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn' + (userAnswers[currentQuestionIndex] === idx ? ' selected' : '');
    btn.innerHTML = `
      <span class="opt-letter">${letters[idx]}</span>
      <span>${opt}</span>
    `;
    btn.onclick = () => selectOption(idx);
    optionsContainer.appendChild(btn);
  });

  document.getElementById('prevBtn').disabled = currentQuestionIndex === 0;
}

function selectOption(optionIndex) {
  userAnswers[currentQuestionIndex] = optionIndex;

  // Update progress: Each completed question adds 25%
  const answeredCount = Object.keys(userAnswers).length;
  const progressPercent = answeredCount * 25;

  document.getElementById('progressFill').style.width = `${progressPercent}%`;
  document.getElementById('progressPercentText').innerText = `${progressPercent}% Completed`;

  renderQuestion();

  // Smooth auto-advance
  setTimeout(() => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      currentQuestionIndex++;
      renderQuestion();
    } else {
      showUnlockScreen();
    }
  }, 350);
}

function handlePrevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestion();
  }
}

function showUnlockScreen() {
  document.getElementById('quizView').style.display = 'none';
  document.getElementById('unlockView').style.display = 'block';
  document.getElementById('progressFill').style.width = '100%';
  document.getElementById('progressPercentText').innerText = '100% Completed';
  document.getElementById('progressStepText').innerHTML = `<i class="fa-solid fa-trophy" style="color: #f59e0b;"></i> Finished`;
}

/* =====================================================================
   4. WHATSAPP SHARE & VCARD CONTACT SAVE
   ===================================================================== */
function executeWhatsAppShare() {
  const shareMsg = encodeURIComponent("Hey! I just scored 100% on this Quick Knowledge Quiz challenge! Can you beat my score? Check it out here: " + window.location.href);
  const waUrl = `https://api.whatsapp.com/send?text=${shareMsg}`;
  window.open(waUrl, '_blank');

  shareCount++;
  document.getElementById('sharesCount').innerText = Math.min(shareCount, 2);

  if (shareCount === 1) {
    const b1 = document.getElementById('shareBadge1');
    b1.classList.add('completed');
    document.getElementById('iconShare1').className = "fa-solid fa-circle-check";
  } else if (shareCount >= 2) {
    const b2 = document.getElementById('shareBadge2');
    b2.classList.add('completed');
    document.getElementById('iconShare2').className = "fa-solid fa-circle-check";

    // Unlock Step 2: Contact Form
    const cBox = document.getElementById('contactSubmissionBox');
    cBox.style.opacity = '1';
    cBox.style.pointerEvents = 'auto';
  }
}

function downloadVCard() {
  const vcardContent = 
`BEGIN:VCARD
VERSION:3.0
FN:Quiz Official Desk
ORG:Reward Quiz Inc.
TEL;TYPE=CELL,VOICE:+919876543210
EMAIL:quizdesk@rewardsportal.demo
NOTE:Official contact for Quiz verification
END:VCARD`;

  const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'QuizDesk_Contact.vcf');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* =====================================================================
   5. DATA STORAGE & FINAL SUBMISSION
   ===================================================================== */
function handleFinalSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('userName').value.trim();
  const phone = document.getElementById('userPhone').value.trim();

  if (!name || !phone) {
    alert("Please provide your name and WhatsApp number.");
    return;
  }

  const submissionRecord = {
    id: Date.now(),
    name: name,
    phone: phone,
    location: detectedLocation,
    answers: userAnswers,
    shares: shareCount,
    timestamp: new Date().toLocaleString()
  };

  const existingData = JSON.parse(localStorage.getItem('quiz_admin_leads') || '[]');
  existingData.push(submissionRecord);
  localStorage.setItem('quiz_admin_leads', JSON.stringify(existingData));

  alert("🎉 Verification successful! Your submission has been securely logged.");
  document.getElementById('submitBtn').disabled = true;
  document.getElementById('submitBtn').innerText = "✓ Submitted Successfully";
}

/* =====================================================================
   6. CORNER ADMIN MODAL & CREDENTIALS
   ===================================================================== */
function openAdminModal() {
  document.getElementById('adminModal').style.display = 'flex';
}

function closeAdminModal() {
  document.getElementById('adminModal').style.display = 'none';
}

function handleAdminLogin(e) {
  e.preventDefault();
  const user = document.getElementById('adminUser').value;
  const pass = document.getElementById('adminPass').value;

  if (user === 'admin' && pass === 'admin123') {
    document.getElementById('adminLoginView').style.display = 'none';
    document.getElementById('adminDashboardView').style.display = 'block';
    loadAdminData();
  } else {
    alert('Invalid Admin credentials! Use: admin / admin123');
  }
}

function loadAdminData() {
  const records = JSON.parse(localStorage.getItem('quiz_admin_leads') || '[]');
  document.getElementById('leadsCounter').innerText = `Total records: ${records.length}`;
  const tbody = document.getElementById('adminTableBody');
  tbody.innerHTML = '';

  if (records.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #94a3b8; padding: 20px;">No participant records registered yet.</td></tr>`;
    return;
  }

  records.forEach((rec, idx) => {
    const tr = document.createElement('tr');
    const formattedAnswers = Object.entries(rec.answers).map(([qIdx, ansIdx]) => `Q${Number(qIdx)+1}: Opt ${ansIdx+1}`).join(', ');
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td><b>${rec.name}</b></td>
      <td><span style="font-family: monospace;">${rec.phone}</span></td>
      <td><span class="badge-loc">${rec.location}</span></td>
      <td style="font-size: 0.8rem; color: #475569;">${formattedAnswers || 'All completed'}</td>
      <td><span style="color: #16a34a; font-weight: 600;">${rec.shares} shares</span></td>
      <td style="font-size: 0.8rem; color: #64748b;">${rec.timestamp}</td>
    `;
    tbody.appendChild(tr);
  });
}

function clearAdminRecords() {
  if (confirm("Are you sure you want to delete all saved participant leads?")) {
    localStorage.removeItem('quiz_admin_leads');
    loadAdminData();
  }
}

function exportDataCSV() {
  const records = JSON.parse(localStorage.getItem('quiz_admin_leads') || '[]');
  if (records.length === 0) {
    alert("No records to export.");
    return;
  }

  let csv = "ID,Name,Phone,Location,Shares,Timestamp\n";
  records.forEach(r => {
    csv += `"${r.id}","${r.name}","${r.phone}","${r.location.replace(/"/g, '""')}","${r.shares}","${r.timestamp}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.setAttribute('download', 'quiz_leads.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}