import { Button } from "@/components/ui/button";
import { ChevronRight, TrendingUp, Shield, Zap, Mail } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";

export default function JaifooLanding() {
    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Header */}
            <Header />

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
                            <img
                                src="/jaifoo-logo.png"
                                alt="Jaifoo mascot character"
                                className="w-48 h-48 mx-auto"
                            />
                        </div>
                    </div>

                    <div className="mb-12">
                        <h3 className="text-xl font-medium text-gray-700 mb-6">
                            Find your avatar-your money style
                        </h3>

                        {/* <div className="flex justify-center items-center gap-4 flex-wrap">
              <img src="/jaifoo_charactor_01.png" alt="Cat avatar" className="w-16 h-16" />
              <img src="/jaifoo_charactor_02.png" alt="Blue robot avatar" className="w-16 h-16" />
              <img src="/jaifoo_charactor_03.png" alt="Brown bear avatar" className="w-16 h-16" />
              <img src="/jaifoo_charactor_04.png" alt="Knight avatar" className="w-16 h-16" />
            </div> */}
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
                            Jaifoo - Core Features ที่ออกแบบมาเพื่อคุณ
                        </h2>
                        <p className="text-lg text-gray-600 text-balance">
                            Jaifoo มี 4 ฟีเจอร์หลักที่สะท้อนตัวตนของเรา
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition-colors">
                            <div className="flex items-center justify-center w-12 h-12 bg-[#ffc92b] rounded-xl mb-4 mx-auto">
                                <TrendingUp className="h-6 w-6 text-gray-900" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                📈 Learns You. Speaks Like You.
                            </h3>
                            <p className="text-base font-medium text-gray-700 mb-2">
                                "เรียนรู้คุณ พูดคุยแบบคุณ"
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-3">
                                น้องใจฟูจะค่อยๆ
                                เรียนรู้พฤติกรรมของคุณจากการใช้ชีวิตประจำวัน
                                ไม่ว่าจะเป็นทางเลือกเล็กๆ น้อยๆ
                                หรือความฝันระยะยาว
                                รวมถึงอารมณ์ความรู้สึกที่มีต่อเรื่องเงิน Jaifoo
                                เข้าใจคุณและคุยกับคุณแบบเพื่อนสนิท
                            </p>
                            <p className="text-sm text-gray-500 italic">
                                เป็นเพื่อนที่ฟังและเข้าใจ ไม่ตัดสิน
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition-colors">
                            <div className="flex items-center justify-center w-12 h-12 bg-[#ffc92b] rounded-xl mb-4 mx-auto">
                                <Shield className="h-6 w-6 text-gray-900" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                🎯 Support Your Financial Goals
                            </h3>
                            <p className="text-base font-medium text-gray-700 mb-2">
                                "เพื่อนคู่คิดที่คอยเชียร์ให้คุณไปถึงฝัน"
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-3">
                                พร้อมเดินไปกับคุณทุกก้าวของเส้นทางการเงิน
                                ไม่ว่าจะเป็นการออมเงิน วางแผนอนาคต
                                หรือการจัดการหนี้สิน น้องใจฟูจะคอยให้กำลังใจ
                                ถามคำถามที่ช่วยให้คุณเข้าใจตัวเองมากขึ้น
                                และช่วยคุณค้นหาวิธีที่เหมาะกับตัวคุณเองในการไปถึงเป้าหมายที่ตั้งไว้ค่ะ
                            </p>
                            <p className="text-sm text-gray-500 italic">
                                น้องใจฟูคิดว่าถ้าลอง...
                                จะช่วยให้ใกล้เป้าหมายมากขึ้น
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition-colors">
                            <div className="flex items-center justify-center w-12 h-12 bg-[#ffc92b] rounded-xl mb-4 mx-auto">
                                <Zap className="h-6 w-6 text-gray-900" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                ⚡ Active notification
                            </h3>
                            <p className="text-base font-medium text-gray-700 mb-2">
                                "ใจฟูถามคำถามเท่าที่เป็นประโยชน์ไม่ทำให้คุณลำคาญ"
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-3">
                                น้องใจฟูจะถามคำถามที่ช่วยให้เข้าใจคุณได้ดีขึ้น
                                โดยไม่ถามมากเกินไปจนรู้สึกรำคาญค่ะ
                                เพราะเป้าหมายของน้องใจฟูคือการเป็นเพื่อนที่เข้าใจคุณอย่างแท้จริง
                            </p>
                            <p className="text-sm text-gray-500 italic">
                                เดือนก่อนคุณกินกาแฟเกือบทุกวัน
                                เดือนนี้ยังกินอยู่ไหมคะ
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition-colors">
                            <div className="flex items-center justify-center w-12 h-12 bg-[#ffc92b] rounded-xl mb-4 mx-auto">
                                <span className="text-2xl font-bold text-gray-900">
                                    ≈
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                🔀 Financial Tools
                            </h3>
                            <p className="text-base font-medium text-gray-700 mb-2">
                                "เครื่องมือทางการเงินที่ใช้งานง่าย"
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-3">
                                น้องใจฟูมีเครื่องมือทางการเงินที่ช่วยเหลือคุณได้แบบ
                                effortless ค่ะ เช่น Cashflow Projection Tool
                                ที่จะช่วยให้คุณเห็นภาพการเงินในอนาคตได้ชัดเจนขึ้น
                                โดยไม่ต้องใช้ความพยายามมากมายค่ะ
                            </p>
                            <p className="text-sm text-gray-500 italic">
                                เครื่องมือที่ทำงานให้คุณ
                                ไม่ใช่คุณทำงานให้เครื่องมือ
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-gray-50 border-t border-gray-100">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <div className="text-center mb-12" id="contact">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Get in Touch
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Have questions? We'd love to hear from you.
                        </p>

                        <div className="flex items-center justify-center gap-2 text-gray-600">
                            <Mail className="h-5 w-5" />
                            <a
                                href="mailto:info@jaifoo.ai"
                                className="hover:text-gray-900 transition-colors"
                            >
                                info@jaifoo.ai
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="md:col-span-2">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Jaifoo
                            </h3>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                Smart money management that listens, reflects,
                                and forecasts your financial future.
                            </p>
                            <div className="flex gap-4">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="rounded-full bg-transparent"
                                >
                                    Download iOS
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="rounded-full bg-transparent"
                                >
                                    Download Android
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">
                                Product
                            </h4>
                            <ul className="space-y-2 text-gray-600">
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-gray-900 transition-colors"
                                    >
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-gray-900 transition-colors"
                                    >
                                        Pricing
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-gray-900 transition-colors"
                                    >
                                        Security
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-gray-900 transition-colors"
                                    >
                                        API
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">
                                Company
                            </h4>
                            <ul className="space-y-2 text-gray-600">
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-gray-900 transition-colors"
                                    >
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-gray-900 transition-colors"
                                    >
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-gray-900 transition-colors"
                                    >
                                        Careers
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-gray-900 transition-colors"
                                    >
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-500 text-sm">
                            © 2024 Jaifoo. All rights reserved.
                        </p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <a
                                href="#"
                                className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
                            >
                                Terms of Service
                            </a>
                            <a
                                href="#"
                                className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
                            >
                                Cookie Policy
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
