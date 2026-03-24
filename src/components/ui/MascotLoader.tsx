import Image from 'next/image'

export default function MascotLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2 select-none">
      <div className="relative flex flex-col items-center">
        <div className="mascot-hop">
          <Image
            src="/images/smartle.png"
            alt="Hop On mascot"
            width={96}
            height={96}
            priority
            unoptimized
          />
        </div>
        {/* shadow */}
        <div className="mascot-shadow w-14 h-3 rounded-full bg-[#6aabdb]/40 -mt-1 blur-[3px]" />
      </div>
      <p className="text-sm text-[#65758b] font-medium mt-3">{message}</p>
    </div>
  )
}
