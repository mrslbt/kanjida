'use client'

import dynamic from 'next/dynamic'

const QuizApp = dynamic(() => import('@/components/QuizApp'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="text-white text-xl">Loading Kanjida...</div>
    </div>
  ),
})

export default function Home() {
  return <QuizApp />
}
