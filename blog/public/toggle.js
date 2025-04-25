
document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;
    const toggleBtn = document.getElementById('theme-toggle');
  
    // 저장된 테마 불러오기
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      body.classList.add('dark');
    }
  
    toggleBtn.addEventListener('click', () => {
      body.classList.toggle('dark');
      const isDark = body.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  });
  