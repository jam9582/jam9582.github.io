const toggle = document.getElementById('theme-toggle');

// Load theme from localStorage
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
  document.body.classList.add('dark');
  toggle.textContent = '☀️'; // 버튼 텍스트 변경
} else {
  toggle.textContent = '🌙';
}

// Toggle theme and save to localStorage
toggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  toggle.textContent = isDark ? '☀️' : '🌙'; // 버튼 텍스트 변경
});
