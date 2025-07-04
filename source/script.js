// Toggle Panel Settings
const settingsToggle = document.getElementById("settingsToggle");
const settingsPanel = document.getElementById("settingsPanel");

settingsToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  settingsPanel.classList.toggle("hidden");
});

document.addEventListener("click", (e) => {
  if (!settingsPanel.contains(e.target) && !settingsToggle.contains(e.target)) {
    settingsPanel.classList.add("hidden");
  }
});

document.querySelectorAll('#nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    settingsPanel.classList.add('hidden');
  });
});

// Theme Toggle
const themeSelector = document.getElementById("themeSelector");
themeSelector.addEventListener("change", () => {
  const theme = themeSelector.value;
  document.body.classList.remove("dark", "light");
  document.body.classList.add(theme);
});

// Font Toggle
const fontSelector = document.getElementById("fontSelector");
fontSelector.addEventListener("change", () => {
  const font = fontSelector.value;
  document.documentElement.style.setProperty("--font-main", font);
});

// Menu Scroll
const menuSelector = document.getElementById('menuSelector');
menuSelector.addEventListener('change', () => {
  const section = menuSelector.value;
  const target = document.getElementById(section);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
});

// Color Swatch Toggle
document.querySelectorAll('.color-swatch').forEach(swatch => {
  swatch.addEventListener('click', () => {
    const colorClass = swatch.getAttribute("data-color");
    const colorValue = getComputedStyle(document.documentElement).getPropertyValue(`--${colorClass}`);
    document.documentElement.style.setProperty("--theme-color", colorValue.trim());

    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
    swatch.classList.add('active');
  });
});

  // Contact Form Submission
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();

      const nama = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const subjek = document.getElementById("subject").value;
      const pesan = document.getElementById("message").value;

      alert(`Thank you, ${nama}!\nYour message has been sent.\n\nEmail : ${email}\nSubject : ${subjek}\nMessage : ${pesan}`);

      form.reset();
    });
  }

// Neumorphic press effect
document.querySelectorAll('.neumorphic').forEach(el => {
  el.addEventListener('mousedown', () => el.classList.add('pressed'));
  el.addEventListener('mouseup', () => el.classList.remove('pressed'));
  el.addEventListener('mouseleave', () => el.classList.remove('pressed'));
});

// no select and copy paste 
document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("selectstart", e => e.preventDefault());
document.addEventListener("copy", e => e.preventDefault());

// hadist 
async function loadHadist() {
  try {
    const res = await fetch('library/hadist.json');
    const arr = await res.json();
    const rnd = arr[Math.floor(Math.random() * arr.length)];
    document.getElementById('hadist-text').textContent = `"${rnd.text}"`;
    document.getElementById('hadist-source').textContent = rnd.source;
  } catch (e) {
    console.error(e);
    document.getElementById('hadist-text').textContent = "Error Loading Data";
  }
}
loadHadist();

// founder 
fetch('library/founder.json')
  .then(res => res.json())
  .then(data => {
    const penasehatList = document.getElementById('list-penasehat');
    const badanList = document.getElementById('list-badan');
    const harianList = document.getElementById('list-harian');

    data.penasehat.forEach(nama => {
      penasehatList.innerHTML += `<li>${nama}</li>`;
    });

    data.badan_jamaah.forEach(nama => {
      badanList.innerHTML += `<li>${nama}</li>`;
    });

    data.pengurus_harian.forEach(entry => {
      harianList.innerHTML += `<li>${entry.jabatan} - ${entry.nama}</li>`;
    });
  });

// members 
const membersPerPage = 6;
let currentPage = 0;
let members = []; 

const container = document.getElementById('member-container');
const totalAnggota = document.getElementById('totalAnggota');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

function renderMembers() {
  container.innerHTML = "";

  const start = currentPage * membersPerPage;
  const end = start + membersPerPage;
  const currentMembers = members.slice(start, end);
  const defaultPhoto = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  currentMembers.forEach(member => {
    const card = document.createElement('div');
    card.className = 'member-card';
    card.innerHTML = `
      <img src="${member.photo || defaultPhoto}" alt="${member.name}" class="member-photo" />
      <h3 class="member-name">${member.name}</h3>
      <p class="member-role">${member.role}</p>
      <span class="member-status">${member.status}</span>
      <div class="member-socials">
        ${member.instagram ? `<a href="${member.instagram}" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>` : ""}
        ${member.facebook ? `<a href="${member.facebook}" target="_blank" title="Facebook"><i class="fab fa-facebook"></i></a>` : ""}
        ${member.whatsapp ? `<a href="${member.whatsapp}" target="_blank" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>` : ""}
        ${member.email ? `<a href="mailto:${member.email}" title="Email"><i class="fas fa-envelope"></i></a>` : ""}
      </div>
    `;
    container.appendChild(card);
  });

  totalAnggota.textContent = `( ${members.length} )`;
  prevBtn.disabled = currentPage === 0;
  nextBtn.disabled = end >= members.length;
}

prevBtn.addEventListener('click', () => {
  if (currentPage > 0) {
    currentPage--;
    renderMembers();
  }
});

nextBtn.addEventListener('click', () => {
  if ((currentPage + 1) * membersPerPage < members.length) {
    currentPage++;
    renderMembers();
  }
});

fetch('library/members.json')
  .then(response => {
    if (!response.ok) throw new Error('Network response not OK');
    return response.json();
  })
  .then(data => {
    members = data;  
    renderMembers(); 
  })
  .catch(error => {
    container.innerHTML = `<p>Error Loading Data : ${error.message}</p>`;
    totalAnggota.textContent = '( 0 )';
  });
  