const toggle = document.getElementById('theme-toggle');

// Load theme from localStorage
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
  document.body.classList.add('dark');
  toggle.textContent = '☀️'; // 버튼 텍스트 변경
} else {
  toggle.textContent = '🌙';
}

toggle.addEventListener('click', () => {
  console.log('Button clicked'); // 클릭 이벤트 확인
  const isDark = document.body.classList.toggle('dark');
  console.log('Dark mode:', isDark); // 다크 모드 상태 확인
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  toggle.textContent = isDark ? '☀️' : '🌙';
});