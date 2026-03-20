import { Header } from '@/components/layout/header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, BookOpen, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function VideoAulaPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <Header title="Vídeo Aula" />
      <div className="p-6">
        <Link href="/trilha-de-aulas" className="inline-flex items-center gap-2 text-sm text-[#657585] hover:text-[#1B2232] mb-6">
          <ArrowLeft size={16} /> Voltar para trilha
        </Link>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Video player */}
          <div className="xl:col-span-2 space-y-4">
            <div className="bg-black rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen size={28} className="text-white" />
                </div>
                <p className="text-white/70 text-sm">Vídeo não disponível neste ambiente</p>
                <p className="text-white/40 text-xs mt-1">Configure a URL do vídeo no Supabase</p>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-[#1B2232] mb-2">Math — Álgebra Básica</h2>
                <p className="text-[#657585] text-sm leading-relaxed mb-4">
                  Nesta aula você vai aprender sobre equações, inequações e funções lineares, tópicos fundamentais para a seção de matemática do SAT.
                </p>
                <div className="flex gap-3">
                  <Button>
                    <CheckCircle size={16} /> Marcar como concluída
                  </Button>
                  <Button variant="outline">
                    <Download size={16} /> Material de apoio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-[#1B2232] mb-3">Próximas aulas</h3>
                <div className="space-y-2">
                  {['Math — Geometria', 'Reading Avançado', 'Simulado Completo 1'].map((title, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-[#EDEFF3] last:border-0">
                      <div className="w-7 h-7 rounded-lg bg-[#F3F5F7] flex items-center justify-center text-xs font-bold text-[#657585]">
                        {i + 4}
                      </div>
                      <p className="text-sm text-[#1B2232]">{title}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-[#1B2232] mb-3">Dúvidas?</h3>
                <p className="text-sm text-[#657585] mb-3">
                  Converse com nossos assistentes IA para tirar dúvidas sobre o conteúdo.
                </p>
                <Link href="/assistentes-ia">
                  <Button variant="outline" className="w-full">Falar com assistente</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
