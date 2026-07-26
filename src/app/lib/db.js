import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data.json');

export function getSubmissions() {
  if (!fs.existsSync(dataFilePath)) {
    return [];
  }
  const data = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(data);
}

export function addSubmission(submission) {
  const submissions = getSubmissions();
  submissions.push({
    id: Date.now(),
    date: new Date().toISOString(),
    ...submission,
  });
  fs.writeFileSync(dataFilePath, JSON.stringify(submissions, null, 2));
}

export function clearSubmissions() {
  fs.writeFileSync(dataFilePath, JSON.stringify([]));
}
