export const canvas = document.createElement('canvas');
export const ctx = canvas.getContext('2d');

document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;