import { mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import ffmpegPath from 'ffmpeg-static';

const root = new URL('..', import.meta.url).pathname.replace(/^\/(.:)/, '$1');
const outputDir = `${root}docs/video-assets`;
mkdirSync(outputDir, { recursive: true });

const storyboard = `${outputDir}/storyboard-keyframe.png`;
const incident = 'C:/Users/thoma/Downloads/Screen_Recording_20260824_030905_HoleFilled.mp4';
const outreach = 'C:/Users/thoma/Downloads/Screen_Recording_20260824_060757_HoleFilled.mp4';
const output = `${outputDir}/holefilled-submission-first-cut.mp4`;
const font = 'C\\:/Windows/Fonts/arialbd.ttf';

const verticalClip = (input, start, end, label, outputLabel) =>
  `[${input}:v]trim=start=${start}:end=${end},setpts=PTS-STARTPTS,split=2[b${outputLabel}][f${outputLabel}];` +
  `[b${outputLabel}]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,boxblur=20:10[bb${outputLabel}];` +
  `[f${outputLabel}]scale=-2:1000[ff${outputLabel}];` +
  `[bb${outputLabel}][ff${outputLabel}]overlay=(W-w)/2:(H-h)/2,drawbox=x=0:y=0:w=iw:h=108:color=0x10231F@0.94:t=fill,drawtext=fontfile='${font}':text='${label}':fontcolor=white:fontsize=34:x=(w-text_w)/2:y=36,format=yuv420p[v${outputLabel}]`;

const filter = [
  `[0:v]scale=1920:1080,setsar=1,drawbox=x=0:y=0:w=iw:h=108:color=0x10231F@0.94:t=fill,drawtext=fontfile='${font}':text='WHEN A SHIFT IS AT RISK':fontcolor=white:fontsize=42:x=(w-text_w)/2:y=30,format=yuv420p[v0]`,
  verticalClip(1, 12, 20, 'CRITICAL COVERAGE GAP DETECTED', 1),
  verticalClip(2, 18, 27, 'QUALIFIED FILLERS RESPOND', 2),
  verticalClip(2, 70, 77, 'THE BEST FIT RISES TO THE TOP', 3),
  `[0:v]scale=1920:1080,setsar=1,drawbox=x=0:y=0:w=iw:h=170:color=0x10231F@0.94:t=fill,drawtext=fontfile='${font}':text='HOLEFILLED':fontcolor=white:fontsize=54:x=(w-text_w)/2:y=28,drawtext=fontfile='${font}':text='Fill the hole before it becomes a problem.':fontcolor=0xD9F3E9:fontsize=31:x=(w-text_w)/2:y=100,format=yuv420p[v4]`,
  '[v0][v1][v2][v3][v4]concat=n=5:v=1:a=0[outv]',
].join(';');

const result = spawnSync(ffmpegPath, [
  '-y', '-loop', '1', '-t', '4', '-i', storyboard,
  '-i', incident,
  '-i', outreach,
  '-filter_complex', filter,
  '-map', '[outv]', '-r', '30', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-movflags', '+faststart', output,
], { stdio: 'inherit' });

process.exit(result.status ?? 1);
