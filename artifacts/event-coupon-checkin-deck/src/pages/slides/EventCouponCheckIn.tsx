const base = import.meta.env.BASE_URL;
export default function EventCouponCheckIn() {
  return <div className="w-screen h-screen overflow-hidden relative bg-[#0C0F1A] text-white font-body">
    <img src={base + "hero.png"} crossOrigin="anonymous" alt="Guest checking in at an event entrance" className="absolute inset-0 w-full h-full object-cover opacity-70" />
    <div className="absolute inset-0 bg-gradient-to-r from-[#0C0F1A] via-[#0C0F1A]/90 to-[#0C0F1A]/20" />
    <div className="absolute inset-0 opacity-20" style={{backgroundImage:'linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px)',backgroundSize:'4vw 4vw'}} />
    <header className="absolute top-[5vh] left-[5vw] right-[5vw] flex justify-between items-center z-10">
      <div className="flex items-center gap-[1vw]"><div className="w-[2.2vw] h-[2.2vw] rounded-[.45vw] bg-primary"/><span className="text-[1.5vw] font-bold">Event Check-in</span></div>
      <span className="text-[1.5vw] text-white/55">PRODUCT OVERVIEW</span>
    </header>
    <main className="absolute z-10 left-[5vw] top-[23vh] w-[64vw]">
      <div className="inline-flex px-[1.2vw] py-[.8vh] rounded-full border border-accent/40 bg-accent/15 text-accent text-[1.5vw] font-bold tracking-[.1em] uppercase">Launch-ready MVP</div>
      <h1 className="font-display text-[6.3vw] leading-[1.02] font-extrabold tracking-[-.05em] mt-[3vh] mb-[2.5vh]">Event Coupon <span className="whitespace-nowrap">Check-in</span></h1>
      <p className="text-[2.2vw] leading-[1.45] text-white/72 max-w-[58vw]">Private coupon delivery. Fast attendee check-in. A clear attendance record.</p>
      <div className="flex gap-[1.2vw] mt-[6vh]">
        <div className="px-[1.4vw] py-[1.4vh] bg-white/8 border border-white/10 rounded-[.7vw] text-[1.55vw]">One event link or printable QR code</div>
        <div className="px-[1.4vw] py-[1.4vh] bg-white/8 border border-white/10 rounded-[.7vw] text-[1.55vw]">No attendee accounts or repeat registration</div>
        <div className="px-[1.4vw] py-[1.4vh] bg-white/8 border border-white/10 rounded-[.7vw] text-[1.55vw]">Built and verified as a launch-ready MVP</div>
      </div>
    </main>
    <footer className="absolute bottom-[4vh] left-[5vw] text-[1.5vw] text-white/40 tracking-[.12em]">EVENT COUPON CHECK-IN</footer>
  </div>;
}