# Kanjida - Quick Start Guide

## 🎮 Your Game is Ready!

The development server is currently running at:
**http://localhost:3000**

Open this in your browser to play!

## 🎯 How to Play

1. **Opponent serves** → Volleyball flies toward you
2. **Kanji appears** → Question shows with 4 answer choices
3. **Tap/click correct answer** → You spike it back!
4. **Wrong answer** → Lose a life (you have 3 lives)
5. **Build combos** → Consecutive correct answers multiply your score

## 📱 Test on Mobile

1. Find your computer's local IP in the terminal (Network: http://192.168.x.x:3000)
2. Open that URL on your phone (must be on same WiFi)
3. Tap answers with your finger
4. Add to home screen for app-like experience!

## 🔨 Development Commands

```bash
# Start dev server (already running)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check for errors
npm run lint
```

## 🚀 Next Steps

### 1. Test the Game (Now!)
Open http://localhost:3000 and try answering some kanji questions

### 2. Expand Kanji Database
Edit `/lib/kanjiData.ts` to add more kanji:
- Currently: ~50 kanji
- Need for N2: ~1000 kanji

You can find free N2 kanji datasets online or I can help you add them!

### 3. Deploy to Vercel
Follow instructions in `DEPLOYMENT.md` - takes 5 minutes!

### 4. Optional Enhancements

**Easy Wins:**
- Add sound effects (correct/wrong beeps)
- Different ball colors for different JLPT levels
- Difficulty selector (N5/N4/N3/N2)

**Bigger Features:**
- Boss battles with reading passages
- Mnemonic stories for each kanji
- Daily challenge mode
- Export/import progress

## 📊 Your Progress

Your progress is automatically saved to your browser's LocalStorage:
- Score
- Kanji mastery levels
- Review intervals (spaced repetition)
- Streak count

**To reset progress**: Clear browser localStorage or play in incognito mode

## 🎨 Customization

### Change Colors
Edit `/app/page.tsx` and component styles

### Adjust Difficulty
Edit `/components/VolleyballGame.tsx`:
- Ball speed: Line where `ball.setVelocity` is called
- Answer time: Adjust when `questionTriggered` happens
- Lives: Change initial value in store

### Modify Spaced Repetition
Edit `/lib/store.ts` in the `answerCorrect` function:
- Interval multiplier (currently 2x)
- Max interval days (currently 30)

## 🐛 Troubleshooting

**Game not loading?**
- Check browser console (F12) for errors
- Make sure dev server is running
- Try refreshing the page

**Phaser errors?**
- Phaser needs to load client-side only (already configured)
- Don't worry about SSR warnings

**Tailwind not working?**
- Already configured for v4
- Restart dev server if styles don't update

## 💡 Tips for 3-Month N2 Mastery

1. **Play daily**: Consistency > intensity
2. **100 reviews/day**: Takes ~15-20 minutes
3. **Trust the algorithm**: Failed kanji reappear sooner
4. **Focus on weak ones**: System tracks your confusion patterns
5. **Week 1-4**: Build N5/N4 foundation (easier kanji)
6. **Week 5-8**: Add N3 kanji (intermediate)
7. **Week 9-12**: Focus on N2 (advanced)

## 📝 File Structure

```
kanjida/
├── app/
│   ├── globals.css       # Styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   └── VolleyballGame.tsx # Main game logic
├── lib/
│   ├── store.ts          # State management (Zustand)
│   └── kanjiData.ts      # Kanji database
└── public/               # Static assets (add images here)
```

## 🎊 You're All Set!

Your volleyball kanji game is production-ready and costs $0 to run!

Next: Open http://localhost:3000 and start playing! 🏐

---

Questions? Check README.md or DEPLOYMENT.md
