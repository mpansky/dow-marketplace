import { useState, useCallback } from 'react'
import type { ChatMessage, Citation, UserRole, StorefrontId } from '@/types'

interface MockResponse {
  content: string
  citations?: Citation[]
}

function generateMockResponse(
  userMessage: string,
  role: UserRole,
  storefront: StorefrontId
): MockResponse {
  const msg = userMessage.toLowerCase()

  // Vendor / company queries
  if (msg.includes('vendor') || msg.includes('company') || msg.includes('companies')) {
    const storefrontLabel =
      storefront === 'indopacom'
        ? 'INDOPACOM'
        : storefront === 'cybercom'
          ? 'CYBERCOM'
          : 'Global'
    return {
      content: `Based on the current ${storefrontLabel} storefront data, the top-matched vendors include **Arcturus Defense Systems** (match score 94%), **Sentinel AI** (92%), and **DroneShield Pacific** (89%). These vendors demonstrate strong past performance across relevant capability domains, with active security clearances and compliant platform registrations. ${role === 'pae' ? 'As a PAE, you can curate these matches and advance them to the evaluation stage.' : 'I recommend reviewing their health scores and platform breadth metrics for a comprehensive comparison.'}`,
      citations: [
        { type: 'vendor', id: 'v-001', label: 'Arcturus Defense Systems' },
        { type: 'vendor', id: 'v-002', label: 'Sentinel AI' },
      ],
    }
  }

  // Challenge queries
  if (msg.includes('challenge') || msg.includes('challenges')) {
    return {
      content: `There are currently **7 active challenges** across the marketplace. The most recent is **"Next-Gen Counter-UAS Detection"** with 12 submissions and an evaluation deadline approaching in 14 days. Two challenges are in the shortlist phase with strong vendor pools. ${role === 'ndc' ? 'As an NDC, you can submit solutions to any open challenge that aligns with your capabilities.' : 'Would you like me to break down challenges by domain or status?'}`,
      citations: [
        { type: 'challenge', id: 'ch-001', label: 'Next-Gen Counter-UAS Detection' },
        { type: 'challenge', id: 'ch-003', label: 'Zero Trust Network Architecture' },
      ],
    }
  }

  // Pipeline / award queries
  if (msg.includes('pipeline') || msg.includes('award') || msg.includes('bottleneck')) {
    return {
      content: `The acquisition pipeline currently has **18 active entries** across all stages. Key highlights: 3 entries are in the **OT Award** stage with a combined value of $12.4M, and 2 entries in **Prototype Demo** are flagged yellow due to extended dwell time (averaging 34 days vs. the 21-day target). The primary bottleneck is in the Evaluation stage, where 5 entries have been waiting over 28 days. I recommend prioritizing entries at risk of timeline slippage.`,
      citations: [
        { type: 'pipeline', id: 'pe-001', label: 'cUAS Rapid Prototype Award' },
        { type: 'pipeline', id: 'pe-005', label: 'Cyber Mesh OT Award' },
      ],
    }
  }

  // cUAS / counter-drone queries
  if (msg.includes('cuas') || msg.includes('counter') || msg.includes('drone') || msg.includes('uas')) {
    return {
      content: `The **cUAS / Counter-Drone** domain is the most active capability area in the marketplace with 4 active challenges and 23 registered vendors. Top capabilities include RF detection and jamming, AI-powered tracking, kinetic defeat systems, and swarm mitigation. Vendor readiness is strong with 78% holding SECRET or higher clearances. The average TRL across submissions is 6.2, indicating mature prototypes ready for demonstration.`,
      citations: [
        { type: 'challenge', id: 'ch-001', label: 'Next-Gen Counter-UAS Detection' },
        { type: 'vendor', id: 'v-003', label: 'DroneShield Pacific' },
      ],
    }
  }

  // Cyber / zero trust queries
  if (msg.includes('cyber') || msg.includes('zero trust') || msg.includes('network')) {
    return {
      content: `The **Cyber / Zero Trust** domain has 3 active challenges focused on zero-trust network architecture, endpoint hardening, and AI-driven threat detection. There are 15 registered vendors with relevant capabilities, and 8 hold FedRAMP authorizations. The most competitive challenge has attracted 9 submissions with an average match score of 86%. CYBERCOM storefront entries are prioritized for IL5+ compliance readiness.`,
      citations: [
        { type: 'challenge', id: 'ch-003', label: 'Zero Trust Network Architecture' },
        { type: 'vendor', id: 'v-002', label: 'Sentinel AI' },
      ],
    }
  }

  // Match / score queries
  if (msg.includes('match') || msg.includes('score') || msg.includes('compare')) {
    return {
      content: `Match scores are computed using a weighted algorithm that considers **technical alignment** (35%), **past performance** (25%), **compliance readiness** (20%), **platform breadth** (10%), and **engagement history** (10%). The current top match across all active challenges has a score of 94%, while the marketplace average is 72%. I can provide detailed match breakdowns for any specific challenge or vendor pair.`,
    }
  }

  // Submission queries
  if (msg.includes('submission') || msg.includes('submit') || msg.includes('proposal')) {
    return {
      content: `Across all active challenges, there are **34 total submissions** with an average match score of 78%. The submission rate has increased 22% compared to last quarter. Currently, 8 submissions are under active evaluation, 5 have been shortlisted, and 2 are advancing to prototype demonstration. The strongest submissions tend to include detailed technical approaches with evidence of prior DoD integration experience.`,
    }
  }

  // Insight / AI analysis queries
  if (msg.includes('insight') || msg.includes('trend') || msg.includes('analysis') || msg.includes('summary')) {
    return {
      content: `Here are the key marketplace intelligence insights:\n\n1. **Vendor Growth**: 12 new vendors registered this quarter, primarily in AI/ML and autonomy domains.\n2. **Pipeline Velocity**: Average time from challenge publication to OT award has decreased to 87 days (down from 112 days).\n3. **Domain Demand**: cUAS capabilities remain highest in demand, followed by cyber/zero trust solutions.\n4. **Compliance Gap**: 34% of otherwise-qualified vendors lack required IL-level certifications, representing a significant barrier to entry.\n5. **Match Quality**: AI-curated match accuracy has improved to 89% based on PAE feedback data.`,
    }
  }

  // Default / overview response
  const roleContext =
    role === 'pae'
      ? 'As a Portfolio Acquisition Expert, I can help you curate vendor matches, manage challenges, track pipeline progress, and identify acquisition bottlenecks.'
      : role === 'ndc'
        ? 'As a Non-traditional Defense Contributor, I can help you discover relevant challenges, optimize your vendor profile, track submissions, and understand evaluation criteria.'
        : 'As an administrator, I can provide cross-storefront analytics, barrier tracking insights, pipeline health metrics, and system-wide performance data.'

  return {
    content: `I'm your **Marketplace Intelligence** assistant for the DoW platform. ${roleContext}\n\nTry asking me about:\n- **Vendors** and capability matching\n- **Active challenges** and submission trends\n- **Pipeline status** and bottleneck analysis\n- **Domain insights** for cUAS, cyber, AI/ML, or autonomy\n- **Match scores** and comparison analytics\n\nHow can I assist you today?`,
  }
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)

  const sendMessage = useCallback(
    (content: string, role: UserRole = 'pae', storefront: StorefrontId = 'indopacom') => {
      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}-user`,
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsTyping(true)

      const delay = 1000 + Math.random() * 1000 // 1-2 seconds

      setTimeout(() => {
        const response = generateMockResponse(content, role, storefront)
        const aiMessage: ChatMessage = {
          id: `msg-${Date.now()}-ai`,
          role: 'assistant',
          content: response.content,
          timestamp: new Date().toISOString(),
          citations: response.citations,
        }

        setMessages((prev) => [...prev, aiMessage])
        setIsTyping(false)
      }, delay)
    },
    []
  )

  const clearMessages = useCallback(() => {
    setMessages([])
    setIsTyping(false)
  }, [])

  return { messages, isTyping, sendMessage, clearMessages }
}
