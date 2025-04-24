import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { marked } from 'marked';

// __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 폴더 경로
const postsDir = path.join(__dirname, 'posts');
const outputDir = path.join(__dirname, 'public');
const templatesDir = path.join(__dirname, 'templates');

// 템플릿 로드
const indexTemplate = fs.readFileSync(path.join(templatesDir, 'index.html'), 'utf-8');
const postTemplate = fs.readFileSync(path.join(templatesDir, 'post.html'), 'utf-8');

// 글 목록 생성
let postListHtml = '';

fs.readdirSync(postsDir).forEach((filename) => {
  const filePath = path.join(postsDir, filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { content, data } = matter(raw);
  const html = marked(content);
  const slug = filename.replace(/\.md$/, '');

  // 포스트 페이지 생성
  const postHtml = postTemplate
    .replace('{{title}}', data.title || slug)
    .replace('{{content}}', html);

  fs.writeFileSync(path.join(outputDir, `${slug}.html`), postHtml);
  postListHtml += `<li><a href="${slug}.html">${data.title || slug}</a></li>`;
});

// 인덱스 페이지 생성
const indexHtml = indexTemplate.replace('{{posts}}', `<ul>${postListHtml}</ul>`);
fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);

console.log('블로그 빌드 완료! public/ 폴더를 확인해보자');