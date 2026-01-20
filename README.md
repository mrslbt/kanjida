# Kanjida - Spaced Repetition Kanji Quiz

Master N2-level Japanese kanji in 3 months with an intelligent spaced repetition quiz app!

## 🎯 Features

### Spaced Repetition Algorithm
- **Progressive difficulty**: Start with N5 → N4 → N3 → N2
- **Adaptive learning**: Failed cards reappear more frequently
- **Smart intervals**: Correct answers increase review intervals (1 day → 2 → 4 → 8 → 30 days)
- **Mastery tracking**: Tracks correct/incorrect counts per kanji

### Time Pressure Learning
- **10-second timer** per question
- **Streak multipliers**: Consecutive correct answers boost your score
- **Daily goals**: Track progress with 100 reviews/day target

### Comprehensive Kanji Database
- **N5**: 80 kanji (most common)
- **N4**: 53 kanji (everyday use)
- **N3**: 40 kanji (intermediate)
- **N2**: 40 kanji (advanced)
- **Total**: 213+ kanji (expandable to 1000+)

### Progress Tracking
- **Level-by-level progress**: Visual progress bars for each JLPT level
- **Daily streaks**: Maintain your learning momentum
- **Score system**: Points earned based on streak multipliers
- **Mastered kanji**: Track kanji you've mastered (3+ correct, 7+ day interval)

## 🚀 Getting Started

### Development

```bash
# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 🎮 How to Use

### Home Screen
- View your total score, current streak, and daily progress
- See progress bars for each JLPT level (N5-N2)
- Click "Start Quiz" to begin

### Quiz Mode
- **Large kanji** displayed in center
- **4 answer choices** below
- **10-second timer** (turns red at 3 seconds)
- **Color feedback**: Green = correct, Red = wrong
- **Level badge**: Shows N5/N4/N3/N2 difficulty

### Scoring
- Base points: 10 per correct answer
- Streak multiplier: Up to 10x (max 100 points/question)
- Failed answers reset your streak

## 📊 Learning Strategy for N2 Mastery

### 3-Month Plan
- **Month 1**: Master N5 + N4 (foundation)
- **Month 2**: Focus on N3 (intermediate)
- **Month 3**: N2 kanji (advanced)

### Daily Routine
- **100 reviews/day** = ~15-20 minutes
- **Morning**: 50 reviews (fresh mind)
- **Evening**: 50 reviews (reinforce)
- **Trust the algorithm**: It shows kanji when you need them

### Spaced Repetition Logic
```
First correct: Review tomorrow (1 day)
Second correct: Review in 2 days
Third correct: Review in 4 days
Fourth correct: Review in 8 days
Mastered: Review in 30 days

Wrong answer: Reset to 1 day
```

## 🛠️ Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling with gradients
- **Zustand** - State management with persistence
- **LocalStorage** - Progress saved automatically

## 💰 Cost

**$0/month** - Everything runs client-side:
- No backend needed
- No database costs
- Deploy free on Vercel (100GB bandwidth)

## 🌐 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or use the [Vercel Dashboard](https://vercel.com):
1. Import your GitHub repo
2. Click "Deploy"
3. Done! ✨

See `DEPLOYMENT.md` for details.

## 📱 Mobile Optimized

- Touch-friendly interface
- Responsive design
- Works as PWA (install on home screen)
- Offline support after first load

## 🔮 Future Enhancements

- [ ] Expand to full N2 database (1000+ kanji)
- [ ] Add audio pronunciation
- [ ] Mnemonic stories for each kanji
- [ ] Confusion matrix (track similar kanji you mix up)
- [ ] Reading passages (N2 comprehension practice)
- [ ] Export/import progress
- [ ] Dark mode
- [ ] Custom study sets

## 📝 Data Structure

### Kanji Card
```typescript
{
  kanji: '日',
  reading: 'にち、ひ、か',
  meaning: 'day, sun',
  level: 'N5',
  correctCount: 5,
  incorrectCount: 1,
  interval: 8,  // days
  lastReviewed: 1234567890
}
```

### Progress Tracking
- **Mastered**: correctCount ≥ 3 AND interval ≥ 7 days
- **Due for review**: (now - lastReviewed) ≥ interval
- **Priority**: Higher incorrectCount = shown first

## 🎨 Customization

### Change Daily Goal
Edit `lib/store.ts`:
```typescript
dailyGoal: 100, // Change to your target
```

### Adjust Timer
Edit `components/QuizApp.tsx`:
```typescript
setTimeLeft(10) // Change seconds here
```

### Modify Spaced Repetition Intervals
Edit `lib/store.ts` in `answerCorrect` function:
```typescript
interval: Math.min(state.currentKanji.interval * 2, 30)
// Change multiplier (2) or max days (30)
```

## 📄 License

MIT - Feel free to use and modify!

## 🙏 Credits

Built with Claude Code by Anthropic

---

**Ready to master N2 kanji?** Open the app and start your journey! 🚀
