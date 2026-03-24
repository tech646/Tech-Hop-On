import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermosDeUsoPage() {
  return (
    <div className="max-w-[760px] mx-auto px-6 py-8">
      <Link href="/home" className="flex items-center gap-1 text-sm text-[#65758b] hover:text-[#1b2232] mb-6 w-fit">
        <ArrowLeft size={14} /> Back
      </Link>

      <h1 className="text-3xl font-bold text-[#1b2232] mb-1">Terms of Use & Privacy Policy</h1>
      <p className="text-sm text-[#65758b] mb-8">Last updated: March 23, 2025</p>

      {/* Terms of Use */}
      <div className="bg-white rounded-2xl border border-[#e1e7ef] p-8 mb-6">
        <h2 className="text-xl font-bold text-[#1b2232] mb-1">Terms of Use</h2>
        <p className="text-sm text-[#65758b] mb-6">Hop On Academy</p>

        <p className="text-sm text-[#1b2232]/80 leading-relaxed mb-6">
          Welcome to Hop On Academy. By using our platform, you agree to the following conditions:
        </p>

        <div className="space-y-6">
          <section>
            <h3 className="font-bold text-[#1b2232] mb-2">1. Scope and Description of Service</h3>
            <p className="text-sm text-[#65758b] leading-relaxed">
              Hop On provides a platform that uses Artificial Intelligence to support international academic preparation (SAT, Essays, Mentorship). The service is a support tool and does not guarantee admission to educational institutions, which depends exclusively on the student&apos;s performance and third-party criteria.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-[#1b2232] mb-2">2. Use of AI Characters (Mrs Brighta, Gritty, Smartle, Wan, Syncie)</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-[#1b2232] mb-1">Advisory Nature</p>
                <p className="text-sm text-[#65758b] leading-relaxed">
                  Our AIs are virtual assistants. The guidance provided is based on statistical patterns and databases built by the Hop On team.
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#1b2232] mb-1">Authorship and Integrity</p>
                <p className="text-sm text-[#65758b] leading-relaxed">
                  Hop On prohibits the use of AI for the full automated generation of essays with the intent of academic fraud. The student is the sole author and is solely responsible for the accuracy of information submitted to universities.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-[#1b2232] mb-2">3. Subscriptions and Payments</h3>
            <p className="text-sm text-[#65758b] leading-relaxed mb-2">
              Access to Hop On Academy and subsequent plans is subject to prior payment.
            </p>
            <p className="text-sm text-[#65758b] leading-relaxed">
              <span className="font-medium text-[#1b2232]">Cancellation:</span> Users may cancel renewal at any time, retaining access until the end of the contracted period.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-[#1b2232] mb-2">4. User Responsibilities</h3>
            <ul className="space-y-1.5">
              {[
                'Provide truthful and up-to-date information.',
                'Not use the platform for unlawful purposes or in ways that violate intellectual property rights.',
                'Keep your access password confidential.',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#65758b] leading-relaxed">
                  <span className="text-[#0057b8] mt-0.5 shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* Privacy Policy */}
      <div className="bg-white rounded-2xl border border-[#e1e7ef] p-8 mb-8">
        <h2 className="text-xl font-bold text-[#1b2232] mb-1">Privacy Policy</h2>
        <p className="text-sm text-[#65758b] mb-6">Hop On Academy</p>

        <p className="text-sm text-[#1b2232]/80 leading-relaxed mb-6">
          Your privacy is our priority. This policy explains how we collect, use, and protect your data.
        </p>

        <div className="space-y-6">
          <section>
            <h3 className="font-bold text-[#1b2232] mb-2">1. Data Collection</h3>
            <p className="text-sm text-[#65758b] leading-relaxed mb-3">
              We collect data necessary to personalize your journey:
            </p>
            <ul className="space-y-1.5">
              {[
                { label: 'Registration Data:', desc: 'Name, email, age, country, city of residence, and educational background.' },
                { label: 'Performance Data:', desc: 'Practice test results, error history, and progress on learning tracks.' },
                { label: 'Narrative Data:', desc: 'Personal and extracurricular information provided to assist with writing.' },
              ].map(item => (
                <li key={item.label} className="flex items-start gap-2 text-sm text-[#65758b] leading-relaxed">
                  <span className="text-[#0057b8] mt-0.5 shrink-0">•</span>
                  <span><span className="font-medium text-[#1b2232]">{item.label}</span> {item.desc}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-[#1b2232] mb-2">2. Artificial Intelligence and Data Processing</h3>
            <ul className="space-y-2">
              {[
                { label: null, desc: 'Your data is processed by language models (such as Google\'s Gemini) to generate personalized feedback.' },
                { label: 'Anonymization:', desc: 'Whenever possible, data sent to third-party APIs is anonymized.' },
                { label: 'No Training:', desc: 'Your personal data is not used to train global third-party models without your explicit consent.' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#65758b] leading-relaxed">
                  <span className="text-[#0057b8] mt-0.5 shrink-0">•</span>
                  <span>{item.label && <span className="font-medium text-[#1b2232]">{item.label} </span>}{item.desc}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-[#1b2232] mb-2">3. Protection of Minors</h3>
            <p className="text-sm text-[#65758b] leading-relaxed mb-3">
              As we serve students in the pre-university stage (often under 18), Hop On commits to:
            </p>
            <ul className="space-y-1.5">
              {[
                'Collect only the minimum necessary data.',
                'Require legal guardian consent as required by LGPD/COPPA.',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#65758b] leading-relaxed">
                  <span className="text-[#0057b8] mt-0.5 shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-[#1b2232] mb-2">4. Your Rights (LGPD)</h3>
            <p className="text-sm text-[#65758b] leading-relaxed mb-3">You have the right to:</p>
            <ul className="space-y-1.5">
              {[
                'Access, correct, or delete your personal data.',
                'Revoke processing consent at any time.',
                'Export your data in a readable format.',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#65758b] leading-relaxed">
                  <span className="text-[#0057b8] mt-0.5 shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-[#1b2232] mb-2">5. Security</h3>
            <p className="text-sm text-[#65758b] leading-relaxed">
              We use end-to-end encryption and bank-level security protocols to ensure your information and academic history are protected against unauthorized access.
            </p>
          </section>
        </div>
      </div>

      <Link href="/home" className="text-sm text-[#65758b] hover:text-[#0057b8] flex items-center justify-center gap-1">
        <ArrowLeft size={14} /> Back to Home
      </Link>
    </div>
  )
}
