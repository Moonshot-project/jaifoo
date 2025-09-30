import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, ChevronRight, TrendingUp, Shield, Zap, Mail } from "lucide-react"
import Link from "next/link"

export default function JaifooLanding() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900">Jaifoo</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" className="bg-[#ffc92b] hover:bg-[#ffc92a] text-gray-900 rounded-lg w-10 h-10">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Link href="#" className="w-full">
                Products
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="#contact" className="w-full">
                Contact us
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="#" className="w-full">
                Report problems
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/signup" className="w-full">
                Join wait list
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6">
        {/* Hero Section */}
        <section className="py-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 leading-tight text-balance">
            Your money buddy who makes finances
            <br />
            fun and stress-free
          </h2>

          <div className="mb-12">
            <div className="inline-block">
              <img src="/jaifoo-logo.png" alt="Jaifoo mascot character" className="w-48 h-48 mx-auto" />
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-xl font-medium text-gray-700 mb-6">Find your avatar-your money style</h3>

            <div className="flex justify-center items-center gap-4 flex-wrap">
              <img src="/jaifoo_charactor_01.png" alt="Cat avatar" className="w-16 h-16" />
              <img src="/jaifoo_charactor_02.png" alt="Blue robot avatar" className="w-16 h-16" />
              <img src="/jaifoo_charactor_03.png" alt="Brown bear avatar" className="w-16 h-16" />
              <img src="/jaifoo_charactor_04.png" alt="Knight avatar" className="w-16 h-16" />
              <img src="/gjaifoo_charactor_05.png" alt="Tech character avatar" className="w-16 h-16" />
            </div>
          </div>
          <div className="mb-3">
            <Link href="/onboarding">
              <Button
                className="
                  bg-[#ffc92b] 
                  text-gray-900 
                  text-lg font-medium 
                  px-14 py-6 
                  rounded-full 
                  transition-all 
                  duration-300 
                  hover:bg-[#ffdb4d] 
                  hover:scale-105 
                  hover:shadow-lg 
                  active:scale-95
                "
              >
                Get start free
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <p className="text-gray-500">no credit card require</p>
        </section>

        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-balance">
              Balance 💰 Cash, 😊 Happiness, and 😥 Stress — all in one place.
            </h2>
            <p className="text-lg text-gray-600 text-balance">
              Discover powerful features that help you take control of your financial future
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 bg-[#ffc92b] rounded-xl mb-4 mx-auto">
                <TrendingUp className="h-6 w-6 text-gray-900" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Learns You. Speaks Like You.</h3>
              <p className="text-gray-600 leading-relaxed">
                From daily choices to long-term dreams and emotional ups/downs, Jaifoo understands you.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 bg-[#ffc92b] rounded-xl mb-4 mx-auto">
                <Shield className="h-6 w-6 text-gray-900" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure & Private</h3>
              <p className="text-gray-600 leading-relaxed">
                Bank-level security ensures your financial data stays protected while you get personalized insights.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 bg-[#ffc92b] rounded-xl mb-4 mx-auto">
                <Zap className="h-6 w-6 text-gray-900" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Insights</h3>
              <p className="text-gray-600 leading-relaxed">
                Get instant notifications and actionable insights to make better financial decisions every day.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 bg-[#ffc92b] rounded-xl mb-4 mx-auto">
                <span className="text-2xl font-bold text-gray-900">≈</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Adaptive Learning</h3>
              <p className="text-gray-600 leading-relaxed">
                Jaifoo learns from your habits and adapts to provide increasingly accurate financial guidance.
              </p>
            </div>
          </div>

          <div className="py-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Loved By</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <p className="text-gray-600 italic mb-4 leading-relaxed">
                  "Jaifoo helped me save $2,000 in just three months. The forecasting is incredibly accurate!"
                </p>
                <h4 className="font-semibold text-gray-900">Sarah Chen</h4>
                <p className="text-gray-500 text-sm">Marketing Manager</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <p className="text-gray-600 italic mb-4 leading-relaxed">
                  "Finally, a financial app that actually understands my spending habits. Game changer!"
                </p>
                <h4 className="font-semibold text-gray-900">Marcus Johnson</h4>
                <p className="text-gray-500 text-sm">Software Engineer</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <p className="text-gray-600 italic mb-4 leading-relaxed">
                  "The cute avatars make budgeting fun. My kids even want to learn about money now!"
                </p>
                <h4 className="font-semibold text-gray-900">Emily Rodriguez</h4>
                <p className="text-gray-500 text-sm">Teacher</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center mb-12" id="contact">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Get in Touch</h2>
            <p className="text-gray-600 mb-8">Have questions? We'd love to hear from you.</p>

            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Mail className="h-5 w-5" />
              <a href="mailto:hello@jaifoo.com" className="hover:text-gray-900 transition-colors">
                hello@jaifoo.com
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Jaifoo</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Smart money management that listens, reflects, and forecasts your financial future.
              </p>
              <div className="flex gap-4">
                <Button size="sm" variant="outline" className="rounded-full bg-transparent">
                  Download iOS
                </Button>
                <Button size="sm" variant="outline" className="rounded-full bg-transparent">
                  Download Android
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Product</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© 2024 Jaifoo. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
